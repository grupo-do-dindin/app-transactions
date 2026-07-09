"use client";

import { useState } from "react";
import { ITransaction } from "../types/transaction";
import { useModalStore } from "../store/useModalStore";
import { useTransactions } from "../hooks/useTransactions";
import { Pencil, Trash2, SlidersHorizontal, X } from "lucide-react";

interface TransactionListProps {
  transactions: ITransaction[];
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("pt-BR");
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const [search, setSearch] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "income" | "outcome">("all");

  const openEdit = useModalStore((state) => state.openEdit);
  const { deleteTransaction } = useTransactions();

  // Extrai lista única de categorias existentes nas transações
  const categories = Array.from(
    new Set(transactions.map((t) => t.category).filter(Boolean))
  );

  // Lógica combinada de filtros
  const filtered = transactions.filter((t) => {
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    if (selectedCategory && t.category !== selectedCategory) {
      return false;
    }

    if (selectedType !== "all" && t.type !== selectedType) {
      return false;
    }

    if (t.createdAt) {
      const txDateStr = t.createdAt.split("T")[0];
      if (startDate && txDateStr < startDate) {
        return false;
      }
      if (endDate && txDateStr > endDate) {
        return false;
      }
    } else if (startDate || endDate) {
      return false;
    }

    const absPrice = Math.abs(t.price);
    if (minPrice && absPrice < Number(minPrice)) {
      return false;
    }
    if (maxPrice && absPrice > Number(maxPrice)) {
      return false;
    }

    return true;
  });

  const clearFilters = () => {
    setSelectedCategory("");
    setStartDate("");
    setEndDate("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedType("all");
  };

  const hasActiveFilters =
    selectedCategory ||
    startDate ||
    endDate ||
    minPrice ||
    maxPrice ||
    selectedType !== "all";

  const activeFiltersCount = [
    selectedCategory ? 1 : 0,
    startDate ? 1 : 0,
    endDate ? 1 : 0,
    minPrice ? 1 : 0,
    maxPrice ? 1 : 0,
    selectedType !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 px-4">
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Busque uma transação"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[#D1FAE5] dark:bg-[#121214] border border-green-200 dark:border-[#323238] text-black dark:text-[#C4C4CC] rounded-md px-4 py-3 placeholder-[#7C7C8A] focus:outline-none"
        />
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`px-5 py-3 rounded-md font-medium transition-all flex items-center gap-2 border cursor-pointer ${
            isFiltersOpen || hasActiveFilters
              ? "bg-[#00875F] text-white border-[#00875F]"
              : "bg-transparent border-green-200 dark:border-[#323238] text-[#00875F] dark:text-[#00B37E] hover:bg-[#00875F] hover:text-white"
          }`}
          aria-label="Filtros avançados"
        >
          <SlidersHorizontal size={18} />
          <span className="hidden sm:inline">Filtros</span>
          {hasActiveFilters && (
            <span className="bg-white text-[#00875F] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold ml-1 animate-pulse">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {isFiltersOpen && (
        <div className="bg-[#D1FAE5] dark:bg-[#202024] border border-green-200 dark:border-[#323238] rounded-md p-5 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-300">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-green-800 dark:text-[#7C7C8A]">Categoria</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white dark:bg-[#121214] border border-green-200 dark:border-[#323238] text-black dark:text-[#C4C4CC] rounded px-3 py-2 text-sm focus:outline-none"
            >
              <option value="">Todas</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-green-800 dark:text-[#7C7C8A]">Tipo</label>
            <div className="flex bg-white dark:bg-[#121214] border border-green-200 dark:border-[#323238] rounded p-0.5 h-[38px]">
              <button
                type="button"
                onClick={() => setSelectedType("all")}
                className={`flex-1 text-center text-xs py-1 rounded transition-colors cursor-pointer ${
                  selectedType === "all"
                    ? "bg-[#00875F] text-white font-medium"
                    : "text-black dark:text-[#C4C4CC] hover:bg-green-100 dark:hover:bg-[#29292E]"
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("income")}
                className={`flex-1 text-center text-xs py-1 rounded transition-colors cursor-pointer ${
                  selectedType === "income"
                    ? "bg-[#00B37E] text-white font-medium"
                    : "text-black dark:text-[#C4C4CC] hover:bg-green-100 dark:hover:bg-[#29292E]"
                }`}
              >
                Entradas
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("outcome")}
                className={`flex-1 text-center text-xs py-1 rounded transition-colors cursor-pointer ${
                  selectedType === "outcome"
                    ? "bg-[#F75A68] text-white font-medium"
                    : "text-black dark:text-[#C4C4CC] hover:bg-green-100 dark:hover:bg-[#29292E]"
                }`}
              >
                Saídas
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-green-800 dark:text-[#7C7C8A]">Valores (R$)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Mín"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 bg-white dark:bg-[#121214] border border-green-200 dark:border-[#323238] text-black dark:text-[#C4C4CC] rounded px-3 py-2 text-sm placeholder-[#7C7C8A] focus:outline-none"
              />
              <input
                type="number"
                placeholder="Máx"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 bg-white dark:bg-[#121214] border border-green-200 dark:border-[#323238] text-black dark:text-[#C4C4CC] rounded px-3 py-2 text-sm placeholder-[#7C7C8A] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-green-800 dark:text-[#7C7C8A]">Período</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-1/2 bg-white dark:bg-[#121214] border border-green-200 dark:border-[#323238] text-black dark:text-[#C4C4CC] rounded px-2 py-1.5 text-xs focus:outline-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-1/2 bg-white dark:bg-[#121214] border border-green-200 dark:border-[#323238] text-black dark:text-[#C4C4CC] rounded px-2 py-1.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="col-span-1 sm:col-span-2 md:col-span-4 flex justify-end mt-2">
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-[#F75A68] hover:text-[#f75a68]/80 font-medium flex items-center gap-1 transition-colors py-1 px-3 border border-dashed border-[#F75A68] rounded hover:bg-[#F75A68]/10 cursor-pointer"
              >
                <X size={14} />
                Limpar Todos os Filtros
              </button>
            </div>
          )}
        </div>
      )}

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <span className="text-xs text-[#7C7C8A] font-medium mr-1">Filtros ativos:</span>
          {selectedCategory && (
            <span className="bg-green-100 dark:bg-[#29292E] text-green-800 dark:text-[#00B37E] text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-green-200 dark:border-[#323238]">
              Categoria: {selectedCategory}
              <button onClick={() => setSelectedCategory("")} className="hover:text-red-500 transition-colors cursor-pointer">
                <X size={12} />
              </button>
            </span>
          )}
          {selectedType !== "all" && (
            <span className="bg-green-100 dark:bg-[#29292E] text-green-800 dark:text-[#00B37E] text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-green-200 dark:border-[#323238]">
              Tipo: {selectedType === "income" ? "Entradas" : "Saídas"}
              <button onClick={() => setSelectedType("all")} className="hover:text-red-500 transition-colors cursor-pointer">
                <X size={12} />
              </button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="bg-green-100 dark:bg-[#29292E] text-green-800 dark:text-[#00B37E] text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-green-200 dark:border-[#323238]">
              Valor: {minPrice ? `≥ R$ ${minPrice}` : ""} {minPrice && maxPrice ? " e " : ""} {maxPrice ? `≤ R$ ${maxPrice}` : ""}
              <button
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                }}
                className="hover:text-red-500 transition-colors cursor-pointer"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {(startDate || endDate) && (
            <span className="bg-green-100 dark:bg-[#29292E] text-green-800 dark:text-[#00B37E] text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-green-200 dark:border-[#323238]">
              Período: {startDate ? formatDate(startDate) : "Início"} até {endDate ? formatDate(endDate) : "Fim"}
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="hover:text-red-500 transition-colors cursor-pointer"
              >
                <X size={12} />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-[#7C7C8A] hover:text-[#F75A68] transition-colors underline cursor-pointer"
          >
            Limpar tudo
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="w-full text-center py-12 bg-[#D1FAE5]/30 dark:bg-[#29292E]/30 rounded-md border border-dashed border-green-200 dark:border-[#323238] my-6">
          <p className="text-black dark:text-[#7C7C8A] text-sm">Nenhuma transação encontrada para os filtros selecionados.</p>
        </div>
      ) : (
        <table className="w-full border-separate border-spacing-y-2">
          <tbody>
            {filtered.map((transaction) => (
              <tr
                key={transaction.id}
                className="bg-[#D1FAE5] dark:bg-[#29292E] hover:bg-green-200 dark:hover:bg-[#323238] transition-colors"
              >
                <td className="py-4 px-6 rounded-l-md text-black dark:text-[#C4C4CC] w-1/4">
                  {transaction.description}
                </td>
                <td
                  className={`py-4 px-6 font-medium ${
                    transaction.price >= 0 ? "text-[#00B37E]" : "text-[#F75A68]"
                  }`}
                >
                  {transaction.price < 0 ? "- " : ""}R${" "}
                  {formatCurrency(Math.abs(transaction.price))}
                </td>
                <td className="py-4 px-6 text-black dark:text-[#C4C4CC]">
                  {transaction.category}
                </td>
                <td className="py-4 px-6 text-black dark:text-[#C4C4CC]">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="py-4 px-6 rounded-r-md">
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() => openEdit(transaction)}
                      aria-label="Editar transação"
                      className="text-[#7C7C8A] hover:text-[#00B37E] transition-colors cursor-pointer"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      aria-label="Excluir transação"
                      className="text-[#7C7C8A] hover:text-[#F75A68] transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
