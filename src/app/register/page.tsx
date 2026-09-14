'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const googleProvider = new GoogleAuthProvider();

const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill in all fields.'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match.'); return; }
    if (!passwordRules.every(r => r.test(form.password))) { toast.error('Password does not meet the requirements.'); return; }
    if (!agreed) { toast.error('Please accept the Terms & Privacy Policy.'); return; }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.name });
      await setDoc(doc(db, 'users', cred.user.uid), {
        name: form.name,
        email: form.email,
        createdAt: new Date().toISOString(),
      });
      toast.success('Account created! Welcome to Lillyum.', { style: { background: '#FAF7F2', color: '#1C1C1E' } });
      router.push('/');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Try signing in.');
      } else if (code === 'auth/weak-password') {
        toast.error('Password is too weak.');
      } else {
        toast.error('Account creation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!agreed) { toast.error('Please accept the Terms & Privacy Policy first.'); return; }
    setGoogleLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await setDoc(doc(db, 'users', cred.user.uid), {
        name: cred.user.displayName,
        email: cred.user.email,
        createdAt: new Date().toISOString(),
      }, { merge: true });
      toast.success('Welcome to Lillyum!', { style: { background: '#FAF7F2', color: '#1C1C1E' } });
      router.push('/');
    } catch {
      toast.error('Google sign-up failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col justify-between bg-brand-charcoal overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/philosophy_silk_bottle.jpg" alt="Lillyum Fragrance" fill className="object-cover opacity-40" priority />
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
          <p className="text-brand-gold text-xs uppercase tracking-widest font-semibold mb-4">Member Benefits</p>
          <ul className="space-y-3">
            {['Exclusive member-only offers', 'Order history & easy reorders', 'Early access to new arrivals', 'Personalised fragrance recommendations'].map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-brand-gold-lighter">
                <CheckCircle2 size={15} className="text-brand-gold shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
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
            <div className="mb-7">
              <p className="text-brand-gold text-xs uppercase tracking-widest font-semibold mb-2">Join us</p>
              <h1 className="font-serif text-3xl font-bold text-brand-charcoal mb-1">Create Account</h1>
              <p className="text-brand-mid text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-brand-gold font-semibold hover:text-brand-gold-dark transition-colors underline underline-offset-2">Sign in</Link>
              </p>
            </div>

            {/* Google */}
            <button onClick={handleGoogle} disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 bg-brand-white border border-brand-light rounded-xl py-3 px-4 text-sm font-medium text-brand-charcoal hover:border-brand-gold hover:bg-brand-gold-soft transition-all duration-200 shadow-soft mb-5 disabled:opacity-50 disabled:cursor-not-allowed">
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

            <div className="relative flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-brand-light" />
              <span className="text-brand-muted text-xs font-medium">or create with email</span>
              <div className="flex-1 h-px bg-brand-light" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-brand-charcoal">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-3 bg-brand-white border border-brand-light rounded-xl text-sm text-brand-charcoal placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-colors" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-brand-charcoal">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-brand-white border border-brand-light rounded-xl text-sm text-brand-charcoal placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-colors" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-brand-charcoal">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                  <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-11 py-3 bg-brand-white border border-brand-light rounded-xl text-sm text-brand-charcoal placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-gold transition-colors">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {form.password && (
                  <div className="flex gap-3 pt-1 flex-wrap">
                    {passwordRules.map((r) => (
                      <span key={r.label} className={`flex items-center gap-1 text-xs transition-colors ${r.test(form.password) ? 'text-green-600' : 'text-brand-muted'}`}>
                        <CheckCircle2 size={11} className={r.test(form.password) ? 'text-green-600' : 'text-brand-muted'} />
                        {r.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-brand-charcoal">Confirm Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                  <input type={showConfirm ? 'text' : 'password'} required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    placeholder="Repeat your password"
                    className={`w-full pl-10 pr-11 py-3 bg-brand-white border rounded-xl text-sm text-brand-charcoal placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 transition-colors ${form.confirm && form.confirm !== form.password ? 'border-red-400 focus:border-red-400' : 'border-brand-light focus:border-brand-gold'}`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-gold transition-colors">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {form.confirm && form.confirm !== form.password && (
                  <p className="text-xs text-red-500">Passwords do not match.</p>
                )}
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="sr-only peer" />
                  <div className="w-4 h-4 border-2 border-brand-light rounded peer-checked:bg-brand-gold peer-checked:border-brand-gold transition-colors group-hover:border-brand-gold flex items-center justify-center">
                    {agreed && <CheckCircle2 size={10} className="text-white" />}
                  </div>
                </div>
                <span className="text-xs text-brand-mid leading-relaxed">
                  I agree to the{' '}
                  <Link href="/policies/terms" className="text-brand-gold hover:text-brand-gold-dark underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/policies/privacy" className="text-brand-gold hover:text-brand-gold-dark underline">Privacy Policy</Link>.
                </span>
              </label>

              <button type="submit" disabled={loading || googleLoading}
                className="w-full flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 shadow-gold disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Create Account</span><ArrowRight size={15} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
