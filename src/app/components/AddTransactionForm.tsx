"use client";

import { useEffect, useState } from "react";
import { ITransaction } from "../types/transaction";

interface AddTranscationFormProps {
  addTransaction: (transaction: ITransaction) => void;
  editingTransaction?: ITransaction | null;
  onClose?: () => void;
}

const initialTransaction: ITransaction = {
  id: Date.now(),
  createdAt: new Date().toISOString().split("T")[0],
  price: 0,
  description: "",
  type: "income",
  category: "",
};

export const AddTransactionForm = ({
  addTransaction,
  editingTransaction,
  onClose,
}: AddTranscationFormProps) => {
  const [newTransaction, setNewTransaction] =
    useState<ITransaction>(initialTransaction);

  useEffect(() => {
    if (editingTransaction) {
      setNewTransaction({
        ...editingTransaction,
        price: Math.abs(editingTransaction.price),
      });
    } else {
      setNewTransaction({
        ...initialTransaction,
        id: Date.now(),
        createdAt: new Date().toISOString().split("T")[0],
      });
    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transactionToSave = {
      ...newTransaction,
      price:
        newTransaction.type === "outcome"
          ? -Math.abs(newTransaction.price)
          : Math.abs(newTransaction.price),
    };
    addTransaction(transactionToSave);

    setNewTransaction({
      id: Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
      price: 0,
      description: "",
      type: "income",
      category: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#202024] shadow-md rounded-2xl p-6 w-full max-w-md mx-auto flex flex-col gap-4"
    >
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-[#E1E1E6]">
          {editingTransaction ? "Editar transação" : "Nova transação"}
        </h2>
        <span className="text-[#7C7C8A] cursor-pointer" onClick={onClose}>
          🗙
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <input
          placeholder="Descrição"
          type="text"
          className="border-0 bg-[#121214] h-[40px] text-[#E1E1E6] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={newTransaction.description}
          onChange={(e) =>
            setNewTransaction({
              ...newTransaction,
              description: e.target.value,
            })
          }
        />
      </div>

      <div className="flex flex-col gap-1">
        <input
          placeholder="Valor"
          type="text"
          step="0.01"
          className="border-0 bg-[#121214] h-[40px] text-[#E1E1E6] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={newTransaction.price}
          onChange={(e) =>
            setNewTransaction({
              ...newTransaction,
              price: Number(e.target.value),
            })
          }
        />
      </div>

      <div className="flex flex-col gap-1">
        <input
          placeholder="Categoria"
          type="text"
          list="categorias"
          className="border-0 bg-[#121214] h-[40px] text-[#E1E1E6] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={newTransaction.category}
          onChange={(e) =>
            setNewTransaction({
              ...newTransaction,
              category: e.target.value,
            })
          }
        />
        <datalist id="categorias">
          <option value="Alimentação" />
          <option value="Transporte" />
          <option value="Lazer" />
          <option value="Saúde" />
          <option value="Educação" />
        </datalist>
      </div>

      <div className="flex justify-around gap-4">
        <div
          onClick={() => {
            setNewTransaction({
              ...newTransaction,
              type: "income",
            });
          }}
          className={`text-[#00B37E] bg-[#323238] w-[150px] h-[40px] rounded cursor-pointer  flex 
            items-center justify-center ${newTransaction.type === "income" ? "outline outline-2" : ""}`}
        >
          ⬆ Entrada
        </div>
        <div
          onClick={() => {
            setNewTransaction({
              ...newTransaction,
              type: "outcome",
            });
          }}
          className={`text-[#F75A68] bg-[#323238] w-[150px] h-[40px] rounded cursor-pointer flex 
            items-center justify-center ${newTransaction.type === "outcome" ? "outline outline-2" : ""}`}
        >
          ⬇ Saída
        </div>
      </div>

      <button
        type="submit"
        className="bg-[#00875F] hover:bg-[#017552] rounded-md h-10 text-white transition-colors"
      >
        {editingTransaction ? "Editar" : "Cadastrar"}
      </button>
    </form>
  );
};
