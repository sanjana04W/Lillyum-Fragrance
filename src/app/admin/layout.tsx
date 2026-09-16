'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Star,
  SlidersHorizontal,
  Layers,
  Tag,
  BarChart2,
  History,
  Users,
  MessageSquare,
  Settings,
  ShieldCheck,
  Shield,
  ExternalLink,
  Bell,
  LogOut,
  Menu,
  ChevronDown,
  Check,
  TrendingUp,
  UserCheck,
  CheckCheck,
  X,
} from 'lucide-react';
import { getAllOrders, getLocalOrders } from '@/services/firestoreService';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export type AdminRole = 'Owner' | 'Staff';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Order Management', href: '/admin/orders', icon: ShoppingBag, badgeKey: 'orders' },
  { label: 'Product Catalog', href: '/admin/products', icon: Package },
  { label: 'Featured Products', href: '/admin/featured', icon: Star },
  { label: 'Master Data', href: '/admin/master-data', icon: SlidersHorizontal },
  { label: 'Stock & Inventory', href: '/admin/inventory', icon: Layers },
  { label: 'Promotions & Offers', href: '/admin/promotions', icon: Tag },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: History },
  { label: 'User Management', href: '/admin/users', icon: Users },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'System Settings', href: '/admin/settings', icon: Settings },
];

export interface AdminNotificationItem {
  id: string;
  orderId?: string;
  title: string;
  time: string;
  customerName: string;
  details: string;
  createdAt: string;
}

const NOTIFICATIONS_STORAGE_KEY = 'lillyum_admin_notifications';

const INITIAL_NOTIFICATIONS: AdminNotificationItem[] = [
  {
    id: 'notif-4699',
    orderId: 'MIKI-2026-4699',
    title: 'New Order: MIKI-2026-4699',
    time: '15 Sept, 12:58',
    customerName: 'H.M. Wenuri Sanjana Herath',
    details: 'Rs. 3,800 • 1 item(s) • Colombo',
    createdAt: '2026-09-15T12:58:00Z',
  },
  {
    id: 'notif-7052',
    orderId: 'MIKI-2026-7052',
    title: 'New Order: MIKI-2026-7052',
    time: '15 Sept, 12:56',
    customerName: 'H.M. Wenuri Sanjana Herath',
    details: 'Rs. 3,450 • 1 item(s) • Colombo',
    createdAt: '2026-09-15T12:56:00Z',
  },
  {
    id: 'notif-1441',
    orderId: 'MIKI-2026-1441',
    title: 'New Order: MIKI-2026-1441',
    time: '15 Sept, 12:52',
    customerName: 'H.M. Wenuri Sanjana Herath',
    details: 'Rs. 4,100 • 1 item(s) • Colombo',
    createdAt: '2026-09-15T12:52:00Z',
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  // Role Switcher state
  const [currentRole, setCurrentRole] = useState<AdminRole>('Owner');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Notifications state & dropdown
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Stats for top bar & sidebar badges — initialized instantly from cache
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(() => {
    const orders = getLocalOrders();
    return orders.filter((o) => o.status === 'Pending').length || 1;
  });
  const [liveRevenue, setLiveRevenue] = useState<number>(() => {
    const orders = getLocalOrders();
    const rev = orders.filter((o) => o.status === 'Completed').reduce((sum, o) => sum + o.total, 0);
    return rev > 0 ? rev : 16550;
  });

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

  // Load saved role from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem('lillyum_admin_role') as AdminRole;
    if (savedRole === 'Owner' || savedRole === 'Staff') {
      setCurrentRole(savedRole);
    }

    const handleStorage = () => {
      const updated = localStorage.getItem('lillyum_admin_role') as AdminRole;
      if (updated === 'Owner' || updated === 'Staff') {
        setCurrentRole(updated);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('lillyum_role_change', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('lillyum_role_change', handleStorage);
    };
  }, []);

  // Fetch real-time stats for revenue and pending order badge
  useEffect(() => {
    if (!authed || isLoginPage) return;
    getAllOrders()
      .then((orders) => {
        const pending = orders.filter((o) => o.status === 'Pending').length;
        if (pending > 0) setPendingOrdersCount(pending);

        const rev = orders
          .filter((o) => o.status === 'Completed')
          .reduce((sum, o) => sum + o.total, 0);
        if (rev > 0) setLiveRevenue(rev);
      })
      .catch(() => {});
  }, [authed, isLoginPage]);

  // Load saved notifications from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored !== null) {
        setNotifications(JSON.parse(stored));
      } else {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
        setNotifications(INITIAL_NOTIFICATIONS);
      }
    } catch {
      setNotifications(INITIAL_NOTIFICATIONS);
    }
  }, []);

  // Click outside listener for role dropdown & notification popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dismiss / Mark individual notification as read (removes from list)
  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      try {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    setNotifications([]);
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify([]));
    } catch {}
    toast.success('All notifications marked as read', { icon: '✓' });
  };

  // Click a notification: marks it read, closes dropdown, navigates to orders
  const handleNotificationClick = (n: AdminNotificationItem) => {
    handleDismissNotification(n.id);
    setNotificationsOpen(false);
    router.push('/admin/orders');
  };

  const STAFF_ALLOWED_PATHS = ['/admin', '/admin/orders', '/admin/inventory', '/admin/messages'];

  const handleRoleChange = (role: AdminRole) => {
    setCurrentRole(role);
    localStorage.setItem('lillyum_admin_role', role);
    window.dispatchEvent(new Event('lillyum_role_change'));
    setRoleDropdownOpen(false);
    toast.success(`Active role set to: ${role === 'Owner' ? 'Owner / Super Admin' : 'Staff Operator'}`);
    if (role === 'Staff') {
      const isAllowed = STAFF_ALLOWED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
      if (!isAllowed) {
        toast('Redirected: Staff can only access Dashboard, Orders, Inventory, and Messages', { icon: '🔒' });
        router.push('/admin');
      }
    }
  };

  const visibleNavItems = currentRole === 'Staff'
    ? NAV_ITEMS.filter((item) => STAFF_ALLOWED_PATHS.includes(item.href))
    : NAV_ITEMS;

  const handleSignOut = () => {
    sessionStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  if (isLoginPage) return <>{children}</>;

  if (!authed) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand-charcoal/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation Bar (Themed in Brand Gold #B8892A) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#B8892A] border-r border-[#9E731E] flex flex-col transition-transform duration-300 shadow-xl lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/15 flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white/20 border border-white/30 shrink-0 shadow-xs">
            <Image src="/logo.jpg" alt="Lillyum" fill className="object-cover" />
          </div>
          <div>
            <p className="font-serif text-base font-bold text-white tracking-wide">
              LILLYUM FRAGRANCE
            </p>
            <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">
              OPERATIONS CONTROL PANEL
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-4 px-3 overflow-y-auto">
          <p className="text-[11px] font-bold text-white/75 uppercase tracking-widest px-3 mb-2">
            NAVIGATION
          </p>

          <nav className="space-y-1">
            {visibleNavItems.map(({ label, href, icon: Icon, badgeKey }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-[#B8892A] shadow-soft font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={isActive ? 'text-[#B8892A]' : 'text-white/80'} />
                    <span>{label}</span>
                  </div>

                  {badgeKey === 'orders' && pendingOrdersCount > 0 && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full leading-none ${
                        isActive
                          ? 'bg-[#B8892A] text-white'
                          : 'bg-white text-[#B8892A]'
                      }`}
                    >
                      {pendingOrdersCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom section */}
        <div className="p-4 border-t border-white/15 space-y-2.5">
          {/* Access status badge */}
          <div className="w-full border border-white/25 bg-white/10 rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-semibold text-white">
            {currentRole === 'Owner' ? (
              <>
                <ShieldCheck size={15} className="text-white" />
                <span className="text-[11px] uppercase tracking-wider font-bold text-white">
                  FULL OWNER ACCESS
                </span>
              </>
            ) : (
              <>
                <UserCheck size={15} className="text-white" />
                <span className="text-[11px] uppercase tracking-wider font-bold text-white">
                  STAFF OPERATOR ACCESS
                </span>
              </>
            )}
          </div>

          {/* Visit Store button */}
          <Link
            href="/"
            target="_blank"
            className="w-full border border-white/30 bg-white/15 hover:bg-white text-white hover:text-[#B8892A] rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-semibold transition-all shadow-2xs"
          >
            <ExternalLink size={14} className="opacity-80" />
            <span>Visit Online Store</span>
          </Link>

          {/* Logout button */}
          <button
            onClick={handleSignOut}
            className="w-full border border-white/30 bg-white/90 hover:bg-white text-rose-600 rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <LogOut size={14} className="text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-brand-light flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-soft">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-cream rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-brand-charcoal font-serif font-bold text-base capitalize">
                {NAV_ITEMS.find((n) => n.href === pathname)?.label ?? 'Dashboard'}
              </h1>
            </div>
          </div>

          {/* Top Bar Right Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* 1. Revenue pill */}
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
              <TrendingUp size={14} className="text-emerald-600" />
              <span>{formatPrice(liveRevenue)}</span>
            </div>

            {/* 2. Role Switcher Dropdown */}
            <div className="relative" ref={roleDropdownRef}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="border border-brand-light hover:border-brand-gold/60 bg-white px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-charcoal flex items-center gap-2 transition-all shadow-2xs"
              >
                <Shield size={14} className="text-amber-500 fill-amber-500/20" />
                <span>TEST ROLE: <strong className="font-bold">{currentRole}</strong></span>
                <ChevronDown size={14} className={`text-brand-charcoal/50 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card border border-brand-light p-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-wider">
                    Simulate Role
                  </div>

                  <button
                    onClick={() => handleRoleChange('Owner')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      currentRole === 'Owner'
                        ? 'bg-brand-gold-soft text-brand-gold-dark border border-brand-gold/30'
                        : 'text-brand-charcoal/70 hover:bg-brand-cream/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>👑</span>
                      <span>Owner / Super Admin</span>
                    </div>
                    {currentRole === 'Owner' && <Check size={14} className="text-brand-gold" />}
                  </button>

                  <button
                    onClick={() => handleRoleChange('Staff')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      currentRole === 'Staff'
                        ? 'bg-brand-gold-soft text-brand-gold-dark border border-brand-gold/30'
                        : 'text-brand-charcoal/70 hover:bg-brand-cream/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>👤</span>
                      <span>Staff Operator</span>
                    </div>
                    {currentRole === 'Staff' && <Check size={14} className="text-brand-gold" />}
                  </button>
                </div>
              )}
            </div>

            {/* 3. Notification Bell with Dropdown Popover (Matching Image 1) */}
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`relative p-2 rounded-full border transition-colors shadow-2xs cursor-pointer ${
                  notificationsOpen
                    ? 'border-brand-gold bg-brand-gold-soft text-brand-gold'
                    : 'border-brand-light bg-white hover:bg-brand-cream text-brand-charcoal/70 hover:text-brand-charcoal'
                }`}
                title="Notifications"
                aria-label="Open notifications"
              >
                <Bell size={16} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none shadow-xs">
                    {notifications.length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-brand-light overflow-hidden z-50 animate-in fade-in zoom-in-95">
                  {/* Popover Header */}
                  <div className="p-4 px-5 border-b border-brand-light/80 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2.5">
                      <Bell size={17} className="text-brand-charcoal" />
                      <h3 className="font-serif font-bold text-sm text-brand-charcoal">
                        Notifications
                      </h3>
                      {notifications.length > 0 && (
                        <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {notifications.length} new
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {notifications.length > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          className="text-[11px] font-semibold text-brand-charcoal/60 hover:text-brand-gold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <CheckCheck size={13} />
                          <span>All read</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setNotificationsOpen(false)}
                        className="p-1 rounded-lg text-brand-charcoal/40 hover:text-brand-charcoal hover:bg-brand-cream transition-colors cursor-pointer"
                        aria-label="Close notifications"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Popover Body: Notification items */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-brand-light/60">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-brand-charcoal/40 space-y-2">
                        <CheckCheck size={26} className="mx-auto text-emerald-500/70" />
                        <p className="text-xs font-medium">All caught up! No new notifications.</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className="p-4 hover:bg-brand-cream/40 transition-colors flex items-start gap-3.5 cursor-pointer relative group"
                        >
                          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                            <ShoppingBag size={18} />
                          </div>

                          <div className="flex-1 min-w-0 pr-5">
                            <p className="text-xs font-bold text-brand-charcoal truncate">
                              {n.title}
                            </p>
                            <p className="text-[10px] text-brand-charcoal/40 mt-0.5">
                              {n.time}
                            </p>
                            <p className="text-xs font-semibold text-brand-charcoal mt-1 truncate">
                              {n.customerName}
                            </p>
                            <p className="text-[11px] text-brand-charcoal/60 mt-0.5 truncate">
                              {n.details}
                            </p>
                          </div>

                          {/* Individual dismiss button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDismissNotification(n.id);
                            }}
                            className="absolute top-3.5 right-3.5 p-1 rounded-md text-brand-charcoal/30 hover:text-brand-charcoal hover:bg-brand-cream transition-colors cursor-pointer"
                            title="Mark as read"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Popover Footer (Matching Image 1) */}
                  <div className="p-3.5 px-5 border-t border-brand-light/80 bg-brand-cream/30 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setNotificationsOpen(false);
                        router.push('/admin/orders');
                      }}
                      className="text-xs font-bold text-brand-charcoal/70 hover:text-brand-gold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>📦</span>
                      <span>View Orders</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setNotificationsOpen(false);
                        router.push('/admin/messages');
                      }}
                      className="text-xs font-bold text-brand-charcoal/70 hover:text-brand-gold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>💬</span>
                      <span>View Messages</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. User Profile (Changed 'M' to 'L' for Lillyum Owner) */}
            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-8 h-8 rounded-full bg-brand-gold text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {currentRole === 'Owner' ? 'L' : 'S'}
              </div>
              <div className="hidden md:block leading-tight">
                <p className="text-xs font-bold text-brand-charcoal">
                  {currentRole === 'Owner' ? 'Owner (Super Admin)' : 'Staff Operator'}
                </p>
                <p className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-widest">
                  {currentRole.toUpperCase()}
                </p>
              </div>
            </div>

            {/* 5. Logout Button */}
            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl border border-brand-light bg-white text-brand-charcoal/60 hover:text-red-500 hover:bg-red-50 transition-colors shadow-2xs"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


