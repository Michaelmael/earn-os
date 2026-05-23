import { NextRequest, NextResponse } from 'next/server';
import { adminLogin } from '@/lib/auth';

export async function POST(request: NextRequest) {
 