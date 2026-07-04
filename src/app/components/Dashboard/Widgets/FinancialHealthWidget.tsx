"use client";

import { ITransaction } from "../../../types/transaction";
import { IWidget } from "../../../types/widget";

interface FinancialHealthWidgetProps {
  widget: IWidget;
  transactions: ITransaction[];
}

export const FinancialHealthWidget = ({
  widget,
  transactions,
}: FinancialHealthWidgetProps) => {
  // Calcular totais
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.price, 0);
  const totalOutcome = transactions
    .filter((t) => t.type === "outcome")
    .reduce((sum, t) => sum + t.price, 0);

  // Calcular score de Saúde Financeira (0 a 100)
  let score = 50; // Inicial neutro
  let healthLabel = "Regular";
  let healthColor = "text-amber-500";
  let healthDesc = "Você está empatando suas contas. Tente economizar um pouco mais.";
  let gaugeStroke = "#f59e0b";

  if (totalIncome > 0) {
    const savingsRate = (totalIncome - totalOutcome) / totalIncome;

    if (savingsRate < 0) {
      // Gastando mais do que ganha
      const debtRatio = Math.min(Math.abs(savingsRate), 1); // máximo 100% de endividamento para cálculo
      score = Math.round(50 - debtRatio * 40); // 10 a 50
    } else {
      // Economizando
      // 0% a 15% de economia -> 50 a 70 pontos
      // 15% a 35% de economia -> 70 a 90 pontos
      // > 35% de economia -> 90 a 100 pontos
      if (savingsRate <= 0.15) {
        score = Math.round(50 + (savingsRate / 0.15) * 20);
      } else if (savingsRate <= 0.35) {
        score = Math.round(70 + ((savingsRate - 0.15) / 0.2) * 20);
      } else {
        score = Math.round(90 + Math.min(((savingsRate - 0.35) / 0.35) * 10, 10));
      }
    }
  } else if (totalOutcome > 0) {
    score = 10;
  }

  if (score >= 85) {
    healthLabel = "Excelente! 🌟";
    healthColor = "text-emerald-500 dark:text-emerald-400";
    healthDesc = "Sua taxa de poupança está ótima! Continue investindo.";
    gaugeStroke = "#10b981";
  } else if (score >= 70) {
    healthLabel = "Boa 👍";
    healthColor = "text-teal-500 dark:text-teal-400";
    healthDesc = "Você está guardando uma boa parte das receitas. Muito bem!";
    gaugeStroke = "#14b8a6";
  } else if (score >= 45) {
    healthLabel = "Regular ⚖️";
    healthColor = "text-amber-500 dark:text-amber-400";
    healthDesc = "Equilíbrio apertado. Reduzir pequenos gastos pode ajudar.";
    gaugeStroke = "#f59e0b";
  } else {
    healthLabel = "Crítica ⚠️";
    healthColor = "text-rose-500 dark:text-rose-400";
    healthDesc = "Seus gastos superaram as receitas. Hora de cortar custos!";
    gaugeStroke = "#f43f5e";
  }

  // Desenhar Velocímetro (Semi-círculo)
  // Raio do arco
  const r = 50;
  const cx = 70;
  const cy = 70;
  // Ângulo inicial é 180 (esquerda) a 0 (direita)
  // O ponteiro gira com base no score de 0 a 180 graus.
  const needleAngle = (score / 100) * 180; // em graus

  return (
    <div className="h-full flex flex-col justify-between p-6 bg-white dark:bg-zinc-800/80 dark:backdrop-blur-md border border-gray-100 dark:border-zinc-700/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header do Widget */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          💚 Saúde Financeira
        </h3>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 py-1 gap-2">
        {/* Velocímetro SVG */}
        <div className="relative w-40 h-24 flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 140 85" className="w-full h-auto">
            {/* Arco de fundo cinza */}
            <path
              d="M 20 70 A 50 50 0 0 1 120 70"
              fill="none"
              stroke="#e4e4e7"
              className="dark:stroke-zinc-700"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Arco colorido de progresso */}
            <path
              d="M 20 70 A 50 50 0 0 1 120 70"
              fill="none"
              stroke={gaugeStroke}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="157" // 3.14159 * 50 = ~157.07
              strokeDashoffset={157 - (score / 100) * 157}
              className="transition-all duration-500"
            />
            {/* Centro do Velocímetro */}
            <circle cx={cx} cy={cy} r="6" fill="#18181b" className="dark:fill-white" />
            {/* Ponteiro / Agulha */}
            <line
              x1={cx}
              y1={cy}
              x2={cx - 42}
              y2={cy}
              stroke="#18181b"
              className="dark:stroke-white transition-all duration-500"
              strokeWidth="3.5"
              strokeLinecap="round"
              transform={`rotate(${needleAngle}, ${cx}, ${cy})`}
            />
          </svg>
          {/* Score centralizado sob o velocímetro */}
          <div className="absolute bottom-0 text-center">
            <span className="text-2xl font-black text-zinc-800 dark:text-white">
              {score}
            </span>
            <span className="text-[10px] text-gray-400 font-bold block -mt-1">PONTOS</span>
          </div>
        </div>

        {/* Textos informativos de saúde */}
        <div className="text-center px-2">
          <span className={`text-xs font-extrabold uppercase tracking-wider ${healthColor}`}>
            Status: {healthLabel}
          </span>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            {healthDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
