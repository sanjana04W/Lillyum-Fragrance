'use client';

import { useState } from 'react';
import { History, Shield, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

interface LogEntry {
  id: string;
  action: string;
  user: string;
  role: string;
  details: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
}

const INITIAL_LOGS: LogEntry[] = [
  { id: '1', action: 'Order Status Update', user: 'Lillyum Admin (Owner)', role: 'Owner', details: 'Updated order LF-20260915-2398 to Dispatched', timestamp: '15 mins ago', status: 'success' },
  { id: '2', action: 'Inventory Stock Adjustment', user: 'Staff Operator', role: 'Staff', details: 'Added +5 units to Armaf Club de Nuit (ARM-CDNI-105)', timestamp: '42 mins ago', status: 'info' },
  { id: '3', action: 'Promo Code Created', user: 'Lillyum Admin (Owner)', role: 'Owner', details: 'Created voucher code AUTUMN20 (20% OFF)', timestamp: '2 hours ago', status: 'success' },
  { id: '4', action: 'Role Switched', user: 'Miky Owner', role: 'Owner', details: 'Test role simulated: Staff Operator', timestamp: '3 hours ago', status: 'info' },
  { id: '5', action: 'Low Stock Alert Triggered', user: 'System Automated', role: 'System', details: 'Rasasi La Yuqawam fell below threshold (4 units left)', timestamp: '5 hours ago', status: 'warning' },
  { id: '6', action: 'Admin Portal Login', user: 'Lillyum Admin (Owner)', role: 'Owner', details: 'Successful authentication from 192.168.1.1', timestamp: 'Today, 09:15 AM', status: 'success' },
];

export default function AuditLogsPage() {
  const [logs] = useState<LogEntry[]>(INITIAL_LOGS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-charcoal">Audit Logs</h1>
          <p className="text-brand-charcoal/50 text-xs">Security tracking and administrative event records</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw size={14} /> Refresh Logs
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-brand-light shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-light bg-brand-cream/60">
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Timestamp</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Action</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Operator</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-light">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-brand-cream/40 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-brand-charcoal/50 text-xs">{log.timestamp}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {log.status === 'success' && <CheckCircle size={14} className="text-emerald-500" />}
                      {log.status === 'warning' && <AlertCircle size={14} className="text-amber-500" />}
                      {log.status === 'info' && <Shield size={14} className="text-brand-gold" />}
                      <span className="text-brand-charcoal font-medium text-xs">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-brand-charcoal/70 text-xs">{log.user}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      log.role === 'Owner'
                        ? 'bg-brand-gold-soft text-brand-gold-dark border border-brand-gold/30'
                        : log.role === 'Staff'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {log.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-brand-charcoal/70 text-xs">{log.details}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
