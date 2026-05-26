import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import path from 'path';
import { randomBytes } from 'crypto';

const dbPath = path.join(process.cwd(), 'users.db');
const db = new Database(dbPath);
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'earnos-secret-key-2025');

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    if (user.emailVerified !== 1) {
      return NextResponse.json({ error: 'Please verify your email before logging in' }, { status: 401 });
    }
    
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    db.prepare('INSERT INTO sessions (userId, token, expiresAt) VALUES (?, ?, ?)')
      .run(user.id, token, expiresAt.toISOString());
    
    const jwt = await new SignJWT({ 
      userId: user.id, 
      email: user.email, 
      username: user.username,
      isAdmin: 0
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);
    
    return NextResponse.json({ 
      success: true, 
      token: jwt,
      user: { email: user.email, username: user.username, isAdmin: false }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
