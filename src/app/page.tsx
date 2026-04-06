"use client";


import styles from "./page.module.css";

import { AddTransactionForm } from "./components/AddTransactionForm";
import { TransactionList } from "./components/TransactionList";
import { AccountBalance } from "./components/AccountBalance";
import { ITransaction } from "./types/transaction";
import {useTransactions} from "@/app/hooks/useTransactions";
import {useEffect} from "react";

export default function Home() {
  const { transactions, isLoading, error, fetchTransactions, deleteTransaction, createTransaction } = useTransactions()
    console.log(transactions)


    useEffect(() => {
        fetchTransactions()
    }, [])

    if (isLoading) return <p>Carregando...</p>
    if (error) return <p>{error}</p>

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <AccountBalance transactions={transactions} />
        <AddTransactionForm addTransaction={createTransaction} />
        <TransactionList transactions={transactions} />
      </main>
    </div>
  );
}
