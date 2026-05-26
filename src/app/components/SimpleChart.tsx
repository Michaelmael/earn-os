'use client';

import { useEffect, useState } from 'react';

interface SimpleChartProps {
  symbol: string;
}

export default function SimpleChart({ symbol }: SimpleChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1h&limit=50`);
        const data = await response.json();
        const formatted = data.map((item: any) => ({
          time: new Date(item[0]).toLocaleTimeString(),
          price: parseFloat(item[4]),
        }));
        setChartData(formatted);
        setLoading(false);
      } catch (error) {
        console.error('Chart error:', error);
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [symbol]);

  const getMax = () => Math.max(...chartData.map(d => d.price));
  const getMin = () => Math.min(...chartData.map(d => d.price));
  const getHeight = (price: number) => ((price - getMin()) / (getMax() - getMin())) * 100;

  if (loading) {
    return <div className="h-[400px] flex items-center justify-center text-gray-400">Loading chart...</div>;
  }

  return (
    <div className="h-[400px] relative">
      <div className="h-full flex items-end gap-1">
        {chartData.map((item, idx) => {
          const isGreen = idx > 0 && item.price > chartData[idx - 1].price;
          return (
            <div
              key={idx}
              className={`flex-1 transition-all ${isGreen ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ height: `${Math.max(getHeight(item.price), 2)}%` }}
              title={`$${item.price.toLocaleString()}`}
            />
          );
        })}
      </div>
    </div>
  );
}
