import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const verificationCodes = new Map();
const ADMIN_EMAIL = 'mbuguamichael920@gmail.com';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'earnos-secret-key-2025');

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    
    const stored = verificationCodes.get(email);
    
    if (!stored) {
      return NextResponse.json({ error: 'No verification code found' }, { status: 400 });
    }
    
    if (Date.now() > stored.expires) {
      verificationCodes.delete(email);
      return NextResponse.json({ error: 'Code has expired' }, { status: 400 });
    }
    
    if (stored.code !== code) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }
    
    verificationCodes.delete(email);
    
    const token = await new SignJWT({ email, isAdmin: email === ADMIN_EMAIL })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);
    
    return NextResponse.json({ success: true, token, isAdmin: email === ADMIN_EMAIL });
    
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
