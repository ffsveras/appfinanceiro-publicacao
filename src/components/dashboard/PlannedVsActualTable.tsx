"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { PlannedVsActual } from "@/types";

interface Props {
  data: PlannedVsActual[];
}

export function PlannedVsActualTable({ data }: Props) {
  return (
    <Card className="bg-[#16213E] border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-base font-semibold">
          Previsão vs. Realizado
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left text-[#8D99AE] font-medium pb-3">Mês</th>
              <th className="text-right text-[#8D99AE] font-medium pb-3">Previsto</th>
              <th className="text-right text-[#8D99AE] font-medium pb-3">Realizado</th>
              <th className="text-right text-[#8D99AE] font-medium pb-3">Var. R$</th>
              <th className="text-right text-[#8D99AE] font-medium pb-3">Var. %</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.month} className="border-t border-white/5">
                <td className="text-[#E2E8F0] py-2.5 font-medium">{row.month}</td>
                <td className="text-right py-2.5 text-[#8D99AE] tabular-nums">
                  {formatCurrency(row.planned)}
                </td>
                <td className="text-right py-2.5 text-[#E2E8F0] tabular-nums">
                  {formatCurrency(row.actual)}
                </td>
                <td className={cn(
                  "text-right py-2.5 tabular-nums font-medium",
                  row.variationValue >= 0 ? "text-[#06D6A0]" : "text-[#EF476F]"
                )}>
                  {row.variationValue >= 0 ? "+" : ""}{formatCurrency(row.variationValue)}
                </td>
                <td className={cn(
                  "text-right py-2.5 tabular-nums font-medium",
                  row.variationPercent >= 0 ? "text-[#06D6A0]" : "text-[#EF476F]"
                )}>
                  {row.variationPercent >= 0 ? "+" : ""}{row.variationPercent.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
