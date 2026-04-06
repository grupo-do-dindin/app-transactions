import { useCallback } from 'react'
import { api } from '../lib/axios'
import { useTransactionsStore } from '../store/useTransactionsStore'
import { CreateTransactionInput, UpdateTransactionInput } from '../types/transaction'

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
    } = useTransactionsStore()

    // ─── READ ────────────────────────────────────────────────
    const fetchTransactions = useCallback(async (query?: string) => {
        setLoading(true)
        setError(null)
        try {
            const { data } = await api.get('/transactions', {
                params: {
                    _sort: 'createdAt',
                    _order: 'desc',
                    ...(query && { q: query }), // busca por texto (json-server suporta ?q=)
                },
            })
            setTransactions(data)
        } catch (err) {
            setError('Erro ao buscar transações.')
        } finally {
            setLoading(false)
        }
    }, [])

    // ─── CREATE ──────────────────────────────────────────────
    const createTransaction = useCallback(async (input: CreateTransactionInput) => {
        setError(null)
        try {
            const { data } = await api.post('/transactions', {
                ...input,
                createdAt: new Date().toISOString(),
            })
            addTransaction(data)
            return data
        } catch (err) {
            setError('Erro ao criar transação.')
        }
    }, [])

    // ─── UPDATE ──────────────────────────────────────────────
    const editTransaction = useCallback(
        async (id: number, input: UpdateTransactionInput) => {
            setError(null)
            try {
                const { data } = await api.patch(`/transactions/${id}`, input)
                updateTransaction(id, data)
                return data
            } catch (err) {
                setError('Erro ao atualizar transação.')
            }
        },
        []
    )

    // ─── DELETE ──────────────────────────────────────────────
    const deleteTransaction = useCallback(async (id: number) => {
        setError(null)
        try {
            await api.delete(`/transactions/${id}`)
            removeTransaction(id)
        } catch (err) {
            setError('Erro ao deletar transação.')
        }
    }, [])

    return {
        transactions,
        isLoading,
        error,
        fetchTransactions,
        createTransaction,
        editTransaction,
        deleteTransaction,
    }
}
