"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, MONTHS } from "@/lib/utils";
import type { MonthlyData } from "@/types";

interface Props {
  data: MonthlyData[];
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#16213E] border border-white/10 rounded-lg p-3 shadow-xl text-sm">
      <p className="text-white font-semibold mb-2">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function MonthlyChart({ data }: Props) {
  return (
    <Card className="bg-[#16213E] border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-base font-semibold">
          Evolução Mensal Jan→Dez
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#8D99AE", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#8D99AE", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "#8D99AE", paddingTop: 12 }}
            />
            <Bar dataKey="receita" name="Receita" fill="#06D6A0" radius={[3, 3, 0, 0]} maxBarSize={32} />
            <Bar dataKey="despesas" name="Despesas" fill="#EF476F" radius={[3, 3, 0, 0]} maxBarSize={32} />
            <Line
              type="monotone"
              dataKey="saldo"
              name="Saldo"
              stroke="#00B4D8"
              strokeWidth={2.5}
              dot={{ fill: "#00B4D8", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
