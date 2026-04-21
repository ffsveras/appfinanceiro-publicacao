import { getDashboardData } from "@/app/actions/transactions";
import { KPICard } from "@/components/dashboard/KPICard";
import { MonthlyChart } from "@/components/dashboard/MonthlyChart";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { CardTable } from "@/components/dashboard/CardTable";
import { PlannedVsActualTable } from "@/components/dashboard/PlannedVsActualTable";
import { MONTHS, CARDS } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, CreditCard, Calendar } from "lucide-react";
import type { MonthlyData, CategoryData, PlannedVsActual } from "@/types";
import type { DbTransaction } from "@/types/db";

export const dynamic = "force-dynamic";

function computeDashboard(transactions: DbTransaction[], year: number) {
  const expenses = transactions.filter((t) => t.type !== "RECEITA");
  const revenues = transactions.filter((t) => t.type === "RECEITA");

  const totalRevenue = revenues.reduce((s, t) => s + t.actual, 0);
  const totalExpenses = expenses.reduce((s, t) => s + t.actual, 0);
  const balance = totalRevenue - totalExpenses;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentMonthTx = transactions.filter((t) => new Date(t.date).getMonth() === currentMonth);
  const currentRevenue = currentMonthTx.filter((t) => t.type === "RECEITA").reduce((s, t) => s + t.actual, 0);
  const currentExpenses = currentMonthTx.filter((t) => t.type !== "RECEITA").reduce((s, t) => s + t.actual, 0);
  const currentMonthBalance = currentRevenue - currentExpenses;

  const monthlyInvoices = MONTHS.map((_, i) => {
    const monthTx = expenses.filter((t) => new Date(t.date).getMonth() === i);
    return monthTx.reduce((s, t) => s + t.actual, 0);
  });
  const biggestInvoice = Math.max(...monthlyInvoices, 0);

  const monthly: MonthlyData[] = MONTHS.map((month, i) => {
    const mRevenue = revenues.filter((t) => new Date(t.date).getMonth() === i).reduce((s, t) => s + t.actual, 0);
    const mExpenses = expenses.filter((t) => new Date(t.date).getMonth() === i).reduce((s, t) => s + t.actual, 0);
    return { month, receita: mRevenue, despesas: mExpenses, saldo: mRevenue - mExpenses };
  });

  const categoryMap: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.actual;
  });
  const categoryTotal = Object.values(categoryMap).reduce((s, v) => s + v, 0);
  const categories: CategoryData[] = Object.entries(categoryMap)
    .map(([category, value]) => ({
      category,
      value,
      percentage: categoryTotal ? (value / categoryTotal) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const cardRows = CARDS.filter((c) => c !== "Débito" && c !== "Outro").map((card) => {
    const months = MONTHS.map((_, i) => {
      const val = expenses
        .filter((t) => t.card === card && new Date(t.date).getMonth() === i)
        .reduce((s, t) => s + t.actual, 0);
      return val > 0 ? val : null;
    });
    const nonNull = months.filter((v): v is number => v !== null);
    const average = nonNull.length ? nonNull.reduce((s, v) => s + v, 0) / nonNull.length : 0;
    return { card, months, average };
  }).filter((r) => r.months.some((v) => v !== null));

  const plannedVsActual: PlannedVsActual[] = MONTHS.map((month, i) => {
    const mTx = transactions.filter((t) => new Date(t.date).getMonth() === i);
    const planned = mTx.reduce((s, t) => s + (t.planned ?? t.actual), 0);
    const actual = mTx.reduce((s, t) => s + t.actual, 0);
    const variationValue = actual - planned;
    const variationPercent = planned ? (variationValue / planned) * 100 : 0;
    return { month, planned, actual, variationValue, variationPercent };
  });

  return { totalRevenue, totalExpenses, balance, biggestInvoice, currentMonthBalance, monthly, categories, cardRows, plannedVsActual };
}

export default async function DashboardPage() {
  const year = new Date().getFullYear();
  const transactions = (await getDashboardData(year)) as DbTransaction[];
  const {
    totalRevenue, totalExpenses, balance, biggestInvoice, currentMonthBalance,
    monthly, categories, cardRows, plannedVsActual,
  } = computeDashboard(transactions, year);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard {year}</h1>
        <p className="text-[#8D99AE] text-sm">Visão geral das suas finanças</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <KPICard title="Receita Total" value={totalRevenue} icon={TrendingUp} variant="green" />
        <KPICard title="Total Despesas" value={totalExpenses} icon={TrendingDown} variant="red" />
        <KPICard title="Saldo Acumulado" value={balance} icon={Wallet} variant={balance >= 0 ? "teal" : "red"} />
        <KPICard title="Maior Fatura" value={biggestInvoice} icon={CreditCard} variant="orange" />
        <KPICard title="Saldo Mês Atual" value={currentMonthBalance} icon={Calendar} variant={currentMonthBalance >= 0 ? "green" : "red"} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <MonthlyChart data={monthly} />
        </div>
        <CategoryChart data={categories} />
      </div>

      <CardTable data={cardRows} />
      <PlannedVsActualTable data={plannedVsActual} />
    </div>
  );
}
