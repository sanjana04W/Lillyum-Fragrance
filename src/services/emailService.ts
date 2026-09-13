import emailjs from '@emailjs/browser';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
const TEMPLATE_CUSTOMER_ID = process.env.NEXT_PUBLIC_EMAILJS_CUSTOMER_TEMPLATE_ID ?? '';
const TEMPLATE_ADMIN_ID = process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID ?? '';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '';

// Send order confirmation to customer
export async function sendOrderConfirmation(order: Order): Promise<void> {
  const itemsText = order.items
    .map(
      (item) =>
        `${item.brand} ${item.title} ${item.size}ml x${item.quantity} — ${formatPrice(
          (item.salePrice ?? item.price) * item.quantity
        )}`
    )
    .join('\n');

  const templateParams = {
    to_name: order.customer.name,
    to_email: order.customer.email,
    order_id: order.orderId,
    items_summary: itemsText,
    subtotal: formatPrice(order.subtotal),
    delivery_fee: formatPrice(order.deliveryFee),
    total: formatPrice(order.total),
    payment_method: order.paymentMethod,
    delivery_address: `${order.customer.address}, ${order.customer.city}, ${order.customer.district}`,
    estimated_delivery: '2-5 Business Days',
    store_phone: '0752369613',
    store_whatsapp: 'https://wa.me/94752369613',
  };

  await emailjs.send(SERVICE_ID, TEMPLATE_CUSTOMER_ID, templateParams, PUBLIC_KEY);
}

// Notify admin of new order
export async function sendAdminOrderNotification(order: Order): Promise<void> {
  const templateParams = {
    order_id: order.orderId,
    customer_name: order.customer.name,
    customer_phone: order.customer.phone,
    customer_email: order.customer.email,
    delivery_address: `${order.customer.address}, ${order.customer.city}, ${order.customer.district}`,
    total: formatPrice(order.total),
    items_count: order.items.length,
  };

  await emailjs.send(SERVICE_ID, TEMPLATE_ADMIN_ID, templateParams, PUBLIC_KEY);
}
