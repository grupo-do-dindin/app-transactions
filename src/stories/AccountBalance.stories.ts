import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { AccountBalance } from "@/app/components/AccountBalance";

const meta = {
  title: "Componentes/AccountBalance",
  component: AccountBalance,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof AccountBalance>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    transactions: [
      {
        id: 1,
        description: "Salário",
        type: "income",
        category: "Trabalho",
        price: 5000,
        createdAt: "2024-01-01",
      },
      {
        id: 2,
        description: "Aluguel",
        type: "outcome",
        category: "Casa",
        price: 1500,
        createdAt: "2024-01-02",
      },
      {
        id: 3,
        description: "Mercado",
        type: "outcome",
        category: "Alimentação",
        price: 600,
        createdAt: "2024-01-03",
      },
    ],
  },
};
