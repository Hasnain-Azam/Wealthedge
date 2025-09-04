import React, { useState } from 'react';
import { useApi } from '../lib/api.js';

export default function ExpenseForm({ categories, onSaved }) {
  const api = useApi();
  const [form, setForm] = useState({
    amount: '',
    incurred_on: new Date().toISOString().slice(0,10),
    category: '',
    merchant: '',
    note: '',
    currency: 'CAD'
  });
  const [error, setError] = useState('');

  function setField(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/expenses', form);
      setForm(prev => ({ ...prev, amount: '', merchant: '', note: '' }));
      onSaved?.();
    } catch (e) {
      setError(e.response?.data?.message || 'Error');
    }
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded-2xl shadow space-y-3">
      <h2 className="font-semibold">Add expense</h2>
      <input className="w-full border rounded-lg p-2" placeholder="Amount" value={form.amount} onChange={e=>setField('amount', e.target.value)} />
      <input className="w-full border rounded-lg p-2" type="date" value={form.incurred_on} onChange={e=>setField('incurred_on', e.target.value)} />
      <input className="w-full border rounded-lg p-2" placeholder="Category (e.g., Food)" value={form.category} onChange={e=>setField('category', e.target.value)} list="catlist" />
      <datalist id="catlist">
        {categories.map(c => <option key={c.id} value={c.name} />)}
      </datalist>
      <input className="w-full border rounded-lg p-2" placeholder="Merchant" value={form.merchant} onChange={e=>setField('merchant', e.target.value)} />
      <textarea className="w-full border rounded-lg p-2" placeholder="Note" value={form.note} onChange={e=>setField('note', e.target.value)} />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button className="w-full bg-black text-white py-2 rounded-lg">Save</button>
    </form>
  );
}
