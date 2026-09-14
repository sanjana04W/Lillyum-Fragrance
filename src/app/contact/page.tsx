'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { STORE_PHONE, STORE_EMAIL, STORE_ADDRESS, SOCIAL_LINKS, WHATSAPP_NUMBER } from '@/lib/constants';
import { getWhatsAppLink } from '@/lib/utils';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const waLink = getWhatsAppLink(
    WHATSAPP_NUMBER,
    'Hi Lillyum Fragrance! I have an inquiry.'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...form,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success('Message sent! We\'ll get back to you within 24 hours.', { style: { background: '#FAF7F2', color: '#1C1C1E' } });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send. Please try WhatsApp instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-white border-b border-brand-light py-12">
        <div className="container-padded text-center">
          <p className="text-brand-gold text-xs uppercase tracking-widest font-semibold mb-2">Get in Touch</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal mb-2">Contact Us</h1>
          <p className="text-brand-mid text-sm">We're here to help — reach out anytime</p>
        </div>
      </div>

      <div className="container-padded py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-brand-charcoal">Connect With Us</h2>
            <p className="text-brand-mid text-sm leading-relaxed">
              Have a question about a fragrance, your order, or anything else? We're happy to help. The fastest way to reach us is via WhatsApp.
            </p>

            <div className="space-y-4">
              {[
                { icon: Phone, label: 'Phone / WhatsApp', value: STORE_PHONE, href: `tel:${STORE_PHONE}` },
                { icon: Mail, label: 'Email', value: STORE_EMAIL, href: `mailto:${STORE_EMAIL}` },
                { icon: MapPin, label: 'Location', value: STORE_ADDRESS, href: undefined },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 bg-brand-white rounded-2xl p-5 border border-brand-light shadow-card">
                  <div className="w-11 h-11 rounded-2xl bg-brand-gold-soft flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-brand-mid text-xs">{label}</p>
                    {href ? (
                      <a href={href} className="text-brand-charcoal font-medium text-sm hover:text-brand-gold transition-colors">{value}</a>
                    ) : (
                      <p className="text-brand-charcoal font-medium text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="primary" size="lg" fullWidth>
                <MessageCircle size={18} /> Chat on WhatsApp — Fastest Response
              </Button>
            </a>

            {/* Social links */}
            <div className="flex gap-4 pt-2">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-mid text-sm hover:text-brand-gold transition-colors">
                <Facebook size={16} /> Facebook
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-mid text-sm hover:text-brand-gold transition-colors">
                <Instagram size={16} /> Instagram
              </a>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="bg-brand-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-card">
            <h2 className="font-serif text-xl font-bold text-brand-charcoal mb-5">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                <Input label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Optional" />
              </div>
              <Input label="Email Address" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
              <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Order inquiry, Product question" />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-brand-charcoal">Message <span className="text-brand-gold">*</span></label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="bg-brand-white border border-brand-light rounded-xl px-4 py-3 text-brand-charcoal text-sm placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold resize-none"
                />
              </div>
              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
