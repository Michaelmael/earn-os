'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }
    
    const securityRegex = /^[A-Za-z]+$/;
    if (!securityAnswer || !securityRegex.test(securityAnswer)) {
      setError('Security answer must be a single word (letters only, no spaces)');
      setLoading(false);
      return;
    }
    
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, securityAnswer: securityAnswer.toLowerCase() })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      setSuccess('Verification code sent to your email!');
      setStep('verify');
    } else {
      setError(data.error || 'Registration failed');
    }
    setLoading(false);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: verificationCode })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      setSuccess('Email verified! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } else {
      setError(data.error || 'Verification failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-slate-900">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-96 border border-white/20">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
            📊
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-gray-300 text-sm mt-2">Join EarnOS with email verification</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm">
            ❌ {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-200 p-3 rounded-lg mb-4 text-sm">
            ✅ {success}
          </div>
        )}
        
        {step === 'form' ? (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Preferred Username (min 3 characters)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 border border-gray-600 text-white mb-4 focus:border-blue-500 outline-none"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 border border-gray-600 text-white mb-4 focus:border-blue-500 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 border border-gray-600 text-white mb-4 focus:border-blue-500 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 border border-gray-600 text-white mb-4 focus:border-blue-500 outline-none"
              required
            />
            <div className="mb-6">
              <label className="block text-gray-300 text-sm mb-2">
                Security Question: What is your place of birth?
              </label>
              <input
                type="text"
                placeholder="One word answer (no spaces)"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value.replace(/\s/g, ''))}
                className="w-full p-3 rounded-lg bg-white/5 border border-gray-600 text-white focus:border-blue-500 outline-none uppercase"
                maxLength={20}
                required
              />
              <p className="text-gray-500 text-xs mt-1">Example: NAIROBI, LONDON, TOKYO (single word only)</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Sending verification...' : 'Register & Verify Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <p className="text-gray-300 text-sm mb-4 text-center">
              A 6-digit code was sent to:<br/>
              <span className="text-blue-400 font-bold">{email}</span>
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 border border-gray-600 text-white mb-6 text-center text-2xl tracking-widest focus:border-blue-500 outline-none"
              maxLength={6}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="text-blue-400 hover:text-blue-300">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
