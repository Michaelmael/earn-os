interface Deal {
  rank: number;
  title: string;
  type: string;
  difficulty: string;
  potential: string;
  timeRequired: string;
  description: string;
  link: string;
  linkText: string;
}

const weeklyDeals: Deal[] = [
  {
    rank: 1,
    title: 'Hamster Kombat Daily Combo',
    type: 'Telegram Game',
    difficulty: 'Easy',
    potential: 'High',
    timeRequired: '10 min/day',
    description: 'Play daily, upgrade your exchange, earn cards. One of the most anticipated airdrops on TON.',
    link: 'https://t.me/hamster_kombat_bot',
    linkText: 'Play on Telegram',
  },
  {
    rank: 2,
    title: 'Binance Futures Trading Competition',
    type: 'Trading Contest',
    difficulty: 'Medium',
    potential: 'Up to $50,000 USDT',
    timeRequired: 'Varies',
    description: 'Trade futures on Binance this week for a share of the prize pool. Volume-based rewards.',
    link: 'https://www.binance.com/en/register?ref=YOUR_BINANCE_REF',
    linkText: 'Join on Binance',
  },
  {
    rank: 3,
    title: 'zkSync Era — Bridge & Earn',
    type: 'Airdrop Farming',
    difficulty: 'Medium',
    potential: 'High (Token Confirmed)',
    timeRequired: '30 min setup',
    description: 'Bridge ETH to zkSync Era, use DApps like SyncSwap, Mute.io, and hold funds. Token confirmed.',
    link: 'https://portal.zksync.io/bridge',
    linkText: 'Bridge to zkSync',
  },
  {
    rank: 4,
    title: 'Scroll Mainnet — Use & Qualify',
    type: 'Airdrop Farming',
    difficulty: 'Medium',
    potential: 'High',
    timeRequired: 'Weekly activity',
    description: 'Bridge to Scroll, use ambient.finance, and complete weekly on-chain actions for the upcoming airdrop.',
    link: 'https://scroll.io/bridge',
    linkText: 'Start on Scroll',
  },
  {
    rank: 5,
    title: 'Bybit Launchpad — New Token Sale',
    type: 'Launchpad',
    difficulty: 'Easy',
    potential: 'Medium-High',
    timeRequired: '5 min',
    description: 'Stake MNT or USDT on Bybit Launchpad to get allocation in new token sales. Frequent opportunities.',
    link: 'https://www.bybit.com/en/register?affiliate_id=YOUR_BYBIT_REF',
    linkText: 'Join Bybit Launchpad',
  },
];

export default function WeeklyTop5() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400 mb-2">
        Hand-picked every Monday. These are the highest-confidence earning opportunities this week.
      </p>
      {weeklyDeals.map((deal) => (
        <div
          key={deal.rank}
          className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col md:flex-row gap-4"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-green-900 text-green-300 rounded-full font-bold text-lg shrink-0">
            {deal.rank}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-bold text-lg">{deal.title}</span>
              <span className="px-2 py-0.5 text-xs rounded bg-purple-900 text-purple-300">{deal.type}</span>
              <span className="px-2 py-0.5 text-xs rounded bg-gray-800 text-gray-300">{deal.difficulty}</span>
              <span className="px-2 py-0.5 text-xs rounded bg-yellow-900 text-yellow-300">{deal.potential}</span>
              <span className="px-2 py-0.5 text-xs rounded bg-gray-800 text-gray-400">⏱ {deal.timeRequired}</span>
            </div>
            <p className="text-sm text-gray-400">{deal.description}</p>
          </div>
          <a
            href={deal.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm rounded transition text-center whitespace-nowrap self-center"
          >
            {deal.linkText} →
          </a>
        </div>
      ))}
    </div>
  );
}