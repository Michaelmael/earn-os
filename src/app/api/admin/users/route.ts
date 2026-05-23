import { NextResponse } from 'next/server';
import { getAllUsers, getActiveUsers } from '@/lib/auth';

export async function GET() {
  const allUsers = getAllUsers();
  const activeUsers = getActiveUsers();
  return NextResponse.json({ allUsers, activeUsers });
}