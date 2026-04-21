"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, MONTHS } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CardRow {
  card: string;
  months: (number | null)[];
  average: number;
}

interface Props {
  data: CardRow[];
}

export function CardTable({ data }: Props) {
  return (
    <Card className="bg-[#16213E] border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-base font-semibold">
          Faturas por Cartão
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left text-[#8D99AE] font-medium pb-3 pr-3 min-w-[140px]">Cartão</th>
              {MONTHS.map((m) => (
                <th key={m} className="text-right text-[#8D99AE] font-medium pb-3 px-2 min-w-[72px]">{m}</th>
              ))}
              <th className="text-right text-[#8D99AE] font-medium pb-3 pl-3">Média</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.card} className="border-t border-white/5">
                <td className="text-[#E2E8F0] py-2.5 pr-3 font-medium text-xs">{row.card}</td>
                {row.months.map((val, i) => (
                  <td
                    key={i}
                    className={cn(
                      "text-right py-2.5 px-2 tabular-nums",
                      val !== null && val > row.average * 1.2
                        ? "text-[#F9844A] font-semibold"
                        : "text-[#8D99AE]"
                    )}
                  >
                    {val !== null ? formatCurrency(val) : "–"}
                  </td>
                ))}
                <td className="text-right py-2.5 pl-3 text-[#00B4D8] font-semibold tabular-nums">
                  {formatCurrency(row.average)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
