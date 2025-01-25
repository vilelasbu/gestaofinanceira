import React from 'react';
import { Transaction } from '../types/finances';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionList({
  transactions,
  onDeleteTransaction,
}: TransactionListProps) {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold p-6 border-b border-white/10 text-white">
        Histórico de Transações
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/20">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="text-white">
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {transaction.type === 'entrada' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400 mr-2" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-400 mr-2" />
                    )}
                    {transaction.description}
                  </div>
                </td>
                <td className="px-6 py-4">{transaction.category}</td>
                <td
                  className={`px-6 py-4 ${
                    transaction.type === 'entrada'
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(transaction.amount)}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
