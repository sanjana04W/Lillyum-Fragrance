import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Lillyum Fragrance Sri Lanka',
  description: 'How Lillyum Fragrance collects, protects, and handles your personal information and order details.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-cream py-12">
      <div className="container-padded max-w-4xl space-y-8">
        <div>
          <nav className="text-xs text-brand-mid mb-4 flex gap-2" aria-label="breadcrumb">
            <Link href="/" className="hover:text-brand-gold">Home</Link>
            <span>/</span>
            <span className="text-brand-charcoal font-medium">Privacy Policy</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal">
            Privacy Policy
          </h1>
          <p className="text-brand-mid text-sm mt-2">
            Last updated: September 2026
          </p>
        </div>

        <div className="bg-brand-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-card space-y-6 text-brand-charcoal text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-charcoal">1. Information We Collect</h2>
            <p className="text-brand-mid">
              When you browse our storefront or place a Cash on Delivery order, we collect essential details to fulfill your delivery:
            </p>
            <ul className="list-disc list-inside space-y-1 text-brand-mid pl-2">
              <li>Full Name and contact phone number (for courier riders to contact you).</li>
              <li>Delivery address, district, and postal code.</li>
              <li>Email address (for automatic order confirmation receipts).</li>
              <li>Device and browser analytics via Meta Pixel, TikTok Pixel, and Google Analytics to improve website browsing experience.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-charcoal">2. How We Use Your Data</h2>
            <p className="text-brand-mid">
              Your details are exclusively used to fulfill your fragrance order, communicate dispatch tracking, and provide customer support via WhatsApp or email. We will never sell, rent, or trade your personal information to third-party marketing companies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-charcoal">3. Third-Party Services & Couriers</h2>
            <p className="text-brand-mid">
              Your recipient details (name, phone, address) are securely shared with our registered courier partners in Sri Lanka strictly for the purpose of island-wide parcel delivery and Cash on Delivery payment collection.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-charcoal">4. Contact Us Regarding Your Data</h2>
            <p className="text-brand-mid">
              If you wish to update or delete your profile information from our database, please message us at <span className="text-brand-gold font-semibold">lillyumfragrance@gmail.com</span> or via WhatsApp at <span className="text-brand-gold font-semibold">0752369613</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

