import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { AddTransactionForm } from "@/app/components/AddTransactionForm";

const meta = {
  title: "Componentes/AddTransactionForm",
  component: AddTransactionForm,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof AddTransactionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    addTransaction: () => {},
    editingTransaction: {
        id: "1",
        accountId: "1",
        type: "Credit",
        to: "Trabalho",
        value: 5000,
        date: "2024-01-01",
        from: "",
        anexo: "",
        urlAnexo: ""
    },
    onClose: () => {},
  },
};
