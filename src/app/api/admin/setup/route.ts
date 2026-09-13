import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name = 'Owner' } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    let uid: string;

    // Check if user exists in Firebase Auth
    try {
      const existingUser = await adminAuth.getUserByEmail(email);
      uid = existingUser.uid;
      // Update password
      await adminAuth.updateUser(uid, { password });
    } catch (err: unknown) {
      // User doesn't exist, create in Firebase Auth
      const newUser = await adminAuth.createUser({
        email,
        password,
        displayName: name,
      });
      uid = newUser.uid;
    }

    // Set or update admin user document in Firestore
    await adminDb.collection('users').doc(uid).set(
      {
        uid,
        email,
        name,
        role: 'Owner',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Admin account created/updated successfully',
      uid,
      email,
      role: 'Owner',
    });
  } catch (error: unknown) {
    console.error('Admin setup error:', error);
    const message = error instanceof Error ? error.message : 'Failed to setup admin account';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

