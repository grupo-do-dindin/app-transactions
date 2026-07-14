"use client";

import { useState, useEffect } from "react";
import { ITransaction } from "../types/transaction";
import { useModalStore } from "../store/useModalStore";
import { useTransactions } from "../hooks/useTransactions";
import { Pencil, Trash2, Search } from "lucide-react";
import { ReceiptModal } from "./ReceiptModal/ReceiptModal";

interface TransactionListProps {
  transactions: ITransaction[];
}

function formatCurrency(value: number): string {
  const resp = value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return resp;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("pt-BR");
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const [search, setSearch] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const openEdit = useModalStore((state) => state.openEdit);
  const { deleteTransaction } = useTransactions();

  const filtered = transactions;

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
        {/* <button
          onClick={() => {}}
          className="bg-transparent border border-[#00875F] text-[#00875F] hover:bg-[#00875F] hover:text-white px-5 py-3 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          Buscar
        </button> */}
      </div>

      <table className="w-full border-separate border-spacing-y-2">
        <tbody>
          {filtered.map((transaction) => (
            <tr
              key={transaction.id}
              className=" bg-[#D1FAE5] dark:bg-[#29292E] hover:bg-green-200 dark:hover:bg-[#323238] transition-colors"
            >
              <td className="py-4 px-6 rounded-l-md text-black dark:text-[#C4C4CC] w-1/4">
                {new Date(transaction.date).toLocaleString("pt-BR")}
              </td>

              {/* CATEGORIA */}
              <td className="py-4 px-6 text-[#C4C4CC]">{transaction.to}</td>

              {/* VALOR */}
              <td
                className={`py-4 px-6 font-medium ${
                  transaction.value >= 0 ? "text-[#00B37E]" : "text-[#F75A68]"
                }`}
              >
                {transaction.value < 0 ? "- " : ""}R${" "}
                {formatCurrency(Math.abs(transaction.value))}
              </td>

              <td className="py-4 px-6 rounded-r-md">
                <div className="flex items-center gap-3 justify-end">
                  <button
                    onClick={() => openEdit(transaction)}
                    aria-label="Editar transação"
                    className="text-[#7C7C8A] hover:text-[#00B37E] transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    aria-label="Excluir transação"
                    className="text-[#7C7C8A] hover:text-[#F75A68] transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
              <td className="py-4 px-6 text-black dark:text-[#C4C4CC] rounded-r-md">
                {transaction.urlAnexo ? (
                  <div className="relative w-12 h-12 overflow-hidden rounded-lg bg-[#f6fdf8] dark:bg-[#111214] group">
                    <button
                      type="button"
                      onClick={() => setSelectedReceipt(transaction.urlAnexo!)}
                      className="absolute inset-0 z-10"
                      aria-label="Abrir recibo"
                    />
                    <img
                      src={transaction.urlAnexo}
                      alt="Recibo"
                      className="h-full w-full object-cover transition duration-200 group-hover:blur-sm"
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition duration-200 group-hover:bg-black/30">
                      <Search className="h-6 w-6 text-white opacity-0 transition duration-200 group-hover:opacity-100" />
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-[#7C7C8A]">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReceiptModal
        receiptUrl={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};
