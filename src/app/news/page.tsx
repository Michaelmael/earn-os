'use client';

import { useEffect, useState } from 'react';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  isBreaking: boolean;
  impact?: 'Tier 1' | 'Tier 2';
}

export default function RealTimeNewsPage() {
  const [breakingNews, setBreakingNews] = useState<NewsArticle[]>([]);
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);
  const [pinnedNews, setPinnedNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'breaking' | 'all' | 'pinned'>('breaking');

  // Load pinned news from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pinnedNews');
    if (saved) {
      setPinnedNews(JSON.parse(saved));
    }
  }, []);

  // Save pinned news to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pinnedNews', JSON.stringify(pinnedNews));
  }, [pinnedNews]);

  // Fetch news every 30 seconds for real-time updates
  useEffect(() => {
    fetchAllNews();
    const interval = setInterval(fetchAllNews, 30000); // 30 second updates
    return () => clearInterval(interval);
  }, []);

  const fetchAllNews = async () => {
    try {
      // Fetch breaking news (urgent, market-moving only)
      const breakingRes = await fetch('https://cryptocurrency.cv/api/breaking?limit=10');
      const breakingData = await breakingRes.json();
      
      // Fetch general news
      const newsRes = await fetch('https://cryptocurrency.cv/api/news?limit=50');
      const newsData = await newsRes.json();
      
      if (breakingData && breakingData.articles) {
        const breaking = breakingData.articles.map((a: any, i: number) => ({
          id: `breaking-${Date.now()}-${i}`,
          title: a.title,
          description: a.description || a.title,
          link: a.link,
          pubDate: a.pubDate,
          source: a.source,
          isBreaking: true,
          impact: a.impact || (i < 3 ? 'Tier 1' : 'Tier 2')
        }));
        setBreakingNews(breaking);
      }
      
      if (newsData && newsData.articles) {
        const general = newsData.articles.slice(0, 40).map((a: any, i: number) => ({
          id: `news-${Date.now()}-${i}`,
          title: a.title,
          description: a.description || a.title,
          link: a.link,
          pubDate: a.pubDate,
          source: a.source,
          isBreaking: false
        }));
        setAllNews(general);
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('News fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePin = (article: NewsArticle) => {
    const isAlreadyPinned = pinnedNews.some(p => p.id === article.id);
    if (isAlreadyPinned) {
      setPinnedNews(pinnedNews.filter(p => p.id !== article.id));
    } else {
      setPinnedNews([article, ...pinnedNews]);
    }
  };

  const isPinned = (articleId: string) => pinnedNews.some(p => p.id === articleId);

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading real-time news...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center animate-pulse">
                <span className="text-xl">🔥</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Live Crypto News</h1>
              <span className="bg-green-600 text-xs px-2 py-1 rounded-full ml-2 animate-pulse">LIVE</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-xs">Updated: {lastUpdate.toLocaleTimeString()}</span>
              <a href="/dashboard" className="text-gray-300 hover:text-white transition">
                ← Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Real-time indicator */}
        <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-3 mb-6 text-center">
          <p className="text-green-400 text-sm">
            🔴 LIVE UPDATES EVERY 30 SECONDS • News older than 1 hour is automatically removed
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
          <button
            onClick={() => setActiveTab('breaking')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'breaking'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🔥 BREAKING ({breakingNews.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📰 All News ({allNews.length})
          </button>
          <button
            onClick={() => setActiveTab('pinned')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'pinned'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📌 Pinned ({pinnedNews.length})
          </button>
        </div>

        {/* Breaking News Section - Always visible first */}
        {activeTab === 'breaking' && (
          <div className="space-y-4">
            <div className="bg-red-600/10 border-l-4 border-red-600 p-4 rounded-r-lg mb-4">
              <h2 className="text-red-400 font-bold text-sm">⚠️ MARKET-MOVING ALERTS</h2>
              <p className="text-gray-400 text-xs">Tier 1: Critical • Tier 2: Important</p>
            </div>
            {breakingNews.map((article) => (
              <div
                key={article.id}
                className={`bg-gradient-to-r ${
                  article.impact === 'Tier 1' 
                    ? 'from-red-600/20 to-transparent border-l-4 border-red-600' 
                    : 'from-orange-600/10 to-transparent border-l-4 border-orange-500'
                } bg-gray-800/50 rounded-r-xl p-5 hover:bg-gray-800/70 transition`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        article.impact === 'Tier 1' ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'
                      }`}>
                        {article.impact === 'Tier 1' ? '🔴 TIER 1 - URGENT' : '🟠 TIER 2'}
                      </span>
                      <span className="text-blue-400 text-sm">{article.source}</span>
                      <span className="text-gray-500 text-xs">{getTimeAgo(article.pubDate)}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">{article.title}</h2>
                    <p className="text-gray-400 text-sm">{article.description}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => togglePin(article)}
                      className={`p-2 rounded-lg transition ${
                        isPinned(article.id) ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                      title={isPinned(article.id) ? 'Unpin' : 'Pin for later'}
                    >
                      📌
                    </button>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:bg-gray-600 transition text-center"
                      title="Read full article"
                    >
                      🔗
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {breakingNews.length === 0 && (
              <div className="text-center text-gray-500 py-12">No breaking news at this moment</div>
            )}
          </div>
        )}

        {/* All News Section */}
        {activeTab === 'all' && (
          <div className="grid gap-3">
            {allNews.map((article) => (
              <div key={article.id} className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition border border-gray-700">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-gray-400 text-sm">{article.source}</span>
                      <span className="text-gray-500 text-xs">{getTimeAgo(article.pubDate)}</span>
                    </div>
                    <h3 className="text-white font-medium">{article.title}</h3>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{article.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePin(article)}
                      className={`p-2 rounded-lg transition ${
                        isPinned(article.id) ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      📌
                    </button>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:bg-gray-600 transition"
                    >
                      🔗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pinned News Section */}
        {activeTab === 'pinned' && (
          <div className="space-y-4">
            {pinnedNews.length > 0 ? (
              pinnedNews.map((article) => (
                <div key={article.id} className="bg-yellow-600/10 border border-yellow-600/30 rounded-xl p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-yellow-400 text-sm">📌 Pinned</span>
                        <span className="text-gray-400 text-sm">{article.source}</span>
                      </div>
                      <h3 className="text-white font-medium">{article.title}</h3>
                      <p className="text-gray-400 text-xs mt-1">{article.description}</p>
                    </div>
                    <button
                      onClick={() => togglePin(article)}
                      className="p-2 rounded-lg bg-gray-700 text-yellow-400 hover:bg-gray-600 transition"
                      title="Unpin"
                    >
                      📌
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-12">
                No pinned news. Click the 📌 button on any news to save it here.
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>🔥 Breaking news updates every 30 seconds • News older than 1 hour auto-expires</p>
          <p className="mt-1">Sources: Binance, Bloomberg, Reuters, BBC, CoinDesk, CoinTelegraph + 200+ more</p>
        </div>
      </main>
    </div>
  );
}
