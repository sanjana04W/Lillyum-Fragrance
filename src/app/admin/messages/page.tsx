'use client';

import { useState } from 'react';
import { MessageSquare, Mail, Phone, Clock, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  sender: string;
  email: string;
  phone: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

const DEFAULT_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    sender: 'H.M. Wenuri Sanjana',
    email: 'wenuri@example.com',
    phone: '0771234567',
    subject: 'Order delivery inquiry for Colombo 07',
    content: 'Hello, I placed order LF-20260915-2398 this morning. Could you confirm if delivery will take place before Friday?',
    timestamp: '25 mins ago',
    isRead: false,
  },
  {
    id: 'msg-2',
    sender: 'Dilan Jayasinghe',
    email: 'dilan.j@gmail.com',
    phone: '0719876543',
    subject: 'Stock availability for Khamrah EDP',
    content: 'Hi! When will Lattafa Khamrah 100ml be back in large batch? Looking to buy 3 bottles as gifts.',
    timestamp: '2 hours ago',
    isRead: false,
  },
  {
    id: 'msg-3',
    sender: 'Shamila Perera',
    email: 'shamila@hotmail.com',
    phone: '0754321098',
    subject: 'Gift Wrapping Request',
    content: 'Could you please include a handwritten note and gold gift bag for my order? Thank you so much!',
    timestamp: 'Yesterday',
    isRead: true,
  },
];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(DEFAULT_MESSAGES);
  const [selectedId, setSelectedId] = useState<string>(messages[0]?.id);

  const selectedMessage = messages.find((m) => m.id === selectedId);

  const markAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
    toast.success('Message marked as read');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-charcoal">Messages & Inquiries</h1>
          <p className="text-brand-charcoal/50 text-xs">Customer inquiries from contact forms and WhatsApp requests</p>
        </div>
        <span className="text-xs bg-brand-gold-soft border border-brand-gold/30 text-brand-gold-dark px-3 py-1 rounded-full font-semibold">
          {messages.filter((m) => !m.isRead).length} Unread Messages
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Messages List */}
        <div className="bg-white rounded-2xl border border-brand-light shadow-soft overflow-hidden divide-y divide-brand-light lg:col-span-1 h-[540px] overflow-y-auto">
          {messages.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedId(m.id);
                if (!m.isRead) markAsRead(m.id);
              }}
              className={`w-full text-left p-4 transition-colors block ${
                selectedId === m.id ? 'bg-brand-cream/80' : 'hover:bg-brand-cream/30'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className={`text-xs font-semibold ${!m.isRead ? 'text-brand-charcoal' : 'text-brand-charcoal/70'}`}>
                  {m.sender}
                </span>
                <span className="text-[10px] text-brand-charcoal/40">{m.timestamp}</span>
              </div>
              <p className="text-xs font-medium text-brand-gold truncate">{m.subject}</p>
              <p className="text-[11px] text-brand-charcoal/60 truncate mt-1">{m.content}</p>
            </button>
          ))}
        </div>

        {/* Selected Message Detail */}
        {selectedMessage ? (
          <div className="bg-white rounded-2xl border border-brand-light shadow-soft p-6 lg:col-span-2 space-y-5">
            <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-brand-light">
              <div>
                <h2 className="text-lg font-bold text-brand-charcoal">{selectedMessage.subject}</h2>
                <div className="flex items-center gap-3 mt-1 text-xs text-brand-charcoal/60">
                  <span>From: <strong className="text-brand-charcoal">{selectedMessage.sender}</strong></span>
                  <span>•</span>
                  <span>{selectedMessage.email}</span>
                  <span>•</span>
                  <span>{selectedMessage.phone}</span>
                </div>
              </div>
              <span className="text-xs text-brand-charcoal/40 flex items-center gap-1">
                <Clock size={12} /> {selectedMessage.timestamp}
              </span>
            </div>

            <div className="bg-brand-cream/50 rounded-xl p-4 text-xs text-brand-charcoal leading-relaxed whitespace-pre-wrap">
              {selectedMessage.content}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                <Mail size={14} /> Reply via Email
              </a>
              <a
                href={`https://wa.me/94${selectedMessage.phone.replace(/^0/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                <Phone size={14} /> Open in WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-brand-light p-8 lg:col-span-2 text-center text-xs text-brand-charcoal/50">
            Select a message to read details
          </div>
        )}
      </div>
    </div>
  );
}
