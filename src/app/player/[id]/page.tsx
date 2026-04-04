'use client';

/* eslint-disable @next/next/no-img-element */
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import Link from 'next/link';
import { getTeam } from '@/lib/teams';
import { BATTING_STATS } from '@/lib/players';
import { GAMES } from '@/lib/games';

export default function PlayerPage() {
  const params = useParams();
  const playerId = decodeURIComponent(params.id as string);

  const player = BATTING_STATS.find(p => p.name === playerId);
  const team = player ? getTeam(player.team as string) : null;

  const playerGames = useMemo(() => {
    if (!player) return [];
    return GAMES
      .filter(g => g.status === 'final' && (g.awayTeam === player.team || g.homeTeam === player.team))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [player]);

  if (!player) {
    return (
      <section className="sec">
        <div className="container" style={{ textAlign: 'center', padding: 60 }}>
          <h2 className="sec-title">Player Not Found</h2>
          <p style={{ color: 'var(--muted)', marginTop: 12 }}>No stats available for &ldquo;{playerId}&rdquo;</p>
          <Link href="/stats" className="btn-outline" style={{ marginTop: 20, display: 'inline-block' }}>View All Stats</Link>
        </div>
      </section>
    );
  }

  const statCards = [
    { label: 'AVG', value: (player.avg as number).toFixed(3).replace(/^0/, '') },
    { label: 'OBP', value: (player.obp as number).toFixed(3).replace(/^0/, '') },
    { label: 'SLG', value: (player.slg as number).toFixed(3).replace(/^0/, '') },
    { label: 'HR', value: String(player.hr) },
    { label: 'RBI', value: String(player.rbi) },
    { label: 'R', value: String(player.r) },
    { label: 'H', value: String(player.h) },
    { label: 'BB', value: String(player.bb) },
    { label: 'SB', value: String(player.sb) },
  ];

  return (
    <>
      {/* Player Header */}
      <section style={{
        background: team ? `linear-gradient(135deg, ${team.color} 0%, ${team.color2 || team.color}88 100%)` : 'var(--card2)',
        padding: '48px 48px 40px',
        color: '#fff',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {team?.logo && (
            <img src={team.logo} alt={team.name} style={{ width: 60, height: 60, objectFit: 'contain', opacity: 0.8 }} />
          )}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', opacity: 0.7 }}>
              {player.jersey ? `#${player.jersey} · ` : ''}{team?.name || player.team} · {player.division} Division
            </div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(32px,6vw,52px)', textTransform: 'uppercase', lineHeight: 0.95 }}>
              {player.name}
            </h1>
          </div>
        </div>
      </section>

      <section className="sec-sm">
        <div className="container">
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10, marginBottom: 32 }}>
            {statCards.map(s => (
              <div key={s.label} style={{
                background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10,
                padding: '16px 12px', textAlign: 'center',
              }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, color: 'var(--gold)', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Full Stats Table */}
          <div className="sec-eyebrow">Season Stats</div>
          <div style={{ overflowX: 'auto', marginTop: 8 }}>
            <table className="big-table">
              <thead>
                <tr>
                  <th>PA</th><th>AB</th><th>H</th><th>2B</th><th>3B</th><th>HR</th>
                  <th>R</th><th>RBI</th><th>BB</th><th>HBP</th><th>SB</th>
                  <th>AVG</th><th>OBP</th><th>SLG</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'center' }}>{player.pa}</td>
                  <td style={{ textAlign: 'center' }}>{player.ab}</td>
                  <td style={{ textAlign: 'center' }}>{player.h}</td>
                  <td style={{ textAlign: 'center' }}>{player.doubles}</td>
                  <td style={{ textAlign: 'center' }}>{player.triples}</td>
                  <td style={{ textAlign: 'center' }}>{player.hr}</td>
                  <td style={{ textAlign: 'center' }}>{player.r}</td>
                  <td style={{ textAlign: 'center' }}>{player.rbi}</td>
                  <td style={{ textAlign: 'center' }}>{player.bb}</td>
                  <td style={{ textAlign: 'center' }}>{player.hbp}</td>
                  <td style={{ textAlign: 'center' }}>{player.sb}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{(player.avg as number).toFixed(3).replace(/^0/, '')}</td>
                  <td style={{ textAlign: 'center' }}>{(player.obp as number).toFixed(3).replace(/^0/, '')}</td>
                  <td style={{ textAlign: 'center' }}>{(player.slg as number).toFixed(3).replace(/^0/, '')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Team Games */}
          <div style={{ marginTop: 32 }}>
            <div className="sec-eyebrow">Team Games</div>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 20, textTransform: 'uppercase', marginBottom: 12 }}>
              {team?.name} Schedule
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {playerGames.slice(0, 10).map(g => {
                const isAway = g.awayTeam === player.team;
                const oppId = isAway ? g.homeTeam : g.awayTeam;
                const opp = getTeam(oppId);
                if (!opp) return null;
                const teamScore = isAway ? g.awayScore : g.homeScore;
                const oppScore = isAway ? g.homeScore : g.awayScore;
                const won = teamScore !== null && oppScore !== null && teamScore > oppScore;
                const dateLabel = new Date(g.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                return (
                  <div key={g.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 10px', fontSize: 13, borderLeft: `3px solid ${won ? 'var(--green)' : 'var(--red)'}`,
                    background: 'var(--card)', borderRadius: 6,
                  }}>
                    <span style={{ width: 48, color: 'var(--muted)', fontSize: 11 }}>{dateLabel}</span>
                    <span style={{ width: 14, fontWeight: 900, color: won ? 'var(--green)' : 'var(--red)', fontSize: 12 }}>{won ? 'W' : 'L'}</span>
                    <span style={{ color: 'var(--muted2)', fontSize: 11 }}>{isAway ? '@' : 'vs'}</span>
                    <span style={{ fontWeight: 600, flex: 1 }}>{opp.name}</span>
                    <span style={{ fontWeight: 700 }}>{teamScore}-{oppScore}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            {team && <Link href={`/team/${team.id}`} className="btn-outline">View Full Team Page</Link>}
          </div>
        </div>
      </section>
    </>
  );
}
