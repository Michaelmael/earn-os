import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';
import { generateVerificationCode, storeVerificationCode, sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }
  const result = createUser(email, password);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const code = generateVerificationCode();
  storeVerificationCode(email, code);
  await sendVerificationEmail(email, code);
  return NextResponse.json({
    success: true,
    message: 'Verification code sent to your email. Enter it to complete signup.',
  });
}