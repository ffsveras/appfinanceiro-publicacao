"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { transactionSchema } from "@/lib/validations";
import type { TransactionFormData } from "@/lib/validations";

async function getUserId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");
  return user.id;
}

export async function getTransactions(filters?: {
  month?: number;
  year?: number;
  type?: string;
  category?: string;
  card?: string;
  search?: string;
}) {
  const userId = await getUserId();

  const where: Record<string, unknown> = {
    userId,
    deletedAt: null,
  };

  if (filters?.month && filters?.year) {
    const start = new Date(filters.year, filters.month - 1, 1);
    const end = new Date(filters.year, filters.month, 0, 23, 59, 59);
    where.date = { gte: start, lte: end };
  } else if (filters?.year) {
    const start = new Date(filters.year, 0, 1);
    const end = new Date(filters.year, 11, 31, 23, 59, 59);
    where.date = { gte: start, lte: end };
  }

  if (filters?.type && filters.type !== "ALL") where.type = filters.type;
  if (filters?.category && filters.category !== "ALL") where.category = filters.category;
  if (filters?.card && filters.card !== "ALL") where.card = filters.card;
  if (filters?.search) {
    where.description = { contains: filters.search, mode: "insensitive" };
  }

  return prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
  });
}

export async function createTransaction(data: TransactionFormData) {
  const userId = await getUserId();
  const parsed = transactionSchema.parse(data);

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      date: new Date(parsed.date),
      description: parsed.description,
      category: parsed.category,
      type: parsed.type,
      card: parsed.card || null,
      installment: parsed.installment || null,
      planned: parsed.planned ?? null,
      actual: parsed.actual,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/lancamentos");
  return transaction;
}

export async function updateTransaction(id: string, data: TransactionFormData) {
  const userId = await getUserId();
  const parsed = transactionSchema.parse(data);

  const transaction = await prisma.transaction.updateMany({
    where: { id, userId, deletedAt: null },
    data: {
      date: new Date(parsed.date),
      description: parsed.description,
      category: parsed.category,
      type: parsed.type,
      card: parsed.card || null,
      installment: parsed.installment || null,
      planned: parsed.planned ?? null,
      actual: parsed.actual,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/lancamentos");
  return transaction;
}

export async function deleteTransaction(id: string) {
  const userId = await getUserId();

  await prisma.transaction.updateMany({
    where: { id, userId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/dashboard");
  revalidatePath("/lancamentos");
}

export async function getDashboardData(year: number) {
  const userId = await getUserId();
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59);

  const transactions = await prisma.transaction.findMany({
    where: { userId, deletedAt: null, date: { gte: start, lte: end } },
    orderBy: { date: "asc" },
  });

  return transactions;
}
