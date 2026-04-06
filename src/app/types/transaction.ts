export interface ITransaction {
  id: number;
  description: string;
  type: 'income' | 'outcome';
  category: string;
  price: number;
  createAt: string;
}

export type CreateTransactionInput = Omit<ITransaction, 'id' | 'createdAt'>
export type UpdateTransactionInput = Partial<CreateTransactionInput>
