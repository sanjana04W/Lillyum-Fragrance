import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return `LKR ${amount.toLocaleString('en-LK')}`;
}

export function generateOrderId(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randPart = Math.floor(1000 + Math.random() * 9000).toString();
  return `LF-${datePart}-${randPart}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getDiscountPercentage(price: number, salePrice: number): number {
  return Math.round(((price - salePrice) / price) * 100);
}

export function getWhatsAppLink(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  const cleaned = phone.replace(/\D/g, '');
  // Sri Lanka country code
  const withCode = cleaned.startsWith('0') ? `94${cleaned.slice(1)}` : cleaned;
  return `https://wa.me/${withCode}?text=${encoded}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
