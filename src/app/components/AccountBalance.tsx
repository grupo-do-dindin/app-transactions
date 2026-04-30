import { ITransaction } from "../types/transaction";
import styles from "./AccountBalance.module.css";

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
    <div className={styles.container}>
      {/* Entradas */}
      <div className={`${styles.card} ${styles.credit}`}>
        <div className={styles["card-header"]}>
          <span className={styles["card-label"]}>Entradas</span>
          <div className={styles["card-icon"]}>↑</div>
        </div>
        <span className={styles["card-value"]}>R$ {summary.credit.toFixed(2)}</span>
      </div>

      {/* Saídas */}
      <div className={`${styles.card} ${styles.debit}`}>
        <div className={styles["card-header"]}>
          <span className={styles["card-label"]}>Saídas</span>
          <div className={styles["card-icon"]}>↓</div>
        </div>
        <span className={styles["card-value"]}>R$ {summary.debit.toFixed(2)}</span>
      </div>

      {/* Total */}
      <div className={`${styles.card} ${styles.balance}`}>
        <div className={styles["card-header"]}>
          <span className={styles["card-label"]}>Total</span>
          <div className={styles["card-icon"]}>$</div>
        </div>
        <span className={styles["card-value"]}>R$ {balance.toFixed(2)}</span>
      </div>
    </div>
  );
};
