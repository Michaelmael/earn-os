import { NextRequest, NextResponse } from 'next/server';
import { findUser, verifyUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  const user = findUser(email);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  verifyUser(email);
  return NextResponse.json({
    success: true,
    user: { email: user.email, verified: true, isAdmin: user.isAdmin },
  });
}