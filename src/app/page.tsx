'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ArbitrageScanner from '@/components/ArbitrageScanner';
import AirdropTerminal from '@/components/AirdropTerminal';
import WeeklyTop5 from '@/components/WeeklyTop5';

export default function Home() {
  const [user, setUser] = useState<{ email: string; isAdmin: boolean } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('earnos_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const logout = () => {
    localStorage.removeItem('earnos_user');
    setUser(null);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-green-400">EarnOS</h1>
          <div className="flex gap-3 items-center">
            {user ? (
              <>
                <span className="text-gray-400 text-sm">{user.email}</span>
                {user.isAdmin && (
                  <Link href="/admin" className="px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-sm">
                    Admin
                  </Link>
                )}
                <button onClick={logout} className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-sm">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded text-sm font-semibold">
                Sign In
              </Link>
            )}
          </div>
        </div>
        <p className="text-gray-400 mt-2">
          Real-time crypto earning signals — arbitrage, airdrops, and verified opportunities
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-800 pb-2">
          ⚡ Live Arbitrage Scanner
        </h2>
        <ArbitrageScanner />
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-800 pb-2">
          🪂 Verified Airdrop Terminal
        </h2>
        <AirdropTerminal />
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-800 pb-2">
          🏆 Weekly Top 5 Sure Bets
        </h2>
        <WeeklyTop5 />
      </section>

      <footer className="text-center text-gray-600 text-sm mt-12">
        EarnOS — All data stays in your browser. We never store passwords on a server.
      </footer>
    </main>
  );
}