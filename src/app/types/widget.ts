export type WidgetType =
  | "balance"
  | "add-transaction"
  | "transactions-list"
  | "savings-goal"
  | "spending-alert"
  | "income-outcome-chart"
  | "category-chart"
  | "savings-trend"
  | "financial-health"
  | "quick-stats";

export interface IWidgetSettings {
  savingsGoalTarget?: number;
  savingsGoalName?: string;
  spendingLimit?: number;
  [key: string]: any;
}

export interface IWidget {
  id: string;
  type: WidgetType;
  title: string;
  colSpan: 1 | 2 | 3;
  settings?: IWidgetSettings;
}

export interface IAvailableWidget {
  type: WidgetType;
  title: string;
  description: string;
  defaultColSpan: 1 | 2 | 3;
  icon: string;
}
