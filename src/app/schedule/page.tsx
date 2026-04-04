'use client';

import { useState, useMemo } from 'react';
import { DivisionFilter as DivFilterType, Game } from '@/lib/types';
import { GAMES } from '@/lib/games';
import DivisionFilter from '@/components/DivisionFilter';
import GameCard from '@/components/GameCard';
import GamePopup from '@/components/GamePopup';

export default function SchedulePage() {
  const [divFilter, setDivFilter] = useState<DivFilterType>('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  const filtered = divFilter === 'all'
    ? GAMES
    : GAMES.filter(g => g.division === divFilter);

  // Get unique dates (weeks)
  const allDates = useMemo(() => {
    const dates = [...new Set(filtered.map(g => g.date))].sort((a, b) => b.localeCompare(a));
    return dates;
  }, [filtered]);

  // Default to most recent week
  const currentWeek = selectedWeek || allDates[0] || '';

  // Group by date
  const grouped = filtered.reduce<Record<string, typeof GAMES>>((acc, g) => {
    if (!acc[g.date]) acc[g.date] = [];
    acc[g.date].push(g);
    return acc;
  }, {});

  // Show selected week or all
  const datesToShow = selectedWeek ? [selectedWeek] : allDates;

  return (
    <section className="sec">
      <div className="container">
        <div className="sec-eyebrow">Schedule &amp; Scores</div>
        <h2 className="sec-title">Spring 2026</h2>

        <div style={{ marginTop: 24 }}>
          <DivisionFilter value={divFilter} onChange={setDivFilter} />
        </div>

        {/* Week Navigation */}
        <div className="week-nav">
          <button
            className={`week-btn ${!selectedWeek ? 'active' : ''}`}
            onClick={() => setSelectedWeek(null)}
          >
            All Weeks
          </button>
          {allDates.map(date => {
            const d = new Date(date + 'T12:00:00');
            const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const gamesOnDate = grouped[date] || [];
            const finalCount = gamesOnDate.filter(g => g.status === 'final').length;
            const ppdCount = gamesOnDate.filter(g => g.status === 'postponed').length;

            return (
              <button
                key={date}
                className={`week-btn ${selectedWeek === date ? 'active' : ''}`}
                onClick={() => setSelectedWeek(date)}
              >
                <span className="week-date">{label}</span>
                <span className="week-count">
                  {finalCount > 0 && `${finalCount} games`}
                  {ppdCount > 0 && finalCount > 0 && ' · '}
                  {ppdCount > 0 && `${ppdCount} ppd`}
                  {finalCount === 0 && ppdCount === 0 && `${gamesOnDate.length} sched`}
                </span>
              </button>
            );
          })}
        </div>

        {datesToShow.map(date => {
          if (!grouped[date]) return null;
          const dateObj = new Date(date + 'T12:00:00');
          const label = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });

          const games = grouped[date];
          const finalGames = games.filter(g => g.status === 'final');
          const upcomingGames = games.filter(g => g.status === 'scheduled');
          const postponedGames = games.filter(g => g.status === 'postponed');

          return (
            <div key={date} style={{ marginBottom: 32 }}>
              <h3 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700, fontSize: 16,
                letterSpacing: '.06em', textTransform: 'uppercase',
                color: 'var(--muted)', marginBottom: 12,
                paddingBottom: 8, borderBottom: '1px solid var(--border)',
              }}>
                {label}
              </h3>

              {finalGames.length > 0 && (
                <div className="home-scores-grid">
                  {finalGames.map(game => (
                    <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} />
                  ))}
                </div>
              )}

              {upcomingGames.length > 0 && (
                <div className="home-scores-grid" style={{ marginTop: finalGames.length > 0 ? 8 : 0 }}>
                  {upcomingGames.map(game => (
                    <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} />
                  ))}
                </div>
              )}

              {postponedGames.length > 0 && (
                <div className="home-scores-grid" style={{ marginTop: 8 }}>
                  {postponedGames.map(game => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>
            No games found for this division.
          </div>
        )}

        <div style={{ marginTop: 32, textAlign: 'center', fontSize: 13, color: 'var(--muted2)' }}>
          Showing {filtered.length} games &middot; Data from BallgameCentral
        </div>
      </div>

      <GamePopup game={selectedGame} onClose={() => setSelectedGame(null)} />
    </section>
  );
}
