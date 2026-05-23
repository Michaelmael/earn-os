import { NextRequest, NextResponse } from 'next/server';
import { adminLogin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const result = adminLogin(email, password);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: { email: result.user!.email, isAdmin: true },
  });
}