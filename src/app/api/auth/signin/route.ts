import { NextRequest, NextResponse } from 'next/server';
import { addOrUpdateUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }
    
    const user = addOrUpdateUser(email);
    
    return NextResponse.json({
      success: true,
      message: 'Sign in link sent to your email',
      user: {
        email: user.email,
        verified: user.verified,
        isAdmin: user.isAdmin,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}