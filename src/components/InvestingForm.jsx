import React, { useState } from 'react';
import { useApi } from '../lib/api.js';

export default function InvestingForm({ onSaved }) {
  const api = useApi();
  const [form, setForm] = useState({
    amount: '',
    occurred_on: new Date().toISOString().slice(0,10),
    note: ''
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function setField(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      await api.post('/investing', form);
      setForm(prev => ({ ...prev, amount: '', note: '' }));
      onSaved?.();
    } catch (e) {
      setError(e.response?.data?.message || 'Error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-4 space-y-3">
      <h3 className="font-semibold">Add investing contribution</h3>
      <label className="block">
        <span className="text-xs text-wealth-slate">Amount</span>
        <input type="number" min="0" step="0.01" value={form.amount}
               onChange={e=>setField('amount', e.target.value)}
               className="mt-1 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-wealth-gold"/>
      </label>
      <label className="block">
        <span className="text-xs text-wealth-slate">Date</span>
        <input type="date" value={form.occurred_on}
               onChange={e=>setField('occurred_on', e.target.value)}
               className="mt-1 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-wealth-gold"/>
      </label>
      <label className="block">
        <span className="text-xs text-wealth-slate">Note</span>
        <input value={form.note} onChange={e=>setField('note', e.target.value)}
               className="mt-1 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-wealth-gold"/>
      </label>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button disabled={busy}
              className="w-full py-2 rounded-lg bg-wealth-gold text-wealth-ink font-medium hover:opacity-90 disabled:opacity-60">
        {busy ? 'Saving…' : 'Save contribution'}
      </button>
    </form>
  );
}
