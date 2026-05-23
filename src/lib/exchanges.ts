export interface Exchange {
  name: string;
  apiUrl: string;
  symbolFormat: (pair: string) => string;
  affiliateSignup: string;
  tradeUrl: string;
}

export const exchanges: Exchange[] = [
  {
    name: 'Binance',
    apiUrl: 'https://api.binance.com/api/v3/ticker/price',
    symbolFormat: (pair: string) => pair.replace('/', ''),
    affiliateSignup: 'https://www.binance.com/en/register?ref=YOUR_BINANCE_REF',
    tradeUrl: 'https://www.binance.com/en/trade/',
  },
  {
    name: 'BingX',
    apiUrl: 'https://open-api.bingx.com/openApi/spot/v1/ticker/price',
    symbolFormat: (pair: string) => pair.replace('/', '-'),
    affiliateSignup: 'https://bingx.com/invite/YOUR_BINGX_REF',
    tradeUrl: 'https://bingx.com/en/spot/',
  },
  {
    name: 'Bybit',
    apiUrl: 'https://api.bybit.com/v5/market/tickers',
    symbolFormat: (pair: string) => pair.replace('/', ''),
    affiliateSignup: 'https://www.bybit.com/en/register?affiliate_id=YOUR_BYBIT_REF',
    tradeUrl: 'https://www.bybit.com/en/trade/spot/',
  },
];

export const tradingPairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT'];