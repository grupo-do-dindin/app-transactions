"use client";

import { useEffect, useState } from "react";
import { ITransaction } from "../types/transaction";
import { ReceiptModal } from "./ReceiptModal/ReceiptModal";
import { ImageUpload } from "./ImageUpload/ImageUpload";

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
  const [priceString, setPriceString] = useState("");
  const [receiptDataUrl, setReceiptDataUrl] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  useEffect(() => {
    if (editingTransaction) {
      setNewTransaction({ ...editingTransaction });
      setPriceString(String(Math.abs(editingTransaction.price).toFixed(2)).replace(/\./g, ","));
      setReceiptDataUrl(editingTransaction.receipt ?? null);
      setSelectedReceipt(null);
    } else {
      setNewTransaction({
        ...initialTransaction,
        id: Date.now(),
        createdAt: new Date().toISOString().split("T")[0],
      });
      setReceiptDataUrl(null);
    }
  }, [editingTransaction]);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Math.abs(Number(priceString.replace(/\,/g, ".")));
    const transactionToSave = {
      ...newTransaction,
      price: newTransaction.type === "outcome" ? -price : price,
      receipt: receiptDataUrl ?? newTransaction.receipt ?? "",
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
      className="bg-[#D1FAE5] dark:bg-[#202024] shadow-md rounded-2xl p-6 w-full max-w-md mx-auto flex flex-col gap-4"
    >
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold dark:text-[#E1E1E6]">
          {editingTransaction ? "Editar transação" : "Nova transação"}
        </h2>
        <span className="dark:text-[#7C7C8A] cursor-pointer" onClick={onClose}>
          X
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <input
          placeholder="Descrição"
          type="text"
          className="border-0  dark:bg-[#121214] h-[40px] dark:text-[#E1E1E6] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
          className="border-0 dark:bg-[#121214] h-[40px] dark:text-[#E1E1E6] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={priceString}
          onChange={(e) => {
            const value = e.target.value;
            const formattedValue = value.replace(/\./g, ',');
            const cleanedValue = formattedValue.replace(/[^0-9,]/g, '');
            setPriceString(cleanedValue);
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <input
          placeholder="Categoria"
          type="text"
          list="categorias"
          className="border-0 dark:bg-[#121214] h-[40px] dark:text-[#E1E1E6] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
      <ImageUpload
        imageUrl={receiptDataUrl}
        onImageSelect={(dataUrl) => {
          setReceiptDataUrl(dataUrl);
          setNewTransaction(prev => ({ ...prev, receipt: dataUrl }));
        }}
        onImageRemove={() => {
          setReceiptDataUrl(null);
          setNewTransaction((prev) => ({ ...prev, receipt: undefined }));
        }}
        onImagePreview={(dataUrl) => setSelectedReceipt(dataUrl)}
        label="Recibo (opcional)"
      />
      <div className="flex justify-around gap-4">
        <div
          onClick={() => {
            setNewTransaction({
              ...newTransaction,
              type: "income",
            });
          }}
          className={`text-[#00B37E] dark:bg-[#323238] w-[150px] h-[40px] border rounded cursor-pointer  flex 
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
          className={`text-[#F75A68] dark:bg-[#323238] w-[150px] h-[40px] border rounded cursor-pointer flex 
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

      <ReceiptModal
        receiptUrl={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </form>
  );
};
