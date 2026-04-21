export interface DbTransaction {
  id: string;
  userId: string;
  date: Date;
  description: string;
  category: string;
  type: "RECEITA" | "FIXO" | "CARTAO" | "VARIAVEL" | "PARCELA";
  card: string | null;
  installment: string | null;
  planned: number | null;
  actual: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
