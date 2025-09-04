import React, { useEffect, useState } from 'react';
import { useApi } from '../lib/api.js';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const fmt = n => `$${Number(n||0).toFixed(2)}`;

export default function InvestingSummary() {
  const api = useApi();
  const [total, setTotal] = useState(0);
  const [monthly, setMonthly] = useState([]);

  async function load() {
    const [{ data: t }, { data: m }] = await Promise.all([
      api.get('/investing/summary/total'),
      api.get('/investing/summary/monthly')
    ]);
    setTotal(t.total || 0);
    setMonthly(m.map(row => ({ month: row.month.slice(0,7), total: row.total })));
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-4 space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold">Investing progress</h3>
        <div className="text-sm text-wealth-slate">Total saved</div>
      </div>
      <div className="text-3xl font-semibold text-wealth-green">{fmt(total)}</div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthly}>
            <XAxis dataKey="month" />
            <YAxis tickFormatter={fmt} />
            <Tooltip formatter={(v)=>fmt(v)} />
            <Line type="monotone" dataKey="total" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
