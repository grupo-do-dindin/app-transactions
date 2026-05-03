import { DashboardView } from "@/app/components/Dashboard";

export default {
  title: "Páginas/Dashboard",
  component: DashboardView,
};

export const Default = {
  args: {
    transactions: [
      {
        id: 1,
        description: "Salário",
        type: "income",
        category: "Trabalho",
        price: 5000,
        createdAt: "",
      },
      {
        id: 2,
        description: "Aluguel",
        type: "outcome",
        category: "Casa",
        price: 1500,
        createdAt: "",
      },
    ],
    isLoading: false,
    error: null,
    isModalOpen: false,
    editingTransaction: null,
    onAddTransaction: () => {},
    onEditTransaction: () => {},
    onCloseModal: () => {},
  },
};
