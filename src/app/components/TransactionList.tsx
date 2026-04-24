"use client";

import { useState } from "react";
import { ITransaction } from "../types/transaction";
import { useModalStore } from "../store/useModalStore";

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
  const openEdit = useModalStore((state) => state.openEdit);

  const filtered = search
    ? transactions.filter((t) =>
        t.description.toLowerCase().includes(search.toLowerCase()),
      )
    : transactions;

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 px-4">
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Busque uma transação"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[#121214] border border-[#323238] text-[#C4C4CC] rounded-md px-4 py-3 placeholder-[#7C7C8A] focus:outline-none"
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
              className="bg-[#29292E] cursor-pointer hover:bg-[#323238] transition-colors"
              onClick={() => openEdit(transaction)}
            >
              <td className="py-4 px-6 rounded-l-md text-[#C4C4CC] w-1/2">
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
              <td className="py-4 px-6 text-[#C4C4CC]">
                {transaction.category}
              </td>
              <td className="py-4 px-6 rounded-r-md text-[#C4C4CC]">
                {formatDate(transaction.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
