'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] to-[#12121A]">
      {/* Navigation - onocoy style */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
          <span className="text-2xl font-bold text-white">EarnOS</span>
        </div>
        <div className="hidden md:flex space-x-8">
          {['Markets', 'Charts', 'News', 'Predictions'].map(item => (
            <a key={item} href="#" className="text-gray-400 hover:text-white transition text-sm font-medium">
              {item}
            </a>
          ))}
        </div>
        <Link 
          href="/login" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 rounded-lg text-white text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition"
        >
          Launch App
        </Link>
      </nav>

      {/* Hero Section - onocoy inspired */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs text-gray-400">Live Data • Real-time Updates</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          AI-Powered Crypto
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"> Trading Intelligence</span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Real-time market predictions, live charts, and smart signals — all in one platform.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/login" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:scale-105 transition"
          >
            Start Trading →
          </Link>
          <button className="border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/5 transition">
            Watch Demo
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-white/5">
          {[
            { value: '150+', label: 'Crypto Pairs' },
            { value: '30s', label: 'Update Speed' },
            { value: '24/7', label: 'Live Trading' },
            { value: '100%', label: 'Free Access' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-white mb-4">Everything You Need</h2>
        <p className="text-gray-400 text-center mb-12">Professional trading tools for every strategy</p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '📊', title: 'Live Charts', desc: 'Interactive candlestick charts with 20+ indicators', color: 'from-blue-600/20 to-blue-600/5' },
            { icon: '🤖', title: 'AI Predictions', desc: 'Strong Buy/Sell signals based on real-time analysis', color: 'from-purple-600/20 to-purple-600/5' },
            { icon: '📰', title: 'Live News Feed', desc: 'Breaking news from 200+ sources', color: 'from-green-600/20 to-green-600/5' },
            { icon: '💰', title: 'Real-time Prices', desc: 'Live crypto prices with moving ticker', color: 'from-yellow-600/20 to-yellow-600/5' },
            { icon: '📈', title: 'Stock Watchlist', desc: 'Track high-risk stocks and get alerts', color: 'from-red-600/20 to-red-600/5' },
            { icon: '🔔', title: 'Smart Alerts', desc: 'Get notified on market-moving events', color: 'from-indigo-600/20 to-indigo-600/5' },
          ].map((feature) => (
            <div 
              key={feature.title} 
              className={`bg-gradient-to-br ${feature.color} p-6 rounded-xl border border-white/10 hover:border-white/20 transition group`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl p-12 text-center border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Trade Smarter?</h2>
          <p className="text-gray-400 mb-8">Join EarnOS today and get real-time market intelligence.</p>
          <Link 
            href="/login" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-gray-500 text-sm">
        <p>© 2025 EarnOS. Real-time Crypto Intelligence.</p>
      </footer>
    </div>
  );
}
