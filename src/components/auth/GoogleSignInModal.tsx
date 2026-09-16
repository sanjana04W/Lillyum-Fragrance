'use client';

import { useState, useEffect } from 'react';
import { X, User, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { registerOrLoginWithGoogleData, CustomerUser } from '@/services/customerAuthService';
import toast from 'react-hot-toast';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: CustomerUser) => void;
  mode?: 'signin' | 'signup';
}

export default function GoogleSignInModal({
  isOpen,
  onClose,
  onSuccess,
  mode = 'signin',
}: GoogleSignInModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [recentAccounts, setRecentAccounts] = useState<Array<{ name: string; email: string }>>([]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    try {
      const stored = JSON.parse(localStorage.getItem('lillyum_customer_accounts') || '[]');
      if (Array.isArray(stored) && stored.length > 0) {
        const unique = stored.filter((a) => a.email).slice(0, 2);
        setRecentAccounts(unique);
        if (unique.length > 0 && !email) {
          setName(unique[0].name || unique[0].displayName || 'Google User');
          setEmail(unique[0].email);
          setSelectedPreset(unique[0].email);
        }
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectAccount = async (accName: string, accEmail: string) => {
    setSubmitting(true);
    try {
      const res = await registerOrLoginWithGoogleData({
        name: accName,
        email: accEmail,
      });
      if (res.success && res.user) {
        toast.success(`Signed in as ${accEmail}`, {
          style: { background: '#FAF7F2', color: '#1C1C1E' },
        });
        onSuccess(res.user);
        onClose();
      } else {
        toast.error(res.error || 'Could not complete Google sign-in.');
      }
    } catch {
      toast.error('Google sign-in error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || cleanEmail.split('@')[0];

    if (!cleanEmail) {
      toast.error('Please enter your Google email.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerOrLoginWithGoogleData({
        name: cleanName,
        email: cleanEmail,
      });
      if (res.success && res.user) {
        toast.success(
          mode === 'signup'
            ? 'Account created with Google! Welcome to Lillyum.'
            : `Welcome back, ${cleanName}!`,
          { style: { background: '#FAF7F2', color: '#1C1C1E' } }
        );
        onSuccess(res.user);
        onClose();
      } else {
        toast.error(res.error || 'Failed to complete Google authentication.');
      }
    } catch {
      toast.error('Google authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-brand-light shadow-2xl w-full max-w-md overflow-hidden relative animate-scale-up">
        {/* Top Header */}
        <div className="p-6 pb-4 border-b border-brand-light flex items-center justify-between bg-brand-cream/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white border border-brand-light shadow-xs flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-sm text-brand-charcoal">
                {mode === 'signup' ? 'Create Account with Google' : 'Sign in with Google'}
              </h2>
              <p className="text-[11px] text-brand-charcoal/60">
                to continue to <span className="font-medium text-brand-charcoal">Lillyum Fragrance Studio</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-brand-cream text-brand-charcoal/50 hover:text-brand-charcoal flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Quick Select from existing device accounts */}
          {recentAccounts.length > 0 && (
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-brand-charcoal/60">
                Choose an account
              </label>
              <div className="space-y-2">
                {recentAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleSelectAccount(acc.name, acc.email)}
                    disabled={submitting}
                    className="w-full p-3 rounded-2xl border border-brand-light hover:border-brand-gold bg-white hover:bg-brand-cream/50 flex items-center justify-between text-left transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-brand-gold text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {(acc.name || acc.email)[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-brand-charcoal truncate">{acc.name}</p>
                        <p className="text-[11px] text-brand-charcoal/60 truncate">{acc.email}</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-brand-gold shrink-0 ml-2" />
                  </button>
                ))}
              </div>

              <div className="relative flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-brand-light" />
                <span className="text-[10px] uppercase font-bold text-brand-charcoal/40">
                  Or enter your Google account
                </span>
                <div className="flex-1 h-px bg-brand-light" />
              </div>
            </div>
          )}

          {/* Form to enter Google account */}
          <form onSubmit={handleCustomSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sanjana Wijesinghe"
                className="w-full px-3.5 py-2.5 bg-brand-cream/30 border border-brand-light rounded-xl text-xs text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">
                Google Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. yourname@gmail.com"
                className="w-full px-3.5 py-2.5 bg-brand-cream/30 border border-brand-light rounded-xl text-xs text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-colors"
              />
            </div>

            <div className="p-3 bg-brand-cream/40 rounded-xl border border-brand-light flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-[#1a73e8] shrink-0 mt-0.5" />
              <p className="text-[11px] text-brand-charcoal/70 leading-relaxed">
                Google will share your name and email with Lillyum Fragrance Studio to securely authenticate your account.
              </p>
            </div>

            <div className="pt-2 flex gap-2.5 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2.5 text-xs font-semibold text-brand-charcoal/70 hover:text-brand-charcoal rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-xl shadow-soft transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{submitting ? 'Authenticating...' : 'Continue with Google'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
