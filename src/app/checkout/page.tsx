'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/store/cartStore';
import { createOrder } from '@/services/firestoreService';
import { sendOrderConfirmation, sendAdminOrderNotification } from '@/services/emailService';
import { trackInitiateCheckout, trackPurchase } from '@/services/analyticsService';
import { generateOrderId, formatPrice } from '@/lib/utils';
import { getDeliveryFee as getZoneFee, ALL_DISTRICTS } from '@/lib/constants';
import { Order } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(9, 'Invalid phone number').max(12),
  address: z.string().min(5, 'Please enter your full address'),
  city: z.string().min(2, 'Please enter your city'),
  district: z.string().min(2, 'Please select your district'),
  postalCode: z.string().optional(),
  deliveryNotes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [district, setDistrict] = useState('Colombo');
  const subtotal = getSubtotal();
  const deliveryFee = getZoneFee(district);
  const total = subtotal + deliveryFee;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { district: 'Colombo' },
  });

  // Watch district change to update fee
  const watchedDistrict = watch('district');
  if (watchedDistrict && watchedDistrict !== district) setDistrict(watchedDistrict);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0) {
      router.push('/cart');
    } else {
      trackInitiateCheckout({ value: subtotal, numItems: items.length });
    }
  }, [mounted, items.length, router, subtotal]);

  if (!mounted || items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const orderId = generateOrderId();
      const orderItems = items.map((item) => ({
        productId: item.productId,
        productSlug: item.productSlug,
        title: item.title,
        brand: item.brand,
        image: item.image,
        size: item.size,
        sku: item.sku,
        price: item.price,
        salePrice: item.salePrice,
        quantity: item.quantity,
        subtotal: (item.salePrice ?? item.price) * item.quantity,
      }));

      const order: Omit<Order, 'id'> = {
        orderId,
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          district: data.district,
          postalCode: data.postalCode,
          deliveryNotes: data.deliveryNotes,
        },
        items: orderItems,
        subtotal,
        deliveryFee,
        total,
        status: 'Pending',
        paymentMethod: 'COD',
        paymentStatus: 'Pending Collection',
        paymentGatewayReference: null,
        transactionId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const firestoreId = await createOrder(order);

      // Fire Purchase pixel
      trackPurchase({ orderId, value: total, numItems: items.length });

      // Send emails (non-blocking)
      const fullOrder = { ...order, id: firestoreId };
      Promise.all([
        sendOrderConfirmation(fullOrder as Order).catch(console.error),
        sendAdminOrderNotification(fullOrder as Order).catch(console.error),
      ]);

      clearCart();
      router.push(`/order-confirmation?orderId=${orderId}&total=${total}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order. Please try again or contact us via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="container-padded py-8 sm:py-12">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal mb-2">Checkout</h1>
        <p className="text-brand-mid text-sm mb-8">Cash on Delivery — pay when your order arrives</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info */}
              <div className="bg-brand-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-card space-y-4">
                <h2 className="font-serif text-lg font-bold text-brand-charcoal">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" required error={errors.name?.message} {...register('name')} placeholder="e.g. Chamari Perera" />
                  <Input label="Phone Number" required type="tel" error={errors.phone?.message} {...register('phone')} placeholder="e.g. 0712345678" />
                </div>
                <Input label="Email Address" required type="email" error={errors.email?.message} {...register('email')} placeholder="e.g. chamari@email.com" hint="Order confirmation will be sent here" />
              </div>

              {/* Delivery Address */}
              <div className="bg-brand-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-card space-y-4">
                <h2 className="font-serif text-lg font-bold text-brand-charcoal">Delivery Address</h2>
                <Input label="Street Address" required error={errors.address?.message} {...register('address')} placeholder="House no, Street, Area" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="City / Town" required error={errors.city?.message} {...register('city')} placeholder="e.g. Colombo 07" />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-brand-charcoal">
                      District <span className="text-brand-gold">*</span>
                    </label>
                    <select
                      {...register('district')}
                      className="bg-brand-white border border-brand-light rounded-xl px-4 py-3 text-brand-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold"
                    >
                      {ALL_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {errors.district && <p className="text-red-500 text-xs">{errors.district.message}</p>}
                  </div>
                </div>
                <Input label="Postal Code" {...register('postalCode')} placeholder="Optional" />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-brand-charcoal">Delivery Notes</label>
                  <textarea
                    {...register('deliveryNotes')}
                    placeholder="Any special instructions for delivery (optional)"
                    rows={2}
                    className="bg-brand-white border border-brand-light rounded-xl px-4 py-3 text-brand-charcoal text-sm placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold resize-none"
                  />
                </div>
              </div>

              {/* Payment */}
              <div className="bg-brand-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-card">
                <h2 className="font-serif text-lg font-bold text-brand-charcoal mb-4">Payment Method</h2>
                <div className="flex items-center gap-3 bg-brand-gold-soft border border-brand-gold/30 rounded-2xl p-4">
                  <div className="w-4 h-4 rounded-full border-2 border-brand-gold bg-brand-gold shrink-0" />
                  <div>
                    <p className="text-brand-charcoal font-semibold text-sm">Cash on Delivery (COD)</p>
                    <p className="text-brand-mid text-xs">Pay with cash when your order is delivered to your doorstep</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-brand-white rounded-3xl p-6 border border-brand-light shadow-card sticky top-24">
                <h2 className="font-serif text-lg font-bold text-brand-charcoal mb-4">Order Summary</h2>
                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.sku} className="flex gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-brand-ivory border border-brand-light">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-brand-charcoal font-medium text-xs truncate">{item.title}</p>
                        <p className="text-brand-mid text-xs">{item.size}ml × {item.quantity}</p>
                        <p className="text-brand-gold font-bold text-xs">{formatPrice((item.salePrice ?? item.price) * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-brand-light pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-mid">Subtotal</span>
                    <span className="text-brand-charcoal font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-mid">Delivery ({watchedDistrict || 'Colombo'})</span>
                    <span className="text-brand-charcoal font-semibold">{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-brand-light items-baseline">
                    <span className="text-brand-charcoal">Total</span>
                    <span className="text-brand-gold font-bold text-xl">{formatPrice(total)}</span>
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  className="mt-5"
                >
                  {loading ? 'Placing Order...' : `Place Order — ${formatPrice(total)}`}
                </Button>
                <p className="text-brand-muted text-xs text-center mt-3">
                  By placing your order you agree to our{' '}
                  <Link href="/policies/returns" className="text-brand-gold hover:underline">return policy</Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

