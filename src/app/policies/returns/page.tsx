import type { Metadata } from 'next';
import Link from 'next/link';
import { RefreshCw, CheckCircle2, AlertOctagon } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Return & Exchange Policy | Lillyum Fragrance Sri Lanka',
  description: 'Understand the return, replacement, and exchange guidelines for fragrances purchased at Lillyum Fragrance.',
};

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-charcoal py-12">
      <div className="container-padded max-w-4xl space-y-8">
        <div>
          <nav className="text-xs text-brand-muted mb-4 flex gap-2" aria-label="breadcrumb">
            <Link href="/" className="hover:text-brand-gold">Home</Link>
            <span>/</span>
            <span className="text-brand-light">Return Policy</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-white">
            Return & Exchange Policy
          </h1>
          <p className="text-brand-muted text-sm mt-2">
            Last updated: September 2026
          </p>
        </div>

        <div className="bg-brand-charcoal rounded-xl p-6 sm:p-8 border border-brand-mid/20 space-y-6 text-brand-light text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-white flex items-center gap-2">
              <CheckCircle2 className="text-brand-gold" size={20} />
              1. Eligibility for Returns & Replacements
            </h2>
            <p className="text-brand-muted">
              Due to the hygiene and personal care nature of luxury perfumes, we can only accept returns or provide replacements under the following strict conditions within <strong className="text-brand-white">48 hours of delivery</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1 text-brand-muted pl-2">
              <li>The item received is damaged, leaking, or has a defective atomiser/sprayer.</li>
              <li>An incorrect product, size, or concentration was dispatched by our warehouse.</li>
              <li>The box remains completely unopened with the manufacturer's cellophane/seal intact (if applicable).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-white flex items-center gap-2">
              <AlertOctagon className="text-red-400" size={20} />
              2. Non-Returnable Items
            </h2>
            <p className="text-brand-muted">
              We cannot offer refunds or exchanges if:
            </p>
            <ul className="list-disc list-inside space-y-1 text-brand-muted pl-2">
              <li>The bottle has been sprayed, used, or removed from its protective packaging.</li>
              <li>You do not like the olfactory scent profile (we encourage researching fragrance notes or contacting us on WhatsApp for personal recommendations prior to ordering).</li>
              <li>More than 48 hours have elapsed since delivery confirmation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-white flex items-center gap-2">
              <RefreshCw className="text-brand-gold" size={20} />
              3. How to Request an Exchange
            </h2>
            <p className="text-brand-muted">
              1. Capture clear photos or a short unboxing video highlighting the issue (damage, batch code, wrong item).<br />
              2. Contact our customer service team on WhatsApp at <strong className="text-brand-gold">0752369613</strong> with your Order Reference Number (e.g. LF-2026...).<br />
              3. Our team will verify the details within 24 hours and arrange a courier pickup or replacement package.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

