import React from 'react';
import { Transaction } from '../types/finances';

interface MonthSummaryProps {
  transactions: Transaction[];
}

export function MonthSummary({ transactions }: MonthSummaryProps) {
  // Agrupa transações por mês
  const monthlyData = transactions.reduce((acc: Record<string, {
    income: number;
    expenses: number;
    balance: number;
  }>, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });

    if (!acc[monthYear]) {
      acc[monthYear] = { income: 0, expenses: 0, balance: 0 };
    }

    if (transaction.type === 'entrada') {
      acc[monthYear].income += transaction.amount;
    } else {
      acc[monthYear].expenses += transaction.amount;
    }
    
    acc[monthYear].balance = acc[monthYear].income - acc[monthYear].expenses;
    
    return acc;
  }, {});

  // Calcula o total acumulado
  let runningTotal = 0;

  return (
    <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-8">
      <h3 className="text-lg font-semibold mb-4 text-white">Resumo Mensal</h3>
      <div className="space-y-4">
        {Object.entries(monthlyData).map(([month, data]) => {
          runningTotal += data.balance;
          return (
            <div key={month} className="border-b border-white/10 pb-4">
              <h4 className="text-white font-medium mb-2">{month}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-white/60 text-sm">Entradas</p>
                  <p className="text-green-400 font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(data.income)}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Saídas</p>
                  <p className="text-red-400 font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(data.expenses)}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Saldo do Mês</p>
                  <p className={`font-medium ${data.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(data.balance)}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Saldo Acumulado</p>
                  <p className={`font-medium ${runningTotal >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(runningTotal)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}