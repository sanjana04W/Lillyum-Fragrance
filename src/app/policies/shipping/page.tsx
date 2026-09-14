import type { Metadata } from 'next';
import Link from 'next/link';
import { Truck, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { DELIVERY_ZONES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Lillyum Fragrance Sri Lanka',
  description: 'Learn about our shipping rates, delivery timelines across Sri Lanka, Cash on Delivery options, and courier handling at Lillyum Fragrance.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-cream py-12">
      <div className="container-padded max-w-4xl space-y-8">
        <div>
          <nav className="text-xs text-brand-mid mb-4 flex gap-2" aria-label="breadcrumb">
            <Link href="/" className="hover:text-brand-gold">Home</Link>
            <span>/</span>
            <span className="text-brand-charcoal font-medium">Shipping Policy</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal">
            Shipping & Delivery Policy
          </h1>
          <p className="text-brand-mid text-sm mt-2">
            Last updated: September 2026
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-brand-white p-5 rounded-2xl border border-brand-light shadow-card">
            <Truck className="text-brand-gold mb-2" size={24} />
            <h3 className="text-brand-charcoal font-semibold text-sm">Island-wide Coverage</h3>
            <p className="text-brand-mid text-xs mt-1">Delivering to all 25 districts in Sri Lanka with trusted courier partners.</p>
          </div>
          <div className="bg-brand-white p-5 rounded-2xl border border-brand-light shadow-card">
            <Clock className="text-brand-gold mb-2" size={24} />
            <h3 className="text-brand-charcoal font-semibold text-sm">Fast Dispatch</h3>
            <p className="text-brand-mid text-xs mt-1">Orders confirmed before 2:00 PM are packaged and dispatched on the same or next business day.</p>
          </div>
          <div className="bg-brand-white p-5 rounded-2xl border border-brand-light shadow-card">
            <ShieldCheck className="text-brand-gold mb-2" size={24} />
            <h3 className="text-brand-charcoal font-semibold text-sm">Cash on Delivery</h3>
            <p className="text-brand-mid text-xs mt-1">Inspect your parcel packaging before handing cash directly to the delivery rider.</p>
          </div>
        </div>

        <div className="bg-brand-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-card space-y-6 text-brand-charcoal text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-charcoal">1. Delivery Zones & Timelines</h2>
            <p className="text-brand-mid">
              We process and ship orders directly from Colombo. Delivery times depend on the destination district:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-brand-light rounded-xl overflow-hidden">
                <thead className="bg-brand-cream text-brand-gold-dark font-semibold">
                  <tr>
                    <th className="p-3 border-b border-brand-light">Zone / Province</th>
                    <th className="p-3 border-b border-brand-light">Estimated Delivery</th>
                    <th className="p-3 border-b border-brand-light">Standard Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light">
                  {DELIVERY_ZONES.map((zone) => (
                    <tr key={zone.id}>
                      <td className="p-3 font-medium text-brand-charcoal">{zone.name} ({zone.districts.join(', ')})</td>
                      <td className="p-3 text-brand-mid">{zone.estimatedDays}</td>
                      <td className="p-3 font-bold text-brand-gold">LKR {zone.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-charcoal">2. Free Delivery</h2>
            <p className="text-brand-mid">
              Orders with a product subtotal of <strong className="text-brand-charcoal">LKR 15,000 or more</strong> qualify for free island-wide standard shipping.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-charcoal">3. Order Tracking & Communication</h2>
            <p className="text-brand-mid">
              Once your package is picked up by our courier partner, you will receive an update via WhatsApp and/or email containing your order tracking reference. The rider will also call your provided phone number prior to delivery.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-brand-charcoal">4. Damaged or Tampered Parcels</h2>
            <p className="text-brand-mid">
              All perfume bottles are securely bubble-wrapped and packed in crush-proof packaging. If the outer package appears heavily damaged or open, please refuse the parcel or document photos before contacting our WhatsApp support team immediately at 0752369613.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

