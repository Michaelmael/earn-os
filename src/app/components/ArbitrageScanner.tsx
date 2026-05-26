'use client';

import { useEffect, useState } from 'react';

interface ArbitrageOpportunity {
  pair: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  profit: number;
  profitPercent: number;
}

export default function ArbitrageScanner() {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    scanArbitrage();
    const interval = setInterval(scanArbitrage, 15000);
    return () => clearInterval(interval);
  }, []);

  const scanArbitrage = async () => {
    try {
      const exchanges = ['binance', 'kraken', 'coinbase', 'bybit'];
      const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
      const prices: any = {};

      for (const symbol of symbols) {
        prices[symbol] = {};
        for (const exchange of exchanges) {
          try {
            let url = '';
            if (exchange === 'binance') {
              url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;
            } else if (exchange === 'kraken') {
              url = `https://api.kraken.com/0/public/Ticker?pair=${symbol.replace('USDT', 'USD')}`;
            } else if (exchange === 'coinbase') {
              url = `https://api.coinbase.com/v2/prices/${symbol.replace('USDT', '-USD')}/spot`;
            } else if (exchange === 'bybit') {
              url = `https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}`;
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            let price = 0;
            if (exchange === 'binance') price = parseFloat(data.price);
            else if (exchange === 'kraken') price = parseFloat(Object.values(data.result)[0]?.c[0]);
            else if (exchange === 'coinbase') price = parseFloat(data.data.amount);
            else if (exchange === 'bybit') price = parseFloat(data.result.list[0].lastPrice);
            
            if (price > 0) {
              prices[symbol][exchange] = price;
            }
          } catch (e) {
            console.error(`${exchange} error for ${symbol}:`, e);
          }
        }
      }

      const newOpportunities: ArbitrageOpportunity[] = [];
      
      for (const symbol of symbols) {
        const exchangePrices = prices[symbol];
        const exchangeList = Object.keys(exchangePrices);
        
        for (let i = 0; i < exchangeList.length; i++) {
          for (let j = i + 1; j < exchangeList.length; j++) {
            const buyExchange = exchangeList[i];
            const sellExchange = exchangeList[j];
            const buyPrice = exchangePrices[buyExchange];
            const sellPrice = exchangePrices[sellExchange];
            
            if (buyPrice && sellPrice) {
              let profit = 0;
              let profitPercent = 0;
              let buyEx = buyExchange;
              let sellEx = sellExchange;
              
              if (sellPrice > buyPrice) {
                profit = sellPrice - buyPrice;
                profitPercent = (profit / buyPrice) * 100;
              } else {
                profit = buyPrice - sellPrice;
                profitPercent = (profit / sellPrice) * 100;
                buyEx = sellExchange;
                sellEx = buyExchange;
              }
              
              if (profitPercent > 0.1 && profitPercent < 10) {
                newOpportunities.push({
                  pair: symbol.replace('USDT', '/USDT'),
                  buyExchange: buyEx.charAt(0).toUpperCase() + buyEx.slice(1),
                  sellExchange: sellEx.charAt(0).toUpperCase() + sellEx.slice(1),
                  buyPrice,
                  sellPrice,
                  profit,
                  profitPercent
                });
              }
            }
          }
        }
      }
      
      newOpportunities.sort((a, b) => b.profitPercent - a.profitPercent);
      setOpportunities(newOpportunities.slice(0, 5));
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Arbitrage scan error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">⚡ Live Arbitrage Scanner</h2>
          <p className="text-gray-400 text-xs">Real-time price differences across 4 major exchanges</p>
        </div>
        <div className="text-right">
          <span className="text-green-400 text-xs animate-pulse">● LIVE</span>
          <p className="text-gray-500 text-xs">{lastUpdate.toLocaleTimeString()}</p>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse h-16 bg-white/5 rounded-lg"></div>
          ))}
        </div>
      ) : opportunities.length > 0 ? (
        <div className="space-y-3">
          {opportunities.map((opp, idx) => (
            <div key={idx} className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-bold">{opp.pair}</span>
                <span className="text-green-400 font-bold text-lg">+{opp.profitPercent.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-gray-400">Buy on</span>
                  <span className="text-green-400 ml-1">{opp.buyExchange}</span>
                  <span className="text-gray-400 ml-2">@ ${opp.buyPrice.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-400">Sell on</span>
                  <span className="text-red-400 ml-1">{opp.sellExchange}</span>
                  <span className="text-gray-400 ml-2">@ ${opp.sellPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Potential profit: ${opp.profit.toFixed(2)} per unit
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p>No arbitrage opportunities above 0.1% at this moment</p>
          <p className="text-xs mt-2">Scanning Binance, Kraken, Coinbase, Bybit every 15 seconds</p>
        </div>
      )}
    </div>
  );
}
