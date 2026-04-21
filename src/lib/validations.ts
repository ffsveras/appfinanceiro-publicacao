import { z } from "zod";

export const transactionSchema = z.object({
  date: z.string().min(1, "Data é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória").max(200),
  category: z.string().min(1, "Categoria é obrigatória"),
  type: z.enum(["RECEITA", "FIXO", "CARTAO", "VARIAVEL", "PARCELA"]),
  card: z.string().optional(),
  installment: z.string().optional(),
  planned: z.coerce.number().optional(),
  actual: z.coerce.number().min(0.01, "Valor real é obrigatório"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
