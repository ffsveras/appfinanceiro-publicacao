import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant?: "default" | "green" | "red" | "teal" | "orange";
  subtitle?: string;
}

const variantStyles = {
  default: { icon: "text-[#8D99AE] bg-white/5", value: "text-white" },
  green: { icon: "text-[#06D6A0] bg-[#06D6A0]/10", value: "text-[#06D6A0]" },
  red: { icon: "text-[#EF476F] bg-[#EF476F]/10", value: "text-[#EF476F]" },
  teal: { icon: "text-[#00B4D8] bg-[#00B4D8]/10", value: "text-[#00B4D8]" },
  orange: { icon: "text-[#F9844A] bg-[#F9844A]/10", value: "text-[#F9844A]" },
};

export function KPICard({ title, value, icon: Icon, variant = "default", subtitle }: KPICardProps) {
  const styles = variantStyles[variant];

  return (
    <Card className="bg-[#16213E] border-white/10">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[#8D99AE] text-xs font-medium uppercase tracking-wider">{title}</p>
            <p className={cn("text-2xl font-bold tabular-nums", styles.value)}>
              {formatCurrency(value)}
            </p>
            {subtitle && <p className="text-[#8D99AE] text-xs">{subtitle}</p>}
          </div>
          <div className={cn("p-2.5 rounded-xl", styles.icon)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
