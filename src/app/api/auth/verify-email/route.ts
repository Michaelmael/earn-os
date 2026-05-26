import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'users.db');
const db = new Database(dbPath);

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (user.emailVerified === 1) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
    }
    
    if (user.verificationCode !== code) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }
    
    const now = new Date();
    const expires = new Date(user.verificationCodeExpires);
    
    if (now > expires) {
      return NextResponse.json({ error: 'Verification code expired. Please register again.' }, { status: 400 });
    }
    
    db.prepare('UPDATE users SET emailVerified = 1, verificationCode = NULL WHERE email = ?').run(email);
    
    return NextResponse.json({ success: true, message: 'Email verified successfully!' });
    
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
