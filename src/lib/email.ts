import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const verificationCodes: Map<string, { code: string; expires: number }> = new Map();

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeVerificationCode(email: string, code: string): void {
  verificationCodes.set(email.toLowerCase(), {
    code,
    expires: Date.now() + 10 * 60 * 1000,
  });
}

export function verifyCode(email: string, code: string): boolean {
  const stored = verificationCodes.get(email.toLowerCase());
  if (!stored) return false;
  if (stored.expires < Date.now()) {
    verificationCodes.delete(email.toLowerCase());
    return false;
  }
  if (stored.code !== code) return false;
  verificationCodes.delete(email.toLowerCase());
  return true;
}

export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    await resend.emails.send({
      from: 'EarnOS <earnos.noreply@gmail.com>',
      to: email,
      subject: '🐉 Verify your EarnOS account',
      html: `
        <div style="background:#0f172a; color:#fff; padding:40px; font-family:Arial; text-align:center;">
          <h1 style="color:#4ade80;">🐉 EarnOS</h1>
          <p style="font-size:18px;">Welcome to the lair. Your verification code is:</p>
          <h2 style="font-size:48px; letter-spacing:10px; color:#facc15;">${code}</h2>
          <p style="color:#94a3b8;">This code expires in 10 minutes.</p>
          <p style="color:#64748b; font-size:12px; margin-top:40px;">The dragon guards your crypto wealth.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}

export async function sendResetEmail(email: string, code: string): Promise<boolean> {
  try {
    await resend.emails.send({
      from: 'EarnOS <earnos.noreply@gmail.com>',
      to: email,
      subject: '🪄 Reset your EarnOS password',
      html: `
        <div style="background:#0f172a; color:#fff; padding:40px; font-family:Arial; text-align:center;">
          <h1 style="color:#4ade80;">🐉 EarnOS</h1>
          <p style="font-size:18px;">Password reset code:</p>
          <h2 style="font-size:48px; letter-spacing:10px; color:#facc15;">${code}</h2>
          <p style="color:#94a3b8;">This code expires in 15 minutes.</p>
          <p style="color:#64748b; font-size:12px; margin-top:40px;">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}