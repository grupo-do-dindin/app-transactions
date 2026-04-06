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
            console.log('Dados recebidos do servidor:', data)
            setTransactions(data)
        } catch (err) {
            console.error('Erro ao buscar transações:', err)
            setError('Erro ao buscar transações.')
        } finally {
            setLoading(false)
        }
    }, [setLoading, setError, setTransactions])

    // ─── CREATE ──────────────────────────────────────────────
    const createTransaction = useCallback(async (input: CreateTransactionInput) => {
        setError(null)
        try {
            const { data } = await api.post('/transactions', {
                ...input,
                createdAt: new Date().toISOString(),
            })
            console.log('Transação criada:', data)
            addTransaction(data)
            return data
        } catch (err) {
            console.error('Erro ao criar transação:', err)
            setError('Erro ao criar transação.')
        }
    }, [setError, addTransaction])

    // ─── UPDATE ──────────────────────────────────────────────
    const editTransaction = useCallback(
        async (id: number, input: UpdateTransactionInput) => {
            setError(null)
            try {
                const { data } = await api.patch(`/transactions/${id}`, input)
                console.log('Transação atualizada:', data)
                updateTransaction(id, data)
                return data
            } catch (err) {
                console.error('Erro ao atualizar transação:', err)
                setError('Erro ao atualizar transação.')
            }
        },
        [setError, updateTransaction]
    )

    // ─── DELETE ──────────────────────────────────────────────
    const deleteTransaction = useCallback(async (id: number) => {
        setError(null)
        try {
            await api.delete(`/transactions/${id}`)
            console.log('Transação deletada:', id)
            removeTransaction(id)
        } catch (err) {
            console.error('Erro ao deletar transação:', err)
            setError('Erro ao deletar transação.')
        }
    }, [setError, removeTransaction])

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
