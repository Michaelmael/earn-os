'use client';

import { useEffect, useState } from 'react';
import { exchanges, tradingPairs } from '@/lib/exchanges';

interface PriceData {
  exchange: string;
  pair: string;
  price: number;
  affiliateSignup: string;
  tradeUrl: string;
}

interface ArbitrageOpportunity {
  pair: string;
  buyExchange: string;
  buyPrice: number;
  buyAffiliate: string;
  buyTradeUrl: string;
  sellExchange: string;
  sellPrice: number;
  sellAffiliate: string;
  sellTradeUrl: string;
  gapPercent: number;
}

export default function ArbitrageScanner() {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const allPrices: PriceData[] = [];

        for (const exchange of exchanges) {
          for (const pair of tradingPairs) {
            try {
              const symbol = exchange.symbolFormat(pair);
              let url = '';

              if (exchange.name === 'Bybit') {
                url = `${exchange.apiUrl}?category=spot&symbol=${symbol}`;
              } else if (exchange.name === 'BingX') {
                url = `${exchange.apiUrl}?symbol=${symbol}`;
              } else {
                url = `${exchange.apiUrl}?symbol=${symbol}`;
              }

              const res = await fetch(url);
              const data = await res.json();

              let price = 0;
              if (exchange.name === 'Bybit') {
                price = parseFloat(data?.result?.list?.[0]?.lastPrice || '0');
              } else if (exchange.name === 'BingX') {
                price = parseFloat(data?.data?.price || '0');
              } else {
                price = parseFloat(data?.price || '0');
              }

              if (price > 0) {
                allPrices.push({
                  exchange: exchange.name,
                  pair,
                  price,
                  affiliateSignup: exchange.affiliateSignup,
                  tradeUrl: exchange.tradeUrl + symbol,
                });
              }
            } catch {
              // Skip failed fetches for individual pairs
            }
          }
        }

        // Find arbitrage opportunities
        const opps: ArbitrageOpportunity[] = [];
        for (const pair of tradingPairs) {
          const pairPrices = allPrices.filter((p) => p.pair === pair);
          if (pairPrices.length >= 2) {
            const cheapest = pairPrices.reduce((min, p) => (p.price < min.price ? p : min));
            const mostExpensive = pairPrices.reduce((max, p) => (p.price > max.price ? p : max));
            const gapPercent = ((mostExpensive.price - cheapest.price) / cheapest.price) * 100;

            if (gapPercent > 0.01 && cheapest.exchange !== mostExpensive.exchange) {
              opps.push({
                pair,
                buyExchange: cheapest.exchange,
                buyPrice: cheapest.price,
                buyAffiliate: cheapest.affiliateSignup,
                buyTradeUrl: cheapest.tradeUrl,
                sellExchange: mostExpensive.exchange,
                sellPrice: mostExpensive.price,
                sellAffiliate: mostExpensive.affiliateSignup,
                sellTradeUrl: mostExpensive.tradeUrl,
                gapPercent,
              });
            }
          }
        }

        opps.sort((a, b) => b.gapPercent - a.gapPercent);
        setOpportunities(opps);
        setLastUpdated(new Date());
        setError(null);
      } catch {
        setError('Failed to fetch prices. Retrying...');
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-gray-400">
          {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
        </p>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
      {opportunities.length === 0 && !error && (
        <p className="text-gray-500 text-center py-4">No arbitrage opportunities above 0.1% right now...</p>
      )}
      <div className="space-y-2">
        {opportunities.map((opp, i) => (
          <div
            key={`${opp.pair}-${i}`}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div>
              <span className="font-bold text-lg">{opp.pair}</span>
              <span className="ml-2 px-2 py-1 bg-green-900 text-green-300 text-xs rounded">
                +{opp.gapPercent.toFixed(2)}%
              </span>
            </div>
            <div className="text-sm text-gray-300">
              Buy on <span className="text-green-400 font-semibold">{opp.buyExchange}</span> @ $
              {opp.buyPrice.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">
              Sell on <span className="text-red-400 font-semibold">{opp.sellExchange}</span> @ $
              {opp.sellPrice.toLocaleString()}
            </div>
            <div className="flex gap-2">
              <a
                href={opp.buyAffiliate}
                target="_blank"
                className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-sm rounded transition"
              >
                Buy ({opp.buyExchange})
              </a>
              <a
                href={opp.sellAffiliate}
                target="_blank"
                className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white text-sm rounded transition"
              >
                Sell ({opp.sellExchange})
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}