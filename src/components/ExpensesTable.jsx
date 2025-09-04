import React from 'react';
import { useApi } from '../lib/api.js';

export default function ExpensesTable({ expenses, onChanged }) {
  const api = useApi();

  async function del(id) {
    await api.delete(`/expenses/${id}`);
    onChanged?.();
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="font-semibold mb-2">Recent expenses</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Date</th>
              <th className="p-2">Category</th>
              <th className="p-2">Merchant</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Note</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id} className="border-t">
                <td className="p-2">{new Date(e.incurred_on).toLocaleDateString()}</td>
                <td className="p-2">{e.category || '—'}</td>
                <td className="p-2">{e.merchant || '—'}</td>
                <td className="p-2">${Number(e.amount).toFixed(2)} {e.currency}</td>
                <td className="p-2">{e.note || ''}</td>
                <td className="p-2 text-right">
                  <button onClick={()=>del(e.id)} className="px-2 py-1 rounded-lg border">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
