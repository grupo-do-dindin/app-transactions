"use client";

import { IWidget, WidgetType } from "../../types/widget";
import { ITransaction } from "../../types/transaction";
import { AccountBalance } from "../AccountBalance";
import { AddTransactionForm } from "../AddTransactionForm";
import { TransactionList } from "../TransactionList";
import { SavingsGoalsWidget } from "./Widgets/SavingsGoalsWidget";
import { SpendingAlertsWidget } from "./Widgets/SpendingAlertsWidget";
import { IncomeOutcomeChartWidget } from "./Widgets/IncomeOutcomeChartWidget";
import { CategoryChartWidget } from "./Widgets/CategoryChartWidget";
import { SavingsTrendWidget } from "./Widgets/SavingsTrendWidget";
import { FinancialHealthWidget } from "./Widgets/FinancialHealthWidget";
import { QuickStatsWidget } from "./Widgets/QuickStatsWidget";

interface WidgetGridProps {
  widgets: IWidget[];
  transactions: ITransaction[];
  createTransaction: (input: any) => void;
  isEditing: boolean;
  onRemoveWidget: (id: string) => void;
  onUpdateWidgetSettings: (id: string, settings: any) => void;
  onMoveWidget: (index: number, direction: "left" | "right") => void;
}

export const WidgetGrid = ({
  widgets,
  transactions,
  createTransaction,
  isEditing,
  onRemoveWidget,
  onUpdateWidgetSettings,
  onMoveWidget,
}: WidgetGridProps) => {
  const renderWidgetContent = (widget: IWidget) => {
    switch (widget.type) {
      case "balance":
        return (
          <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-700/50">
            <AccountBalance transactions={transactions} />
          </div>
        );
      case "add-transaction":
        return (
          <div className="h-full bg-white dark:bg-zinc-800/80 border border-gray-100 dark:border-zinc-700/50 rounded-2xl p-4 shadow-sm">
            <AddTransactionForm addTransaction={createTransaction} />
          </div>
        );
      case "transactions-list":
        return (
          <div className="h-full bg-white dark:bg-zinc-800/80 border border-gray-100 dark:border-zinc-700/50 rounded-2xl p-4 shadow-sm max-h-[460px] overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
              📜 Histórico
            </h3>
            <TransactionList transactions={transactions} />
          </div>
        );
      case "savings-goal":
        return (
          <SavingsGoalsWidget
            widget={widget}
            transactions={transactions}
            isEditing={isEditing}
            onUpdateSettings={(settings) => onUpdateWidgetSettings(widget.id, settings)}
          />
        );
      case "spending-alert":
        return (
          <SpendingAlertsWidget
            widget={widget}
            transactions={transactions}
            isEditing={isEditing}
            onUpdateSettings={(settings) => onUpdateWidgetSettings(widget.id, settings)}
          />
        );
      case "income-outcome-chart":
        return <IncomeOutcomeChartWidget widget={widget} transactions={transactions} />;
      case "category-chart":
        return <CategoryChartWidget widget={widget} transactions={transactions} />;
      case "savings-trend":
        return <SavingsTrendWidget widget={widget} transactions={transactions} />;
      case "financial-health":
        return <FinancialHealthWidget widget={widget} transactions={transactions} />;
      case "quick-stats":
        return <QuickStatsWidget widget={widget} transactions={transactions} />;
      default:
        return <div className="p-4 bg-red-100 text-red-800">Widget Desconhecido</div>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-10 w-full max-w-7xl mx-auto">
      {widgets.map((widget, index) => {
        const colSpanClass =
          widget.colSpan === 3
            ? "md:col-span-3"
            : widget.colSpan === 2
            ? "md:col-span-2"
            : "md:col-span-1";

        return (
          <div
            key={widget.id}
            className={`relative group transition-all duration-300 ${colSpanClass} ${
              isEditing ? "animate-wiggle cursor-grab active:cursor-grabbing" : ""
            }`}
          >
            {/* Overlay de Edição */}
            {isEditing && (
              <div className="absolute -top-3 -right-3 z-30 flex items-center gap-1.5">
                {/* Botão para mover para a esquerda/anterior */}
                {index > 0 && (
                  <button
                    onClick={() => onMoveWidget(index, "left")}
                    className="w-7 h-7 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition font-bold text-xs"
                    title="Mover para cima/esquerda"
                  >
                    ←
                  </button>
                )}

                {/* Botão para mover para a direita/próximo */}
                {index < widgets.length - 1 && (
                  <button
                    onClick={() => onMoveWidget(index, "right")}
                    className="w-7 h-7 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition font-bold text-xs"
                    title="Mover para baixo/direita"
                  >
                    →
                  </button>
                )}

                {/* Botão Excluir */}
                <button
                  onClick={() => onRemoveWidget(widget.id)}
                  className="w-7 h-7 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition font-black text-xs"
                  title="Remover Widget"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Container do Widget com sombra leve */}
            <div className="h-full transition-transform duration-200">
              {renderWidgetContent(widget)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
