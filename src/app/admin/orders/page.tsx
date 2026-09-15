'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { Order, OrderStatus } from '@/types';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { getAllOrders, getLocalOrders, updateOrderStatus } from '@/services/firestoreService';
import {
  ShoppingBag,
  Search,
  Download,
  Printer,
  X,
  Save,
  MessageCircle,
  Eye,
  User,
  CheckCircle,
  Clock,
  Truck,
  RotateCcw,
  Check,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Dispatched',
  'Completed',
  'Cancelled',
];

const STATUS_BADGE_STYLES: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Confirmed: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  Processing: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Dispatched: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  Completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(() => getLocalOrders());
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const [search, setSearch] = useState('');

  // Inspect / Edit Modal state
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editStatus, setEditStatus] = useState<OrderStatus>('Pending');
  const [editNotes, setEditNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const list = await getAllOrders();
        if (list && list.length > 0) {
          setOrders(list);
        }
      } catch (err) {
        console.warn('Orders loaded from local cache');
      }
    }
    load();
  }, []);

  // Filtered orders based on status & search
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesFilter = filter === 'All' || o.status === filter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        o.orderId.toLowerCase().includes(q) ||
        (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
        (o.customer?.phone && o.customer.phone.includes(q)) ||
        (o.customer?.district && o.customer.district.toLowerCase().includes(q)) ||
        (o.customer?.email && o.customer.email.toLowerCase().includes(q));
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, search]);

  // Open Inspect Modal
  const handleOpenInspect = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditNotes(order.internalNotes ?? '');
    setInspectModalOpen(true);
  };

  // Quick Status change from table dropdown (if used)
  const handleQuickStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId || o.orderId === orderId ? { ...o, status: newStatus } : o))
      );
      window.dispatchEvent(new Event('lillyum_orders_updated'));
      toast.success(`Order status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  // Save changes inside Inspect / Edit Modal
  const handleSaveModalChanges = async () => {
    if (!selectedOrder) return;
    setIsSaving(true);
    try {
      const targetId = selectedOrder.id || selectedOrder.orderId;
      const updatedOrder: Order = {
        ...selectedOrder,
        status: editStatus,
        internalNotes: editNotes,
        updatedAt: new Date().toISOString(),
      };
      setSelectedOrder(updatedOrder);
      setOrders((prev) =>
        prev.map((o) => (o.id === targetId || o.orderId === targetId ? updatedOrder : o))
      );

      await updateOrderStatus(targetId, editStatus, editNotes);

      window.dispatchEvent(new Event('lillyum_orders_updated'));
      toast.success(`Order ${selectedOrder.orderId} updated successfully!`);
      setInspectModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save order changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Export filtered orders to CSV
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    const headers = [
      'Order Ref',
      'Date',
      'Customer Name',
      'Phone',
      'Email',
      'District',
      'Address',
      'Items Count',
      'Total (LKR)',
      'Payment Method',
      'Status',
      'Notes',
    ];

    const rows = filteredOrders.map((o) => [
      `"${o.orderId}"`,
      `"${new Date(o.createdAt as string).toLocaleString()}"`,
      `"${o.customer?.name ?? ''}"`,
      `"${o.customer?.phone ?? ''}"`,
      `"${o.customer?.email ?? ''}"`,
      `"${o.customer?.district ?? ''}"`,
      `"${(o.customer?.address ?? '').replace(/"/g, '""')}"`,
      o.items?.length ?? 0,
      o.total,
      `"${o.paymentMethod ?? 'COD'}"`,
      `"${o.status}"`,
      `"${(o.internalNotes ?? '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `lillyum_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders exported to CSV');
  };

  // Print Dispatch Slip for the selected order
  const handlePrintDispatchSlip = () => {
    if (!selectedOrder) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = selectedOrder.items
      .map(
        (i) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${i.title} (${i.brand}) - ${i.size}ml</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${i.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Rs. ${i.price.toLocaleString()}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Rs. ${(i.quantity * i.price).toLocaleString()}</td>
        </tr>
      `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dispatch Slip - ${selectedOrder.orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1c1c1e; line-height: 1.5; }
            .header { border-bottom: 2px solid #B8892A; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 20px; font-weight: bold; color: #B8892A; letter-spacing: 2px; }
            .badge { background: #FAF7F2; border: 1px solid #B8892A; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: bold; }
            .box { background: #FAF7F2; border: 1px solid #eee; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
            th { background: #f5f5f5; padding: 8px; text-align: left; font-size: 12px; text-transform: uppercase; }
            .totals { margin-top: 16px; text-align: right; font-size: 14px; }
            .total-val { font-size: 18px; font-weight: bold; color: #B8892A; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">LILLYUM FRAGRANCE</div>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #666;">COURIER DISPATCH & PACKING SLIP</p>
            </div>
            <div>
              <span class="badge">${selectedOrder.paymentMethod || 'COD'} ORDER</span>
            </div>
          </div>

          <div style="display: flex; gap: 20px; margin-bottom: 16px;">
            <div class="box" style="flex: 1;">
              <strong>ORDER INFO</strong><br/>
              Order Ref: <strong>${selectedOrder.orderId}</strong><br/>
              Date: ${new Date(selectedOrder.createdAt as string).toLocaleString()}<br/>
              Status: <strong>${selectedOrder.status.toUpperCase()}</strong>
            </div>
            <div class="box" style="flex: 1;">
              <strong>RECIPIENT DETAILS</strong><br/>
              Name: <strong>${selectedOrder.customer.name}</strong><br/>
              Phone: <strong>${selectedOrder.customer.phone}</strong><br/>
              Address: ${selectedOrder.customer.address}, ${selectedOrder.customer.city}<br/>
              District: <strong>${selectedOrder.customer.district}</strong>
            </div>
          </div>

          ${selectedOrder.internalNotes ? `<div class="box"><strong>Dispatch / Courier Notes:</strong> ${selectedOrder.internalNotes}</div>` : ''}

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div>Subtotal: Rs. ${selectedOrder.subtotal.toLocaleString()}</div>
            <div>Delivery Fee: Rs. ${(selectedOrder.deliveryFee || 0).toLocaleString()}</div>
            <div style="margin-top: 6px;">Total Collectible Amount: <span class="total-val">Rs. ${selectedOrder.total.toLocaleString()}</span></div>
          </div>

          <div style="margin-top: 40px; border-top: 1px dashed #ccc; padding-top: 12px; font-size: 11px; text-align: center; color: #888;">
            Thank you for shopping with Lillyum Fragrance Studio. Authenticity Guaranteed.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card (Matching Image 2) */}
      <div className="bg-white rounded-3xl border border-brand-light p-6 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold-soft border border-brand-gold/30 text-brand-gold flex items-center justify-center shrink-0 shadow-xs">
            <ShoppingBag size={26} />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-charcoal">
              Order Management System
            </h1>
            <p className="text-brand-charcoal/60 text-xs mt-0.5">
              Manage Sri Lanka COD orders, verify payments, update delivery status, and trigger WhatsApp notifications.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="border border-brand-light hover:border-brand-gold/60 bg-white hover:bg-brand-cream text-brand-charcoal font-semibold text-xs px-4 py-2.5 rounded-full flex items-center gap-2 shadow-2xs transition-all shrink-0 cursor-pointer"
        >
          <Download size={15} className="text-brand-gold" />
          <span>Export Orders to CSV</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar (Matching Image 2) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', ...STATUSES] as const).map((s) => {
            const count = s === 'All' ? orders.length : orders.filter((o) => o.status === s).length;
            const isActive = filter === s;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border border-brand-gold bg-brand-gold text-white shadow-soft'
                    : 'border border-brand-light bg-white text-brand-charcoal/70 hover:border-brand-gold/40 hover:text-brand-charcoal'
                }`}
              >
                <span>{s}</span>
                {count > 0 && (
                  <span
                    className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-brand-cream text-brand-charcoal/60'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-charcoal/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, Name, Phone..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-brand-light rounded-full text-xs text-brand-charcoal placeholder-brand-charcoal/40 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold shadow-2xs"
          />
        </div>
      </div>

      {/* Orders Table (Matching Image 2) */}
      <div className="bg-white rounded-3xl border border-brand-light shadow-soft overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-brand-charcoal/50">
            No orders found matching the filter or search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-light bg-brand-cream/50 text-[11px] font-bold text-brand-charcoal/60 uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5">Order Ref</th>
                  <th className="text-left px-4 py-3.5">Customer Details</th>
                  <th className="text-left px-4 py-3.5">District</th>
                  <th className="text-left px-4 py-3.5">Items Count</th>
                  <th className="text-left px-4 py-3.5">Total Amount</th>
                  <th className="text-left px-4 py-3.5">Order Status</th>
                  <th className="text-right px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light">
                {filteredOrders.map((order) => {
                  const badge = STATUS_BADGE_STYLES[order.status] ?? STATUS_BADGE_STYLES.Pending;
                  const formattedDate = new Date(order.createdAt as string).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  const waMessage = `Hi ${order.customer?.name ?? 'Customer'}! This is Lillyum Fragrance Studio. Your order ${order.orderId} is currently ${order.status.toLowerCase()}. Total: Rs. ${order.total.toLocaleString()}.`;

                  return (
                    <tr key={order.id} className="hover:bg-brand-cream/40 transition-colors">
                      {/* ORDER REF */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleOpenInspect(order)}
                          className="font-bold text-xs text-brand-charcoal hover:text-brand-gold text-left block"
                        >
                          {order.orderId}
                        </button>
                        <p className="text-[11px] text-brand-charcoal/40 mt-0.5">{formattedDate}</p>
                        {order.verificationCode && (
                          <span
                            className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-full mt-1 font-semibold ${
                              order.isVerified
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {order.isVerified ? '✓ Verified' : `Code: ${order.verificationCode}`}
                          </span>
                        )}
                      </td>

                      {/* CUSTOMER DETAILS */}
                      <td className="px-4 py-4">
                        <p className="text-xs font-bold text-brand-charcoal">{order.customer?.name}</p>
                        <p className="text-[11px] text-brand-charcoal/50">{order.customer?.phone}</p>
                      </td>

                      {/* DISTRICT */}
                      <td className="px-4 py-4 text-xs font-medium text-brand-charcoal">
                        {order.customer?.district || 'Colombo'}
                      </td>

                      {/* ITEMS COUNT */}
                      <td className="px-4 py-4 text-xs text-brand-charcoal/70">
                        {order.items?.length ?? 1} item(s)
                      </td>

                      {/* TOTAL AMOUNT */}
                      <td className="px-4 py-4 text-xs font-bold text-brand-gold">
                        Rs. {order.total.toLocaleString()}
                      </td>

                      {/* ORDER STATUS */}
                      <td className="px-4 py-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border inline-flex items-center gap-1 ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* WhatsApp Customer Button */}
                          <a
                            href={getWhatsAppLink(order.customer?.phone ?? '', waMessage)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-600 flex items-center justify-center transition-colors shadow-2xs"
                            title="Chat with customer on WhatsApp"
                          >
                            <MessageCircle size={15} />
                          </a>

                          {/* Inspect / Edit Button */}
                          <button
                            onClick={() => handleOpenInspect(order)}
                            className="border border-brand-light hover:border-brand-gold/50 bg-white hover:bg-brand-cream/80 text-brand-charcoal text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Eye size={14} className="text-brand-gold" />
                            <span>Inspect</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* INSPECT / EDIT ORDER MODAL (Matching Image 3)            */}
      {/* ======================================================== */}
      {inspectModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-brand-light shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-brand-light flex items-center justify-between bg-brand-cream/30">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-serif text-xl font-bold text-brand-charcoal">
                    {selectedOrder.orderId}
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                    {selectedOrder.paymentMethod || 'COD'} ORDER
                  </span>
                </div>
                <p className="text-brand-charcoal/50 text-xs mt-0.5">
                  Placed on{' '}
                  {new Date(selectedOrder.createdAt as string).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintDispatchSlip}
                  className="border border-brand-light hover:border-brand-gold/60 bg-white hover:bg-brand-cream text-brand-charcoal font-semibold text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Printer size={14} className="text-brand-gold" />
                  <span>Print Dispatch Slip</span>
                </button>
                <button
                  onClick={() => setInspectModalOpen(false)}
                  className="p-1.5 text-brand-charcoal/40 hover:text-brand-charcoal hover:bg-brand-cream rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* UPDATE ORDER STATUS CARD (Top card in Image 3) */}
              <div className="p-5 rounded-3xl border border-brand-light bg-brand-cream/30 space-y-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block mb-1.5">
                      Update Order Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                      className="px-3 py-2 bg-white border border-brand-light rounded-xl text-xs font-bold text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold cursor-pointer shadow-2xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          Status: {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <a
                    href={getWhatsAppLink(
                      selectedOrder.customer?.phone ?? '',
                      `Hi ${selectedOrder.customer?.name ?? 'Customer'}! Regarding your Lillyum Fragrance order ${selectedOrder.orderId}: status is ${editStatus}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-soft transition-all self-start sm:self-end"
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp Customer</span>
                  </a>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-charcoal">
                    Internal Admin &amp; Courier Tracking Notes
                  </label>
                  <textarea
                    rows={2}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add courier tracking numbers, packing details, or customer notes..."
                    className="w-full p-3 bg-white border border-brand-light rounded-xl text-xs text-brand-charcoal placeholder-brand-charcoal/40 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold resize-none shadow-2xs"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveModalChanges}
                    disabled={isSaving}
                    className="bg-brand-charcoal hover:bg-brand-gold text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-soft transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save size={14} />
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>

              {/* Lower Section: 2 Columns (Matching Image 3) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column: Customer Details */}
                <div className="p-5 rounded-3xl border border-brand-light bg-white shadow-soft space-y-3">
                  <div className="flex items-center gap-2 border-b border-brand-light pb-2.5">
                    <User size={16} className="text-brand-gold" />
                    <h3 className="font-bold text-xs text-brand-charcoal uppercase tracking-wider">
                      Customer Details
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-brand-charcoal/50 block text-[11px]">Name:</span>
                      <span className="font-bold text-brand-charcoal">
                        {selectedOrder.customer?.name}
                      </span>
                    </div>

                    <div>
                      <span className="text-brand-charcoal/50 block text-[11px]">Phone:</span>
                      <a
                        href={`tel:${selectedOrder.customer?.phone}`}
                        className="font-semibold text-brand-charcoal hover:text-brand-gold"
                      >
                        {selectedOrder.customer?.phone}
                      </a>
                    </div>

                    <div>
                      <span className="text-brand-charcoal/50 block text-[11px]">Email:</span>
                      <span className="text-brand-charcoal/80">
                        {selectedOrder.customer?.email || 'N/A'}
                      </span>
                    </div>

                    <div>
                      <span className="text-brand-charcoal/50 block text-[11px]">
                        Delivery Address:
                      </span>
                      <p className="text-brand-charcoal/80 leading-relaxed">
                        {selectedOrder.customer?.address}
                        {selectedOrder.customer?.city ? `, ${selectedOrder.customer.city}` : ''}
                      </p>
                      <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-md bg-brand-cream border border-brand-light text-[10px] font-bold text-brand-charcoal">
                        District: {selectedOrder.customer?.district || 'Colombo'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Order Items */}
                <div className="p-5 rounded-3xl border border-brand-light bg-white shadow-soft space-y-3">
                  <div className="border-b border-brand-light pb-2.5">
                    <h3 className="font-bold text-xs text-brand-charcoal uppercase tracking-wider">
                      Order Items ({selectedOrder.items?.length ?? 1})
                    </h3>
                  </div>

                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-cream border border-brand-light shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-brand-charcoal/40">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-brand-charcoal truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-brand-charcoal/50">
                            Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-brand-charcoal">
                            Rs. {(item.quantity * item.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Financial Summary */}
                  <div className="border-t border-brand-light pt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-brand-charcoal/60">
                      <span>Subtotal</span>
                      <span>Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-brand-charcoal/60">
                      <span>Delivery Fee</span>
                      <span>Rs. {(selectedOrder.deliveryFee || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-brand-charcoal pt-1.5 border-t border-brand-light/60">
                      <span>Total Amount ({selectedOrder.paymentMethod || 'COD'})</span>
                      <span className="text-brand-gold">
                        Rs. {selectedOrder.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

