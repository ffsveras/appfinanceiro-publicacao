"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, CARDS, TRANSACTION_TYPES, MONTH_NAMES } from "@/lib/utils";
import { Search } from "lucide-react";

export function TransactionFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "ALL") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/lancamentos?${params.toString()}`);
    },
    [router, searchParams]
  );

  const selectClass = "bg-[#1A1A2E] border-white/10 text-white focus:border-[#00B4D8] h-9 text-xs";

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8D99AE]" />
        <Input
          placeholder="Buscar..."
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="pl-8 w-48 bg-[#1A1A2E] border-white/10 text-white placeholder:text-[#8D99AE] h-9 text-xs"
        />
      </div>

      <Select defaultValue={searchParams.get("month") ?? undefined} onValueChange={(v) => updateFilter("month", v ?? "")}>
        <SelectTrigger className={`${selectClass} w-32`}>
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent className="bg-[#16213E] border-white/10">
          <SelectItem value="ALL" className="text-white text-xs">Todos meses</SelectItem>
          {MONTH_NAMES.map((m, i) => (
            <SelectItem key={i} value={String(i + 1)} className="text-white text-xs">{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue={searchParams.get("type") ?? undefined} onValueChange={(v) => updateFilter("type", v ?? "")}>
        <SelectTrigger className={`${selectClass} w-32`}>
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent className="bg-[#16213E] border-white/10">
          <SelectItem value="ALL" className="text-white text-xs">Todos tipos</SelectItem>
          {TRANSACTION_TYPES.map((t) => (
            <SelectItem key={t.value} value={t.value} className="text-white text-xs">{t.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue={searchParams.get("category") ?? undefined} onValueChange={(v) => updateFilter("category", v ?? "")}>
        <SelectTrigger className={`${selectClass} w-36`}>
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent className="bg-[#16213E] border-white/10 max-h-60">
          <SelectItem value="ALL" className="text-white text-xs">Todas categorias</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c} className="text-white text-xs">{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue={searchParams.get("card") ?? undefined} onValueChange={(v) => updateFilter("card", v ?? "")}>
        <SelectTrigger className={`${selectClass} w-44`}>
          <SelectValue placeholder="Cartão" />
        </SelectTrigger>
        <SelectContent className="bg-[#16213E] border-white/10">
          <SelectItem value="ALL" className="text-white text-xs">Todos cartões</SelectItem>
          {CARDS.map((c) => (
            <SelectItem key={c} value={c} className="text-white text-xs">{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
