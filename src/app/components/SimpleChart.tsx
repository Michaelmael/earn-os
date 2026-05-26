'use client';

import { useEffect, useState } from 'react';

interface SimpleChartProps {
  symbol: string;
}

export default function SimpleChart({ symbol }: SimpleChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverPrice, setHoverPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(0);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1h&limit=50`);
        const data = await response.json();
        
        const formatted = data.map((item: any) => ({
          time: new Date(item[0]).toLocaleTimeString(),
          price: parseFloat(item[4]), // closing price
          open: parseFloat(item[1]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
          volume: parseFloat(item[5])
        }));
        
        const prices = formatted.map(d => d.price);
        setMaxPrice(Math.max(...prices));
        setMinPrice(Math.min(...prices));
        setChartData(formatted);
        setLoading(false);
      } catch (error) {
        console.error('Chart data error:', error);
        setLoading(false);
      }
    };

    fetchChartData();
    const interval = setInterval(fetchChartData, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  const getHeightPercent = (price: number) => {
    const range = maxPrice - minPrice;
    if (range === 0) return 50;
    return ((price - minPrice) / range) * 100;
  };

  const getColor = (index: number) => {
    if (index === 0) return '#6B7280';
    return chartData[index].price >= chartData[index - 1].price ? '#10B981' : '#EF4444';
  };

  if (loading) {
    return (
      <div className="w-full h-[400px] bg-gray-800/50 rounded-lg flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Loading chart...</div>
      </div>
    );
  }

  const currentPrice = chartData[chartData.length - 1]?.price;
  const prevPrice = chartData[chartData.length - 2]?.price;
  const priceChange = currentPrice && prevPrice ? ((currentPrice - prevPrice) / prevPrice * 100) : 0;

  return (
    <div className="w-full">
      {/* Price info */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <span className="text-2xl font-bold text-white">
            ${currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`ml-2 text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
          </span>
        </div>
        <div className="text-gray-500 text-xs">
          {symbol}/USDT • 1h candles
        </div>
      </div>

      {/* Chart canvas */}
      <div className="relative h-[350px] w-full">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
          <span>${maxPrice.toLocaleString()}</span>
          <span>${((maxPrice + minPrice) / 2).toLocaleString()}</span>
          <span>${minPrice.toLocaleString()}</span>
        </div>

        {/* Chart bars */}
        <div className="absolute left-12 right-0 top-0 bottom-0 flex items-end gap-1">
          {chartData.map((item, idx) => {
            const height = getHeightPercent(item.price);
            const color = getColor(idx);
            return (
              <div
                key={idx}
                className="flex-1 group relative cursor-pointer"
                onMouseEnter={() => setHoverPrice(item.price)}
                onMouseLeave={() => setHoverPrice(null)}
              >
                <div
                  className="w-full transition-all duration-200 hover:opacity-80"
                  style={{
                    height: `${Math.max(height, 2)}%`,
                    backgroundColor: color,
                    minHeight: '2px'
                  }}
                />
                {/* Tooltip */}
                {hoverPrice === item.price && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs text-white whitespace-nowrap z-10">
                    ${item.price.toLocaleString()}<br/>
                    <span className="text-gray-400">{item.time}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Grid lines */}
        <div className="absolute left-12 right-0 top-0 bottom-0 pointer-events-none">
          {[0, 25, 50, 75, 100].map((percent) => (
            <div
              key={percent}
              className="absolute w-full border-t border-gray-700/50"
              style={{ bottom: `${percent}%` }}
            />
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="ml-12 mt-2 flex justify-between text-xs text-gray-500">
        <span>{chartData[0]?.time}</span>
        <span>{chartData[Math.floor(chartData.length / 4)]?.time}</span>
        <span>{chartData[Math.floor(chartData.length / 2)]?.time}</span>
        <span>{chartData[Math.floor(chartData.length * 3 / 4)]?.time}</span>
        <span>{chartData[chartData.length - 1]?.time}</span>
      </div>
    </div>
  );
}
