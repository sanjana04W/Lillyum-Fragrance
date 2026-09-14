import { Suspense } from 'react';
import OrderConfirmationContent from './OrderConfirmationContent';

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-cream flex items-center justify-center"><p className="text-brand-mid">Loading...</p></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

