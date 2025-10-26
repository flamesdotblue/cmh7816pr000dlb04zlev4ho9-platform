import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';

function currency(n) {
  return `$${n.toFixed(2)}`;
}

export default function HistoryPage({ orders, onDelete }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const fromTime = from ? new Date(from).getTime() : -Infinity;
    const toTime = to ? new Date(to).getTime() + 24 * 60 * 60 * 1000 - 1 : Infinity;
    return orders.filter((o) => {
      const t = new Date(o.date).getTime();
      const matchDate = t >= fromTime && t <= toTime;
      const matchQuery = q
        ? o.customer.name.toLowerCase().includes(q.toLowerCase()) ||
          o.items.some((i) => i.name.toLowerCase().includes(q.toLowerCase())) ||
          o.id.toLowerCase().includes(q.toLowerCase())
        : true;
      return matchDate && matchQuery;
    });
  }, [orders, from, to, q]);

  const totalRevenue = useMemo(() => filtered.reduce((s, o) => s + o.total, 0), [filtered]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-rose-700">Filters</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm text-rose-900/80">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-md border border-rose-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-rose-900/80">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-md border border-rose-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-rose-900/80">Search</label>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Customer, item, or order ID"
              className="w-full rounded-md border border-rose-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-semibold text-rose-700">Orders</h2>
          <div className="text-sm text-rose-900/80">Revenue: <span className="font-bold">{currency(totalRevenue)}</span></div>
        </div>
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-sm text-rose-900/70">No orders match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-rose-100 text-rose-700">
                  <th className="px-2 py-2">Date</th>
                  <th className="px-2 py-2">Order ID</th>
                  <th className="px-2 py-2">Customer</th>
                  <th className="px-2 py-2">Items</th>
                  <th className="px-2 py-2 text-right">Total</th>
                  <th className="px-2 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-b border-rose-50">
                    <td className="px-2 py-2 text-rose-900/80">{new Date(o.date).toLocaleString()}</td>
                    <td className="px-2 py-2 font-mono text-xs">{o.id}</td>
                    <td className="px-2 py-2">{o.customer.name}{o.customer.phone ? ` (${o.customer.phone})` : ''}</td>
                    <td className="px-2 py-2">
                      <ul className="list-inside list-disc text-rose-900/80">
                        {o.items.map((i) => (
                          <li key={i.id + o.id}>{i.name} × {i.qty}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-2 py-2 text-right font-semibold">{currency(o.total)}</td>
                    <td className="px-2 py-2 text-right">
                      <button
                        onClick={() => onDelete(o.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
