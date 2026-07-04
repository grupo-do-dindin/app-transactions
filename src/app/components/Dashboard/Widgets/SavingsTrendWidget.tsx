"use client";

import { useState } from "react";
import { ITransaction } from "../../../types/transaction";
import { IWidget } from "../../../types/widget";

interface SavingsTrendWidgetProps {
  widget: IWidget;
  transactions: ITransaction[];
}

export const SavingsTrendWidget = ({
  widget,
  transactions,
}: SavingsTrendWidgetProps) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    balance: number;
    x: number;
    y: number;
    idx: number;
  } | null>(null);

  // Ordenar transações por data ascendente para calcular o acumulativo
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Calcular saldo acumulado ponto a ponto
  let runningBalance = 0;
  const trendPoints: { date: string; balance: number }[] = [];

  sortedTransactions.forEach((t) => {
    try {
      const date = new Date(t.createdAt);
      if (isNaN(date.getTime())) return;

      if (t.type === "income") {
        runningBalance += t.price;
      } else {
        runningBalance -= t.price;
      }

      trendPoints.push({
        date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        balance: runningBalance,
      });
    } catch (e) {
      // Ignorar datas ruins
    }
  });

  // Pegar os últimos 8 pontos para desenhar
  const displayPoints = trendPoints.slice(-8);

  // Encontrar valores min e max para o gráfico
  let minBalance = 0;
  let maxBalance = 1000;

  if (displayPoints.length > 0) {
    const balances = displayPoints.map((p) => p.balance);
    minBalance = Math.min(...balances, 0); // Incluir o 0 para contextualizar
    maxBalance = Math.max(...balances, 100);
  }

  // Dar uma folga nos limites superior e inferior
  const range = maxBalance - minBalance;
  maxBalance = maxBalance + range * 0.15;
  minBalance = minBalance - (range > 0 ? range * 0.15 : 100);

  const width = 500;
  const height = 220;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Gerar coordenadas dos pontos (x, y)
  const svgPoints = displayPoints.map((pt, idx) => {
    const x =
      paddingLeft +
      (idx / Math.max(displayPoints.length - 1, 1)) * chartWidth;
    const ratio = (pt.balance - minBalance) / (maxBalance - minBalance || 1);
    const y = paddingTop + chartHeight * (1 - ratio);
    return { x, y, pt, idx };
  });

  // Gerar comando 'd' para o SVG path
  let pathD = "";
  let areaD = "";
  if (svgPoints.length > 0) {
    pathD = `M ${svgPoints[0].x} ${svgPoints[0].y} ` +
      svgPoints.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ");

    // O caminho da área vai até a base do gráfico (y = paddingTop + chartHeight)
    const yBase = paddingTop + chartHeight;
    areaD = `${pathD} L ${svgPoints[svgPoints.length - 1].x} ${yBase} L ${svgPoints[0].x} ${yBase} Z`;
  }

  return (
    <div className="h-full flex flex-col justify-between p-6 bg-white dark:bg-zinc-800/80 dark:backdrop-blur-md border border-gray-100 dark:border-zinc-700/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header do Widget */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          📈 Tendência do Saldo Acumulado
        </h3>
        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
          Saldo Atual: R$ {runningBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {displayPoints.length < 2 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <span className="text-2xl mb-1">📈</span>
          <p className="text-sm text-gray-400">Adicione mais transações para ver a tendência.</p>
        </div>
      ) : (
        <div className="relative flex-1 w-full mt-2">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Linhas de Grade Horizontal */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = paddingTop + chartHeight * (1 - ratio);
              const val = minBalance + (maxBalance - minBalance) * ratio;
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
                    {Math.round(val) >= 1000 ? `${(val / 1000).toFixed(1)}k` : Math.round(val)}
                  </text>
                </g>
              );
            })}

            {/* Desenhar Área Preenchida */}
            <path d={areaD} fill="url(#areaGrad)" />

            {/* Desenhar Linha de Tendência */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Desenhar Pontos Interativos */}
            {svgPoints.map((p, idx) => (
              <g key={idx}>
                {/* Círculo visível menor */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  className="transition-all duration-150"
                  style={{
                    transform: hoveredPoint?.idx === idx ? "scale(1.4)" : "scale(1)",
                    transformOrigin: `${p.x}px ${p.y}px`,
                  }}
                />

                {/* Área invisível maior para detecção de hover fácil */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="12"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    setHoveredPoint({
                      date: p.pt.date,
                      balance: p.pt.balance,
                      x: p.x,
                      y: p.y,
                      idx,
                    });
                  }}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* Eixo X: Rótulos */}
                {idx % 2 === 0 && (
                  <text
                    x={p.x}
                    y={height - paddingBottom + 20}
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-gray-400 dark:fill-zinc-500"
                  >
                    {p.pt.date}
                  </text>
                )}
              </g>
            ))}

            {/* Eixo X Base */}
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
          {hoveredPoint && (
            <div
              className="absolute z-10 p-2 bg-zinc-950 text-white text-[10px] rounded shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full flex flex-col items-center gap-0.5 border border-zinc-800"
              style={{
                left: `${(hoveredPoint.x / width) * 100}%`,
                top: `${(hoveredPoint.y / height) * 100 - 4}%`,
              }}
            >
              <span className="font-semibold uppercase tracking-wider text-[8px] text-zinc-400">
                Saldo em {hoveredPoint.date}
              </span>
              <span className="text-xs font-bold text-emerald-400">
                R$ {hoveredPoint.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              <div className="w-1.5 h-1.5 bg-zinc-950 rotate-45 transform translate-y-1.5"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
