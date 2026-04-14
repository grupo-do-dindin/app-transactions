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
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 px-20 py-10 dark:bg-[#121214] bg-[#d1fae5]">
      <div className="bg-zinc-800 rounded-lg p-10 shadow-md flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">Entradas</p>
          <p className="text-xl font-semibold text-white">
            R$ {summary.credit.toFixed(2)}
          </p>
        </div>
        <div className="text-green-400">⬆</div>
      </div>

      <div className="bg-zinc-800 rounded-lg p-10 shadow-md flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">Saídas</p>
          <p className="text-xl font-semibold text-white">
            R$ {summary.debit.toFixed(2)}
          </p>
        </div>
        <div className="text-red-400">⬇</div>
      </div>

      <div className="bg-emerald-700 rounded-lg p-10 shadow-md flex justify-between items-center">
        <div>
          <p className="text-sm text-white/70">Total</p>
          <p className="text-xl font-semibold text-white">
            R$ {balance.toFixed(2)}
          </p>
        </div>
        <div className="text-white text-xl">$</div>
      </div>
    </div>
  );
};
