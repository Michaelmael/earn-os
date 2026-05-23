import { NextRequest, NextResponse } from 'next/server';
import { findUser, generateResetCode, storeResetCode } from '@/lib/auth';
import { sendResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  const user = findUser(email);
  if (!user) {
    return NextResponse.json({
      success: true,
      message: 'If your email is registered, a reset code has been sent.',
    });
  }

  const code = generateResetCode();
  storeResetCode(email, code);
  await sendResetEmail(email, code);

  return NextResponse.json({
    success: true,
    message: 'Reset code sent to your email.',
  });
}