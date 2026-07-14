"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";
import * as echarts from "echarts";
import { ITransaction } from "../types/transaction";

interface DailyFlowChartProps {
  transactions: ITransaction[];
}

const COLORS = {
  entradas: "#00B37E",
  saidas: "#F75A68",
};

interface DailyPoint {
  label: string;
  entradas: number;
  saidas: number;
}

function groupByDay(transactions: ITransaction[]): DailyPoint[] {
  const byDay = new Map<string, { entradas: number; saidas: number }>();

  transactions.forEach((transaction) => {
    if (!transaction.date) return;

    const day = transaction.date.split("T")[0];
    const entry = byDay.get(day) ?? { entradas: 0, saidas: 0 };

    if (transaction.type === "Credit") {
      entry.entradas += transaction.value;
    } else {
      entry.saidas += Math.abs(transaction.value);
    }

    byDay.set(day, entry);
  });

  return Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, values]) => ({
      label: new Date(`${day}T00:00:00`).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      ...values,
    }));
}

function formatCurrency(value: number): string {
  return `R$ ${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export const DailyFlowChart = ({ transactions }: DailyFlowChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const { resolvedTheme } = useTheme();

  const daily = useMemo(() => groupByDay(transactions), [transactions]);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const isDark = resolvedTheme === "dark";
    const textColor = isDark ? "#C4C4CC" : "#374151";
    const gridColor = isDark ? "#323238" : "#e5e7eb";

    chart.setOption({
      textStyle: { fontFamily: "Roboto, sans-serif" },
      tooltip: {
        trigger: "axis",
        valueFormatter: (value: number) => formatCurrency(value),
      },
      legend: {
        data: ["Entradas", "Saídas"],
        top: 0,
        textStyle: { color: textColor },
      },
      grid: { left: 56, right: 16, top: 40, bottom: 32 },
      xAxis: {
        type: "category",
        data: daily.map((d) => d.label),
        axisLine: { lineStyle: { color: gridColor } },
        axisLabel: { color: textColor },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: textColor, formatter: (value: number) => `R$ ${value}` },
        splitLine: { lineStyle: { color: gridColor } },
      },
      series: [
        {
          name: "Entradas",
          type: "bar",
          data: daily.map((d) => d.entradas),
          itemStyle: { color: COLORS.entradas, borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 24,
        },
        {
          name: "Saídas",
          type: "bar",
          data: daily.map((d) => d.saidas),
          itemStyle: { color: COLORS.saidas, borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 24,
        },
      ],
    });
  }, [daily, resolvedTheme]);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-md">
      <h2 className="text-sm text-black dark:text-gray-400 mb-4">
        Entradas e saídas por dia
      </h2>

      {daily.length === 0 ? (
        <p className="text-sm text-[#7C7C8A] py-10 text-center">
          Nenhuma transação para exibir no gráfico ainda.
        </p>
      ) : (
        <div ref={containerRef} className="h-72 w-full" />
      )}
    </div>
  );
};
