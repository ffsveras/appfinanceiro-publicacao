import { Suspense } from "react";
import { getTransactions } from "@/app/actions/transactions";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import type { DbTransaction } from "@/types/db";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    month?: string;
    type?: string;
    category?: string;
    card?: string;
    search?: string;
  }>;
}

export default async function LancamentosPage({ searchParams }: Props) {
  const params = await searchParams;

  const transactions = await getTransactions({
    month: params.month ? Number(params.month) : undefined,
    year: new Date().getFullYear(),
    type: params.type,
    category: params.category,
    card: params.card,
    search: params.search,
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Lançamentos</h1>
        <p className="text-[#8D99AE] text-sm">Registre e gerencie suas transações</p>
      </div>

      <Card className="bg-[#16213E] border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
            <Plus className="h-4 w-4 text-[#00B4D8]" />
            Novo Lançamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionForm />
        </CardContent>
      </Card>

      <Card className="bg-[#16213E] border-white/10">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-white text-base font-semibold">
              Histórico ({transactions.length} registros)
            </CardTitle>
            <Suspense fallback={null}>
              <TransactionFilters />
            </Suspense>
          </div>
        </CardHeader>
        <CardContent>
          <TransactionList transactions={transactions as DbTransaction[]} />
        </CardContent>
      </Card>
    </div>
  );
}
