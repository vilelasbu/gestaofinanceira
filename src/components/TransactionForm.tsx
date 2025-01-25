import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Transaction } from '../types/finances';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'user_id'>) => void;
}

export function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'entrada' | 'saida'>('entrada');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAddTransaction({
      description,
      amount: Number(amount),
      type,
      category,
      date: new Date().toISOString(),
    });

    setDescription('');
    setAmount('');
    setCategory('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-8"
    >
      <h3 className="text-lg font-semibold mb-4 text-white">Nova Transação</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded-md bg-white/20 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="number"
          placeholder="Valor"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 rounded-md bg-white/20 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'entrada' | 'saida')}
          className="w-full p-2 rounded-md bg-white/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
        <input
          type="text"
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 rounded-md bg-white/20 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Adicionar Transação
      </button>
    </form>
  );
}