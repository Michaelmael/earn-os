import ArbitrageScanner from '@/components/ArbitrageScanner';
import AirdropTerminal from '@/components/AirdropTerminal';
import WeeklyTop5 from '@/components/WeeklyTop5';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-green-400">EarnOS</h1>
        <p className="text-gray-400 mt-2">
          Real-time crypto earning signals — arbitrage, airdrops, and verified opportunities
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-800 pb-2">
          ⚡ Live Arbitrage Scanner
        </h2>
        <ArbitrageScanner />
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-800 pb-2">
          🪂 Verified Airdrop Terminal
        </h2>
        <AirdropTerminal />
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-800 pb-2">
          🏆 Weekly Top 5 Sure Bets
        </h2>
        <WeeklyTop5 />
      </section>

      <footer className="text-center text-gray-600 text-sm mt-12">
        EarnOS — All data fetched locally. We never collect your data.
      </footer>
    </main>
  );
}