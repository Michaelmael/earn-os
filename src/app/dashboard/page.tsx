'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Footer from '../components/Footer';
import ArbitrageScanner from '../components/ArbitrageScanner';

const SimpleChart = dynamic(() => import('../components/SimpleChart'), { ssr: false });

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    const admin = localStorage.getItem('isAdmin') === 'true';
    
    if (!token) {
      router.push('/login');
    } else {
      setUserEmail(email || '');
      setIsAdmin(admin);
      fetchPrices();
    }
    setLoading(false);
  }, [router]);

  const fetchPrices = async () => {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      const data = await response.json();
      const topCoins = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'DOGEUSDT', 'XRPUSDT'];
      const filtered = data
        .filter((item: any) => topCoins.includes(item.symbol))
        .map((item: any) => ({
          symbol: item.symbol.replace('USDT', ''),
          price: `$${parseFloat(item.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
          change24h: parseFloat(item.priceChangePercent),
        }));
      setCryptos(filtered);
    } catch (error) {
      console.error('Price fetch error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col">
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <h1 className="text-xl font-bold text-white">EarnOS</h1>
              <span className="bg-green-600/20 text-green-400 text-xs px-2 py-0.5 rounded-full">LIVE</span>
              {isAdmin && <span className="bg-purple-600 text-xs px-2 py-0.5 rounded-full">Admin</span>}
            </div>
            
            <div className="hidden md:flex space-x-6">
              <a href="/dashboard" className="text-white text-sm">Dashboard</a>
              <a href="/news" className="text-gray-400 hover:text-white text-sm transition">News</a>
              <a href="/prices" className="text-gray-400 hover:text-white text-sm transition">Prices</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm hidden md:block">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="border border-red-600/50 text-red-400 px-4 py-1.5 rounded-lg text-sm hover:bg-red-600/10 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-6 py-8">
        {/* Arbitrage Scanner */}
        <div className="mb-8">
          <ArbitrageScanner />
        </div>

        {/* Crypto Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {cryptos.map((crypto: any) => (
            <button
              key={crypto.symbol}
              onClick={() => setSelectedCrypto(crypto.symbol)}
              className={`bg-gradient-to-br from-white/5 to-white/0 border rounded-xl p-4 text-center transition ${
                selectedCrypto === crypto.symbol ? 'border-blue-500 bg-blue-500/10' : 'border-white/10'
              }`}
            >
              <div className="text-white font-bold text-lg">{crypto.symbol}</div>
              <div className="text-white font-mono text-sm mt-1">{crypto.price}</div>
              <div className={`text-xs mt-1 ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {crypto.change24h >= 0 ? '▲' : '▼'} {Math.abs(crypto.change24h).toFixed(2)}%
              </div>
            </button>
          ))}
        </div>

        {/* Chart & Signals */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">{selectedCrypto}/USDT Live Chart</h2>
              <SimpleChart symbol={selectedCrypto} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">🤖 AI Trading Signals</h2>
            <div className="space-y-3">
              {cryptos.map((crypto: any) => {
                let signal = '';
                let color = '';
                if (crypto.change24h > 3) { signal = 'STRONG BUY'; color = 'bg-green-600'; }
                else if (crypto.change24h > 0) { signal = 'BUY'; color = 'bg-green-500'; }
                else if (crypto.change24h < -3) { signal = 'STRONG SELL'; color = 'bg-red-600'; }
                else if (crypto.change24h < 0) { signal = 'SELL'; color = 'bg-red-500'; }
                else { signal = 'HOLD'; color = 'bg-yellow-600'; }
                
                return (
                  <div key={crypto.symbol} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white font-bold">{crypto.symbol}</div>
                      <div className="text-gray-400 text-xs">{crypto.price}</div>
                    </div>
                    <div className={`${color} px-3 py-1 rounded-full text-xs font-bold text-white`}>
                      {signal}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
