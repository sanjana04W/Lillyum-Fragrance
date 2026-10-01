import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Lillyum Fragrance Sri Lanka',
  description: 'Terms and conditions for ordering and using Lillyum Fragrance Studio services in Sri Lanka.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-brand-cream py-12">
      <div className="container-padded max-w-4xl space-y-8">
        <div>
          <nav className="text-xs text-brand-mid mb-4 flex gap-2" aria-label="breadcrumb">
            <Link href="/" className="hover:text-brand-gold">Home</Link>
            <span>/</span>
            <span className="text-brand-charcoal font-medium">Terms of Service</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal">
            Terms of Service
          </h1>
          <p className="text-brand-mid text-sm mt-2">
            Last updated: October 2026
          </p>
        </div>

        <div className="bg-brand-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-card space-y-6 text-brand-charcoal text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-charcoal">1. Acceptance of Terms</h2>
            <p className="text-brand-mid">
              By creating an account, browsing our catalog, or placing an order with Lillyum Fragrance Studio, you agree to comply with and be bound by these Terms of Service, our Privacy Policy, and our Shipping and Returns policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-charcoal">2. Products & Authenticity</h2>
            <p className="text-brand-mid">
              All fragrances listed on Lillyum are 100% authentic, imported, and stored in optimal climate-controlled environments. Product images and packaging representations are accurate to current manufacturer editions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-charcoal">3. Orders, Pricing & Payment</h2>
            <p className="text-brand-mid">
              All prices are listed in Sri Lankan Rupees (LKR). We offer convenient Cash on Delivery (COD) island-wide across all 25 districts in Sri Lanka. Orders are confirmed via automated verification and WhatsApp/phone contact before courier dispatch.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-charcoal">4. User Accounts & Security</h2>
            <p className="text-brand-mid">
              When creating an account, you agree to provide true, accurate, and current information. You are responsible for safeguarding your login credentials. If you suspect unauthorized access to your account, please notify our team immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-charcoal">5. Delivery & Inspect-on-Delivery</h2>
            <p className="text-brand-mid">
              Parcels are delivered within 1–3 business days within the Western Province, and 2–5 business days islandwide. You are welcome to inspect outer parcel packaging prior to completing Cash on Delivery payment to our courier partner.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-charcoal">6. Contact Information</h2>
            <p className="text-brand-mid">
              For any questions regarding these terms, our customer care concierge is available daily via WhatsApp at <span className="text-brand-gold font-semibold">0752369613</span> or by email at <span className="text-brand-gold font-semibold">lillyumfragrance@gmail.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
