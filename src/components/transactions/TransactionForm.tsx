"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { transactionSchema, type TransactionFormData } from "@/lib/validations";
import { createTransaction, updateTransaction } from "@/app/actions/transactions";
import { CATEGORIES, CARDS, TRANSACTION_TYPES } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DbTransaction as Transaction } from "@/types/db";

interface Props {
  transaction?: Transaction;
  onSuccess?: () => void;
}

export function TransactionForm({ transaction, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema) as Resolver<TransactionFormData>,
    defaultValues: transaction
      ? {
          date: new Date(transaction.date).toISOString().split("T")[0],
          description: transaction.description,
          category: transaction.category,
          type: transaction.type,
          card: transaction.card ?? "",
          installment: transaction.installment ?? "",
          planned: transaction.planned ?? undefined,
          actual: transaction.actual,
        }
      : undefined,
  });

  const type = watch("type");

  async function onSubmit(data: TransactionFormData) {
    try {
      if (transaction) {
        await updateTransaction(transaction.id, data);
        toast.success("Lançamento atualizado!");
      } else {
        await createTransaction(data);
        toast.success("Lançamento criado!");
        reset();
      }
      onSuccess?.();
    } catch {
      toast.error("Erro ao salvar lançamento.");
    }
  }

  const inputClass = "bg-[#1A1A2E] border-white/10 text-white placeholder:text-[#8D99AE] focus:border-[#00B4D8]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[#E2E8F0] text-xs">Data *</Label>
          <Input type="date" className={inputClass} {...register("date")} />
          {errors.date && <p className="text-[#EF476F] text-xs">{errors.date.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-[#E2E8F0] text-xs">Tipo *</Label>
          <Select
            defaultValue={transaction?.type}
            onValueChange={(v) => setValue("type", (v ?? "") as TransactionFormData["type"])}
          >
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent className="bg-[#16213E] border-white/10">
              {TRANSACTION_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value} className="text-white hover:bg-white/5">
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-[#EF476F] text-xs">{errors.type.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[#E2E8F0] text-xs">Descrição *</Label>
        <Input placeholder="Ex: Supermercado Extra" className={inputClass} {...register("description")} />
        {errors.description && <p className="text-[#EF476F] text-xs">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[#E2E8F0] text-xs">Categoria *</Label>
          <Select
            defaultValue={transaction?.category}
            onValueChange={(v) => setValue("category", v ?? "")}
          >
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent className="bg-[#16213E] border-white/10 max-h-60">
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c} className="text-white hover:bg-white/5">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-[#EF476F] text-xs">{errors.category.message}</p>}
        </div>

        {(type === "CARTAO" || type === "PARCELA") && (
          <div className="space-y-1.5">
            <Label className="text-[#E2E8F0] text-xs">Cartão</Label>
            <Select
              defaultValue={transaction?.card ?? undefined}
              onValueChange={(v) => setValue("card", v ?? "")}
            >
              <SelectTrigger className={inputClass}>
                <SelectValue placeholder="Selecione o cartão" />
              </SelectTrigger>
              <SelectContent className="bg-[#16213E] border-white/10">
                {CARDS.map((c) => (
                  <SelectItem key={c} value={c} className="text-white hover:bg-white/5">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[#E2E8F0] text-xs">Valor Real (R$) *</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            className={inputClass}
            {...register("actual")}
          />
          {errors.actual && <p className="text-[#EF476F] text-xs">{errors.actual.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-[#E2E8F0] text-xs">Previsto (R$)</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            className={inputClass}
            {...register("planned")}
          />
        </div>

        {type === "PARCELA" && (
          <div className="space-y-1.5">
            <Label className="text-[#E2E8F0] text-xs">Parcela (ex: 3/12)</Label>
            <Input placeholder="3/12" className={inputClass} {...register("installment")} />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#00B4D8] hover:bg-[#0096c7] text-white font-semibold"
        >
          {isSubmitting ? "Salvando..." : transaction ? "Atualizar" : "Adicionar Lançamento"}
        </Button>
      </div>
    </form>
  );
}
