"use client";

import { AddTransactionForm } from "./components/AddTransactionForm";
import { TransactionList } from "./components/TransactionList";
import { AccountBalance } from "./components/AccountBalance";
import { useTransactions } from "@/app/hooks/useTransactions";
import { useEffect } from "react";

export default function Home() {
  const {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    createTransaction,
  } = useTransactions();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="w-full">
        <AccountBalance transactions={transactions} />
        <AddTransactionForm addTransaction={createTransaction} />
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
}
