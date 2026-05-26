import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const verificationCodes = new Map();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;
    
    verificationCodes.set(email, { code, expires });
    
    await resend.emails.send({
      from: 'EarnOS <noreply.earnos@gmail.com>',
      to: email,
      subject: 'Your EarnOS Verification Code',
      html: `<h1>Your code is: ${code}</h1><p>Valid for 10 minutes</p>`,
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
