'use client';

import { useEffect, useState } from 'react';

interface Airdrop {
  id: string;
  name: string;
  status: 'active' | 'claimable' | 'upcoming';
  chain: string;
  description: string;
  officialLink: string;
  legitimacyScore: number;
  rewardType: string;
}

const AIRDROPS_URL =
  'https://raw.githubusercontent.com/yourusername/earn-os-airdrops/main/airdrops.json';

const FALLBACK_AIRDROPS: Airdrop[] = [
  {
    id: 'hamster-kombat',
    name: 'Hamster Kombat',
    status: 'active',
    chain: 'TON',
    description: 'Play the Telegram mini-app game to earn $HMSTR tokens. Largest airdrop of 2025.',
    officialLink: 'https://t.me/hamster_kombat_bot',
    legitimacyScore: 95,
    rewardType: 'Game + Airdrop',
  },
  {
    id: 'notcoin',
    name: 'Notcoin',
    status: 'claimable',
    chain: 'TON',
    description: 'NOT token is now live. Claim your tokens if you mined during the beta phase.',
    officialLink: 'https://t.me/notcoin_bot',
    legitimacyScore: 98,
    rewardType: 'Claimable Token',
  },
  {
    id: 'zksync-era',
    name: 'zkSync Era Airdrop',
    status: 'upcoming',
    chain: 'Ethereum L2',
    description: 'zkSync confirmed a token. Bridge funds and use DApps to qualify.',
    officialLink: 'https://portal.zksync.io/bridge',
    legitimacyScore: 90,
    rewardType: 'Retroactive Airdrop',
  },
  {
    id: 'layerzero',
    name: 'LayerZero',
    status: 'claimable',
    chain: 'Multi-chain',
    description: 'ZRO token is claimable. Check if your wallet qualifies for the airdrop.',
    officialLink: 'https://layerzero.foundation/claim',
    legitimacyScore: 97,
    rewardType: 'Claimable Token',
  },
  {
    id: 'scroll',
    name: 'Scroll Network',
    status: 'upcoming',
    chain: 'Ethereum L2',
    description: 'Use Scroll bridge and DApps regularly. Token is expected soon.',
    officialLink: 'https://scroll.io/bridge',
    legitimacyScore: 85,
    rewardType: 'Likely Airdrop',
  },
];

export default function AirdropTerminal() {
  const [airdrops, setAirdrops] = useState<Airdrop[]>(FALLBACK_AIRDROPS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAirdrops = async () => {
      try {
        const res = await fetch(AIRDROPS_URL);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAirdrops(data);
          }
        }
      } catch {
        // Use fallback data
      }
      setLoading(false);
    };
    fetchAirdrops();
  }, []);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900 text-green-300';
      case 'claimable':
        return 'bg-yellow-900 text-yellow-300';
      case 'upcoming':
        return 'bg-blue-900 text-blue-300';
      default:
        return 'bg-gray-800 text-gray-400';
    }
  };

  const legitimacyBadge = (score: number) => {
    if (score >= 90) return 'bg-green-900 text-green-300';
    if (score >= 70) return 'bg-yellow-900 text-yellow-300';
    return 'bg-red-900 text-red-300';
  };

  return (
    <div>
      {loading && <p className="text-gray-500 text-center py-4">Loading airdrops...</p>}
      <div className="space-y-3">
        {airdrops.map((airdrop) => (
          <div
            key={airdrop.id}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg">{airdrop.name}</span>
                <span className={`px-2 py-0.5 text-xs rounded ${statusBadge(airdrop.status)}`}>
                  {airdrop.status}
                </span>
                <span className={`px-2 py-0.5 text-xs rounded ${legitimacyBadge(airdrop.legitimacyScore)}`}>
                  {airdrop.legitimacyScore}% legit
                </span>
              </div>
              <p className="text-sm text-gray-400">{airdrop.description}</p>
              <div className="flex gap-3 mt-1 text-xs text-gray-500">
                <span>Chain: {airdrop.chain}</span>
                <span>Reward: {airdrop.rewardType}</span>
              </div>
            </div>
            <a
              href={airdrop.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm rounded transition text-center whitespace-nowrap"
            >
              Go to {airdrop.status === 'claimable' ? 'Claim' : 'Source'} →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}