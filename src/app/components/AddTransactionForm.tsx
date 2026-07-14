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
  accountId: "",
  id: "",
  date: new Date().toISOString().split("T")[0],
  from: "",
  to: "",
  anexo: "",
  type: "Credit",
  urlAnexo: "",
  value: 0,
};

export const AddTransactionForm = ({
  addTransaction,
  editingTransaction,
  onClose,
}: AddTranscationFormProps) => {
  const [newTransaction, setNewTransaction] =
    useState<ITransaction>(initialTransaction);
  const [priceString, setPriceString] = useState("");
  const price = Number(priceString.replace(",", "."));
  const [receiptDataUrl, setReceiptDataUrl] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  useEffect(() => {
    if (editingTransaction) {
      setNewTransaction({ ...editingTransaction });
      setPriceString(
        String(Math.abs(editingTransaction.value).toFixed(2)).replace(
          /\./g,
          ",",
        ),
      );
      setReceiptDataUrl(editingTransaction.urlAnexo ?? null);
      setSelectedReceipt(null);
    } else {
      setNewTransaction({
        ...initialTransaction,
        accountId: "", // passar aqui
        date: new Date().toISOString().split("T")[0],
      });
      setReceiptDataUrl(null);
    }
  }, [editingTransaction]);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Math.abs(Number(priceString.replace(/\,/g, ".")));
    const transactionToSave = {
      ...newTransaction,
      value: newTransaction.type === "Debit" ? -price : price,
      date: new Date().toISOString().split("T")[0],
      urlAnexo: receiptDataUrl ?? newTransaction.urlAnexo ?? "",
    };
    addTransaction(transactionToSave);

    setNewTransaction({
      id: "",
      accountId: "",
      date: new Date().toISOString().split("T")[0],
      from: "",
      to: "",
      anexo: "",
      type: "Credit",
      urlAnexo: "",
      value: 0,
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
          placeholder="Valor"
          type="text"
          className="border-0 dark:bg-[#121214] h-[40px] dark:text-[#E1E1E6] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={priceString}
          onChange={(e) => {
            const value = e.target.value.replace(/\./g, ",");

            if (/^\d*(,\d{0,2})?$/.test(value)) {
              setPriceString(value);
            }
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <input
          placeholder="Categoria"
          type="text"
          list="categorias"
          className="border-0 dark:bg-[#121214] h-[40px] dark:text-[#E1E1E6] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={newTransaction.to}
          onChange={(e) =>
            setNewTransaction({
              ...newTransaction,
              to: e.target.value,
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
              type: "Credit",
            });
          }}
          className={`text-[#00B37E] dark:bg-[#323238] w-[150px] h-[40px] border rounded cursor-pointer  flex 
            items-center justify-center ${newTransaction.type === "Credit" ? "outline outline-2" : ""}`}
        >
          ⬆ Entrada
        </div>
        <div
          onClick={() => {
            setNewTransaction({
              ...newTransaction,
              type: "Debit",
            });
          }}
          className={`text-[#F75A68] dark:bg-[#323238] w-[150px] h-[40px] border rounded cursor-pointer flex 
            items-center justify-center ${newTransaction.type === "Debit" ? "outline outline-2" : ""}`}
        >
          ⬇ Saída
        </div>
      </div>

      <button
        type="submit"
        className="bg-[#00875F] hover:bg-[#017552] rounded-md h-10 text-white transition-colors disabled:bg-[#ffffff30] disabled:cursor-not-allowed disabled:text-[#ffffff54]"
        disabled={price <= 0 || !newTransaction.to}
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
