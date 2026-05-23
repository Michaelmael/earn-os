import { NextRequest, NextResponse } from 'next/server';
import { verifyResetCode } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { email, code } = await request.json();
  if (!email || !code) {
    return NextResponse.json({ error: 'Email and code required' }, { status: 400 });
  }
  const valid = verifyResetCode(email, code);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
  }
  return NextResponse.json({ success: true, message: 'Code verified. You can now log in.' });
}