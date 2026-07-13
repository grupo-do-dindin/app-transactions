import { useCallback } from "react";
import { api } from "../lib/axios";
import { useTransactionsStore } from "../store/useTransactionsStore";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../types/transaction";

export function useTransactions() {
  const {
    transactions,
    isLoading,
    error,
    setTransactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
    setLoading,
    setError,
  } = useTransactionsStore();

  const fetchTransactions = useCallback(
    async (query?: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/transactions");
        const data = await response.json();
        setTransactions(data.result.transactions);
      } catch (err) {
        console.error("Erro ao buscar transações:", err);
        setError("Erro ao buscar transações.");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setTransactions],
  );

  const createTransaction = useCallback(
    async (input: CreateTransactionInput) => {
      setError(null);

      try {
        const response = await fetch("/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Erro ao criar transação");
        }

        addTransaction(data.result);

        return data;
      } catch (err) {
        console.error("Erro ao criar transação:", err);
        setError("Erro ao criar transação.");
      }
    },
    [addTransaction],
  );

  const editTransaction = useCallback(
    async (id: string, input: UpdateTransactionInput) => {
      setError(null);
      try {
        const response = await fetch(`/api/transactions/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Erro ao atualizar transação");
        }

        updateTransaction(id, data.result);

        return data;
      } catch (err) {
        console.error("Erro ao atualizar transação:", err);
        setError("Erro ao atualizar transação.");
      }
    },
    [setError, updateTransaction],
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      setError(null);
      try {
        const response = await fetch(`/api/transactions/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Erro ao deletar transação");
        }

        removeTransaction(id);
      } catch (err) {
        console.error("Erro ao deletar transação:", err);
        setError("Erro ao deletar transação.");
      }
    },
    [setError, removeTransaction],
  );

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    createTransaction,
    editTransaction,
    deleteTransaction,
  };
}
