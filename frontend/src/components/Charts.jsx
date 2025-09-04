import React, { useEffect, useState } from 'react';
import { useApi } from '../lib/api.js';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Charts() {
  const api = useApi();
  const [monthly, setMonthly] = useState([]);
  const [byCat, setByCat] = useState([]);

  useEffect(() => {
    (async () => {
      const [m, c] = await Promise.all([
        api.get('/expenses/summary/monthly'),
        api.get('/expenses/summary/by-category')
      ]);
      setMonthly(m.data.map(row => ({ month: row.month.slice(0,10), total: row.total })));
      setByCat(c.data);
    })();
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="font-semibold mb-2">Monthly spend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthly}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="font-semibold mb-2">By category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={byCat} dataKey="total" nameKey="category" outerRadius={100} label>
                {byCat.map((entry, index) => <Cell key={`cell-${index}`} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
