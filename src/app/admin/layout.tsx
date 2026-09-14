'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, ShoppingBag, Package, BarChart2,
  Users, Settings, Tag, LogOut, Menu
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Inventory', href: '/admin/inventory', icon: Package },
  { label: 'Promotions', href: '/admin/promotions', icon: Tag },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  // Always allow the login page through without any check
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;
    const ok = sessionStorage.getItem('admin_auth') === 'true';
    if (!ok) {
      router.replace('/admin/login');
    } else {
      setAuthed(true);
    }
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (!authed) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleSignOut = () => {
    sessionStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-brand-charcoal flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-brand-charcoal border-r border-brand-mid/30 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-brand-mid/30">
          <p className="font-serif text-lg font-bold text-brand-gold">LILLYUM</p>
          <p className="text-brand-muted text-xs">Admin Panel</p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === href
                  ? 'bg-brand-gold/10 text-brand-gold'
                  : 'text-brand-muted hover:text-brand-light hover:bg-brand-dark'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-mid/30">
          <div className="mb-3">
            <p className="text-brand-white text-sm font-medium">Lillyum Admin</p>
            <p className="text-brand-muted text-xs">Owner</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-brand-muted text-sm hover:text-red-400 transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-brand-charcoal border-b border-brand-mid/30 flex items-center px-4 gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 text-brand-muted hover:text-brand-gold"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-brand-white font-semibold text-sm capitalize">
            {NAV_ITEMS.find((n) => n.href === pathname)?.label ?? 'Admin'}
          </h1>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

