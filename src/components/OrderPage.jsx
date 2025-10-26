import { useMemo, useRef, useState } from 'react';
import { Plus, Minus, Printer, Trash2 } from 'lucide-react';

function currency(n) {
  return `$${n.toFixed(2)}`;
}

export default function OrderPage({ menu, onPlaceOrder }) {
  const [cart, setCart] = useState({}); // id -> { id, name, price, qty }
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const receiptRef = useRef(null);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev[item.id] || { ...item, qty: 0 };
      return { ...prev, [item.id]: { ...existing, qty: existing.qty + 1 } };
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      const nextQty = existing.qty - 1;
      const copy = { ...prev };
      if (nextQty <= 0) delete copy[id];
      else copy[id] = { ...existing, qty: nextQty };
      return copy;
    });
  };

  const clearCart = () => setCart({});

  const items = useMemo(() => Object.values(cart), [cart]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const taxRate = 0.08;
  const tax = useMemo(() => subtotal * taxRate, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const canPlaceOrder = items.length > 0 && customer.name.trim().length > 0;

  const handlePlaceOrder = () => {
    if (!canPlaceOrder) return;
    const order = {
      id: `ORD-${Date.now()}`,
      customer: { ...customer },
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      date: new Date().toISOString(),
    };
    onPlaceOrder(order);
    printReceipt(order);
    setCustomer({ name: '', phone: '' });
    clearCart();
  };

  const printReceipt = (order) => {
    const w = window.open('', 'PRINT', 'height=650,width=400');
    if (!w) return;
    const date = new Date(order.date);
    const html = `
      <html>
        <head>
          <title>Receipt ${order.id}</title>
          <style>
            body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding: 16px; }
            h1 { font-size: 18px; margin: 0 0 8px; }
            .muted { color: #6b7280; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { padding: 6px 0; text-align: left; font-size: 13px; }
            tfoot td { border-top: 1px dashed #e5e7eb; padding-top: 8px; }
          </style>
        </head>
        <body>
          <h1>Bubble Bliss Cafe</h1>
          <div class="muted">${date.toLocaleString()}</div>
          <div class="muted">Order: ${order.id}</div>
          <div class="muted">Customer: ${order.customer.name}${order.customer.phone ? ` — ${order.customer.phone}` : ''}</div>
          <table>
            <thead>
              <tr><th>Item</th><th>Qty</th><th style="text-align:right">Amount</th></tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (i) => `<tr><td>${i.name}</td><td>${i.qty}</td><td style="text-align:right">$${(i.price * i.qty).toFixed(2)}</td></tr>`
                )
                .join('')}
            </tbody>
            <tfoot>
              <tr><td>Subtotal</td><td></td><td style="text-align:right">$${order.subtotal.toFixed(2)}</td></tr>
              <tr><td>Tax</td><td></td><td style="text-align:right">$${order.tax.toFixed(2)}</td></tr>
              <tr><td><strong>Total</strong></td><td></td><td style="text-align:right"><strong>$${order.total.toFixed(2)}</strong></td></tr>
            </tfoot>
          </table>
          <p class="muted" style="margin-top:16px;">Thank you! Have a sweet day ♡</p>
          <script>window.onload = function() { window.print(); setTimeout(() => window.close(), 300); };</script>
        </body>
      </html>
    `;
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <section className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-rose-700">Menu</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {menu.map((m) => (
            <button
              key={m.id}
              onClick={() => addToCart(m)}
              className="flex items-center justify-between rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-left hover:bg-rose-100"
            >
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-rose-800/80">{currency(m.price)}</div>
              </div>
              <Plus className="h-4 w-4 text-rose-700" />
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-rose-700">Cart & Customer</h2>

        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            type="text"
            value={customer.name}
            onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
            placeholder="Customer name"
            className="w-full rounded-md border border-rose-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
          />
          <input
            type="tel"
            value={customer.phone}
            onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
            placeholder="Phone (optional)"
            className="w-full rounded-md border border-rose-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
          />
        </div>

        <div className="max-h-64 overflow-auto rounded-lg border border-rose-100">
          {items.length === 0 ? (
            <div className="p-6 text-center text-sm text-rose-900/70">No items in cart. Tap menu items to add.</div>
          ) : (
            <ul className="divide-y divide-rose-100">
              {items.map((i) => (
                <li key={i.id} className="flex items-center justify-between px-3 py-2">
                  <div>
                    <div className="text-sm font-medium">{i.name}</div>
                    <div className="text-xs text-rose-900/70">{currency(i.price)} each</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(i.id)}
                      className="rounded-md border border-rose-200 p-1 hover:bg-rose-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
                    <button
                      onClick={() => addToCart(i)}
                      className="rounded-md border border-rose-200 p-1 hover:bg-rose-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <div className="w-20 text-right text-sm font-medium">{currency(i.price * i.qty)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="text-rose-900/80">Subtotal</div>
          <div className="text-right font-medium">{currency(subtotal)}</div>
          <div className="text-rose-900/80">Tax (8%)</div>
          <div className="text-right font-medium">{currency(tax)}</div>
          <div className="col-span-2 mt-1 flex items-center justify-between border-t border-rose-100 pt-2 text-base">
            <div className="font-semibold text-rose-700">Total</div>
            <div className="font-extrabold">{currency(total)}</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={handlePlaceOrder}
            disabled={!canPlaceOrder}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow ${
              canPlaceOrder
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'cursor-not-allowed bg-rose-200 text-white'
            }`}
          >
            <Printer className="h-4 w-4" />
            Place Order & Print
          </button>
          <button
            onClick={clearCart}
            disabled={items.length === 0}
            className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium ${
              items.length === 0
                ? 'cursor-not-allowed border-rose-100 text-rose-300'
                : 'border-rose-200 text-rose-700 hover:bg-rose-50'
            }`}
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>
        </div>
        <div ref={receiptRef} className="hidden" />
      </section>
    </div>
  );
}
