import React, { useState, useEffect } from 'react';
import { Transaction, User } from './types/finances';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { MonthlyChart } from './components/MonthlyChart';
import { MonthSummary } from './components/MonthSummary';
import { Auth } from './components/Auth';
import { supabase } from './lib/supabase';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadTransactions();
    } else {
      setTransactions([]);
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    }
  };

  const handleAddTransaction = async (newTransaction: Omit<Transaction, 'id' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...newTransaction, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTransactions([data, ...transactions]);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center p-4">
        <div className="bg-white/20 backdrop-blur-sm p-8 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-center mb-8">
            <img src="/V.png" alt="Logo" className="h-16 w-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-center">Sistema de Gestão Financeira</h1>
          <Auth />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 bg-fixed">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
        style={{ backgroundImage: 'url(/ddd.png)' }}
      />
      <header className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-sm text-white z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/V.png" alt="Logo" className="h-12 w-auto" />
              <h1 className="text-2xl font-bold">Sistema de Gestão Financeira</h1>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-white/80 hover:text-white transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main
        className="container mx-auto px-4 py-8 relative"
        style={{ paddingTop: '120px' }}
      >
        <TransactionForm onAddTransaction={handleAddTransaction} />
        <Dashboard transactions={transactions} />
        <MonthSummary transactions={transactions} />
        <MonthlyChart transactions={transactions} />
        <TransactionList
          transactions={transactions}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </main>
    </div>
  );
}

export default App;