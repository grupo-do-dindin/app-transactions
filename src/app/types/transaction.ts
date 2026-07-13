export interface ITransaction {
  accountId: string;
  id: string;
  date: string;
  from: string;
  to: string;
  anexo: string;
  type: 'Credit' | 'Debit';
  urlAnexo: string;
  value: number;
}

export type CreateTransactionInput = Omit<ITransaction, 'id' | 'date'>
export type UpdateTransactionInput = Partial<CreateTransactionInput>
