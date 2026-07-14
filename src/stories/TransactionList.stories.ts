import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { TransactionList } from "@/app/components/TransactionList";

const meta = {
  title: "Componentes/TransactionList",
  component: TransactionList,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof TransactionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    transactions: [
      {
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
      {
        id: "2",
        accountId: "1",
        type: "Debit",
        to: "Lazer",
        value: 50,
        date: "2024-01-01",
        from: "",
        anexo: "",
        urlAnexo: ""
      },
      {
        id: "3",
        accountId: "1",
        type: "Debit",
        to: "Alimentação",
        value: 500,
        date: "2024-01-01",
        from: "",
        anexo: "",
        urlAnexo: ""
      },
    ],
  },
};
