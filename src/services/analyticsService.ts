'use client';

// ======================================================
// Analytics Service — Meta Pixel + TikTok Pixel abstraction
// Load pixels in layout.tsx via next/script, then call these
// ======================================================

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    ttq: {
      track: (event: string, params?: Record<string, unknown>) => void;
      page: () => void;
    };
  }
}

function fbq(...args: unknown[]) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(...args);
  }
}

function ttq(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(event, params);
  }
}

// PageView — fires on every route change
export function trackPageView() {
  fbq('track', 'PageView');
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.page();
  }
}

// ViewContent — Product Detail Page
export function trackViewContent(params: {
  productId: string;
  productName: string;
  brand: string;
  category: string;
  price: number;
  currency?: string;
}) {
  const currency = params.currency ?? 'LKR';

  fbq('track', 'ViewContent', {
    content_ids: [params.productId],
    content_name: params.productName,
    content_type: 'product',
    content_category: params.category,
    value: params.price,
    currency,
  });

  ttq('ViewContent', {
    content_id: params.productId,
    content_name: params.productName,
    content_type: 'product',
    value: params.price,
    currency,
  });
}

// AddToCart
export function trackAddToCart(params: {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  currency?: string;
}) {
  const currency = params.currency ?? 'LKR';
  const value = params.price * params.quantity;

  fbq('track', 'AddToCart', {
    content_ids: [params.productId],
    content_name: params.productName,
    content_type: 'product',
    value,
    currency,
    num_items: params.quantity,
  });

  ttq('AddToCart', {
    content_id: params.productId,
    content_name: params.productName,
    quantity: params.quantity,
    price: params.price,
    value,
    currency,
  });
}

// InitiateCheckout
export function trackInitiateCheckout(params: {
  value: number;
  numItems: number;
  currency?: string;
}) {
  const currency = params.currency ?? 'LKR';

  fbq('track', 'InitiateCheckout', {
    value: params.value,
    currency,
    num_items: params.numItems,
  });

  ttq('InitiateCheckout', {
    value: params.value,
    currency,
    num_items: params.numItems,
  });
}

// Purchase — only fires after successful COD order confirmation
export function trackPurchase(params: {
  orderId: string;
  value: number;
  numItems: number;
  currency?: string;
}) {
  const currency = params.currency ?? 'LKR';

  fbq('track', 'Purchase', {
    value: params.value,
    currency,
    num_items: params.numItems,
    order_id: params.orderId,
  });

  ttq('CompletePayment', {
    value: params.value,
    currency,
    order_id: params.orderId,
  });
}
