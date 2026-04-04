'use client';

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { TEAMS, getTeamsByDivision, getTeam } from '@/lib/teams';
import { DIVISIONS } from '@/lib/teams';
import { GAMES, calculateStandings, calculateStreaks, getTeamRecord } from '@/lib/games';
import { calcPct, calcGB, sortTeams } from '@/lib/stats';
import GamePopup from '@/components/GamePopup';
import type { Team, Game } from '@/lib/types';

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const teamsWithRecords = useMemo(() => {
    const standings = calculateStandings();
    return TEAMS.map(t => ({
      ...t,
      wins: standings[t.id]?.wins ?? 0,
      losses: standings[t.id]?.losses ?? 0,
      ties: standings[t.id]?.ties ?? 0,
      rs: standings[t.id]?.rs ?? 0,
      ra: standings[t.id]?.ra ?? 0,
    }));
  }, []);

  const getTeamsForDiv = (div: typeof DIVISIONS[number]): Team[] =>
    teamsWithRecords.filter(t => t.division === div);

  const recentGames = GAMES
    .filter(g => g.status === 'final')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  const upcomingGames = GAMES
    .filter(g => g.status === 'scheduled')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  return (
    <>
      {/* Hero Banner */}
      <section style={{ padding: 0, background: 'var(--bg)' }}>
        <img
          src="/logos/make_this_image_202604032344.png"
          alt="South Florida Baseball League"
          style={{ width: '50%', height: 'auto', display: 'block', margin: '0 auto' }}
        />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', padding: '16px 0 24px' }}>
          <Link href="/schedule" className="btn-gold">View Schedule</Link>
          <Link href="/standings" className="btn-outline">Standings</Link>
          <Link href="/stats" className="btn-outline">Player Stats</Link>
        </div>
      </section>

      {/* Main Content: Scores Left + Standings Right */}
      <section className="sec-sm">
        <div className="container">
          <div className="home-grid">
            {/* Left: Scores */}
            <div className="home-main">
              <div className="sec-eyebrow">Latest Scores</div>
              <h2 className="sec-title" style={{ fontSize: 'clamp(28px,4vw,40px)', marginBottom: 16 }}>Recent Results</h2>
              <div className="home-scores-grid">
                {recentGames.map((g) => {
                  const away = getTeam(g.awayTeam);
                  const home = getTeam(g.homeTeam);
                  if (!away || !home || g.awayScore === null || g.homeScore === null) return null;
                  const awayWon = g.awayScore > g.homeScore;
                  const dateLabel = new Date(g.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });

                  return (
                    <div className="sched-game-block" key={g.id} onClick={() => setSelectedGame(g)}>
                      <div className="gb-left">
                        <div className="gb-status-label">FINAL &middot; {dateLabel}</div>
                        <div className="gb-team-row">
                          <img src={away.logo} alt={away.abbr} className="gb-logo" style={{ borderColor: away.color }} />
                          <span className="gb-name-wrap">
                            <span className={`gb-name ${awayWon ? 'winner' : 'loser'}`}>{away.name}</span>
                            <span className="gb-rec">({getTeamRecord(g.awayTeam)})</span>
                          </span>
                          <span className={`gb-score ${awayWon ? 'winner' : 'loser'}`}>{g.awayScore}</span>
                        </div>
                        <div className="gb-team-row">
                          <img src={home.logo} alt={home.abbr} className="gb-logo" style={{ borderColor: home.color }} />
                          <span className="gb-name-wrap">
                            <span className={`gb-name ${!awayWon ? 'winner' : 'loser'}`}>{home.name}</span>
                            <span className="gb-rec">({getTeamRecord(g.homeTeam)})</span>
                          </span>
                          <span className={`gb-score ${!awayWon ? 'winner' : 'loser'}`}>{g.homeScore}</span>
                        </div>
                      </div>
                      <div className="gb-mid">
                        <div className="gb-field">{g.field !== 'TBD' ? g.field : g.division + ' Div'}</div>
                        <div className="gb-time">{g.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Link href="/schedule" className="btn-outline">Full Schedule &amp; Scores</Link>
              </div>

              {/* Upcoming */}
              {upcomingGames.length > 0 && (
                <div style={{ marginTop: 40 }}>
                  <div className="sec-eyebrow">Coming Up</div>
                  <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 24, textTransform: 'uppercase', marginBottom: 12 }}>
                    Upcoming Games
                  </h3>
                  <div className="sched-wrap">
                    {upcomingGames.map(g => {
                      const away = getTeam(g.awayTeam);
                      const home = getTeam(g.homeTeam);
                      if (!away || !home) return null;
                      const dateLabel = new Date(g.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                      return (
                        <div className="sched-game-block" key={g.id}>
                          <div className="gb-left">
                            <div className="gb-status-label upcoming">{dateLabel} &middot; {g.time}</div>
                            <div className="gb-team-row">
                              <img src={away.logo} alt={away.abbr} className="gb-logo" style={{ borderColor: away.color }} />
                              <span className="gb-name">{away.name}</span>
                            </div>
                            <div className="gb-team-row">
                              <img src={home.logo} alt={home.abbr} className="gb-logo" style={{ borderColor: home.color }} />
                              <span className="gb-name">{home.name}</span>
                            </div>
                          </div>
                          <div className="gb-mid">
                            <div className="gb-field">{g.field}</div>
                            <div className="gb-div-badge">{g.division} Division</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Compact Standings */}
            <div className="home-sidebar">
              <div className="sec-eyebrow">Standings</div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 20, textTransform: 'uppercase', marginBottom: 4 }}>
                Spring 2026
              </h3>
              <div style={{ fontSize: 10, color: 'var(--muted2)', marginBottom: 16 }}>Through Mar 29, 2026</div>
              {(() => {
                const streaks = calculateStreaks();
                const sections = [
                  { label: '18+ Division', teams: getTeamsForDiv('18+') },
                  { label: '28+ Division', teams: getTeamsForDiv('28+') },
                  { label: '35+ American', teams: teamsWithRecords.filter(t => t.division === '35+' && t.subDivision === 'American') },
                  { label: '35+ National', teams: teamsWithRecords.filter(t => t.division === '35+' && t.subDivision === 'National') },
                ];
                return sections.map(({ label, teams: divTeams }) => {
                const sorted = sortTeams(divTeams);
                const leader = sorted[0];
                return (
                  <div key={label} className="sidebar-standings">
                    <div className="sidebar-div-label">{label}</div>
                    <table className="sidebar-tbl">
                      <thead>
                        <tr><th>Team</th><th>W</th><th>L</th><th>PCT</th><th>GB</th><th>STRK</th></tr>
                      </thead>
                      <tbody>
                        {sorted.map((t, i) => (
                          <tr key={t.id} className={i === 0 ? 'leader' : ''}>
                            <td>
                              <Link href={`/team/${t.id}`} className="sidebar-team-link">
                                <img src={t.logo} alt={t.abbr} className="sidebar-logo" />
                                <span className="sidebar-tname">{t.name}</span>
                              </Link>
                            </td>
                            <td>{t.wins}</td>
                            <td>{t.losses}</td>
                            <td>{calcPct(t.wins, t.losses)}</td>
                            <td>{calcGB(t, leader)}</td>
                            <td style={{ color: streaks[t.id]?.startsWith('W') ? 'var(--green)' : streaks[t.id]?.startsWith('L') ? 'var(--red)' : 'var(--muted)', fontWeight: 600, fontSize: 10 }}>{streaks[t.id] || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
                });
              })()}
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <Link href="/standings" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none' }}>
                  Full Standings &raquo;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Teams Grid */}
      <section className="sec-sm">
        <div className="container">
          <div className="sec-eyebrow">Teams</div>
          <h2 className="sec-title" style={{ fontSize: 'clamp(28px,4vw,40px)', marginBottom: 24 }}>27 Teams &middot; 3 Divisions</h2>
          {DIVISIONS.map(div => {
            const divTeams = getTeamsByDivision(div);
            return (
              <div key={div} style={{ marginTop: 24 }}>
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
                  {div} Division
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 6 }}>
                  {divTeams.map(t => (
                    <Link
                      key={t.id}
                      href={`/team/${t.id}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 12px', background: 'var(--card)',
                        border: '1px solid var(--border)', borderRadius: 8,
                        borderLeft: `3px solid ${t.color}`, textDecoration: 'none', color: 'var(--white)',
                        transition: 'background .15s',
                      }}
                    >
                      <img src={t.logo} alt={t.abbr} style={{ width: 28, height: 28, borderRadius: 4, objectFit: 'contain', flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 14 }}>{t.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="divider" />

      {/* League Info */}
      <section className="sec-sm" style={{ background: 'var(--bg2)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 700 }}>
          <div className="sec-eyebrow">About the League</div>
          <h2 className="sec-title" style={{ fontSize: 'clamp(28px,4vw,40px)' }}>34 Years of Baseball</h2>
          <p style={{ marginTop: 16, color: 'var(--muted)', lineHeight: 1.8, fontSize: 14 }}>
            The South Florida Baseball League is one of the premier adult baseball
            organizations in Florida, operating in Dade, Broward and Palm Beach counties.
          </p>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            {[
              { val: '65+', label: 'Seasons' },
              { val: '27', label: 'Teams' },
              { val: '3', label: 'Divisions' },
              { val: 'WOOD', label: 'Bat Only' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 36, color: 'var(--gold)', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GamePopup game={selectedGame} onClose={() => setSelectedGame(null)} />
    </>
  );
}
