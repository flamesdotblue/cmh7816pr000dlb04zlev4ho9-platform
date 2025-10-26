import { useEffect, useMemo, useState } from 'react';
import NavBar from './components/NavBar';
import HeroSpline from './components/HeroSpline';
import OrderPage from './components/OrderPage';
import AddMenuPage from './components/AddMenuPage';
import HistoryPage from './components/HistoryPage';

const STORAGE_KEYS = {
  menu: 'cafe_menu',
  orders: 'cafe_orders',
};

const defaultMenu = [
  { id: 'taro-milk-tea', name: 'Taro Milk Tea', price: 4.5 },
  { id: 'strawberry-boba', name: 'Strawberry Boba', price: 4.75 },
  { id: 'brown-sugar-latte', name: 'Brown Sugar Latte', price: 5.0 },
  { id: 'matcha-latte', name: 'Matcha Latte', price: 5.25 },
];

export default function App() {
  const [tab, setTab] = useState('order'); // 'order' | 'menu' | 'history'
  const [menu, setMenu] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.menu);
      return raw ? JSON.parse(raw) : defaultMenu;
    } catch {
      return defaultMenu;
    }
  });
  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.orders);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.menu, JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  }, [orders]);

  const addMenuItem = (item) => {
    setMenu((prev) => {
      const exists = prev.some((m) => m.name.toLowerCase() === item.name.toLowerCase());
      const newItem = exists ? { ...item, id: `${item.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}` } : item;
      return [...prev, exists ? newItem : item];
    });
  };

  const placeOrder = (order) => {
    // order: { id, customer, items, subtotal, tax, total, date }
    setOrders((prev) => [order, ...prev]);
  };

  const deleteOrder = (id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const menuSorted = useMemo(() => {
    return [...menu].sort((a, b) => a.name.localeCompare(b.name));
  }, [menu]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white text-slate-800">
      <header className="relative">
        <div className="h-[380px] w-full">
          <HeroSpline />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-white/0 to-white/80" />
        <div className="absolute inset-x-0 bottom-2 flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-rose-700 drop-shadow-sm">
            Bubble Bliss Cafe — Billing & POS
          </h1>
          <p className="mt-2 text-sm sm:text-base text-rose-900/80">
            Take orders, print receipts, manage menu, and view sales history.
          </p>
        </div>
      </header>

      <NavBar current={tab} onChange={setTab} />

      <main className="mx-auto max-w-6xl px-4 pb-16">
        {tab === 'order' && (
          <OrderPage
            menu={menuSorted}
            onPlaceOrder={placeOrder}
          />
        )}
        {tab === 'menu' && (
          <AddMenuPage onAddItem={addMenuItem} existing={menuSorted} />
        )}
        {tab === 'history' && (
          <HistoryPage orders={orders} onDelete={deleteOrder} />
        )}
      </main>

      <footer className="border-t border-rose-100 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/40">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Bubble Bliss Cafe. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
