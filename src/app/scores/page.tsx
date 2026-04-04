'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DivisionFilter as DivFilterType, Game } from '@/lib/types';
import { GAMES } from '@/lib/games';
import DivisionFilter from '@/components/DivisionFilter';
import GameCard from '@/components/GameCard';
import GamePopup from '@/components/GamePopup';

function GameAutoOpener({ onOpen }: { onOpen: (g: Game) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const gameId = searchParams.get('game');
    if (gameId) {
      const game = GAMES.find(g => g.id === gameId);
      if (game) onOpen(game);
    }
  }, [searchParams, onOpen]);
  return null;
}

export default function ScoresPage() {
  const [divFilter, setDivFilter] = useState<DivFilterType>('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const finalGames = GAMES
    .filter(g => g.status === 'final')
    .filter(g => divFilter === 'all' || g.division === divFilter)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Group by date
  const grouped = finalGames.reduce<Record<string, typeof finalGames>>((acc, g) => {
    if (!acc[g.date]) acc[g.date] = [];
    acc[g.date].push(g);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <section className="sec">
      <div className="container">
        <div className="sec-eyebrow">Results</div>
        <h2 className="sec-title">Scores</h2>

        <div style={{ marginTop: 24 }}>
          <DivisionFilter value={divFilter} onChange={setDivFilter} />
        </div>

        {sortedDates.map(date => {
          const dateObj = new Date(date + 'T12:00:00');
          const label = dateObj.toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
          });

          return (
            <div key={date} style={{ marginBottom: 32 }}>
              <h3 style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16,
                letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)',
                marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)',
              }}>
                {label}
              </h3>
              <div className="home-scores-grid">
                {grouped[date].map(game => (
                  <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <Suspense fallback={null}>
        <GameAutoOpener onOpen={setSelectedGame} />
      </Suspense>
      <GamePopup game={selectedGame} onClose={() => setSelectedGame(null)} />
    </section>
  );
}
