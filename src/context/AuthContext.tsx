'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AdminUser } from '@/types';
import {
  CustomerUser,
  getLocalCustomer,
  loginCustomer,
  signOutCustomer,
} from '@/services/customerAuthService';

interface AuthContextValue {
  user: CustomerUser | User | null;
  adminUser: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isOwner: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | User | null>(() => getLocalCustomer());
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(() => !getLocalCustomer());

  useEffect(() => {
    // Safety timeout: Never keep loading stuck true for more than 1.2s
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(safetyTimer);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const docPromise = getDoc(doc(db, 'users', firebaseUser.uid));
          const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500));
          const d = await Promise.race([docPromise, timeoutPromise]);
          if (d && d.exists()) {
            setAdminUser({ id: d.id, ...d.data() } as AdminUser);
          } else {
            setAdminUser(null);
          }
        } catch {
          setAdminUser(null);
        }
      } else {
        const local = getLocalCustomer();
        setUser(local);
        setAdminUser(null);
      }
      setLoading(false);
    });

    const handleCustomerAuthChange = () => {
      const current = getLocalCustomer();
      setUser(current);
      setLoading(false);
    };
    window.addEventListener('lillyum-auth-change', handleCustomerAuthChange);

    return () => {
      unsub();
      window.removeEventListener('lillyum-auth-change', handleCustomerAuthChange);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await loginCustomer(email, password);
    if (!res.success) {
      throw new Error(res.error || 'Invalid credentials');
    }
  };

  const signOut = async () => {
    await signOutCustomer();
    setUser(null);
    setAdminUser(null);
  };

  const isOwner = adminUser?.role === 'Owner';
  const isStaff = adminUser?.role === 'Staff' || isOwner;

  return (
    <AuthContext.Provider value={{ user, adminUser, loading, signIn, signOut, isOwner, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
