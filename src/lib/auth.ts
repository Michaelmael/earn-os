'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUser, loginUser, adminLogin, verifyUserEmail,
  generateResetCode, storeResetCode, verifyResetCode,
  findUser, storeVerificationCode, verifyCode
} from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup' | 'verify' | 'reset'>('login');
  const [isAdmin, setIsAdmin] = useState(false);
  const [resetCodeInput, setResetCodeInput] = useState('');
  const [verificationInput, setVerificationInput] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');

    if (mode === 'login') {
      const result = isAdmin ? adminLogin(email, password) : loginUser(email, password);
      if (result.success && result.user) {
        localStorage.setItem('earnos_user', JSON.stringify({ email: result.user.email, isAdmin: result.user.isAdmin }));
        router.push(result.user.isAdmin ? '/admin' : '/');
      } else {
        setError(result.error || 'Login failed');
      }
    } else if (mode === 'signup') {
      if (password.length < 5) { setError('Password must be at least 5 characters'); return; }
      const result = createUser(email, password);
      if (result.success) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        storeVerificationCode(email, code);
        setMessage(`Verification code: ${code}`);
        setMode('verify');
      } else {
        setError(result.error || 'Signup failed');
      }
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault(); setMessage(''); setError('');
    const valid = verifyCode(email, verificationInput);
    if (valid) {
      verifyUserEmail(email);
      setMessage('Email verified! You can now log in.');
      setTimeout(() => setMode('login'), 1000);
    } else {
      setError('Invalid or expired code');
    }
  };

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault(); setMessage(''); setError('');
    const user = findUser(email);
    if (!user) { setMessage('If email exists, code sent.'); return; }
    const code = generateResetCode();
    storeResetCode(email, code);
    setMessage(`Reset code: ${code}`);
    setResetCodeInput('');
  };

  const handleResetConfirm = (e: React.FormEvent) => {
    e.preventDefault(); setMessage(''); setError('');
    const valid = verifyResetCode(email, resetCodeInput);
    if (valid) {
      setMessage('Code verified! You can now log in.');
      setMode('login');
    } else {
      setError('Invalid or expired code');
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-400">EarnOS</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to access your dashboard</p>
        </div>

        {mode === 'verify' ? (
          <>
            <h2 className="text-xl mb-4 text-center">Verify Email</h2>
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-sm text-gray-400 text-center">Enter the 6-digit code</p>
              <input type="text" placeholder="000000" value={verificationInput}
                onChange={e => setVerificationInput(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white text-center text-2xl tracking-widest" required />
              <button type="submit" className="w-full p-3 bg-green-700 hover:bg-green-600 rounded font-semibold transition">Verify Email</button>
            </form>
          </>
        ) : mode === 'reset' ? (
          <>
            <h2 className="text-xl mb-4 text-center">Reset Password</h2>
            {!resetCodeInput ? (
              <form onSubmit={handleResetRequest} className="space-y-4">
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white" required />
                <button type="submit" className="w-full p-3 bg-yellow-700 hover:bg-yellow-600 rounded font-semibold transition">Send Reset Code</button>
              </form>
            ) : (
              <form onSubmit={handleResetConfirm} className="space-y-4">
                <p className="text-sm text-gray-400">Enter reset code for {email}</p>
                <input type="text" placeholder="e.g. 2000a" value={resetCodeInput} onChange={e => setResetCodeInput(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white" required />
                <button type="submit" className="w-full p-3 bg-yellow-700 hover:bg-yellow-600 rounded font-semibold transition">Verify Code</button>
              </form>
            )}
            <p className="text-center mt-4">
              <button onClick={() => { setMode('login'); setResetCodeInput(''); }} className="text-green-400 hover:underline text-sm">Back to Sign In</button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl mb-4 text-center">
              {isAdmin ? 'Admin Login' : mode === 'signup' ? 'Create Account' : 'Sign In'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white" required />
              <input type="password" placeholder="Password (min 5 chars)" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white" required />
              <button type="submit" className="w-full p-3 bg-green-700 hover:bg-green-600 rounded font-semibold transition text-lg">
                {mode === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
            </form>
            <div className="flex justify-between mt-4 text-sm">
              <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-green-400 hover:underline">
                {mode === 'login' ? 'Create account' : 'Already have account?'}
              </button>
              <button onClick={() => setIsAdmin(!isAdmin)} className="text-yellow-400 hover:underline">
                {isAdmin ? 'User login' : 'Admin?'}
              </button>
            </div>
            <p className="text-center mt-2">
              <button onClick={() => setMode('reset')} className="text-gray-400 hover:underline text-sm">Forgot password?</button>
            </p>
          </>
        )}

        {message && <p className="mt-4 p-3 bg-green-900 text-green-300 rounded text-sm">{message}</p>}
        {error && <p className="mt-4 p-3 bg-red-900 text-red-300 rounded text-sm">{error}</p>}
      </div>
    </main>
  );
}