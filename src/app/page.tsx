"use client";

import { useTransactions } from "@/app/hooks/useTransactions";
import { useModalStore } from "@/app/store/useModalStore";
import { useEffect } from "react";

import { DashboardView } from "./components/Dashboard";

export default function Dashboard() {
  const {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    createTransaction,
    editTransaction,
  } = useTransactions();

  const { isOpen, editingTransaction, close } = useModalStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <DashboardView
      transactions={transactions}
      isLoading={isLoading}
      error={error}
      isModalOpen={isOpen}
      editingTransaction={editingTransaction}
      onAddTransaction={createTransaction}
      onEditTransaction={editTransaction}
      onCloseModal={close}
    />
  );
}
