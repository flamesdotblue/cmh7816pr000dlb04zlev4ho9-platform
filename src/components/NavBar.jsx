import { Home, ShoppingCart, PlusCircle, History } from 'lucide-react';

const tabs = [
  { id: 'order', label: 'Order', icon: ShoppingCart },
  { id: 'menu', label: 'Add Menu', icon: PlusCircle },
  { id: 'history', label: 'Order History', icon: History },
];

export default function NavBar({ current, onChange }) {
  return (
    <nav className="sticky top-0 z-10 border-b border-rose-100 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/40">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-2 py-2 sm:px-4">
        <div className="flex items-center gap-2 rounded-md px-3 py-2 text-rose-700">
          <Home className="h-5 w-5" />
          <span className="hidden text-sm font-semibold sm:inline">Cafe POS</span>
        </div>
        <div className="ml-auto flex w-full max-w-xl items-center justify-end gap-1 sm:gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`$
                {current === id
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-white text-rose-700 hover:bg-rose-50'
              } inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
