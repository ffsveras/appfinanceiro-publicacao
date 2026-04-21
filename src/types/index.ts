export type TransactionType = "RECEITA" | "FIXO" | "CARTAO" | "VARIAVEL" | "PARCELA";

export interface Transaction {
  id: string;
  userId: string;
  date: Date;
  description: string;
  category: string;
  type: TransactionType;
  card?: string | null;
  installment?: string | null;
  planned?: number | null;
  actual: number;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface KPISummary {
  totalRevenue: number;
  totalExpenses: number;
  balance: number;
  biggestInvoice: number;
  currentMonthBalance: number;
}

export interface MonthlyData {
  month: string;
  receita: number;
  despesas: number;
  saldo: number;
}

export interface CategoryData {
  category: string;
  value: number;
  percentage: number;
}

export interface CardMonthData {
  card: string;
  [month: string]: number | string;
}

export interface PlannedVsActual {
  month: string;
  planned: number;
  actual: number;
  variationValue: number;
  variationPercent: number;
}
