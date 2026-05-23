import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/lib/email';
import { verifyUserEmail, findUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { email, code } = await request.json();
  if (!email || !code) {
    return NextResponse.json({ error: 'Email and code required' }, { status: 400 });
  }
  const valid = verifyCode(email, code);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
  }
  const user = findUser(email);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  verifyUserEmail(email);
  return NextResponse.json({ success: true, message: 'Email verified! You can now log in.', user: { email: user.email, isAdmin: user.isAdmin } });
}