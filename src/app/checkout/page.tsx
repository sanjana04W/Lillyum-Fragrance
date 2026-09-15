'use client';

import { useState, useEffect, useRef } from 'react';
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
import { useAuth } from '@/context/AuthContext';
import { LogIn, CheckCircle2, ShieldCheck, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
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
  const [sendingCode, setSendingCode] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [district, setDistrict] = useState('Colombo');

  // Verification step state
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const subtotal = getSubtotal();
  const deliveryFee = getZoneFee(district);
  const total = subtotal + deliveryFee;

  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { district: 'Colombo' },
  });

  const watchedDistrict = watch('district');
  if (watchedDistrict && watchedDistrict !== district) setDistrict(watchedDistrict);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('pending_checkout_form');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.name) setValue('name', parsed.name);
          if (parsed.email) setValue('email', parsed.email);
          if (parsed.phone) setValue('phone', parsed.phone);
          if (parsed.address) setValue('address', parsed.address);
          if (parsed.city) setValue('city', parsed.city);
          if (parsed.district) { setValue('district', parsed.district); setDistrict(parsed.district); }
          if (parsed.postalCode) setValue('postalCode', parsed.postalCode);
          if (parsed.deliveryNotes) setValue('deliveryNotes', parsed.deliveryNotes);
        } catch (e) { console.error(e); }
        sessionStorage.removeItem('pending_checkout_form');
      }
    }
    if (user) {
      if (user.displayName) setValue('name', user.displayName);
      if (user.email) setValue('email', user.email);
    }
  }, [user, setValue]);

  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0) {
      router.push('/cart');
    } else {
      trackInitiateCheckout({ value: subtotal, numItems: items.length });
    }
  }, [mounted, items.length, router, subtotal]);

  const startCooldown = (seconds: number) => {
    setResendCooldown(seconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (cooldownRef.current) clearInterval(cooldownRef.current); }, []);

  if (!mounted || items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  // Step 1: validate form, send verification code
  const handleConfirmOrder = async (data: FormData) => {
    if (!user) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pending_checkout_form', JSON.stringify(data));
      }
      toast('Please sign in or create an account to complete your order.', {
        icon: '🔒',
        style: { borderRadius: '12px', background: '#1C1C1E', color: '#FAF7F2', border: '1px solid #B8892A' },
      });
      router.push('/login?redirect=/checkout');
      return;
    }
    setSendingCode(true);
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(code);
      setPendingFormData(data);
      const orderId = generateOrderId();
      const orderItems = items.map((item) => ({
        productId: item.productId, productSlug: item.productSlug, title: item.title,
        brand: item.brand, image: item.image, size: item.size, sku: item.sku,
        price: item.price, salePrice: item.salePrice, quantity: item.quantity,
        subtotal: (item.salePrice ?? item.price) * item.quantity,
      }));
      const emailOrder = {
        id: 'pending', orderId,
        customer: { name: data.name, email: data.email, phone: data.phone, address: data.address, city: data.city, district: data.district },
        items: orderItems, subtotal, deliveryFee, total,
        status: 'Pending' as const, paymentMethod: 'COD' as const,
        paymentStatus: 'Pending Collection' as const, paymentGatewayReference: null, transactionId: null,
        verificationCode: code, isVerified: false,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      await sendOrderConfirmation(emailOrder as Order, code);
      setVerificationStep(true);
      startCooldown(60);
      toast.success('Verification code sent to your email!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setSendingCode(false);
    }
  };

  const handleResend = async () => {
    if (!pendingFormData || resendCooldown > 0) return;
    setSendingCode(true);
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(code);
      setEnteredCode('');
      const orderId = generateOrderId();
      const orderItems = items.map((item) => ({
        productId: item.productId, productSlug: item.productSlug, title: item.title,
        brand: item.brand, image: item.image, size: item.size, sku: item.sku,
        price: item.price, salePrice: item.salePrice, quantity: item.quantity,
        subtotal: (item.salePrice ?? item.price) * item.quantity,
      }));
      const emailOrder = {
        id: 'pending', orderId,
        customer: { name: pendingFormData.name, email: pendingFormData.email, phone: pendingFormData.phone, address: pendingFormData.address, city: pendingFormData.city, district: pendingFormData.district },
        items: orderItems, subtotal, deliveryFee, total,
        status: 'Pending' as const, paymentMethod: 'COD' as const,
        paymentStatus: 'Pending Collection' as const, paymentGatewayReference: null, transactionId: null,
        verificationCode: code, isVerified: false,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      await sendOrderConfirmation(emailOrder as Order, code);
      startCooldown(60);
      toast.success('New verification code sent!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to resend code.');
    } finally {
      setSendingCode(false);
    }
  };

  // Step 2: verify code and place order
  const handleVerifyAndPlace = async () => {
    if (!pendingFormData) return;
    if (enteredCode.trim() !== verificationCode) {
      toast.error('Incorrect verification code. Please check your email and try again.');
      return;
    }
    await executePlaceOrder(true, 'Verified via email code');
  };

  // Fallback for "Didn't get code? Complete Order"
  const handleFallbackCompleteOrder = async () => {
    if (!pendingFormData) return;
    await executePlaceOrder(false, 'Manual phone verification requested (fallback)');
  };

  const executePlaceOrder = async (isVerified: boolean, note?: string) => {
    if (!pendingFormData) return;
    setPlacingOrder(true);
    try {
      const orderId = generateOrderId();
      const orderItems = items.map((item) => ({
        productId: item.productId, productSlug: item.productSlug, title: item.title,
        brand: item.brand, image: item.image, size: item.size, sku: item.sku,
        price: item.price, salePrice: item.salePrice, quantity: item.quantity,
        subtotal: (item.salePrice ?? item.price) * item.quantity,
      }));
      const order: Omit<Order, 'id'> = {
        orderId,
        customer: {
          name: pendingFormData.name, email: pendingFormData.email, phone: pendingFormData.phone,
          address: pendingFormData.address, city: pendingFormData.city, district: pendingFormData.district,
          postalCode: pendingFormData.postalCode, deliveryNotes: pendingFormData.deliveryNotes,
        },
        items: orderItems, subtotal, deliveryFee, total,
        status: 'Pending', paymentMethod: 'COD', paymentStatus: 'Pending Collection',
        paymentGatewayReference: null, transactionId: null,
        verificationCode,
        isVerified,
        internalNotes: note,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      const firestoreId = await createOrder(order);
      trackPurchase({ orderId, value: total, numItems: items.length });
      sendAdminOrderNotification({ ...order, id: firestoreId } as Order).catch(console.error);
      clearCart();
      const params = new URLSearchParams({
        orderId, total: String(total),
        email: pendingFormData.email, name: pendingFormData.name,
        district: pendingFormData.district, address: pendingFormData.address,
        city: pendingFormData.city, phone: pendingFormData.phone,
      });
      router.push(`/order-confirmation?${params.toString()}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order. Please try again or contact us via WhatsApp.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="container-padded py-8 sm:py-12">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal mb-2">Checkout</h1>
        <p className="text-brand-mid text-sm mb-8">Cash on Delivery — pay when your order arrives</p>

        <form onSubmit={handleSubmit(handleConfirmOrder)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">

              {/* Contact Information */}
              <div className="bg-brand-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-card space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="font-serif text-lg font-bold text-brand-charcoal">Contact Information</h2>
                  {user ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                      <CheckCircle2 size={13} /> Signed in as {user.email}
                    </span>
                  ) : (
                    <Link href="/login?redirect=/checkout" className="text-xs text-brand-gold font-semibold hover:underline flex items-center gap-1">
                      <LogIn size={12} /> Have an account? Sign In
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" required error={errors.name?.message} {...register('name')} placeholder="e.g. Chamari Perera" disabled={verificationStep} />
                  <Input label="Phone Number" required type="tel" error={errors.phone?.message} {...register('phone')} placeholder="e.g. 0712345678" disabled={verificationStep} />
                </div>
                <Input label="Email Address" required type="email" error={errors.email?.message} {...register('email')} placeholder="e.g. chamari@email.com" hint="Verification code will be sent here" disabled={verificationStep} />
              </div>

              {/* Delivery Address */}
              <div className="bg-brand-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-card space-y-4">
                <h2 className="font-serif text-lg font-bold text-brand-charcoal">Delivery Address</h2>
                <Input label="Street Address" required error={errors.address?.message} {...register('address')} placeholder="House no, Street, Area" disabled={verificationStep} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="City / Town" required error={errors.city?.message} {...register('city')} placeholder="e.g. Colombo 07" disabled={verificationStep} />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-brand-charcoal">District <span className="text-brand-gold">*</span></label>
                    <select {...register('district')} disabled={verificationStep}
                      className="bg-brand-white border border-brand-light rounded-xl px-4 py-3 text-brand-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold disabled:opacity-60">
                      {ALL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.district && <p className="text-red-500 text-xs">{errors.district.message}</p>}
                  </div>
                </div>
                <Input label="Postal Code" {...register('postalCode')} placeholder="Optional" disabled={verificationStep} />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-brand-charcoal">Delivery Notes</label>
                  <textarea {...register('deliveryNotes')} disabled={verificationStep} placeholder="Any special instructions (optional)" rows={2}
                    className="bg-brand-white border border-brand-light rounded-xl px-4 py-3 text-brand-charcoal text-sm placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold resize-none disabled:opacity-60" />
                </div>
              </div>

              {/* Payment Method */}
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

              {/* ── Email Verification Box (Matches Reference Images 3 & 4) ── */}
              {verificationStep && (
                <div className="bg-brand-white rounded-3xl p-6 sm:p-8 border-2 border-brand-gold/40 shadow-gold animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-gold-soft border border-brand-gold/30 flex items-center justify-center shrink-0">
                      <ShieldCheck size={20} className="text-brand-gold" />
                    </div>
                    <div>
                      <h2 className="font-serif text-lg font-bold text-brand-charcoal">Email Verification</h2>
                      <p className="text-brand-mid text-xs">Confirm your email to complete the order</p>
                    </div>
                  </div>

                  <p className="text-sm text-brand-dark mb-4">
                    We&apos;ve sent a 6-digit verification code to{' '}
                    <strong className="text-brand-charcoal font-bold">{pendingFormData?.email}</strong>.
                    Please enter it below to confirm your order.
                  </p>

                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-5">
                    <CheckCircle2 size={17} className="text-emerald-600 shrink-0" />
                    <p className="text-sm text-emerald-700 font-medium">
                      Verification code sent to {pendingFormData?.email}!
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={enteredCode}
                      onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit code"
                      className="flex-1 bg-brand-cream border-2 border-brand-gold/40 focus:border-brand-gold rounded-xl px-4 py-3.5 text-brand-charcoal text-xl font-mono tracking-[0.3em] text-center focus:outline-none shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyAndPlace}
                      disabled={enteredCode.length !== 6 || placingOrder}
                      className="sm:w-auto px-6 py-3.5 bg-brand-charcoal hover:bg-black text-brand-white disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-card"
                    >
                      {placingOrder ? (
                        <><Loader2 size={16} className="animate-spin" /> Placing Order...</>
                      ) : (
                        <><CheckCircle2 size={16} className="text-brand-gold" /> Verify &amp; Confirm Order</>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs flex-wrap pt-1 text-brand-mid">
                    <button
                      type="button"
                      onClick={() => { setVerificationStep(false); setEnteredCode(''); }}
                      className="text-brand-gold hover:underline font-semibold"
                    >
                      Change Email or Details
                    </button>
                    <span>•</span>
                    {resendCooldown > 0 ? (
                      <span className="text-brand-mid">Resend in {resendCooldown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={sendingCode}
                        className="text-brand-mid hover:text-brand-gold flex items-center gap-1 disabled:opacity-50 font-medium"
                      >
                        <RefreshCw size={11} /> Resend Code
                      </button>
                    )}
                    <span>•</span>
                    <button
                      type="button"
                      onClick={handleFallbackCompleteOrder}
                      disabled={placingOrder}
                      className="text-brand-mid hover:text-brand-charcoal underline"
                    >
                      Didn&apos;t get code? Complete Order
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-brand-white rounded-3xl p-6 border border-brand-light shadow-card sticky top-24">
                <h2 className="font-serif text-lg font-bold text-brand-charcoal mb-4">
                  Order Summary ({items.length})
                </h2>

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
                    <span className="text-brand-charcoal">Total Amount (COD)</span>
                    <span className="text-brand-gold font-bold text-xl">{formatPrice(total)}</span>
                  </div>
                </div>

                {!verificationStep ? (
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={sendingCode}
                    className="mt-5 flex items-center justify-center gap-2 shadow-gold"
                  >
                    {sendingCode ? 'Sending Verification Code...' : (
                      <>
                        <CheckCircle2 size={18} />
                        Confirm Order (Cash on Delivery)
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="mt-5 bg-brand-gold-soft border border-brand-gold/40 rounded-2xl px-4 py-3 text-center">
                    <p className="text-brand-gold font-semibold text-xs flex items-center justify-center gap-1.5">
                      <ShieldCheck size={16} /> Enter the 6-digit code to place order
                    </p>
                  </div>
                )}

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
