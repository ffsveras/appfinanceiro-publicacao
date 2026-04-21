import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR").format(d);
}

export const MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export const CATEGORIES = [
  "Alimentação",
  "Assinaturas",
  "Educação",
  "Entretenimento",
  "Farmácia",
  "Habitação",
  "Investimentos",
  "Lazer",
  "Receita",
  "Saúde",
  "Supermercado",
  "Transporte",
  "Utilidades",
  "Vestuário",
  "Viagem",
  "Outros",
];

export const CARDS = [
  "Advantage Master",
  "Unlimited Master",
  "Unlimited Visa",
  "American Express",
  "Unique Visa",
  "Débito",
  "Outro",
];

export const TRANSACTION_TYPES = [
  { value: "RECEITA", label: "Receita" },
  { value: "FIXO", label: "Fixo" },
  { value: "CARTAO", label: "Cartão" },
  { value: "VARIAVEL", label: "Variável" },
  { value: "PARCELA", label: "Parcela" },
];
