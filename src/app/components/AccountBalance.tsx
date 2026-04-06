import { ITransaction } from "../types/transaction";

interface AccountBalanceProps {
  transactions: ITransaction[];
}

export const AccountBalance = ({ transactions }: AccountBalanceProps) => {
  const summary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "income") {
        acc.credit += transaction.price;
      } else {
        acc.debit += transaction.price;
      }
      return acc;
    },
    { credit: 0, debit: 0 },
  );

  const balance = summary.credit - summary.debit;

  return (
    <div className="bg-white shadow-md rounded-2xl p-10 w-full max-w-md mx-auto mt-4 flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-gray-800">Resumo financeiro</h2>

      <div className="flex justify-between text-green-600">
        <span>Crédito</span>
        <span>R$ {summary.credit.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-red-500">
        <span>Débito</span>
        <span>R$ {summary.debit.toFixed(2)}</span>
      </div>

      <div className="border-t pt-2 flex justify-between font-semibold text-gray-800">
        <span>Saldo</span>
        <span>R$ {balance.toFixed(2)}</span>
      </div>
    </div>
  );
};
