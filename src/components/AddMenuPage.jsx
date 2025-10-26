import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

export default function AddMenuPage({ onAddItem, existing }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const p = parseFloat(price);
    if (!name.trim() || Number.isNaN(p) || p <= 0) {
      setMessage('Enter a valid name and price.');
      return;
    }
    const item = { id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`, name: name.trim(), price: parseFloat(p.toFixed(2)) };
    onAddItem(item);
    setName('');
    setPrice('');
    setMessage('Added to menu.');
    setTimeout(() => setMessage(''), 1500);
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <section className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-rose-700">Add Menu Item</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-rose-900/80">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mango Green Tea"
              className="w-full rounded-md border border-rose-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-rose-900/80">Price</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="4.50"
              className="w-full rounded-md border border-rose-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-700"
          >
            <PlusCircle className="h-4 w-4" />
            Add Item
          </button>
          {message && <div className="text-sm text-rose-700">{message}</div>}
        </form>
      </section>

      <section className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-rose-700">Current Menu</h2>
        <div className="max-h-80 overflow-auto">
          <ul className="divide-y divide-rose-100 text-sm">
            {existing.map((m) => (
              <li key={m.id} className="flex items-center justify-between px-2 py-2">
                <span>{m.name}</span>
                <span className="font-medium">${m.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
