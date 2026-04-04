'use client';

/* eslint-disable @next/next/no-img-element */
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import Link from 'next/link';
import { getTeam, TEAMS } from '@/lib/teams';
import { GAMES, calculateStandings } from '@/lib/games';
import { BATTING_STATS } from '@/lib/players';
import { calcPct } from '@/lib/stats';

export default function TeamPage() {
  const params = useParams();
  const teamId = params.id as string;
  const team = getTeam(teamId);

  const standings = useMemo(() => calculateStandings(), []);
  const record = standings[teamId] || { wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 };

  const teamGames = useMemo(() => {
    return GAMES
      .filter(g => g.awayTeam === teamId || g.homeTeam === teamId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [teamId]);

  const teamPlayers = useMemo(() => {
    return BATTING_STATS.filter(p => p.team === teamId)
      .sort((a, b) => (b.avg as number) - (a.avg as number));
  }, [teamId]);

  if (!team) {
    return (
      <section className="sec">
        <div className="container" style={{ textAlign: 'center', padding: 60 }}>
          <h2 className="sec-title">Team Not Found</h2>
          <Link href="/" className="btn-outline" style={{ marginTop: 20 }}>Back to Home</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Team Header */}
      <section style={{
        background: `linear-gradient(135deg, ${team.color} 0%, ${team.color2 || team.color}88 100%)`,
        padding: '48px 48px 40px',
        color: '#fff',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {team.logo && (
            <img src={team.logo} alt={team.name} style={{ width: 140, height: 140, objectFit: 'contain' }} />
          )}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', opacity: 0.7 }}>
              {team.division} Division
            </div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(32px,6vw,56px)', textTransform: 'uppercase', lineHeight: 0.95 }}>
              {team.name}
            </h1>
            <div style={{ marginTop: 8, display: 'flex', gap: 24, fontSize: 14, opacity: 0.85 }}>
              <span><strong>{record.wins}-{record.losses}</strong> ({calcPct(record.wins, record.losses)})</span>
              <span>RS: {record.rs} | RA: {record.ra}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sec-sm">
        <div className="container">
          <div className="team-detail-grid">

            {/* Roster / Players */}
            <div>
              <div className="sec-eyebrow">Roster</div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 22, textTransform: 'uppercase', marginBottom: 16 }}>
                Players
              </h3>
              {teamPlayers.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="big-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Player</th>
                        <th style={{ textAlign: 'center' }}>AVG</th>
                        <th style={{ textAlign: 'center' }}>AB</th>
                        <th style={{ textAlign: 'center' }}>H</th>
                        <th style={{ textAlign: 'center' }}>HR</th>
                        <th style={{ textAlign: 'center' }}>RBI</th>
                        <th style={{ textAlign: 'center' }}>OBP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamPlayers.map((p, i) => (
                        <tr key={p.name as string}>
                          <td style={{ color: 'var(--muted)', fontSize: 11 }}>{p.jersey || '-'}</td>
                          <td>
                            <Link href={`/player/${encodeURIComponent(p.name as string)}`} className="player-name">
                              {p.name}
                            </Link>
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 700 }}>{(p.avg as number).toFixed(3).replace(/^0/, '')}</td>
                          <td style={{ textAlign: 'center' }}>{p.ab}</td>
                          <td style={{ textAlign: 'center' }}>{p.h}</td>
                          <td style={{ textAlign: 'center' }}>{p.hr}</td>
                          <td style={{ textAlign: 'center' }}>{p.rbi}</td>
                          <td style={{ textAlign: 'center' }}>{(p.obp as number).toFixed(3).replace(/^0/, '')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)', background: 'var(--card2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  No player stats available yet for this team.
                </div>
              )}
            </div>

            {/* Schedule */}
            <div>
              <div className="sec-eyebrow">Schedule</div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 22, textTransform: 'uppercase', marginBottom: 16 }}>
                Games
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {teamGames.map(g => {
                  const isAway = g.awayTeam === teamId;
                  const oppId = isAway ? g.homeTeam : g.awayTeam;
                  const opp = getTeam(oppId);
                  if (!opp) return null;

                  const isFinal = g.status === 'final';
                  const isPostponed = g.status === 'postponed';
                  const teamScore = isAway ? g.awayScore : g.homeScore;
                  const oppScore = isAway ? g.homeScore : g.awayScore;
                  const won = isFinal && teamScore !== null && oppScore !== null && teamScore > oppScore;
                  const lost = isFinal && teamScore !== null && oppScore !== null && teamScore < oppScore;

                  const dateLabel = new Date(g.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                  return (
                    <div key={g.id} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px', background: 'var(--card)', border: '1px solid var(--border)',
                      borderRadius: 8, fontSize: 13,
                      borderLeft: isFinal ? `3px solid ${won ? 'var(--green)' : lost ? 'var(--red)' : 'var(--border)'}` : '3px solid var(--border)',
                    }}>
                      <span style={{ width: 50, color: 'var(--muted)', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{dateLabel}</span>
                      {isFinal && (
                        <span style={{
                          width: 18, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 13,
                          color: won ? 'var(--green)' : 'var(--red)',
                        }}>
                          {won ? 'W' : 'L'}
                        </span>
                      )}
                      {isPostponed && <span style={{ width: 18, fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>PPD</span>}
                      {!isFinal && !isPostponed && <span style={{ width: 18 }} />}
                      <span style={{ color: 'var(--muted2)', fontSize: 11 }}>{isAway ? '@' : 'vs'}</span>
                      <img src={opp.logo} alt={opp.abbr} style={{ width: 18, height: 18, objectFit: 'contain' }} />
                      <span style={{ fontWeight: 600, flex: 1 }}>{opp.name}</span>
                      {isFinal && teamScore !== null && oppScore !== null && (
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14 }}>
                          {teamScore}-{oppScore}
                        </span>
                      )}
                      {!isFinal && !isPostponed && (
                        <span style={{ fontSize: 11, color: 'var(--gold)' }}>{g.time}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
