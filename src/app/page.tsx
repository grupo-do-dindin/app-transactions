"use client";

import { useEffect, useState } from "react";
import { useTransactions } from "@/app/hooks/useTransactions";
import { WidgetGrid } from "./components/Dashboard/WidgetGrid";
import { WidgetCatalog } from "./components/Dashboard/WidgetCatalog";
import { IWidget, WidgetType } from "./types/widget";

const INITIAL_WIDGETS: IWidget[] = [
  { id: "w-balance", type: "balance", title: "Resumo de Saldo", colSpan: 3 },
  { id: "w-add-tx", type: "add-transaction", title: "Nova Transação", colSpan: 1 },
  { id: "w-tx-list", type: "transactions-list", title: "Lista de Transações", colSpan: 1 },
  { id: "w-savings-goal", type: "savings-goal", title: "Meta de Economia", colSpan: 1 },
  { id: "w-income-outcome-chart", type: "income-outcome-chart", title: "Receitas vs Saídas", colSpan: 2 },
  { id: "w-category-chart", type: "category-chart", title: "Gastos por Categoria", colSpan: 1 },
];

export default function Home() {
  const {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    createTransaction,
  } = useTransactions();

  const [widgets, setWidgets] = useState<IWidget[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Carregar transações
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Carregar widgets do localStorage (apenas no cliente para evitar erros de hidratação)
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("dindin-widgets");
    if (saved) {
      try {
        setWidgets(JSON.parse(saved));
      } catch (e) {
        setWidgets(INITIAL_WIDGETS);
      }
    } else {
      setWidgets(INITIAL_WIDGETS);
    }
  }, []);

  // Salvar no localStorage sempre que mudar
  const saveWidgets = (updatedWidgets: IWidget[]) => {
    setWidgets(updatedWidgets);
    localStorage.setItem("dindin-widgets", JSON.stringify(updatedWidgets));
  };

  // Remover um widget
  const handleRemoveWidget = (id: string) => {
    const updated = widgets.filter((w) => w.id !== id);
    saveWidgets(updated);
  };

  // Adicionar um novo widget
  const handleAddWidget = (type: WidgetType, title: string, defaultColSpan: 1 | 2 | 3) => {
    const newWidget: IWidget = {
      id: `w-${type}-${Date.now()}`,
      type,
      title,
      colSpan: defaultColSpan,
      settings: {},
    };
    saveWidgets([...widgets, newWidget]);
  };

  // Atualizar configurações internas de um widget (como meta ou limites)
  const handleUpdateWidgetSettings = (id: string, settings: any) => {
    const updated = widgets.map((w) =>
      w.id === id ? { ...w, settings: { ...w.settings, ...settings } } : w
    );
    saveWidgets(updated);
  };

  // Reordenar widgets (mover para esquerda/direita/cima/baixo)
  const handleMoveWidget = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= widgets.length) return;

    const updated = [...widgets];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    saveWidgets(updated);
  };

  // Resetar para o layout padrão
  const handleResetLayout = () => {
    if (confirm("Deseja realmente redefinir o dashboard para o layout padrão?")) {
      saveWidgets(INITIAL_WIDGETS);
      setIsEditing(false);
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-sm text-gray-500">Buscando dados financeiros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 min-h-[60vh] text-center">
        <span className="text-3xl">⚠️</span>
        <p className="mt-2 text-red-600 dark:text-red-400 font-semibold">{error}</p>
        <button
          onClick={() => fetchTransactions()}
          className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const activeWidgetTypes = widgets.map((w) => w.type);

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50/50 dark:bg-zinc-900/40">
      {/* Faixa de Controle Superior do Dashboard */}
      <section className="w-full bg-white dark:bg-[#121214] border-b border-gray-100 dark:border-zinc-800 py-4 px-6 md:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
           Painel financeiro
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {isEditing
              ? "Modo de Personalização Ativo: reorganize, configure ou remova widgets."
              : "Visualize gráficos, metas e transações. Personalize como quiser!"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsCatalogOpen(true)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow active:scale-95 transition"
              >
                + Adicionar Widget
              </button>
              <button
                onClick={handleResetLayout}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              >
                Resetar Padrão
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-1.5 rounded-lg text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg active:scale-95 transition"
              >
                Salvar Layout ✓
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-1.5 rounded-lg text-xs font-bold text-white bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-950 dark:hover:bg-zinc-650 transition flex items-center gap-1.5 shadow"
            >
              ⚙️ Personalizar Dashboard
            </button>
          )}
        </div>
      </section>

      {/* Grid de Widgets Personalizado */}
      {widgets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 min-h-[50vh]">
          <span className="text-5xl mb-3">📱</span>
          <h2 className="text-lg font-bold text-gray-700 dark:text-zinc-350">Seu Dashboard está vazio</h2>
          <p className="text-sm text-gray-400 max-w-sm mt-1">
            Clique no botão abaixo para adicionar widgets e começar a gerenciar seus dados financeiros.
          </p>
          <button
            onClick={() => {
              setIsEditing(true);
              setIsCatalogOpen(true);
            }}
            className="mt-6 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition shadow-md"
          >
            Adicionar Primeiro Widget
          </button>
        </div>
      ) : (
        <WidgetGrid
          widgets={widgets}
          transactions={transactions}
          createTransaction={createTransaction}
          isEditing={isEditing}
          onRemoveWidget={handleRemoveWidget}
          onUpdateWidgetSettings={handleUpdateWidgetSettings}
          onMoveWidget={handleMoveWidget}
        />
      )}

      {/* Catálogo Drawer lateral */}
      <WidgetCatalog
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onAddWidget={handleAddWidget}
        activeWidgetTypes={activeWidgetTypes}
      />
    </div>
  );
}
