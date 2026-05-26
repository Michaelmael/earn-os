import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import path from 'path';

const dbPath = path.join(process.cwd(), 'users.db');
const db = new Database(dbPath);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { username, email, password, securityAnswer } = await req.json();
    
    if (!username || !email || !password || !securityAnswer) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    
    if (username.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    
    const securityRegex = /^[A-Za-z]+$/;
    if (!securityRegex.test(securityAnswer)) {
      return NextResponse.json({ error: 'Security answer must be a single word (letters only)' }, { status: 400 });
    }
    
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?').get(email, username);
    if (existingUser) {
      return NextResponse.json({ error: 'Email or username already taken' }, { status: 400 });
    }
    
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpires = new Date();
    codeExpires.setMinutes(codeExpires.getMinutes() + 10);
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    const hashedAnswer = bcrypt.hashSync(securityAnswer.toLowerCase(), 10);
    
    const result = db.prepare(`
      INSERT INTO users (username, email, password, securityAnswer, verificationCode, verificationCodeExpires, emailVerified, isAdmin)
      VALUES (?, ?, ?, ?, ?, ?, 0, 0)
    `).run(username, email, hashedPassword, hashedAnswer, verificationCode, codeExpires.toISOString());
    
    const { error } = await resend.emails.send({
      from: 'EarnOS <onboarding@resend.dev>',
      to: email,
      subject: 'Verify Your EarnOS Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center;">
            <h1 style="color: white;">EarnOS</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2>Verify Your Email Address</h2>
            <p>Hello <strong>${username}</strong>,</p>
            <p>Your verification code is:</p>
            <div style="font-size: 48px; font-weight: bold; text-align: center; padding: 20px; background: white; border-radius: 8px; letter-spacing: 10px; margin: 20px 0;">
              ${verificationCode}
            </div>
            <p>This code expires in <strong>10 minutes</strong>.</p>
          </div>
        </div>
      `,
    });
    
    if (error) {
      console.error('Email error:', error);
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
    }
    
    console.log(`Verification code ${verificationCode} sent to ${email}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Verification code sent to your email',
      userId: result.lastInsertRowid 
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
