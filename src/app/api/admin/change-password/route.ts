import { NextRequest, NextResponse } from 'next/server';
import { changeAdminPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { newPassword } = await request.json();
  if (!newPassword) {
    return NextResponse.json({ error: 'New password required' }, { status: 400 });
  }
  const result = changeAdminPassword(newPassword);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true, message: 'Admin password changed successfully' });
}