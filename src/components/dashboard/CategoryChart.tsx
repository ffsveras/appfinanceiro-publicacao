"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { CategoryData } from "@/types";

const COLORS = ["#00B4D8", "#06D6A0", "#FFD166", "#F9844A", "#EF476F", "#8D99AE", "#A78BFA", "#34D399"];

interface Props {
  data: CategoryData[];
}

function CustomTooltip({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: CategoryData }>;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-[#16213E] border border-white/10 rounded-lg p-3 shadow-xl text-sm">
      <p className="text-white font-semibold">{item.category}</p>
      <p className="text-[#8D99AE]">{formatCurrency(item.value)}</p>
      <p className="text-[#8D99AE]">{item.percentage.toFixed(1)}%</p>
    </div>
  );
}

export function CategoryChart({ data }: Props) {
  return (
    <Card className="bg-[#16213E] border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-base font-semibold">
          Despesas por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={70}
              outerRadius={110}
              dataKey="value"
              nameKey="category"
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => <span style={{ color: "#8D99AE", fontSize: 11 }}>{value}</span>}
              iconSize={10}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
