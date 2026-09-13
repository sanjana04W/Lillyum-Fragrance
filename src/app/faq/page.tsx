import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle, ChevronRight, MessageCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { getWhatsAppLink } from '@/lib/utils';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | Lillyum Fragrance Sri Lanka',
  description: 'Answers to common questions about buying perfumes online in Sri Lanka, Cash on Delivery, authenticity verification, and delivery times.',
};

const FAQS = [
  {
    q: 'Are all your perfumes 100% original and authentic?',
    a: 'Yes, absolutely. We source all our fragrances directly from certified distributors in Dubai and Europe. Every bottle comes in original manufacturer packaging with matching batch codes that you can verify online.'
  },
  {
    q: 'How does Cash on Delivery (COD) work?',
    a: 'You place your order through our website without needing a credit card or bank transfer upfront. Once our courier delivers the package to your address, you pay the rider the exact total amount in cash.'
  },
  {
    q: 'How long will it take for my order to arrive?',
    a: 'Deliveries within Colombo and Greater Western Province generally take 1–2 business days. For outstation areas (Kandy, Galle, Kurunegala, Jaffna, etc.), delivery typically takes 2–4 business days.'
  },
  {
    q: 'Can I test or open the bottle before paying the delivery rider?',
    a: 'Couriers do not allow opening the manufacturer sealed perfume box prior to payment collection due to security policies. However, if there is any issue with leakage or wrong item upon opening, you are fully covered under our 48-hour replacement policy.'
  },
  {
    q: 'What is the difference between EDT, EDP, and Extrait de Parfum?',
    a: 'It refers to the oil concentration. Eau de Toilette (EDT) has 5–15% oil and lasts 4–6 hours (great for daytime/office). Eau de Parfum (EDP) has 15–20% oil and lasts 8–10 hours. Extrait de Parfum has 20–40% oil and provides exceptional 12+ hours longevity and projection.'
  },
  {
    q: 'Can I place an order or ask for recommendations via WhatsApp?',
    a: 'Yes! If you are unsure which fragrance suits you best, or prefer assistance placing an order, our fragrance consultants are available on WhatsApp at 0752369613.'
  }
];

export default function FAQPage() {
  const waLink = getWhatsAppLink(WHATSAPP_NUMBER, 'Hi Lillyum Fragrance! I have a question before placing an order.');

  return (
    <div className="min-h-screen bg-brand-charcoal py-12">
      <div className="container-padded max-w-4xl space-y-8">
        <div>
          <nav className="text-xs text-brand-muted mb-4 flex gap-2" aria-label="breadcrumb">
            <Link href="/" className="hover:text-brand-gold">Home</Link>
            <span>/</span>
            <span className="text-brand-light">FAQ</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-white">
            Frequently Asked Questions
          </h1>
          <p className="text-brand-muted text-sm mt-2">
            Find answers to common questions about ordering, authenticity, and deliveries.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-brand-charcoal rounded-xl p-5 border border-brand-mid/20 space-y-2">
              <h2 className="font-serif text-base font-bold text-brand-white flex items-start gap-2">
                <HelpCircle size={18} className="text-brand-gold shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h2>
              <p className="text-brand-muted text-sm leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-brand-charcoal rounded-2xl p-6 sm:p-8 border border-brand-gold/20 text-center space-y-4">
          <h2 className="font-serif text-xl font-bold text-brand-white">
            Still have questions?
          </h2>
          <p className="text-brand-muted text-sm max-w-md mx-auto">
            Our team is ready to answer your questions and help you discover the perfect perfume.
          </p>
          <div className="flex justify-center gap-4">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="md">
                <MessageCircle size={16} /> Chat on WhatsApp
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" size="md">
                Contact Form
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

