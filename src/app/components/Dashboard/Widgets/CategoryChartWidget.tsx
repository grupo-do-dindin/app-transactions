"use client";

import { useState } from "react";
import { ITransaction } from "../../../types/transaction";
import { IWidget } from "../../../types/widget";

interface CategoryChartWidgetProps {
  widget: IWidget;
  transactions: ITransaction[];
}

const CATEGORY_COLORS: { [key: string]: string } = {
  alimentação: "#10b981", // Emerald
  lazer: "#3b82f6",       // Blue
  transporte: "#f59e0b",  // Amber
  saúde: "#ec4899",       // Pink
  educação: "#8b5cf6",    // Purple
  moradia: "#06b6d4",     // Cyan
  outros: "#64748b",      // Slate
};

const DEFAULT_COLOR = "#a1a1aa"; // Gray

export const CategoryChartWidget = ({
  widget,
  transactions,
}: CategoryChartWidgetProps) => {
  const [activeCategory, setActiveCategory] = useState<{
    name: string;
    value: number;
    percent: number;
    color: string;
  } | null>(null);

  // Filtrar apenas despesas e agrupar por categoria
  const expenses = transactions.filter((t) => t.type === "outcome");
  const totalExpense = expenses.reduce((sum, t) => sum + t.price, 0);

  const categoryMap: { [key: string]: number } = {};
  expenses.forEach((t) => {
    const cat = t.category.toLowerCase().trim();
    categoryMap[cat] = (categoryMap[cat] || 0) + t.price;
  });

  const categories = Object.keys(categoryMap)
    .map((name) => {
      const value = categoryMap[name];
      const percent = totalExpense > 0 ? (value / totalExpense) * 100 : 0;
      const color = CATEGORY_COLORS[name] || DEFAULT_COLOR;
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        percent,
        color,
      };
    })
    .sort((a, b) => b.value - a.value);

  // Parâmetros do SVG Donut
  const radius = 50;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const size = 150;
  const center = size / 2;

  // Variável para acumular o deslocamento (offset) do arco
  let accumulatedPercent = 0;

  // Categoria ativa padrão (se nada estiver em foco, exibe o total ou a maior categoria)
  const defaultDisplay = categories.length > 0
    ? {
        name: "Total Despesas",
        value: totalExpense,
        percent: 100,
        color: "#64748b",
      }
    : null;

  const displayInfo = activeCategory || defaultDisplay;

  return (
    <div className="h-full flex flex-col justify-between p-6 bg-white dark:bg-zinc-800/80 dark:backdrop-blur-md border border-gray-100 dark:border-zinc-700/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header do Widget */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          🍩 Despesas por Categoria
        </h3>
      </div>

      {categories.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <span className="text-2xl mb-1">🍕</span>
          <p className="text-sm text-gray-400">Sem despesas registradas.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 flex-1 py-2">
          {/* Donut SVG */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full transform -rotate-90 overflow-visible"
            >
              {/* Círculo de fundo padrão */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                className="stroke-gray-100 dark:stroke-zinc-700"
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {categories.map((cat, idx) => {
                const strokeDashoffset =
                  circumference - (cat.percent / 100) * circumference;
                const strokeDasharray = `${circumference} ${circumference}`;
                const rotationOffset = (accumulatedPercent / 100) * circumference;
                accumulatedPercent += cat.percent;

                return (
                  <circle
                    key={idx}
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={cat.color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset - rotationOffset}
                    strokeLinecap="round"
                    className="transition-all duration-300 cursor-pointer origin-center hover:scale-105"
                    style={{
                      transformOrigin: "center",
                    }}
                    onMouseEnter={() => {
                      setActiveCategory(cat);
                    }}
                    onMouseLeave={() => setActiveCategory(null)}
                  />
                );
              })}
            </svg>

            {/* Texto Central */}
            {displayInfo && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate max-w-full">
                  {displayInfo.name}
                </span>
                <span className="text-sm font-extrabold text-gray-800 dark:text-white truncate max-w-full">
                  R$ {displayInfo.value.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">
                  {displayInfo.percent.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* Legendas */}
          <div className="flex-1 w-full flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
            {categories.slice(0, 5).map((cat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs transition duration-150 hover:bg-gray-50 dark:hover:bg-zinc-700/30 p-1 rounded-lg cursor-pointer"
                onMouseEnter={() => setActiveCategory(cat)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  ></span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium truncate">
                    {cat.name}
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400 font-bold shrink-0">
                  R$ {cat.value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
            {categories.length > 5 && (
              <div className="text-[10px] text-center text-gray-400 italic">
                e mais {categories.length - 5} categoria(s)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
