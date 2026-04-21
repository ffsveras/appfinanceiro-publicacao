import { getTransactions } from "@/app/actions/transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, MONTH_NAMES } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, CreditCard, Repeat, Wallet, CheckCircle2, AlertTriangle } from "lucide-react";
import type { DbTransaction } from "@/types/db";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function MensalPage({ searchParams }: Props) {
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? Number(params.year) : now.getFullYear();
  const month = params.month ? Number(params.month) : now.getMonth() + 1;

  const transactions = (await getTransactions({ month, year })) as DbTransaction[];

  const revenues = transactions.filter((t) => t.type === "RECEITA");
  const fixed = transactions.filter((t) => t.type === "FIXO");
  const cards = transactions.filter((t) => t.type === "CARTAO");
  const variable = transactions.filter((t) => t.type === "VARIAVEL");
  const installments = transactions.filter((t) => t.type === "PARCELA");

  const totalRevenue = revenues.reduce((s, t) => s + t.actual, 0);
  const totalFixed = fixed.reduce((s, t) => s + t.actual, 0);
  const totalCards = cards.reduce((s, t) => s + t.actual, 0);
  const totalVariable = variable.reduce((s, t) => s + t.actual, 0);
  const totalInstallments = installments.reduce((s, t) => s + t.actual, 0);
  const totalExpenses = totalFixed + totalCards + totalVariable + totalInstallments;
  const balance = totalRevenue - totalExpenses;

  function getRemainingInstallments(installmentStr: string | null) {
    if (!installmentStr) return null;
    const parts = installmentStr.split("/");
    if (parts.length !== 2) return null;
    const current = parseInt(parts[0]);
    const total = parseInt(parts[1]);
    return isNaN(current) || isNaN(total) ? null : total - current;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {MONTH_NAMES[month - 1]} {year}
          </h1>
          <p className="text-[#8D99AE] text-sm">Visão detalhada do mês</p>
        </div>
        <div className="flex items-center gap-2">
          {MONTH_NAMES.map((name, i) => (
            <a
              key={i}
              href={`/mensal?month=${i + 1}&year=${year}`}
              className={cn(
                "text-xs px-2 py-1 rounded transition-colors",
                month === i + 1
                  ? "bg-[#00B4D8] text-white font-semibold"
                  : "text-[#8D99AE] hover:text-white hover:bg-white/5"
              )}
            >
              {name.slice(0, 3)}
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: "Receita", value: totalRevenue, icon: TrendingUp, color: "text-[#06D6A0]", bg: "bg-[#06D6A0]/10" },
          { label: "Fixas", value: totalFixed, icon: Repeat, color: "text-[#00B4D8]", bg: "bg-[#00B4D8]/10" },
          { label: "Cartões", value: totalCards, icon: CreditCard, color: "text-[#F9844A]", bg: "bg-[#F9844A]/10" },
          { label: "Variáveis", value: totalVariable, icon: TrendingDown, color: "text-[#FFD166]", bg: "bg-[#FFD166]/10" },
          { label: "Parcelas", value: totalInstallments, icon: Wallet, color: "text-[#A78BFA]", bg: "bg-[#A78BFA]/10" },
          {
            label: "Saldo",
            value: balance,
            icon: balance >= 0 ? CheckCircle2 : AlertTriangle,
            color: balance >= 0 ? "text-[#06D6A0]" : "text-[#EF476F]",
            bg: balance >= 0 ? "bg-[#06D6A0]/10" : "bg-[#EF476F]/10",
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="bg-[#16213E] border-white/10">
            <CardContent className="p-4">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", bg)}>
                <Icon className={cn("h-4 w-4", color)} />
              </div>
              <p className="text-[#8D99AE] text-xs">{label}</p>
              <p className={cn("text-lg font-bold tabular-nums", color)}>{formatCurrency(value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="bg-[#16213E] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
              <Repeat className="h-4 w-4 text-[#00B4D8]" />
              Despesas Fixas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {fixed.length === 0 ? (
              <p className="text-[#8D99AE] text-sm py-4 text-center">Nenhuma despesa fixa no mês</p>
            ) : (
              <div className="space-y-2">
                {fixed.map((tx) => {
                  const overBudget = tx.planned && tx.actual > tx.planned * 1.05;
                  return (
                    <div key={tx.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-2">
                        {overBudget ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-[#F9844A]" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#06D6A0]" />
                        )}
                        <span className="text-[#E2E8F0] text-sm">{tx.description}</span>
                        {overBudget && (
                          <Badge className="text-xs bg-[#F9844A]/10 text-[#F9844A] border-[#F9844A]/20 border">
                            Acima do objetivo
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-[#EF476F] font-semibold text-sm">{formatCurrency(tx.actual)}</p>
                        {tx.planned && (
                          <p className="text-[#8D99AE] text-xs">prev: {formatCurrency(tx.planned)}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#16213E] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
              <Wallet className="h-4 w-4 text-[#A78BFA]" />
              Parcelas em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {installments.length === 0 ? (
              <p className="text-[#8D99AE] text-sm py-4 text-center">Nenhuma parcela no mês</p>
            ) : (
              <div className="space-y-2">
                {installments.map((tx) => {
                  const remaining = getRemainingInstallments(tx.installment ?? null);
                  return (
                    <div key={tx.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div>
                        <p className="text-[#E2E8F0] text-sm">{tx.description}</p>
                        {tx.installment && (
                          <p className="text-[#8D99AE] text-xs">
                            Parcela {tx.installment}
                            {remaining !== null && ` • ${remaining} restante${remaining !== 1 ? "s" : ""}`}
                          </p>
                        )}
                      </div>
                      <p className="text-[#A78BFA] font-semibold text-sm">{formatCurrency(tx.actual)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#16213E] border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm font-semibold">Fechamento do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Receitas", value: totalRevenue, color: "text-[#06D6A0]" },
              { label: "Total Despesas", value: totalExpenses, color: "text-[#EF476F]" },
              { label: "Saldo Líquido", value: balance, color: balance >= 0 ? "text-[#06D6A0]" : "text-[#EF476F]" },
              { label: "% Comprometido", value: null, color: "text-[#FFD166]", extra: `${totalRevenue ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : 0}%` },
            ].map(({ label, value, color, extra }) => (
              <div key={label} className="text-center p-4 rounded-lg bg-[#1A1A2E]">
                <p className="text-[#8D99AE] text-xs mb-1">{label}</p>
                <p className={cn("text-xl font-bold", color)}>
                  {extra ?? formatCurrency(value ?? 0)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
