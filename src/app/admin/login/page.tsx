'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isSetup, setIsSetup] = useState(false);
  const [name, setName] = useState('Lillyum Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSetup) {
        // Call setup API to create Owner account via Admin SDK
        const res = await fetch('/api/admin/setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to setup admin account');
        }

        toast.success('Admin account created! Signing you in...');
      }

      // Sign in with Firebase Client Auth
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // Verify they are an admin user
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
      if (!userDoc.exists()) {
        await auth.signOut();
        toast.error('Access denied. No admin record found in Firestore.');
        return;
      }

      toast.success('Signed in successfully!');
      router.push('/admin');
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Login failed';
      if (message.includes('wrong-password') || message.includes('invalid-credential')) {
        toast.error('Invalid email or password.');
      } else if (message.includes('user-not-found')) {
        toast.error('User not found. Use "First-Time Admin Setup" tab below to create your account.');
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-brand-charcoal rounded-2xl border border-brand-mid/30 p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="font-serif text-2xl font-bold text-brand-gold">LILLYUM</h1>
          <p className="text-brand-muted text-xs uppercase tracking-widest mt-1">Admin Portal</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-brand-dark rounded-lg p-1 mb-6 border border-brand-mid/30">
          <button
            type="button"
            onClick={() => setIsSetup(false)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              !isSetup ? 'bg-brand-gold text-brand-charcoal' : 'text-brand-muted hover:text-brand-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSetup(true)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              isSetup ? 'bg-brand-gold text-brand-charcoal' : 'text-brand-muted hover:text-brand-white'
            }`}
          >
            First-Time Setup
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {isSetup && (
            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lillyum Owner"
            />
          )}
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@lillyumfragrance.lk"
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
          />

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            {loading
              ? isSetup
                ? 'Creating Account...'
                : 'Signing in...'
              : isSetup
              ? 'Create Owner Account'
              : 'Sign In'}
          </Button>
        </form>

        {isSetup && (
          <p className="text-[11px] text-brand-muted text-center mt-4 leading-relaxed">
            This will register your account in Firebase Authentication and assign the full <strong className="text-brand-gold">Owner</strong> role in Firestore.
          </p>
        )}
      </div>
    </div>
  );
}

