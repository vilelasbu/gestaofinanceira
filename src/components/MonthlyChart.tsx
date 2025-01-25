import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Transaction } from '../types/finances';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyChartProps {
  transactions: Transaction[];
}

export function MonthlyChart({ transactions }: MonthlyChartProps) {
  // Return early if no transactions
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-8 text-white text-center">
        Nenhuma transação registrada ainda.
      </div>
    );
  }

  const monthlyData = transactions.reduce(
    (acc: Record<string, { income: number; expenses: number }>, transaction) => {
      if (!transaction.date) return acc; // Skip if no date

      const date = new Date(transaction.date);
      const monthYear = date.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
      });

      if (!acc[monthYear]) {
        acc[monthYear] = { income: 0, expenses: 0 };
      }

      if (transaction.type === 'entrada') {
        acc[monthYear].income += Number(transaction.amount) || 0;
      } else {
        acc[monthYear].expenses += Number(transaction.amount) || 0;
      }

      return acc;
    },
    {}
  );

  const months = Object.keys(monthlyData);
  const incomeData = months.map((month) => monthlyData[month].income);
  const expensesData = months.map((month) => monthlyData[month].expenses);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
        },
      },
      title: {
        display: true,
        text: 'Balanço Mensal',
        color: '#ffffff',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#ffffff',
          callback: (value: number) => {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(value);
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Entradas',
        data: incomeData,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Saídas',
        data: expensesData,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-8">
      <Bar options={options} data={data} />
    </div>
  );
}