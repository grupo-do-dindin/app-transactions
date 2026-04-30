"use client";

import { AddTransactionForm } from "./components/AddTransactionForm";
import { TransactionList } from "./components/TransactionList";
import { AccountBalance } from "./components/AccountBalance";
import { useTransactions } from "@/app/hooks/useTransactions";
import { useModalStore } from "@/app/store/useModalStore";
import { useEffect } from "react";

export default function Home() {
  const {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    createTransaction,
    editTransaction,
  } = useTransactions();

  const { isOpen: isModalOpen, editingTransaction, close: closeModal } = useModalStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="w-full">
        <AccountBalance transactions={transactions} />

        {isModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/60"
            onClick={closeModal}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <AddTransactionForm
                addTransaction={(transaction) => {
                  if (editingTransaction) {
                    editTransaction(editingTransaction.id, {
                      description: transaction.description,
                      price: transaction.type === "outcome"
                        ? -Math.abs(transaction.price)
                        : Math.abs(transaction.price),
                      type: transaction.type,
                      category: transaction.category,
                    });
                  } else {
                    createTransaction(transaction);
                  }
                  closeModal();
                }}
                editingTransaction={editingTransaction}
                onClose={closeModal}
              />
            </div>
          </div>
        )}

        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
}
