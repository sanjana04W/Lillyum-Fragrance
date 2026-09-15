'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  getCustomerAccountDetails,
  updateCustomerAccountDetails,
  CustomerAccountDetails,
} from '@/services/customerAuthService';
import { Order } from '@/types';
import { ALL_DISTRICTS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import {
  ArrowLeft,
  LayoutGrid,
  ShoppingBag,
  Settings,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Save,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const continueUrl = searchParams.get('continue') || searchParams.get('redirect');
  const { user, loading: authLoading, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview');
  const [profile, setProfile] = useState<CustomerAccountDetails | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [savingSettings, setSavingSettings] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    district: 'Colombo',
  });

  // Load profile and orders
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login?redirect=/profile');
      return;
    }

    const email = user.email || '';
    const details = getCustomerAccountDetails(user.uid || email);
    setProfile(details);

    // Load customer orders from localStorage
    let customerOrders: Order[] = [];
    try {
      const allOrders: Order[] = JSON.parse(localStorage.getItem('lillyum_orders') || '[]');
      customerOrders = allOrders.filter(
        (o) => o.customer?.email?.toLowerCase().trim() === email.toLowerCase().trim()
      );
    } catch {
      customerOrders = [];
    }
    setOrders(customerOrders);

    // Populate initial settings form
    const mostRecentOrder = customerOrders[0];
    setSettingsForm({
      name: details?.name || details?.displayName || user.displayName || '',
      phone: details?.phone || mostRecentOrder?.customer?.phone || '',
      address: details?.address || mostRecentOrder?.customer?.address || '',
      city: details?.city || mostRecentOrder?.customer?.city || '',
      district: details?.district || mostRecentOrder?.customer?.district || 'Colombo',
    });
  }, [user, authLoading, router]);

  if (authLoading || (!user && typeof window !== 'undefined')) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  const displayName = profile?.name || profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Customer';
  const displayEmail = user?.email || profile?.email || '';
  const firstInitial = displayName.charAt(0).toUpperCase() || 'C';

  // Calculate metrics
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Format member since date
  const memberDate = profile?.createdAt ? new Date(profile.createdAt) : new Date();
  const formattedMemberSince = memberDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }) + ', ' + memberDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const displayPhone = settingsForm.phone || 'No phone number provided yet.';
  const displayAddress =
    settingsForm.address
      ? `${settingsForm.address}${settingsForm.city ? ', ' + settingsForm.city : ''}${settingsForm.district ? ', ' + settingsForm.district : ''}`
      : 'No delivery address provided yet.';

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingSettings(true);

    const email = user.email || '';
    const success = updateCustomerAccountDetails(user.uid || email, {
      name: settingsForm.name,
      displayName: settingsForm.name,
      phone: settingsForm.phone,
      address: settingsForm.address,
      city: settingsForm.city,
      district: settingsForm.district,
    });

    setTimeout(() => {
      setSavingSettings(false);
      if (success) {
        toast.success('Profile updated successfully!', {
          style: { background: '#FAF7F2', color: '#1C1C1E', border: '1px solid #B8892A' },
        });
        const updated = getCustomerAccountDetails(user.uid || email);
        setProfile(updated);
        setActiveTab('overview');
      } else {
        toast.error('Could not save changes. Please try again.');
      }
    }, 400);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully.');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-brand-cream py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Header Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-brand-mid hover:text-brand-gold uppercase transition-colors"
          >
            <ArrowLeft size={16} />
            BACK TO SHOP
          </Link>

          {continueUrl && (
            <Link
              href={continueUrl}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gold text-white text-xs sm:text-sm font-semibold hover:bg-brand-gold-dark transition-colors shadow-gold"
            >
              Continue to Checkout
              <ChevronRight size={14} />
            </Link>
          )}
        </div>

        {/* 2-Column Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Profile Card & Navigation */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-brand-white rounded-3xl p-6 border border-brand-light shadow-card space-y-6">

              {/* User Identity Header */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold via-brand-gold-dark to-brand-charcoal text-white flex items-center justify-center font-serif text-2xl font-bold shadow-soft shrink-0">
                  {firstInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-serif text-base sm:text-lg font-bold text-brand-charcoal truncate" title={displayName}>
                    {displayName}
                  </h2>
                  <span className="inline-block text-[10px] tracking-widest text-brand-gold font-bold uppercase mt-0.5">
                    CUSTOMER
                  </span>
                </div>
              </div>

              {/* Navigation Menu Tabs */}
              <nav className="space-y-1.5 pt-2 border-t border-brand-light">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    activeTab === 'overview'
                      ? 'bg-brand-gold-soft text-brand-gold font-semibold shadow-soft'
                      : 'text-brand-mid hover:text-brand-charcoal hover:bg-brand-ivory'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid size={17} className={activeTab === 'overview' ? 'text-brand-gold' : 'text-brand-muted'} />
                    <span>Overview</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    activeTab === 'orders'
                      ? 'bg-brand-gold-soft text-brand-gold font-semibold shadow-soft'
                      : 'text-brand-mid hover:text-brand-charcoal hover:bg-brand-ivory'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={17} className={activeTab === 'orders' ? 'text-brand-gold' : 'text-brand-muted'} />
                    <span>Order History</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-gold-soft text-brand-gold">
                    {totalOrders}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    activeTab === 'settings'
                      ? 'bg-brand-gold-soft text-brand-gold font-semibold shadow-soft'
                      : 'text-brand-mid hover:text-brand-charcoal hover:bg-brand-ivory'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Settings size={17} className={activeTab === 'settings' ? 'text-brand-gold' : 'text-brand-muted'} />
                    <span>Settings</span>
                  </div>
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors pt-2"
                >
                  <LogOut size={17} />
                  <span>Logout</span>
                </button>
              </nav>

            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="lg:col-span-8 space-y-6">

            {/* Welcome Greeting Banner */}
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal">
                Welcome Back, {displayName}!
              </h1>
              <p className="text-brand-mid text-sm mt-1 leading-relaxed">
                Manage your order history, delivery details, and keep your contact information up-to-date.
              </p>
            </div>

            {/* 3 Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-brand-white rounded-3xl p-5 sm:p-6 border border-brand-light shadow-card">
                <p className="text-[11px] font-semibold tracking-wider text-brand-muted uppercase">
                  TOTAL ORDERS
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-brand-charcoal mt-2">
                  {totalOrders}
                </p>
              </div>

              <div className="bg-brand-white rounded-3xl p-5 sm:p-6 border border-brand-light shadow-card">
                <p className="text-[11px] font-semibold tracking-wider text-brand-muted uppercase">
                  TOTAL SPENT
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-brand-gold mt-2">
                  {formatPrice(totalSpent)}
                </p>
              </div>

              <div className="bg-brand-white rounded-3xl p-5 sm:p-6 border border-brand-light shadow-card">
                <p className="text-[11px] font-semibold tracking-wider text-brand-muted uppercase">
                  MEMBER SINCE
                </p>
                <p className="text-sm sm:text-base font-bold text-brand-charcoal mt-3 leading-snug">
                  {formattedMemberSince}
                </p>
              </div>
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-brand-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-card space-y-6">
                  <div className="flex items-center justify-between border-b border-brand-light pb-4">
                    <h2 className="font-serif text-lg font-bold text-brand-charcoal">
                      Account Overview
                    </h2>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="text-xs font-semibold text-brand-gold hover:underline flex items-center gap-1"
                    >
                      <Settings size={12} /> Edit Details
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider">
                        EMAIL ADDRESS
                      </p>
                      <p className="font-medium text-brand-charcoal mt-1 flex items-center gap-2 break-all">
                        <Mail size={15} className="text-brand-gold shrink-0" />
                        {displayEmail}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider">
                        PHONE NUMBER
                      </p>
                      <p className="font-medium text-brand-charcoal mt-1 flex items-center gap-2">
                        <Phone size={15} className="text-brand-gold shrink-0" />
                        {displayPhone}
                      </p>
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-brand-light/60">
                      <p className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider">
                        DEFAULT DELIVERY ADDRESS
                      </p>
                      <p className="font-medium text-brand-charcoal mt-1 flex items-start gap-2">
                        <MapPin size={16} className="text-brand-gold shrink-0 mt-0.5" />
                        <span>{displayAddress}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-brand-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-card space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-lg font-bold text-brand-charcoal">
                      Recent Orders
                    </h2>
                    {orders.length > 0 && (
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-semibold text-brand-gold hover:underline flex items-center gap-1"
                      >
                        View All Orders ({orders.length}) →
                      </button>
                    )}
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-8 space-y-3">
                      <p className="text-brand-mid text-sm">You haven't placed any orders yet.</p>
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-white text-xs font-semibold hover:bg-brand-gold-dark transition-colors shadow-gold"
                      >
                        Explore Fragrances
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 2).map((order) => (
                        <div
                          key={order.orderId}
                          className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-2xl bg-brand-cream border border-brand-light hover:border-brand-gold/40 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-sm text-brand-charcoal">
                                #{order.orderId}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                                  order.status === 'Completed' || order.status === 'Confirmed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : order.status === 'Cancelled'
                                    ? 'bg-red-50 text-red-600 border border-red-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {order.status}
                              </span>
                              {order.isVerified && (
                                <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-0.5">
                                  <CheckCircle2 size={11} /> Verified
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-brand-mid mt-1">
                              {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}{' '}
                              • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-serif font-bold text-sm text-brand-gold">
                              {formatPrice(order.total)}
                            </span>
                            <Link
                              href={`/order-confirmation?orderId=${order.orderId}&total=${order.total}&email=${encodeURIComponent(
                                order.customer.email
                              )}`}
                              className="text-xs font-semibold text-brand-mid hover:text-brand-gold flex items-center gap-1"
                            >
                              Details <ExternalLink size={12} />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Order History */}
            {activeTab === 'orders' && (
              <div className="bg-brand-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-card space-y-6">
                <div className="flex items-center justify-between border-b border-brand-light pb-4">
                  <div>
                    <h2 className="font-serif text-lg font-bold text-brand-charcoal">
                      Your Orders
                    </h2>
                    <p className="text-brand-mid text-xs mt-0.5">
                      Track past orders, view invoices, and verify delivery codes.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-gold-soft text-brand-gold">
                    {orders.length} order{orders.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-brand-gold-soft text-brand-gold flex items-center justify-center mx-auto">
                      <ShoppingBag size={28} />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-brand-charcoal">No orders yet</h3>
                    <p className="text-brand-mid text-sm max-w-sm mx-auto">
                      Once you place an order, all receipts, verification codes, and tracking details will be shown here.
                    </p>
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-gold text-white text-sm font-semibold hover:bg-brand-gold-dark transition-colors shadow-gold"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.orderId}
                        className="rounded-2xl border border-brand-light p-5 space-y-4 hover:border-brand-gold/40 transition-colors"
                      >
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-base text-brand-charcoal">
                                #{order.orderId}
                              </span>
                              <span
                                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                  order.status === 'Completed' || order.status === 'Confirmed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : order.status === 'Cancelled'
                                    ? 'bg-red-50 text-red-600 border border-red-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {order.status}
                              </span>
                              {order.isVerified ? (
                                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                  <CheckCircle2 size={12} /> Verified
                                </span>
                              ) : (
                                <span className="text-xs font-semibold text-brand-gold bg-brand-gold-soft border border-brand-gold/30 px-2.5 py-0.5 rounded-full">
                                  Code: {order.verificationCode || 'Sent to email'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-brand-mid mt-1 flex items-center gap-1.5">
                              <Calendar size={13} className="text-brand-muted" />
                              {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-brand-muted block">Order Total</span>
                            <span className="font-serif font-bold text-lg text-brand-gold">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items List */}
                        <div className="border-t border-brand-light/60 pt-3 space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-brand-charcoal">
                              <span className="text-brand-mid truncate max-w-xs">
                                {item.title} ({item.size}ml × {item.quantity})
                              </span>
                              <span className="font-semibold text-brand-charcoal">
                                {formatPrice(item.subtotal)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="border-t border-brand-light/60 pt-3 flex items-center justify-between flex-wrap gap-2 text-xs">
                          <span className="text-brand-mid">
                            Delivery to: <strong className="text-brand-charcoal">{order.customer.city}, {order.customer.district}</strong>
                          </span>
                          <Link
                            href={`/order-confirmation?orderId=${order.orderId}&total=${order.total}&email=${encodeURIComponent(
                              order.customer.email
                            )}`}
                            className="inline-flex items-center gap-1 font-semibold text-brand-gold hover:underline"
                          >
                            Open Confirmation & Verify <ChevronRight size={13} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Settings */}
            {activeTab === 'settings' && (
              <div className="bg-brand-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-card space-y-6">
                <div className="border-b border-brand-light pb-4">
                  <h2 className="font-serif text-lg font-bold text-brand-charcoal">
                    Profile Settings
                  </h2>
                  <p className="text-brand-mid text-xs mt-0.5">
                    Update your delivery address, telephone number, and contact details.
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      placeholder="e.g. H.M. Wenuri Sanjana Herath"
                      className="w-full px-4 py-3 bg-brand-white border border-brand-light rounded-xl text-sm text-brand-charcoal placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      placeholder="e.g. +94701442569"
                      className="w-full px-4 py-3 bg-brand-white border border-brand-light rounded-xl text-sm text-brand-charcoal placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      placeholder="e.g. No. 124, Lotus Road"
                      className="w-full px-4 py-3 bg-brand-white border border-brand-light rounded-xl text-sm text-brand-charcoal placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-1.5">
                        City / Town
                      </label>
                      <input
                        type="text"
                        value={settingsForm.city}
                        onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })}
                        placeholder="e.g. Colombo 07"
                        className="w-full px-4 py-3 bg-brand-white border border-brand-light rounded-xl text-sm text-brand-charcoal placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-1.5">
                        District
                      </label>
                      <select
                        value={settingsForm.district}
                        onChange={(e) => setSettingsForm({ ...settingsForm, district: e.target.value })}
                        className="w-full px-4 py-3 bg-brand-white border border-brand-light rounded-xl text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold"
                      >
                        {ALL_DISTRICTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('overview')}
                      className="px-5 py-2.5 rounded-xl border border-brand-light text-sm font-medium text-brand-mid hover:text-brand-charcoal"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-gold text-white text-sm font-semibold hover:bg-brand-gold-dark transition-colors shadow-gold disabled:opacity-50"
                    >
                      {savingSettings ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-cream flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
