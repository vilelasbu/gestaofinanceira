import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Transaction } from '../types/finances';

interface DashboardProps {
  transactions: Transaction[];
}

export function Dashboard({ transactions }: DashboardProps) {
  const totalIncome = transactions
    .filter((t) => t.type === 'entrada')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'saida')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Entradas</p>
            <h3 className="text-2xl font-bold text-green-400">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(totalIncome)}
            </h3>
          </div>
          <TrendingUp className="w-8 h-8 text-green-400" />
        </div>
      </div>

      <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Saídas</p>
            <h3 className="text-2xl font-bold text-red-400">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(totalExpenses)}
            </h3>
          </div>
          <TrendingDown className="w-8 h-8 text-red-400" />
        </div>
      </div>

      <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Saldo Total</p>
            <h3
              className={`text-2xl font-bold ${
                balance >= 0 ? 'text-blue-400' : 'text-red-400'
              }`}
            >
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(balance)}
            </h3>
          </div>
          <DollarSign className="w-8 h-8 text-blue-400" />
        </div>
      </div>
    </div>
  );
}
