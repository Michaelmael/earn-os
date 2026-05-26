'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('isAdmin', data.user.isAdmin ? 'true' : 'false');
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
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
          <h1 className="text-2xl font-bold text-white">EarnOS</h1>
          <p className="text-gray-300 text-sm mt-2">Trading Analysis Platform</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm">
            ❌ {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/5 border border-gray-600 text-white mb-6 focus:border-blue-500 outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-sm text-yellow-400 hover:text-yellow-300">
            Forgot Password?
          </a>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-400 hover:text-blue-300">
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}
