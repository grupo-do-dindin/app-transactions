export interface ITransaction {
  id: number;
  description: string;
  type: 'income' | 'outcome';
  category: string;
  price: number;
  createdAt: string;
}

export type CreateTransactionInput = Omit<ITransaction, 'id' | 'createdAt'>
export type UpdateTransactionInput = Partial<CreateTransactionInput>
