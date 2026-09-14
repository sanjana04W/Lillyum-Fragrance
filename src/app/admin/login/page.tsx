'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

// Hardcoded admin credentials — change these to your own values or use env vars
const ADMIN_EMAIL    = process.env.NEXT_PUBLIC_ADMIN_EMAIL    ?? 'admin@lillyumfragrance.lk';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'Lillyum@Admin2025';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a brief delay for UX
    await new Promise((r) => setTimeout(r, 600));

    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Store session flag in sessionStorage (cleared when browser closes)
      sessionStorage.setItem('admin_auth', 'true');
      toast.success('Welcome back, Admin!', { style: { background: '#1C1C1E', color: '#B8892A' } });
      router.push('/admin');
    } else {
      setError('Invalid email or password.');
      toast.error('Access denied.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-4">
      {/* Background subtle texture */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-[#232323] rounded-2xl border border-brand-mid/30 shadow-2xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-brand-gold via-brand-gold-lighter to-brand-gold" />

          <div className="p-8">
            {/* Logo + Title */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-brand-gold/40 mb-4">
                <Image src="/logo.jpg" alt="Lillyum" fill className="object-cover" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-brand-gold tracking-wide">LILLYUM</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <ShieldCheck size={11} className="text-brand-muted" />
                <p className="text-brand-muted text-[11px] uppercase tracking-[0.2em]">Admin Portal</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-brand-muted uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="admin@lillyumfragrance.lk"
                    className="w-full pl-10 pr-4 py-3 bg-brand-charcoal border border-brand-mid/40 rounded-xl text-sm text-white placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/60 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-brand-muted uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 bg-brand-charcoal border border-brand-mid/40 rounded-xl text-sm text-white placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/60 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-gold transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-red-400 text-xs text-center">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-dark text-brand-charcoal font-bold text-sm py-3.5 rounded-xl transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 pb-5 text-center">
            <p className="text-brand-muted text-[11px]">
              Restricted access — Lillyum staff only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
