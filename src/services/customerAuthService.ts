import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface CustomerUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

const CUSTOMERS_KEY = 'lillyum_customer_accounts';
const CURRENT_CUSTOMER_KEY = 'lillyum_current_customer';

const googleProvider = new GoogleAuthProvider();

export function getLocalCustomer(): CustomerUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(CURRENT_CUSTOMER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function setLocalCustomer(user: CustomerUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(CURRENT_CUSTOMER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_CUSTOMER_KEY);
    }
  } catch (e) {
    console.error('Failed to set local customer:', e);
  }
  window.dispatchEvent(new Event('lillyum-auth-change'));
}

export async function registerCustomer(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: CustomerUser }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  // Check local customer accounts first
  let existingAccounts: Array<{ uid: string; name: string; email: string; password: string; createdAt: string }> = [];
  try {
    existingAccounts = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
  } catch {
    existingAccounts = [];
  }

  const alreadyExists = existingAccounts.some(
    (a) => a.email && a.email.toLowerCase() === cleanEmail
  );
  if (alreadyExists) {
    return { success: false, error: 'This email is already registered. Try signing in.' };
  }

  // Create customer record immediately
  const uid = 'cust_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const newAccount = {
    uid,
    name: cleanName,
    displayName: cleanName,
    email: cleanEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  existingAccounts.push(newAccount);
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(existingAccounts));
  } catch (err) {
    console.error('Storage error:', err);
  }

  const customer: CustomerUser = {
    uid,
    email: cleanEmail,
    displayName: cleanName,
  };

  setLocalCustomer(customer);

  // Background attempt to sync with Firebase Auth (non-blocking, will not hang UI)
  try {
    createUserWithEmailAndPassword(auth, cleanEmail, password)
      .then(async (cred) => {
        try {
          await updateProfile(cred.user, { displayName: cleanName });
          await setDoc(doc(db, 'users', cred.user.uid), {
            name: cleanName,
            email: cleanEmail,
            createdAt: new Date().toISOString(),
          });
        } catch {
          // ignore
        }
      })
      .catch(() => {
        // Firebase Auth disabled/offline — local customer already saved
      });
  } catch {
    // ignore
  }

  return { success: true, user: customer };
}

export async function loginCustomer(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: CustomerUser }> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Check local customer accounts first (instant response)
  try {
    const existingAccounts = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
    const matched = existingAccounts.find(
      (a: { email: string }) => a.email && a.email.toLowerCase() === cleanEmail
    );
    if (matched) {
      if (matched.password === password) {
        const customer: CustomerUser = {
          uid: matched.uid,
          email: matched.email,
          displayName: matched.name || matched.displayName || cleanEmail.split('@')[0],
        };
        setLocalCustomer(customer);
        return { success: true, user: customer };
      } else {
        return { success: false, error: 'Invalid password. Please try again.' };
      }
    }
  } catch {
    // ignore
  }

  // 2. If not found locally, try Firebase Auth with a fast timeout (1.5s max)
  try {
    const authPromise = signInWithEmailAndPassword(auth, cleanEmail, password);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 1500)
    );

    const cred = await Promise.race([authPromise, timeoutPromise]);
    const customer: CustomerUser = {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName || cleanEmail.split('@')[0],
      photoURL: cred.user.photoURL,
    };
    setLocalCustomer(customer);
    return { success: true, user: customer };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || '';
    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      return { success: false, error: 'Invalid email or password.' };
    }
    if (code === 'auth/user-not-found') {
      return { success: false, error: 'No account found with this email. Please create one.' };
    }
    return { success: false, error: 'Invalid email or password.' };
  }
}

export async function loginCustomerWithGoogle(): Promise<{ success: boolean; error?: string; user?: CustomerUser }> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const customer: CustomerUser = {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName,
      photoURL: cred.user.photoURL,
    };
    setLocalCustomer(customer);
    return { success: true, user: customer };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || '';
    if (code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Sign-in window was closed.' };
    }
    return {
      success: false,
      error: 'Google Sign-In is unavailable. Please create an account with email and password.',
    };
  }
}

export async function signOutCustomer(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch {
    // ignore
  }
  setLocalCustomer(null);
}

export interface CustomerAccountDetails {
  uid: string;
  name: string;
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  createdAt: string;
}

export function getCustomerAccountDetails(emailOrUid: string): CustomerAccountDetails | null {
  if (typeof window === 'undefined') return null;
  try {
    const existingAccounts = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
    const target = emailOrUid.toLowerCase().trim();
    const found = existingAccounts.find(
      (a: { uid?: string; email?: string }) =>
        (a.email && a.email.toLowerCase() === target) ||
        (a.uid && a.uid === emailOrUid)
    );
    return found || null;
  } catch {
    return null;
  }
}

export function updateCustomerAccountDetails(
  uidOrEmail: string,
  updates: Partial<CustomerAccountDetails>
): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const existingAccounts = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
    const target = uidOrEmail.toLowerCase().trim();
    const idx = existingAccounts.findIndex(
      (a: { uid?: string; email?: string }) =>
        (a.uid && a.uid === uidOrEmail) ||
        (a.email && a.email.toLowerCase() === target)
    );
    if (idx >= 0) {
      existingAccounts[idx] = { ...existingAccounts[idx], ...updates };
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(existingAccounts));

      const current = getLocalCustomer();
      if (current && (current.uid === uidOrEmail || current.email?.toLowerCase() === target)) {
        const updatedCustomer: CustomerUser = {
          ...current,
          displayName: updates.displayName || updates.name || current.displayName,
          email: updates.email || current.email,
        };
        setLocalCustomer(updatedCustomer);
      }
      return true;
    }
    return false;
  } catch (e) {
    console.error('Update account error:', e);
    return false;
  }
}

