import { create } from "zustand";
import { ITransaction } from "../types/transaction";

interface ModalState {
  isOpen: boolean;
  editingTransaction: ITransaction | null;
  open: () => void;
  openEdit: (transaction: ITransaction) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  editingTransaction: null,
  open: () => set({ isOpen: true, editingTransaction: null }),
  openEdit: (transaction) => set({ isOpen: true, editingTransaction: transaction }),
  close: () => set({ isOpen: false, editingTransaction: null }),
}));
