"use client";

import { ITransaction } from "../../../types/transaction";
import { IWidget } from "../../../types/widget";

interface QuickStatsWidgetProps {
  widget: IWidget;
  transactions: ITransaction[];
}

export const QuickStatsWidget = ({
  widget,
  transactions,
}: QuickStatsWidgetProps) => {
  const totalCount = transactions.length;

  const incomes = transactions.filter((t) => t.type === "income");
  const outcomes = transactions.filter((t) => t.type === "outcome");

  const maxIncome = incomes.length > 0 ? Math.max(...incomes.map((t) => t.price)) : 0;
  const maxOutcome = outcomes.length > 0 ? Math.max(...outcomes.map((t) => t.price)) : 0;

  const avgTransaction =
    totalCount > 0
      ? transactions.reduce((sum, t) => sum + t.price, 0) / totalCount
      : 0;

  return (
    <div className="h-full flex flex-col justify-between p-6 bg-white dark:bg-zinc-800/80 dark:backdrop-blur-md border border-gray-100 dark:border-zinc-700/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header do Widget */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          ⚡ Estatísticas Rápidas
        </h3>
      </div>

      {totalCount === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <span className="text-2xl mb-1">⚡</span>
          <p className="text-sm text-gray-400">Nenhuma estatística disponível.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 flex-1">
          {/* Card 1: Maior Receita */}
          <div className="bg-emerald-50/40 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100/30">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">
              Maior Receita
            </span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block truncate">
              R$ {maxIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Card 2: Maior Despesa */}
          <div className="bg-rose-50/40 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-100/30">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">
              Maior Despesa
            </span>
            <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400 mt-1 block truncate">
              R$ {maxOutcome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Card 3: Ticket Médio */}
          <div className="bg-blue-50/40 dark:bg-blue-950/20 p-3 rounded-xl border border-blue-100/30">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">
              Valor Médio
            </span>
            <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-1 block truncate">
              R$ {avgTransaction.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Card 4: Frequência */}
          <div className="bg-slate-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-slate-100/10">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">
              Transações
            </span>
            <span className="text-sm font-extrabold text-gray-700 dark:text-gray-200 mt-1 block truncate">
              {totalCount} lançadas
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
