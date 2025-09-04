import React, { useMemo } from 'react';

export default function SummaryCards({ expenses }) {
  const { total, avg } = useMemo(() => {
    if (!expenses.length) return { total: 0, avg: 0 };
    const sum = expenses.reduce((s, e) => s + Number(e.amount), 0);
    return { total: sum, avg: sum / expenses.length };
  }, [expenses]);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="text-gray-500 text-sm">Total spent</div>
        <div className="text-2xl font-semibold">${total.toFixed(2)}</div>
      </div>
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="text-gray-500 text-sm">Avg / expense</div>
        <div className="text-2xl font-semibold">${avg.toFixed(2)}</div>
      </div>
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="text-gray-500 text-sm">Entries</div>
        <div className="text-2xl font-semibold">{expenses.length}</div>
      </div>
    </div>
  );
}
