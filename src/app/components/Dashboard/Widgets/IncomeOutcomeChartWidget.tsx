"use client";

import { useState } from "react";
import { ITransaction } from "../../../types/transaction";
import { IWidget } from "../../../types/widget";

interface IncomeOutcomeChartWidgetProps {
  widget: IWidget;
  transactions: ITransaction[];
}

export const IncomeOutcomeChartWidget = ({
  widget,
  transactions,
}: IncomeOutcomeChartWidgetProps) => {
  const [hoveredBar, setHoveredBar] = useState<{
    month: string;
    type: "income" | "outcome";
    value: number;
    x: number;
    y: number;
  } | null>(null);

  // Agrupar transações por mês/ano
  const groupedData: { [key: string]: { income: number; outcome: number } } = {};

  transactions.forEach((t) => {
    try {
      const date = new Date(t.createdAt);
      if (isNaN(date.getTime())) return;
      const key = `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

      if (!groupedData[key]) {
        groupedData[key] = { income: 0, outcome: 0 };
      }

      if (t.type === "income") {
        groupedData[key].income += t.price;
      } else {
        groupedData[key].outcome += t.price;
      }
    } catch (e) {
      // Ignorar datas inválidas
    }
  });

  // Ordenar cronologicamente os meses
  const sortedMonths = Object.keys(groupedData).sort((a, b) => {
    const [monthA, yearA] = a.split("/").map(Number);
    const [monthB, yearB] = b.split("/").map(Number);
    return yearA !== yearB ? yearA - yearB : monthA - monthB;
  });

  // Pegar os últimos 5 meses com dados para não sobrecarregar
  const displayMonths = sortedMonths.slice(-5);

  // Achar o valor máximo para escalar o gráfico
  let maxValue = 1000;
  displayMonths.forEach((month) => {
    const data = groupedData[month];
    maxValue = Math.max(maxValue, data.income, data.outcome);
  });
  // Adicionar margem de 15% no topo
  maxValue = maxValue * 1.15;

  // Dimensões do SVG
  const width = 500;
  const height = 220;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  return (
    <div className="h-full flex flex-col justify-between p-6 bg-white dark:bg-zinc-800/80 dark:backdrop-blur-md border border-gray-100 dark:border-zinc-700/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header do Widget */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          📊 Comparativo: Receitas vs Despesas
        </h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span> Receitas
          </span>
          <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block"></span> Despesas
          </span>
        </div>
      </div>

      {displayMonths.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <span className="text-2xl mb-1">📉</span>
          <p className="text-sm text-gray-400">Sem dados de transações disponíveis.</p>
        </div>
      ) : (
        <div className="relative flex-1 w-full mt-2">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            {/* Definições de Gradientes */}
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="outcomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>

            {/* Linhas de Grade de Fundo (Horizontal) */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = paddingTop + chartHeight * (1 - ratio);
              const valueLabel = Math.round(maxValue * ratio);
              return (
                <g key={index} className="opacity-40 dark:opacity-20">
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-gray-400 dark:fill-zinc-500 font-medium"
                  >
                    {valueLabel >= 1000 ? `${(valueLabel / 1000).toFixed(1)}k` : valueLabel}
                  </text>
                </g>
              );
            })}

            {/* Desenho das Barras */}
            {displayMonths.map((month, idx) => {
              const data = groupedData[month];
              const monthWidth = chartWidth / displayMonths.length;
              const xStart = paddingLeft + idx * monthWidth;

              // Largura de cada barra individual
              const barWidth = Math.min(20, monthWidth * 0.3);
              const barGap = 4;

              // Calcular posições e alturas
              const incomeHeight = (data.income / maxValue) * chartHeight;
              const outcomeHeight = (data.outcome / maxValue) * chartHeight;

              const xIncome = xStart + (monthWidth - barWidth * 2 - barGap) / 2;
              const xOutcome = xIncome + barWidth + barGap;

              const yIncome = paddingTop + chartHeight - incomeHeight;
              const yOutcome = paddingTop + chartHeight - outcomeHeight;

              return (
                <g key={month}>
                  {/* Barra de Receita */}
                  <rect
                    x={xIncome}
                    y={yIncome}
                    width={barWidth}
                    height={incomeHeight}
                    fill="url(#incomeGrad)"
                    rx="4"
                    className="transition-all duration-300 hover:opacity-85 cursor-pointer"
                    onMouseEnter={(e) => {
                      setHoveredBar({
                        month,
                        type: "income",
                        value: data.income,
                        x: xIncome + barWidth / 2,
                        y: yIncome,
                      });
                    }}
                    onMouseLeave={() => setHoveredBar(null)}
                  />

                  {/* Barra de Despesa */}
                  <rect
                    x={xOutcome}
                    y={yOutcome}
                    width={barWidth}
                    height={outcomeHeight}
                    fill="url(#outcomeGrad)"
                    rx="4"
                    className="transition-all duration-300 hover:opacity-85 cursor-pointer"
                    onMouseEnter={(e) => {
                      setHoveredBar({
                        month,
                        type: "outcome",
                        value: data.outcome,
                        x: xOutcome + barWidth / 2,
                        y: yOutcome,
                      });
                    }}
                    onMouseLeave={() => setHoveredBar(null)}
                  />

                  {/* Eixo X: Rótulos dos Meses */}
                  <text
                    x={xStart + monthWidth / 2}
                    y={height - paddingBottom + 20}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-gray-500 dark:fill-gray-400"
                  >
                    {month}
                  </text>
                </g>
              );
            })}

            {/* Linha do Eixo X */}
            <line
              x1={paddingLeft}
              y1={paddingTop + chartHeight}
              x2={width - paddingRight}
              y2={paddingTop + chartHeight}
              stroke="#cbd5e1"
              strokeWidth="2"
              className="dark:stroke-zinc-700"
            />
          </svg>

          {/* Tooltip Dinâmico */}
          {hoveredBar && (
            <div
              className="absolute z-10 p-2 bg-zinc-950 text-white text-[10px] rounded shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full flex flex-col items-center gap-0.5 border border-zinc-800"
              style={{
                left: `${(hoveredBar.x / width) * 100}%`,
                top: `${(hoveredBar.y / height) * 100 - 4}%`,
              }}
            >
              <span className="font-semibold uppercase tracking-wider text-[8px] text-zinc-400">
                {hoveredBar.month} - {hoveredBar.type === "income" ? "Receita" : "Despesa"}
              </span>
              <span className="text-xs font-bold">
                R$ {hoveredBar.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              {/* Seta do Tooltip */}
              <div className="w-1.5 h-1.5 bg-zinc-950 rotate-45 transform translate-y-1.5"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
