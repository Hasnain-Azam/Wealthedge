import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../lib/api.js';
import ExpensesTable from '../components/ExpensesTable.jsx';
import ExpenseForm from '../components/ExpenseForm.jsx';
import SummaryCards from '../components/SummaryCards.jsx';
import Charts from '../components/Charts.jsx';
import InvestingForm from '../components/InvestingForm.jsx';
import InvestingSummary from '../components/InvestingSummary.jsx';

export default function Dashboard() {
  const { token } = useAuth();
  const api = useApi();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);

  async function load() {
    const [{ data: ex }, { data: cats }] = await Promise.all([
      api.get('/expenses'),
      api.get('/expenses/categories'),
    ]);
    setExpenses(ex);
    setCategories(cats);
  }

  useEffect(() => { if (token) load(); }, [token]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <SummaryCards expenses={expenses} />

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <ExpenseForm categories={categories} onSaved={load} />
          </div>
          <div className="space-y-4">
            <ExpensesTable expenses={expenses} onChanged={load} />
          </div>
        </div>

        <Charts />

        <div className="grid md:grid-cols-2 gap-4">
          <InvestingForm onSaved={load} />
          <InvestingSummary />
        </div>
      </div>
    </div>
  );
}
