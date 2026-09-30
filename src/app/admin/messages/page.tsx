'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  X,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllInquiries, updateInquiryStatus } from '@/services/firestoreService';
import { Inquiry, InquiryStatus } from '@/types';

function formatDate(dateStr: string | Date | undefined): string {
  if (!dateStr) return '—';
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
}

const STATUS_COLORS: Record<InquiryStatus, string> = {
  New: 'bg-blue-50 text-blue-700 border-blue-200',
  'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
  Resolved: 'bg-green-50 text-green-700 border-green-200',
};

const STATUS_OPTIONS: InquiryStatus[] = ['New', 'In Progress', 'Resolved'];

export default function AdminMessagesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'All'>('All');
  const [notes, setNotes] = useState('');

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllInquiries();
      setInquiries(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
        setNotes(data[0].internalNotes || '');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    fetchInquiries();

    // Auto-refresh when a new inquiry is saved via the contact form (localStorage event)
    const handleInquiryUpdate = () => {
      fetchInquiries();
    };
    window.addEventListener('lillyum_inquiries_updated', handleInquiryUpdate);
    return () => {
      window.removeEventListener('lillyum_inquiries_updated', handleInquiryUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedInquiry = inquiries.find((m) => m.id === selectedId) ?? null;

  const handleSelect = (inquiry: Inquiry) => {
    setSelectedId(inquiry.id);
    setNotes(inquiry.internalNotes || '');

    // Auto-mark as "In Progress" if still New
    if (inquiry.status === 'New') {
      handleStatusChange(inquiry.id, 'In Progress', inquiry.internalNotes);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: InquiryStatus,
    currentNotes?: string
  ) => {
    setUpdatingId(id);
    try {
      await updateInquiryStatus(id, newStatus, currentNotes);
      setInquiries((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
      toast.success(`Status updated to "${newStatus}"`);
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setUpdatingId(selectedInquiry.id);
    try {
      await updateInquiryStatus(selectedInquiry.id, selectedInquiry.status, notes);
      setInquiries((prev) =>
        prev.map((m) => (m.id === selectedInquiry.id ? { ...m, internalNotes: notes } : m))
      );
      toast.success('Notes saved.');
    } catch {
      toast.error('Failed to save notes.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered inquiries
  const filtered = inquiries.filter((m) => {
    const matchStatus = statusFilter === 'All' || m.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const newCount = inquiries.filter((m) => m.status === 'New').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-charcoal">Messages &amp; Inquiries</h1>
          <p className="text-brand-charcoal/50 text-xs">Customer inquiries submitted via the Contact Us form</p>
        </div>
        <div className="flex items-center gap-3">
          {newCount > 0 && (
            <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full font-semibold">
              {newCount} New
            </span>
          )}
          <button
            onClick={fetchInquiries}
            disabled={loading}
            className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-xl border border-brand-light bg-brand-white hover:bg-brand-cream transition-colors text-brand-charcoal font-medium"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, subject..."
            className="w-full pl-8 pr-8 py-2.5 text-xs border border-brand-light rounded-xl bg-brand-white focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-charcoal"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InquiryStatus | 'All')}
            className="appearance-none pr-8 pl-3 py-2.5 text-xs border border-brand-light rounded-xl bg-brand-white focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-brand-muted">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Loading messages…</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
          <button
            onClick={fetchInquiries}
            className="ml-auto text-xs font-semibold underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && inquiries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <MessageSquare size={40} className="text-brand-muted/40" />
          <p className="text-brand-charcoal font-semibold text-sm">No messages yet</p>
          <p className="text-brand-muted text-xs max-w-xs">
            Messages submitted through the Contact Us form will appear here.
          </p>
        </div>
      )}

      {/* Messages Grid */}
      {!loading && !error && inquiries.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* List Panel */}
          <div className="bg-white rounded-2xl border border-brand-light shadow-soft overflow-hidden lg:col-span-1 h-[580px] flex flex-col">
            <div className="px-4 py-3 border-b border-brand-light text-xs text-brand-muted font-medium">
              {filtered.length} of {inquiries.length} message{inquiries.length !== 1 ? 's' : ''}
            </div>
            <div className="overflow-y-auto flex-1 divide-y divide-brand-light">
              {filtered.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-xs text-brand-muted">
                  No messages match your filter.
                </div>
              ) : (
                filtered.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelect(m)}
                    className={`w-full text-left p-4 transition-colors block ${
                      selectedId === m.id ? 'bg-brand-cream/80' : 'hover:bg-brand-cream/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`text-xs font-semibold truncate ${
                          m.status === 'New' ? 'text-brand-charcoal' : 'text-brand-charcoal/70'
                        }`}
                      >
                        {m.status === 'New' && (
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 mb-0.5" />
                        )}
                        {m.name}
                      </span>
                      <span className="text-[10px] text-brand-charcoal/40 shrink-0">
                        {formatDate(m.createdAt as string)}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-brand-gold truncate">{m.subject || 'General Inquiry'}</p>
                    <p className="text-[11px] text-brand-charcoal/60 truncate mt-1">{m.message}</p>
                    <div className="mt-2">
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[m.status as InquiryStatus] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}
                      >
                        {m.status}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Detail Panel */}
          {selectedInquiry ? (
            <div className="bg-white rounded-2xl border border-brand-light shadow-soft p-6 lg:col-span-2 space-y-5 overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-brand-light">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-brand-charcoal truncate">
                    {selectedInquiry.subject || 'General Inquiry'}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-brand-charcoal/60">
                    <span>
                      From: <strong className="text-brand-charcoal">{selectedInquiry.name}</strong>
                    </span>
                    <span>•</span>
                    <span>{selectedInquiry.email}</span>
                    {selectedInquiry.phone && (
                      <>
                        <span>•</span>
                        <span>{selectedInquiry.phone}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-xs text-brand-charcoal/40 flex items-center gap-1 shrink-0">
                  <Clock size={12} /> {formatDate(selectedInquiry.createdAt as string)}
                </span>
              </div>

              {/* Message Body */}
              <div className="bg-brand-cream/50 rounded-xl p-4 text-xs text-brand-charcoal leading-relaxed whitespace-pre-wrap min-h-[80px]">
                {selectedInquiry.message}
              </div>

              {/* Status Control */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold text-brand-charcoal">Status:</span>
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    disabled={updatingId === selectedInquiry.id}
                    onClick={() => handleStatusChange(selectedInquiry.id, s)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      selectedInquiry.status === s
                        ? STATUS_COLORS[s]
                        : 'bg-brand-white border-brand-light text-brand-muted hover:border-brand-gold/40'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {updatingId === selectedInquiry.id && selectedInquiry.status !== s ? (
                      s
                    ) : (
                      <>
                        {selectedInquiry.status === s && <CheckCircle2 size={11} className="inline mr-1 mb-0.5" />}
                        {s}
                      </>
                    )}
                  </button>
                ))}
              </div>

              {/* Internal Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-charcoal">Internal Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add private notes about this inquiry…"
                  className="bg-brand-cream/30 border border-brand-light rounded-xl px-4 py-3 text-xs text-brand-charcoal placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold resize-none"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={updatingId === selectedInquiry.id}
                  className="self-end text-xs px-4 py-1.5 bg-brand-charcoal text-white rounded-lg hover:bg-brand-gold transition-colors disabled:opacity-60"
                >
                  {updatingId === selectedInquiry.id ? 'Saving…' : 'Save Notes'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-brand-light">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || 'Your Inquiry')}`}
                  className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
                >
                  <Mail size={14} /> Reply via Email
                </a>
                {selectedInquiry.phone && (
                  <a
                    href={`https://wa.me/94${selectedInquiry.phone.replace(/^0/, '').replace(/\s+/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
                  >
                    <Phone size={14} /> Open in WhatsApp
                  </a>
                )}
                <button
                  onClick={() => handleStatusChange(selectedInquiry.id, 'Resolved')}
                  disabled={selectedInquiry.status === 'Resolved' || updatingId === selectedInquiry.id}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 size={14} /> Mark Resolved
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-brand-light p-8 lg:col-span-2 flex items-center justify-center text-xs text-brand-charcoal/50">
              Select a message to view details
            </div>
          )}
        </div>
      )}
    </div>
  );
}
