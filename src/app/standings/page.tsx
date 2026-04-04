'use client';

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { TEAMS, DIVISIONS, getTeamsByDivision } from '@/lib/teams';
import { calculateStandings, calculateStreaks } from '@/lib/games';
import { calcPct, calcGB, sortTeams } from '@/lib/stats';
import { DivisionFilter as DivFilterType } from '@/lib/types';
import DivisionFilter from '@/components/DivisionFilter';
import type { Team } from '@/lib/types';

export default function StandingsPage() {
  const [divFilter, setDivFilter] = useState<DivFilterType>('all');

  const teamsWithRecords = useMemo(() => {
    const standings = calculateStandings();
    const streaks = calculateStreaks();
    return TEAMS.map(t => ({
      ...t,
      wins: standings[t.id]?.wins ?? 0,
      losses: standings[t.id]?.losses ?? 0,
      ties: standings[t.id]?.ties ?? 0,
      rs: standings[t.id]?.rs ?? 0,
      ra: standings[t.id]?.ra ?? 0,
      streak: streaks[t.id] || '-',
    }));
  }, []);

  const getTeamsForDiv = (div: typeof DIVISIONS[number]): Team[] =>
    teamsWithRecords.filter(t => t.division === div);

  const divisionsToShow = divFilter === 'all' ? DIVISIONS : [divFilter as typeof DIVISIONS[number]];

  return (
    <section className="sec">
      <div className="container">
        <div className="sec-eyebrow">Standings</div>
        <h2 className="sec-title">Spring 2026</h2>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 8 }}>
          Through March 29, 2026
        </p>

        <div style={{ marginTop: 24 }}>
          <DivisionFilter value={divFilter} onChange={setDivFilter} />
        </div>

        <div className="standings-wrap">
          {divisionsToShow.map(div => {
            const sorted = sortTeams(getTeamsForDiv(div));
            const leader = sorted[0];

            return (
              <div className="div-card" key={div}>
                <div className="div-card-head">
                  <div className="div-card-label">{div} Division</div>
                  <span style={{ fontSize: 11, color: 'var(--muted2)', marginLeft: 'auto' }}>
                    {sorted.length} teams
                  </span>
                </div>
                <table className="s-tbl">
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>W</th>
                      <th>L</th>
                      <th>PCT</th>
                      <th>GB</th>
                      <th>STRK</th>
                      <th className="hide-mobile">RS</th>
                      <th className="hide-mobile">RA</th>
                      <th className="hide-mobile">DIFF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((team, i) => {
                      const diff = team.rs - team.ra;
                      return (
                        <tr key={team.id} className={i === 0 ? 'leader' : ''}>
                          <td style={{ display: 'flex', alignItems: 'center' }}>
                            <span className="rank">{i + 1}</span>
                            {team.logo ? (
                              <img src={team.logo} alt={team.abbr} style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'contain', marginRight: 10, flexShrink: 0 }} />
                            ) : (
                              <span className="team-logo" style={{ background: team.color }}>{team.abbr}</span>
                            )}
                            <Link href={`/team/${team.id}`} className="tname" style={{ textDecoration: 'none', color: 'inherit' }}>
                              {team.name}
                            </Link>
                          </td>
                          <td>{team.wins}</td>
                          <td>{team.losses}</td>
                          <td>{calcPct(team.wins, team.losses)}</td>
                          <td>{calcGB(team, leader)}</td>
                          <td style={{ color: team.streak?.startsWith('W') ? 'var(--green)' : team.streak?.startsWith('L') ? 'var(--red)' : 'var(--muted)', fontWeight: 700 }}>{team.streak || '-'}</td>
                          <td className="hide-mobile">{team.rs}</td>
                          <td className="hide-mobile">{team.ra}</td>
                          <td className="hide-mobile" style={{ color: diff > 0 ? 'var(--green)' : diff < 0 ? 'var(--red)' : 'var(--muted)' }}>
                            {diff > 0 ? '+' : ''}{diff}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
