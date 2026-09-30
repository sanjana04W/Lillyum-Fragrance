import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
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
  password: string,
  phone?: string
): Promise<{ success: boolean; error?: string; user?: CustomerUser }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const cleanPhone = phone?.trim() || '';

  // ── Step 1: Check duplicate & save to localStorage IMMEDIATELY (instant) ───
  let existingAccounts: Array<{ uid: string; name: string; displayName: string; email: string; password?: string; phone?: string; createdAt: string }> = [];
  try { existingAccounts = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]'); } catch { existingAccounts = []; }

  if (existingAccounts.some((a) => a.email && a.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'This email is already registered. Try signing in.' };
  }

  // Use a local UID (may be replaced by Firebase UID upon background sync)
  const localUid = 'cust_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  existingAccounts.push({
    uid: localUid,
    name: cleanName,
    displayName: cleanName,
    email: cleanEmail,
    password,
    phone: cleanPhone,
    createdAt: new Date().toISOString(),
  });
  try { localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(existingAccounts)); } catch { /* */ }

  const localCustomer: CustomerUser = { uid: localUid, email: cleanEmail, displayName: cleanName };
  setLocalCustomer(localCustomer);

  // ── Step 2: Save to Firestore 'users' & 'customers' (non-blocking) ─────────
  try {
    setDoc(doc(db, 'users', localUid), {
      name: cleanName,
      displayName: cleanName,
      email: cleanEmail,
      phone: cleanPhone || null,
      createdAt: new Date().toISOString(),
    }, { merge: true }).catch(() => {});
  } catch { /* ignore */ }

  try {
    addDoc(collection(db, 'customers'), {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone || '',
      orderHistory: [],
      createdAt: Timestamp.now(),
    }).catch(() => {});
  } catch { /* ignore */ }

  // ── Step 3: Sync with Firebase Auth in background (for cross-device login) ─
  try {
    createUserWithEmailAndPassword(auth, cleanEmail, password)
      .then(async (cred) => {
        const firebaseUid = cred.user.uid;
        try { await updateProfile(cred.user, { displayName: cleanName }); } catch { /* */ }
        // Sync profile under real Firebase UID as well
        setDoc(doc(db, 'users', firebaseUid), {
          name: cleanName, displayName: cleanName, email: cleanEmail,
          phone: cleanPhone || null, createdAt: new Date().toISOString(),
        }, { merge: true }).catch(() => {});
        // Update local cache with Firebase UID
        try {
          const accs: Array<{ uid: string; name: string; displayName: string; email: string; password?: string; phone?: string; createdAt: string }> = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
          const idx = accs.findIndex((a) => a.uid === localUid || a.email?.toLowerCase() === cleanEmail);
          if (idx >= 0) { accs[idx] = { ...accs[idx], uid: firebaseUid }; }
          localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(accs));
          const cur = getLocalCustomer();
          if (cur && cur.uid === localUid) setLocalCustomer({ ...cur, uid: firebaseUid });
        } catch { /* */ }
      })
      .catch((err: { code?: string; message?: string }) => {
        console.info('Firebase Auth background creation info:', err?.code || err?.message);
      });
  } catch { /* ignore */ }

  return { success: true, user: localCustomer };
}

export async function loginCustomer(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: CustomerUser }> {
  const cleanEmail = email.trim().toLowerCase();

  // ── Step 1: Check local customer accounts first (instant login) ────────────
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
        // Sync with Firebase Auth in background so cross-device state stays valid
        try {
          signInWithEmailAndPassword(auth, cleanEmail, password).catch(() => {
            createUserWithEmailAndPassword(auth, cleanEmail, password).catch(() => {});
          });
        } catch { /* ignore */ }
        return { success: true, user: customer };
      } else {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }
    }
  } catch {
    // ignore
  }

  // ── Step 2: Try Firebase Auth (for users logging in on a new device) ───────
  try {
    const authPromise = signInWithEmailAndPassword(auth, cleanEmail, password);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 3500)
    );

    const cred = await Promise.race([authPromise, timeoutPromise]);
    const customer: CustomerUser = {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName || cleanEmail.split('@')[0],
      photoURL: cred.user.photoURL,
    };

    // Cache locally on this new device
    try {
      let accs: Array<{ uid: string; name: string; displayName: string; email: string; password?: string; phone?: string; createdAt: string }> = [];
      try { accs = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]'); } catch { /* */ }
      const idx = accs.findIndex((a) => a.email?.toLowerCase() === cleanEmail || a.uid === cred.user.uid);
      if (idx >= 0) {
        accs[idx] = { ...accs[idx], uid: cred.user.uid, password };
      } else {
        accs.push({
          uid: cred.user.uid,
          name: customer.displayName || '',
          displayName: customer.displayName || '',
          email: cleanEmail,
          password,
          phone: '',
          createdAt: new Date().toISOString(),
        });
      }
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(accs));
    } catch { /* non-critical */ }

    setLocalCustomer(customer);
    return { success: true, user: customer };

  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || '';
    if (code === 'auth/wrong-password') {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
    if (code === 'auth/user-not-found') {
      return { success: false, error: 'No account found with this email. Please create one.' };
    }
    if (code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials') {
      return { success: false, error: 'Invalid email or password. Please try again or create an account.' };
    }
    return { success: false, error: 'Invalid email or password. Please try again.' };
  }
}

export async function registerOrLoginWithGoogleData(googleUser: {
  email: string;
  name: string;
  photoURL?: string;
  uid?: string;
}): Promise<{ success: boolean; error?: string; user?: CustomerUser }> {
  const cleanEmail = googleUser.email.trim().toLowerCase();
  const cleanName = googleUser.name.trim() || cleanEmail.split('@')[0];
  const uid = googleUser.uid || 'google_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

  let existingAccounts: Array<CustomerAccountDetails & { password?: string; authProvider?: string; photoURL?: string }> = [];
  try {
    existingAccounts = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
  } catch {
    existingAccounts = [];
  }

  const existingIdx = existingAccounts.findIndex(
    (a) => (a.email && a.email.toLowerCase() === cleanEmail) || a.uid === uid
  );

  let finalUser: CustomerAccountDetails;
  if (existingIdx >= 0) {
    // Existing user logging in with Google
    existingAccounts[existingIdx] = {
      ...existingAccounts[existingIdx],
      name: existingAccounts[existingIdx].name || cleanName,
      displayName: existingAccounts[existingIdx].displayName || cleanName,
      photoURL: googleUser.photoURL || existingAccounts[existingIdx].photoURL,
      authProvider: 'google',
    };
    finalUser = existingAccounts[existingIdx];
  } else {
    // New user creating account with Google
    finalUser = {
      uid,
      name: cleanName,
      displayName: cleanName,
      email: cleanEmail,
      photoURL: googleUser.photoURL,
      createdAt: new Date().toISOString(),
    };
    existingAccounts.push({
      ...finalUser,
      authProvider: 'google',
    });
  }

  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(existingAccounts));
  } catch (err) {
    console.error('Storage error:', err);
  }

  const customer: CustomerUser = {
    uid: finalUser.uid,
    email: cleanEmail,
    displayName: cleanName,
    photoURL: googleUser.photoURL,
  };

  setLocalCustomer(customer);

  // Sync with Firestore in background (non-blocking)
  try {
    setDoc(
      doc(db, 'users', customer.uid),
      {
        name: cleanName,
        displayName: cleanName,
        email: cleanEmail,
        photoURL: googleUser.photoURL || null,
        authProvider: 'google',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    ).catch(() => {});
  } catch {
    // ignore
  }

  return { success: true, user: customer };
}

export async function loginCustomerWithGoogle(): Promise<{
  success: boolean;
  requiresFallback?: boolean;
  error?: string;
  user?: CustomerUser;
}> {
  try {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, googleProvider);
    return await registerOrLoginWithGoogleData({
      uid: cred.user.uid,
      email: cred.user.email || '',
      name: cred.user.displayName || cred.user.email?.split('@')[0] || 'Google User',
      photoURL: cred.user.photoURL || undefined,
    });
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || '';
    if (code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Sign-in window was closed.' };
    }
    console.warn('Firebase Google Auth popup error:', code, err);
    return {
      success: false,
      requiresFallback: true,
      error: 'Google popup unavailable. Opening Google Account selector...',
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
  photoURL?: string;
  authProvider?: string;
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

