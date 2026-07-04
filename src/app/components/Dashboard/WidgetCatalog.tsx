"use client";

import { WidgetType, IAvailableWidget } from "../../types/widget";

interface WidgetCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (type: WidgetType, title: string, defaultColSpan: 1 | 2 | 3) => void;
  activeWidgetTypes: WidgetType[];
}

const AVAILABLE_WIDGETS: IAvailableWidget[] = [
  {
    type: "balance",
    title: "Resumo de Saldo",
    description: "Exibe o resumo das Entradas, Saídas e o Saldo Geral.",
    defaultColSpan: 3,
    icon: "💰",
  },
  {
    type: "add-transaction",
    title: "Nova Transação",
    description: "Formulário para adicionar novas receitas e despesas.",
    defaultColSpan: 1,
    icon: "➕",
  },
  {
    type: "transactions-list",
    title: "Lista de Transações",
    description: "Relação histórica de todas as transações lançadas.",
    defaultColSpan: 1,
    icon: "📜",
  },
  {
    type: "savings-goal",
    title: "Meta de Economia",
    description: "Defina uma meta financeira e acompanhe o progresso real acumulado.",
    defaultColSpan: 1,
    icon: "🎯",
  },
  {
    type: "spending-alert",
    title: "Alerta de Gastos",
    description: "Monitore despesas totais contra um teto limite configurável.",
    defaultColSpan: 1,
    icon: "🚨",
  },
  {
    type: "income-outcome-chart",
    title: "Receitas vs Saídas",
    description: "Gráfico de colunas SVG comparando receitas e despesas mensais.",
    defaultColSpan: 2,
    icon: "📊",
  },
  {
    type: "category-chart",
    title: "Gastos por Categoria",
    description: "Gráfico donut SVG mostrando a proporção de gastos por categoria.",
    defaultColSpan: 1,
    icon: "🍩",
  },
  {
    type: "savings-trend",
    title: "Tendência de Saldo",
    description: "Gráfico de linhas SVG do saldo acumulado ponto a ponto.",
    defaultColSpan: 2,
    icon: "📈",
  },
  {
    type: "financial-health",
    title: "Saúde Financeira",
    description: "Um velocímetro de pontuação para o seu equilíbrio financeiro.",
    defaultColSpan: 1,
    icon: "💚",
  },
  {
    type: "quick-stats",
    title: "Estatísticas Rápidas",
    description: "Métricas úteis de tickets médios, maior receita e maior despesa.",
    defaultColSpan: 1,
    icon: "⚡",
  },
];

export const WidgetCatalog = ({
  isOpen,
  onClose,
  onAddWidget,
  activeWidgetTypes,
}: WidgetCatalogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Panel Content */}
        <div className="w-screen max-w-md bg-white dark:bg-zinc-900 shadow-2xl flex flex-col transition-all duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                📱 Catálogo de Widgets
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Adicione widgets para turbinar seu painel financeiro.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
            >
              ✖
            </button>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
            {AVAILABLE_WIDGETS.map((widget) => {
              const isAdded = activeWidgetTypes.includes(widget.type);

              return (
                <div
                  key={widget.type}
                  className={`p-4 rounded-xl border flex items-start gap-4 transition duration-200 ${
                    isAdded
                      ? "bg-zinc-50/50 dark:bg-zinc-800/20 border-zinc-200 dark:border-zinc-800 opacity-70"
                      : "bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700/60 hover:shadow-md"
                  }`}
                >
                  <span className="text-3xl shrink-0 p-2 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                    {widget.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-semibold text-sm text-gray-800 dark:text-white">
                        {widget.title}
                      </span>
                      <span className="text-[10px] bg-gray-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400 font-bold shrink-0">
                        {widget.defaultColSpan} col{widget.defaultColSpan > 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-400 mt-1 leading-relaxed">
                      {widget.description}
                    </p>

                    <button
                      disabled={isAdded}
                      onClick={() => onAddWidget(widget.type, widget.title, widget.defaultColSpan)}
                      className={`mt-3 w-full py-1.5 rounded-lg text-xs font-bold transition flex justify-center items-center gap-1 ${
                        isAdded
                          ? "bg-zinc-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow active:scale-[0.98]"
                      }`}
                    >
                      {isAdded ? "Adicionado ✓" : "Adicionar ao Dashboard +"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
