"use client";

import { useState } from "react";
import { ITransaction } from "../../../types/transaction";
import { IWidget } from "../../../types/widget";

interface SpendingAlertsWidgetProps {
  widget: IWidget;
  transactions: ITransaction[];
  isEditing: boolean;
  onUpdateSettings: (settings: any) => void;
}

export const SpendingAlertsWidget = ({
  widget,
  transactions,
  isEditing,
  onUpdateSettings,
}: SpendingAlertsWidgetProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [limit, setLimit] = useState(widget.settings?.spendingLimit || 3000);

  // Calcula despesas totais (Saídas)
  const totalExpenses = transactions
    .filter((t) => t.type === "outcome")
    .reduce((sum, t) => sum + t.price, 0);

  const percentage = Math.min(
    Math.max(Math.round((totalExpenses / (limit || 1)) * 100), 0),
    100
  );

  const isWarning = percentage >= 80 && percentage < 100;
  const isDanger = percentage >= 100;

  let alertColor = "bg-emerald-500";
  let textColor = "text-emerald-600 dark:text-emerald-400";
  let alertBadge = "Estável 👍";
  let alertMessage = "Seus gastos estão sob controle.";
  let bgTheme = "bg-emerald-50/50 dark:bg-emerald-950/20";
  let borderTheme = "border-gray-100 dark:border-zinc-700/50";

  if (isDanger) {
    alertColor = "bg-red-500";
    textColor = "text-red-600 dark:text-red-400";
    alertBadge = "Limite Excedido! 🚨";
    alertMessage = "Você ultrapassou o teto de gastos configurado!";
    bgTheme = "bg-red-50/70 dark:bg-red-950/30";
    borderTheme = "border-red-200 dark:border-red-900/40";
  } else if (isWarning) {
    alertColor = "bg-amber-500";
    textColor = "text-amber-600 dark:text-amber-400";
    alertBadge = "Atenção Próximo do Limite ⚠️";
    alertMessage = "Você atingiu 80%+ do seu teto de gastos.";
    bgTheme = "bg-amber-50/70 dark:bg-amber-950/30";
    borderTheme = "border-amber-200 dark:border-amber-900/40";
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      spendingLimit: Number(limit),
    });
    setShowSettings(false);
  };

  return (
    <div className={`relative h-full flex flex-col justify-between p-6 bg-white dark:bg-zinc-800/80 dark:backdrop-blur-md border ${borderTheme} rounded-2xl shadow-sm hover:shadow-md transition-all duration-300`}>
      {/* Header do Widget */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          🚨 Alerta de Gastos
        </h3>
        {!isEditing && (
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
          >
            ⚙️
          </button>
        )}
      </div>

      {showSettings ? (
        <form onSubmit={handleSave} className="flex flex-col gap-3 flex-1 justify-center">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Teto Mensal de Despesas (R$)</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full text-sm border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500 text-black dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-200 text-xs font-semibold py-1.5 px-3 rounded-lg transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col flex-1 justify-between gap-4">
          <div className="flex justify-between items-baseline">
            <span className="text-3xl font-extrabold text-gray-800 dark:text-white">
              R$ {totalExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-medium text-gray-400">
              limite de R$ {limit.toLocaleString("pt-BR")}
            </span>
          </div>

          {/* Barra de Progresso */}
          <div className="w-full">
            <div className="w-full h-3 bg-gray-100 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${alertColor} rounded-full transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
              <span>0%</span>
              <span className="font-semibold text-gray-600 dark:text-gray-300">{percentage}% consumido</span>
              <span>100%</span>
            </div>
          </div>

          {/* Banner de status */}
          <div className={`p-3 rounded-xl ${bgTheme} border border-transparent transition-all duration-300`}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-xs font-bold uppercase tracking-wide ${textColor}`}>
                {alertBadge}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{alertMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};
