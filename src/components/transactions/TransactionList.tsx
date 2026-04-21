"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/utils";
import { deleteTransaction } from "@/app/actions/transactions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionForm } from "./TransactionForm";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DbTransaction as Transaction } from "@/types/db";

const typeColors: Record<string, string> = {
  RECEITA: "bg-[#06D6A0]/10 text-[#06D6A0] border-[#06D6A0]/20",
  FIXO: "bg-[#00B4D8]/10 text-[#00B4D8] border-[#00B4D8]/20",
  CARTAO: "bg-[#F9844A]/10 text-[#F9844A] border-[#F9844A]/20",
  VARIAVEL: "bg-[#FFD166]/10 text-[#FFD166] border-[#FFD166]/20",
  PARCELA: "bg-[#A78BFA]/10 text-[#A78BFA] border-[#A78BFA]/20",
};

const typeLabels: Record<string, string> = {
  RECEITA: "Receita",
  FIXO: "Fixo",
  CARTAO: "Cartão",
  VARIAVEL: "Variável",
  PARCELA: "Parcela",
};

interface Props {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: Props) {
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteTransaction(id);
      toast.success("Lançamento removido.");
    } catch {
      toast.error("Erro ao remover lançamento.");
    } finally {
      setDeletingId(null);
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-[#8D99AE]">
        <p className="text-lg font-medium">Nenhum lançamento encontrado</p>
        <p className="text-sm mt-1">Adicione seu primeiro lançamento acima.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left text-[#8D99AE] font-medium pb-3 pr-4">Data</th>
            <th className="text-left text-[#8D99AE] font-medium pb-3 pr-4">Descrição</th>
            <th className="text-left text-[#8D99AE] font-medium pb-3 pr-4">Categoria</th>
            <th className="text-left text-[#8D99AE] font-medium pb-3 pr-4">Tipo</th>
            <th className="text-left text-[#8D99AE] font-medium pb-3 pr-4">Cartão</th>
            <th className="text-right text-[#8D99AE] font-medium pb-3 pr-4">Previsto</th>
            <th className="text-right text-[#8D99AE] font-medium pb-3">Realizado</th>
            <th className="text-right text-[#8D99AE] font-medium pb-3 pl-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
              <td className="py-3 pr-4 text-[#8D99AE] tabular-nums whitespace-nowrap">
                {formatDate(tx.date)}
              </td>
              <td className="py-3 pr-4 text-[#E2E8F0] font-medium max-w-[200px] truncate">
                {tx.description}
                {tx.installment && (
                  <span className="ml-2 text-[#8D99AE] text-xs">({tx.installment})</span>
                )}
              </td>
              <td className="py-3 pr-4 text-[#8D99AE]">{tx.category}</td>
              <td className="py-3 pr-4">
                <Badge className={cn("text-xs border", typeColors[tx.type])}>
                  {typeLabels[tx.type]}
                </Badge>
              </td>
              <td className="py-3 pr-4 text-[#8D99AE] text-xs">{tx.card ?? "–"}</td>
              <td className="py-3 pr-4 text-right text-[#8D99AE] tabular-nums">
                {tx.planned ? formatCurrency(tx.planned) : "–"}
              </td>
              <td className={cn(
                "py-3 text-right font-semibold tabular-nums",
                tx.type === "RECEITA" ? "text-[#06D6A0]" : "text-[#EF476F]"
              )}>
                {tx.type === "RECEITA" ? "+" : "-"}{formatCurrency(tx.actual)}
              </td>
              <td className="py-3 pl-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-[#8D99AE] hover:text-[#00B4D8] hover:bg-[#00B4D8]/10"
                    onClick={() => setEditingTx(tx)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Dialog open={editingTx?.id === tx.id} onOpenChange={(o) => !o && setEditingTx(null)}>
                    <DialogContent className="bg-[#16213E] border-white/10 text-white max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Editar Lançamento</DialogTitle>
                      </DialogHeader>
                      {editingTx && (
                        <TransactionForm
                          transaction={editingTx}
                          onSuccess={() => setEditingTx(null)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-[#8D99AE] hover:text-[#EF476F] hover:bg-[#EF476F]/10"
                    disabled={deletingId === tx.id}
                    onClick={() => handleDelete(tx.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
