'use client';

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { TEAMS, DIVISIONS } from '@/lib/teams';
import { calculateStandings, calculateStreaks } from '@/lib/games';
import { calcPct, calcGB, sortTeams } from '@/lib/stats';
import { DivisionFilter as DivFilterType } from '@/lib/types';
import DivisionFilter from '@/components/DivisionFilter';
import type { Team } from '@/lib/types';

function StandingsCard({ label, teams }: { label: string; teams: Team[] }) {
  const sorted = sortTeams(teams);
  const leader = sorted[0];
  const streaks = calculateStreaks();

  return (
    <div className="div-card">
      <div className="div-card-head">
        <div className="div-card-label">{label}</div>
        <span style={{ fontSize: 11, color: 'var(--muted2)', marginLeft: 'auto' }}>{sorted.length} teams</span>
      </div>
      <table className="s-tbl">
        <thead>
          <tr>
            <th>Team</th><th>W</th><th>L</th><th>PCT</th><th>GB</th><th>STRK</th>
            <th className="hide-mobile">RS</th><th className="hide-mobile">RA</th><th className="hide-mobile">DIFF</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((team, i) => {
            const diff = team.rs - team.ra;
            const streak = streaks[team.id] || '-';
            return (
              <tr key={team.id} className={i === 0 ? 'leader' : ''}>
                <td style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="rank">{i + 1}</span>
                  {team.logo && <img src={team.logo} alt={team.abbr} style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'contain', marginRight: 10, flexShrink: 0 }} />}
                  <Link href={`/team/${team.id}`} className="tname" style={{ textDecoration: 'none', color: 'inherit' }}>{team.name}</Link>
                </td>
                <td>{team.wins}</td>
                <td>{team.losses}</td>
                <td>{calcPct(team.wins, team.losses)}</td>
                <td>{calcGB(team, leader)}</td>
                <td style={{ color: streak.startsWith('W') ? 'var(--green)' : streak.startsWith('L') ? 'var(--red)' : 'var(--muted)', fontWeight: 700 }}>{streak}</td>
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
}

export default function StandingsPage() {
  const [divFilter, setDivFilter] = useState<DivFilterType>('all');

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

  const show18 = divFilter === 'all' || divFilter === '18+';
  const show28 = divFilter === 'all' || divFilter === '28+';
  const show35 = divFilter === 'all' || divFilter === '35+';

  const teams18 = teamsWithRecords.filter(t => t.division === '18+');
  const teams28 = teamsWithRecords.filter(t => t.division === '28+');
  const teams35american = teamsWithRecords.filter(t => t.division === '35+' && t.subDivision === 'American');
  const teams35national = teamsWithRecords.filter(t => t.division === '35+' && t.subDivision === 'National');

  return (
    <section className="sec">
      <div className="container">
        <div className="sec-eyebrow">Standings</div>
        <h2 className="sec-title">Spring 2026</h2>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 8 }}>Through March 29, 2026</p>

        <div style={{ marginTop: 24 }}>
          <DivisionFilter value={divFilter} onChange={setDivFilter} />
        </div>

        <div className="standings-wrap">
          {show18 && <StandingsCard label="18+ Division" teams={teams18} />}
          {show28 && <StandingsCard label="28+ Division" teams={teams28} />}
          {show35 && <StandingsCard label="35+ Division — American" teams={teams35american} />}
          {show35 && <StandingsCard label="35+ Division — National" teams={teams35national} />}
        </div>
      </div>
    </section>
  );
}
