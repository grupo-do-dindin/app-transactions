"use client";

import { useState } from "react";
import { ITransaction } from "../../../types/transaction";
import { IWidget } from "../../../types/widget";

interface SavingsGoalsWidgetProps {
  widget: IWidget;
  transactions: ITransaction[];
  isEditing: boolean;
  onUpdateSettings: (settings: any) => void;
}

export const SavingsGoalsWidget = ({
  widget,
  transactions,
  isEditing,
  onUpdateSettings,
}: SavingsGoalsWidgetProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [goalName, setGoalName] = useState(widget.settings?.savingsGoalName || "Reserva de Emergência");
  const [goalTarget, setGoalTarget] = useState(widget.settings?.savingsGoalTarget || 5000);

  // Calula a economia real (Entradas - Saídas)
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.price, 0);
  const totalOutcome = transactions
    .filter((t) => t.type === "outcome")
    .reduce((sum, t) => sum + t.price, 0);
  const currentSavings = totalIncome - totalOutcome;

  const percentage = Math.min(
    Math.max(Math.round((currentSavings / (goalTarget || 1)) * 100), 0),
    100
  );

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      savingsGoalName: goalName,
      savingsGoalTarget: Number(goalTarget),
    });
    setShowSettings(false);
  };

  return (
    <div className="relative h-full flex flex-col justify-between p-6 bg-white dark:bg-zinc-800/80 dark:backdrop-blur-md border border-gray-100 dark:border-zinc-700/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header do Widget */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          🎯 Meta: {widget.settings?.savingsGoalName || "Reserva"}
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
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Nome da Meta</label>
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className="w-full text-sm border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Valor Alvo (R$)</label>
            <input
              type="number"
              value={goalTarget}
              onChange={(e) => setGoalTarget(Number(e.target.value))}
              className="w-full text-sm border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black dark:text-white"
            />
          </div>
          <div className="flex gap-2 mt-1">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition"
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
        <div className="flex flex-col md:flex-row items-center gap-6 flex-1 justify-center py-2">
          {/* Círculo SVG de Progresso */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-gray-100 dark:stroke-zinc-700/60"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-emerald-500 dark:stroke-emerald-400 transition-all duration-500"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xl font-bold text-gray-800 dark:text-white">
              {percentage}%
            </span>
          </div>

          {/* Textos Informativos */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-2xl font-bold text-gray-800 dark:text-emerald-400">
              R$ {currentSavings.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Economizados de uma meta total de{" "}
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                R$ {goalTarget.toLocaleString("pt-BR")}
              </span>
            </p>
            <div className="mt-3 text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full inline-block font-medium">
              {percentage === 100
                ? "🎉 Meta Atingida!"
                : `Faltam R$ ${(Math.max(goalTarget - currentSavings, 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
