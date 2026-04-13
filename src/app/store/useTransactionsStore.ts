import { create } from "zustand";
import { ITransaction, UpdateTransactionInput } from "../types/transaction"

interface TransactionsState {
    transactions: ITransaction[]
    isLoading: boolean
    error: string | null
    setTransactions: (transactions: ITransaction[]) => void
    addTransaction: (transaction: ITransaction) => void
    updateTransaction: (id: number, updated: UpdateTransactionInput) => void
    removeTransaction: (id: number) => void
    setLoading: (value: boolean) => void
    setError: (message: string | null) => void
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
    transactions: [],
    isLoading: false,
    error: null,

    setTransactions: (transactions) => set({ transactions }),

    addTransaction: (transaction) =>
        set((state) => ({
            transactions: [transaction, ...state.transactions],
        })),

    updateTransaction: (id, updated) =>
        set((state) => ({
            transactions: state.transactions.map((t) =>
                t.id === id ? { ...t, ...updated } : t
            ),
        })),

    removeTransaction: (id) =>
        set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
        })),

    setLoading: (value) => set({ isLoading: value }),
    setError: (message) => set({ error: message }),
}))
