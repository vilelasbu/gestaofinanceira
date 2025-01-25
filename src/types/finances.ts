export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'entrada' | 'saida';
  date: string;
  category: string;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
}

export interface MonthlyBalance {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}