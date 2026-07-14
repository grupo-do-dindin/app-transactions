"use client";

import { AddTransactionForm } from "../components/AddTransactionForm";
import { TransactionList } from "../components/TransactionList";
import { AccountBalance } from "../components/AccountBalance";
import { DailyFlowChart } from "../components/DailyFlowChart";

import { ITransaction } from "../types/transaction";

interface DashboardViewProps {
  transactions: ITransaction[];
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
  editingTransaction: ITransaction | null;
  onAddTransaction: (data: any) => void;
  onEditTransaction: (id: string, data: any) => void;
  onCloseModal: () => void;
}

export const DashboardView = ({
  transactions,
  isLoading,
  error,
  isModalOpen,
  editingTransaction,
  onAddTransaction,
  onEditTransaction,
  onCloseModal,
}: DashboardViewProps) => {
  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen w-full flex flex-col">
      <AccountBalance transactions={transactions} />

      <div className="w-full max-w-4xl mx-auto mt-6 px-4">
        <DailyFlowChart transactions={transactions} />
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={onCloseModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AddTransactionForm
              addTransaction={(transaction) => {
                if (editingTransaction) {
                  onEditTransaction(editingTransaction.id, transaction);
                } else {
                  onAddTransaction(transaction);
                }
                onCloseModal();
              }}
              editingTransaction={editingTransaction}
              onClose={onCloseModal}
            />
          </div>
        </div>
      )}

      <TransactionList transactions={transactions} />
    </div>
  );
};
