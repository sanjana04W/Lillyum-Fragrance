import emailjs from '@emailjs/browser';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_hlm54aa';
const TEMPLATE_CUSTOMER_ID = process.env.NEXT_PUBLIC_EMAILJS_CUSTOMER_TEMPLATE_ID || 'template_upj3bh8';
const TEMPLATE_ADMIN_ID = process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID || '';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'vbld11gI4agU3_UKh';

// Helper to send email using @emailjs/browser with REST fallback
async function sendEmailWithFallback(
  serviceId: string,
  templateId: string,
  params: Record<string, unknown>,
  publicKey: string
): Promise<void> {
  try {
    await emailjs.send(serviceId, templateId, params, publicKey);
  } catch (browserError) {
    console.warn('EmailJS browser send failed, attempting REST API fallback:', browserError);
    // Direct REST API fallback
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: params,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`EmailJS REST fallback failed (${res.status}): ${errText}`);
    }
  }
}

// Send order confirmation and verification code to customer
export async function sendOrderConfirmation(order: Order, customCode?: string): Promise<void> {
  const vCode = customCode || order.verificationCode || '';

  const itemsText = order.items
    .map(
      (item) =>
        `${item.brand} ${item.title} ${item.size}ml x${item.quantity} — ${formatPrice(
          (item.salePrice ?? item.price) * item.quantity
        )}`
    )
    .join('\n');

  const templateParams: Record<string, unknown> = {
    // Recipient identifiers (matching common EmailJS variable patterns)
    to_name: order.customer.name,
    user_name: order.customer.name,
    name: order.customer.name,
    to_email: order.customer.email,
    user_email: order.customer.email,
    email: order.customer.email,
    reply_to: order.customer.email,

    // Verification Code variables
    verification_code: vCode,
    code: vCode,
    otp: vCode,
    passcode: vCode,

    // Order Details
    order_id: order.orderId,
    order_number: order.orderId,
    items_summary: itemsText,
    subtotal: formatPrice(order.subtotal),
    delivery_fee: formatPrice(order.deliveryFee),
    total: formatPrice(order.total),
    payment_method: order.paymentMethod,
    delivery_address: `${order.customer.address}, ${order.customer.city}, ${order.customer.district}`,
    estimated_delivery: '2-5 Business Days',
    store_phone: '0752369613',
    store_whatsapp: 'https://wa.me/94752369613',
    message: vCode
      ? `Thank you for your order! Your verification code is: ${vCode}. Please keep this code handy for order confirmation.`
      : `Thank you for your order with Lillyum Fragrance Studio! Order ID: ${order.orderId}`,
  };

  await sendEmailWithFallback(SERVICE_ID, TEMPLATE_CUSTOMER_ID, templateParams, PUBLIC_KEY);
}

// Resend verification code to a customer
export async function resendOrderVerificationCode(
  orderId: string,
  toEmail: string,
  toName: string,
  verificationCode: string
): Promise<void> {
  const templateParams: Record<string, unknown> = {
    to_name: toName,
    user_name: toName,
    name: toName,
    to_email: toEmail,
    user_email: toEmail,
    email: toEmail,
    reply_to: toEmail,

    verification_code: verificationCode,
    code: verificationCode,
    otp: verificationCode,
    passcode: verificationCode,

    order_id: orderId,
    order_number: orderId,
    message: `Your verification code for order ${orderId} is: ${verificationCode}. Please enter this on the confirmation screen or provide it when our team contacts you.`,
  };

  await sendEmailWithFallback(SERVICE_ID, TEMPLATE_CUSTOMER_ID, templateParams, PUBLIC_KEY);
}

// Notify admin of new order
export async function sendAdminOrderNotification(order: Order): Promise<void> {
  if (!TEMPLATE_ADMIN_ID) return;
  const templateParams = {
    order_id: order.orderId,
    customer_name: order.customer.name,
    customer_phone: order.customer.phone,
    customer_email: order.customer.email,
    verification_code: order.verificationCode || 'N/A',
    delivery_address: `${order.customer.address}, ${order.customer.city}, ${order.customer.district}`,
    total: formatPrice(order.total),
    items_count: order.items.length,
  };

  await sendEmailWithFallback(SERVICE_ID, TEMPLATE_ADMIN_ID, templateParams, PUBLIC_KEY);
}

