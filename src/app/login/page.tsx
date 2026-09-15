'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginCustomer, loginCustomerWithGoogle } from '@/services/customerAuthService';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res = await loginCustomer(form.email, form.password);
      if (res.success) {
        toast.success('Welcome back!', { style: { background: '#FAF7F2', color: '#1C1C1E' } });
        router.push(redirectUrl);
      } else {
        toast.error(res.error || 'Invalid email or password.');
      }
    } catch {
      toast.error('Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const res = await loginCustomerWithGoogle();
      if (res.success) {
        toast.success('Signed in with Google!', { style: { background: '#FAF7F2', color: '#1C1C1E' } });
        router.push(redirectUrl);
      } else {
        toast.error(res.error || 'Google sign-in failed.');
      }
    } catch {
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) { toast.error('Enter your email address first.'); return; }
    try {
      await sendPasswordResetEmail(auth, form.email);
      setResetSent(true);
      toast.success('Password reset email sent!', { style: { background: '#FAF7F2', color: '#1C1C1E' } });
    } catch {
      toast.error('Could not send reset email. Check the address and try again.');
    }
  };

  const registerLink = redirectUrl !== '/' ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : '/register';

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col justify-between bg-brand-charcoal overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/about_brand_heritage.jpg" alt="Lillyum Fragrance" fill className="object-cover opacity-40" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal/80 via-brand-charcoal/50 to-transparent" />
        </div>
        <div className="relative z-10 p-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-brand-gold/30 group-hover:ring-brand-gold/60 transition-all">
              <Image src="/logo.jpg" alt="Lillyum" fill className="object-cover" />
            </div>
            <div className="leading-tight">
              <p className="font-serif text-lg font-bold text-white tracking-wide">LILLYUM</p>
              <p className="text-[10px] text-brand-gold-lighter uppercase tracking-[0.2em] -mt-0.5">Fragrance Studio</p>
            </div>
          </Link>
        </div>
        <div className="relative z-10 p-10">
          <blockquote className="font-serif text-2xl xl:text-3xl text-white leading-snug mb-4">
            "Wear your story.<br /><span className="text-brand-gold">Leave an impression.</span>"
          </blockquote>
          <p className="text-brand-gold-lighter text-sm">— Lillyum Fragrance Studio, Colombo</p>
          <div className="mt-8 flex gap-2">
            <span className="w-8 h-0.5 bg-brand-gold rounded-full" />
            <span className="w-2 h-0.5 bg-brand-gold/40 rounded-full" />
            <span className="w-2 h-0.5 bg-brand-gold/20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col bg-brand-cream">
        <div className="lg:hidden flex items-center gap-3 p-6 bg-brand-white border-b border-brand-light">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-brand-gold/30">
              <Image src="/logo.jpg" alt="Lillyum" fill className="object-cover" />
            </div>
            <p className="font-serif text-base font-bold text-brand-charcoal tracking-wide">LILLYUM</p>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-brand-gold text-xs uppercase tracking-widest font-semibold mb-2">Welcome back</p>
              <h1 className="font-serif text-3xl font-bold text-brand-charcoal mb-1">Sign In</h1>
              <p className="text-brand-mid text-sm">
                {"Don't have an account? "}
                <Link href={registerLink} className="text-brand-gold font-semibold hover:text-brand-gold-dark transition-colors underline underline-offset-2">Create one</Link>
              </p>
            </div>

            {/* Google */}
            <button onClick={handleGoogle} disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 bg-brand-white border border-brand-light rounded-xl py-3 px-4 text-sm font-medium text-brand-charcoal hover:border-brand-gold hover:bg-brand-gold-soft transition-all duration-200 shadow-soft mb-6 disabled:opacity-50 disabled:cursor-not-allowed">
              {googleLoading ? <Loader2 size={16} className="animate-spin" /> : (
                <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              Continue with Google
            </button>

            <div className="relative flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-brand-light" />
              <span className="text-brand-muted text-xs font-medium">or sign in with email</span>
              <div className="flex-1 h-px bg-brand-light" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-brand-charcoal">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-brand-white border border-brand-light rounded-xl text-sm text-brand-charcoal placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-colors" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-brand-charcoal">Password</label>
                  <button type="button" onClick={handleForgotPassword} className="text-xs text-brand-gold hover:text-brand-gold-dark font-medium transition-colors">
                    {resetSent ? '✓ Email sent' : 'Forgot password?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                  <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Your password"
                    className="w-full pl-10 pr-11 py-3 bg-brand-white border border-brand-light rounded-xl text-sm text-brand-charcoal placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-gold transition-colors">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading || googleLoading}
                className="w-full flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 shadow-gold mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Sign In</span><ArrowRight size={15} /></>}
              </button>
            </form>

            <p className="text-center text-brand-muted text-xs mt-8">
              By signing in, you agree to our{' '}
              <Link href="/policies/terms" className="underline hover:text-brand-gold transition-colors">Terms</Link>
              {' '}and{' '}
              <Link href="/policies/privacy" className="underline hover:text-brand-gold transition-colors">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-cream flex items-center justify-center"><Loader2 size={24} className="animate-spin text-brand-gold" /></div>}>
      <LoginForm />
    </Suspense>
  );
}