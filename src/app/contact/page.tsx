'use client';

import { useState, useRef } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { STORE_PHONE, STORE_EMAIL, STORE_ADDRESS, SOCIAL_LINKS, WHATSAPP_NUMBER } from '@/lib/constants';
import { getWhatsAppLink } from '@/lib/utils';
import { createInquiry } from '@/services/firestoreService';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', email: '', phone: '', subject: '', message: '' };

function validateForm(form: typeof EMPTY_FORM) {
  const errors: Partial<typeof EMPTY_FORM> = {};
  if (!form.name.trim()) errors.name = 'Full name is required.';
  if (!form.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!form.message.trim()) {
    errors.message = 'Message is required.';
  } else if (form.message.trim().length < 3) {
    errors.message = 'Please enter at least 3 characters.';
  }
  return errors;
}

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Ref-based submission lock to prevent duplicate submissions
  const submittingRef = useRef(false);

  const waLink = getWhatsAppLink(WHATSAPP_NUMBER, 'Hi Lillyum Fragrance! I have an inquiry.');

  const handleChange = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Duplicate submission guard
    if (submittingRef.current || loading) return;

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (validationErrors.name) toast.error(validationErrors.name);
      else if (validationErrors.email) toast.error(validationErrors.email);
      else if (validationErrors.message) toast.error(validationErrors.message);
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    setErrors({});

    try {
      await createInquiry({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || undefined,
        subject: form.subject.trim() || 'General Inquiry',
        message: form.message.trim(),
        status: 'New',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setSubmitted(true);
      setForm(EMPTY_FORM);
      toast.success("Message sent! We'll get back to you within 24 hours.", {
        duration: 5000,
        style: { background: '#FAF7F2', color: '#1C1C1E' },
      });
    } catch (err) {
      console.error('Contact form error:', err);
      toast.error('Failed to send message. Please try WhatsApp instead.');
    } finally {
      setLoading(false);
      submittingRef.current = false;
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
              Have a question about a fragrance, your order, or anything else? We're happy to help. The fastest way to
              reach us is via WhatsApp.
            </p>

            <div className="space-y-4">
              {[
                { icon: Phone, label: 'Phone / WhatsApp', value: STORE_PHONE, href: `tel:${STORE_PHONE}` },
                { icon: Mail, label: 'Email', value: STORE_EMAIL, href: `mailto:${STORE_EMAIL}` },
                { icon: MapPin, label: 'Location', value: STORE_ADDRESS, href: undefined },
              ].map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 bg-brand-white rounded-2xl p-5 border border-brand-light shadow-card"
                >
                  <div className="w-11 h-11 rounded-2xl bg-brand-gold-soft flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-brand-mid text-xs">{label}</p>
                    {href ? (
                      <a href={href} className="text-brand-charcoal font-medium text-sm hover:text-brand-gold transition-colors">
                        {value}
                      </a>
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
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-mid text-sm hover:text-brand-gold transition-colors"
              >
                <Facebook size={16} /> Facebook
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-mid text-sm hover:text-brand-gold transition-colors"
              >
                <Instagram size={16} /> Instagram
              </a>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="bg-brand-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-card">
            <h2 className="font-serif text-xl font-bold text-brand-charcoal mb-5">Send us a Message</h2>

            {/* Success State */}
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle size={36} className="text-green-500" />
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-charcoal">Message Sent!</h3>
                <p className="text-brand-mid text-sm max-w-xs leading-relaxed">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-sm text-brand-gold underline underline-offset-2 hover:text-brand-gold-dark transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1">
                    <Input
                      label="Full Name"
                      required
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name}</p>}
                  </div>
                  {/* Phone */}
                  <div className="flex flex-col gap-1">
                    <Input
                      label="Phone Number"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <Input
                    label="Email Address"
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-1">
                  <Input
                    label="Subject"
                    value={form.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    placeholder="e.g. Order inquiry, Product question"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-brand-charcoal">
                    Message <span className="text-brand-gold">*</span>
                  </label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className={`bg-brand-white border rounded-xl px-4 py-3 text-brand-charcoal text-sm placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold resize-none transition-colors ${
                      errors.message ? 'border-red-400' : 'border-brand-light'
                    }`}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-0.5">{errors.message}</p>}
                </div>

                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Google Maps Section */}
      <div className="border-t border-brand-light bg-brand-white">
        <div className="container-padded py-10">
          <div className="text-center mb-6">
            <p className="text-brand-gold text-xs uppercase tracking-widest font-semibold mb-1">Find Us</p>
            <h2 className="font-serif text-2xl font-bold text-brand-charcoal">Our Location</h2>
            <p className="text-brand-mid text-sm mt-1">Colombo 01200, Sri Lanka</p>
          </div>

          <div className="rounded-3xl overflow-hidden border border-brand-light shadow-card" style={{ height: '420px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63372.12795924673!2d79.82119965820313!3d6.921837799999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259251b57c025%3A0x78fed1f46eca1b19!2sColombo%2001200%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1694000000000!5m2!1sen!2slk"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'sepia(20%) saturate(80%) brightness(1.05)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lillyum Fragrance Studio — Colombo, Sri Lanka"
            />
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            <MapPin size={14} className="text-brand-gold" />
            <a
              href="https://maps.google.com/?q=Colombo+01200+Sri+Lanka"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-mid text-xs hover:text-brand-gold transition-colors underline underline-offset-2"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
