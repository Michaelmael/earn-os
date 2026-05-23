// Email sending utility
// For production, sign up at https://resend.com (free tier: 100 emails/day)

const verificationCodes: Map<string, { code: string; expires: number }> = new Map();

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeVerificationCode(email: string, code: string): void {
  verificationCodes.set(email.toLowerCase(), {
    code,
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
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
  // In production, use Resend API
  // For now, log to console and return success
  console.log(`\n========================================`);
  console.log(`VERIFICATION CODE for ${email}: ${code}`);
  console.log(`========================================\n`);
  
  // To send real emails, uncomment this and add your Resend API key:
  /*
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'EarnOS <noreply@earnos.xyz>',
      to: email,
      subject: 'Verify your EarnOS account',
      html: `<h1>Welcome to EarnOS</h1><p>Your verification code is: <strong>${code}</strong></p><p>This code expires in 10 minutes.</p>`,
    });
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
  */
  
  return true;
}

export async function sendResetEmail(email: string, code: string): Promise<boolean> {
  console.log(`\n========================================`);
  console.log(`RESET CODE for ${email}: ${code}`);
  console.log(`========================================\n`);
  return true;
}