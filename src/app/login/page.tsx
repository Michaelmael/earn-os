'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [isAdmin, setIsAdmin] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [dragonPos, setDragonPos] = useState({ x: 0, y: 0 });
  const [breathingFire, setBreathingFire] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Dragon follows cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setDragonPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');

    if (mode === 'login') {
      const url = isAdmin ? '/api/auth/admin-login' : '/api/auth/login';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('earnos_user', JSON.stringify(data.user));
        setLoginSuccess(true);
        setBreathingFire(true);
        setTimeout(() => {
          router.push(data.user.isAdmin ? '/admin' : '/');
        }, 1500);
      } else {
        setError(data.error);
      }
    } else if (mode === 'signup') {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Account created! You can now log in.');
        setMode('login');
      } else {
        setError(data.error);
      }
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault(); setMessage(''); setError('');
    const res = await fetch('/api/auth/reset-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.success) setMessage(`Reset code: ${data.code}`);
  };

  const handleResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault(); setMessage(''); setError('');
    const res = await fetch('/api/auth/reset-confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: resetCode }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage('Code verified! Log in with your new password.');
      setMode('login');
      setResetCode('');
    } else {
      setError(data.error);
    }
  };

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 overflow-hidden relative cursor-none"
    >
      {/* Dragon that follows cursor */}
      <div
        className="fixed pointer-events-none z-50 transition-transform duration-75"
        style={{
          left: dragonPos.x - 30,
          top: dragonPos.y - 30,
          transform: `scale(${loginSuccess ? 1.5 : 1})`,
        }}
      >
        <div className="text-5xl animate-bounce relative">
          🐉
          {/* Fire breath on success */}
          {breathingFire && (
            <div className="absolute -right-16 top-2 animate-ping">
              <span className="text-3xl">🔥</span>
              <span className="text-3xl absolute -right-6 top-0">🔥</span>
              <span className="text-2xl absolute -right-10 -top-2">🔥</span>
              <span className="text-xl absolute -right-14 top-1">💨</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating embers in background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-xl animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.3,
            }}
          >
            {['✨', '💫', '⭐', '🔥', '💨'][i % 5]}
          </div>
        ))}
      </div>

      {/* Login Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 w-full max-w-md relative z-10 shadow-2xl shadow-green-900/20">
        <div className="text-center mb-6">
          <span className="text-6xl">🐉</span>
          <h1 className="text-3xl font-bold text-green-400 mt-2">EarnOS</h1>
          <p className="text-gray-500 text-sm mt-1">The dragon guards your crypto wealth</p>
        </div>

        {mode !== 'reset' ? (
          <>
            <h2 className="text-xl mb-4 text-center">
              {isAdmin ? '🔥 Admin Lair' : mode === 'signup' ? 'Join the Hoard' : 'Enter the Lair'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email" placeholder="Email"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:border-green-500 focus:outline-none transition"
                required
              />
              <input
                type="password" placeholder={mode === 'signup' ? 'Password (min 5 chars)' : 'Password'}
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:border-green-500 focus:outline-none transition"
                required
              />
              <button
                type="submit"
                className="w-full p-3 bg-green-700 hover:bg-green-600 rounded font-semibold transition text-lg"
              >
                {mode === 'signup' ? '🐣 Hatch Account' : '🐉 Enter Lair'}
              </button>
            </form>
            <div className="flex justify-between mt-4 text-sm">
              <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-green-400 hover:underline">
                {mode === 'login' ? 'Create account' : 'Already have account?'}
              </button>
              <button onClick={() => setIsAdmin(!isAdmin)}
                className="text-yellow-400 hover:underline">
                {isAdmin ? 'User login' : 'Admin?'}
              </button>
            </div>
            <p className="text-center mt-2">
              <button onClick={() => setMode('reset')}
                className="text-gray-400 hover:underline text-sm">Forgot password?</button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl mb-4 text-center">Reset Password</h2>
            {!resetCode ? (
              <form onSubmit={handleResetRequest} className="space-y-4">
                <input type="email" placeholder="Email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white" required />
                <button type="submit"
                  className="w-full p-3 bg-yellow-700 hover:bg-yellow-600 rounded font-semibold transition">
                  🪄 Send Reset Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetConfirm} className="space-y-4">
                <p className="text-sm text-gray-400">Enter code sent to {email}</p>
                <input type="text" placeholder="e.g. 2000a" value={resetCode}
                  onChange={e => setResetCode(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white" required />
                <button type="submit"
                  className="w-full p-3 bg-yellow-700 hover:bg-yellow-600 rounded font-semibold transition">
                  🐉 Verify Code
                </button>
              </form>
            )}
            <p className="text-center mt-4">
              <button onClick={() => { setMode('login'); setResetCode(''); }}
                className="text-green-400 hover:underline text-sm">Back to Sign In</button>
            </p>
          </>
        )}

        {message && (
          <p className="mt-4 p-3 bg-green-900 text-green-300 rounded text-sm animate-pulse">{message}</p>
        )}
        {error && (
          <p className="mt-4 p-3 bg-red-900 text-red-300 rounded text-sm animate-shake">{error}</p>
        )}

        {/* Success firework */}
        {loginSuccess && (
          <div className="mt-4 text-center animate-bounce">
            <p className="text-2xl">🔥🐉🔥</p>
            <p className="text-green-400 font-bold">The dragon approves! Entering...</p>
          </div>
        )}
      </div>
    </main>
  );
}