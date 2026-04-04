'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { DivisionFilter as DivFilterType } from '@/lib/types';
import { TEAMS } from '@/lib/teams';
import { BATTING_STATS } from '@/lib/players';
import DivisionFilter from '@/components/DivisionFilter';

const BATTING_COLS = [
  { key: 'avg', label: 'AVG', fmt: (v: number) => v.toFixed(3).replace(/^0/, '') },
  { key: 'ab', label: 'AB' },
  { key: 'h', label: 'H' },
  { key: 'r', label: 'R' },
  { key: 'hr', label: 'HR' },
  { key: 'rbi', label: 'RBI' },
  { key: 'bb', label: 'BB' },
  { key: 'sb', label: 'SB' },
  { key: 'obp', label: 'OBP', fmt: (v: number) => v.toFixed(3).replace(/^0/, '') },
  { key: 'slg', label: 'SLG', fmt: (v: number) => v.toFixed(3).replace(/^0/, '') },
  { key: 'ops', label: 'OPS', fmt: (v: number) => v.toFixed(3).replace(/^0/, ''), calc: true },
];

export default function StatsPage() {
  const [divFilter, setDivFilter] = useState<DivFilterType>('all');
  const [sortCol, setSortCol] = useState('avg');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [teamFilter, setTeamFilter] = useState('all');

  const filteredPlayers = useMemo(() => {
    return BATTING_STATS.filter(p => {
      if (divFilter !== 'all' && p.division !== divFilter) return false;
      if (teamFilter !== 'all' && p.team !== teamFilter) return false;
      return true;
    }).map(p => ({
      ...p,
      ops: (p.obp as number) + (p.slg as number),
    }));
  }, [divFilter, teamFilter]);

  const sorted = useMemo(() => {
    return [...filteredPlayers].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortCol] as number;
      const bv = (b as Record<string, unknown>)[sortCol] as number;
      return sortDir === 'desc' ? bv - av : av - bv;
    });
  }, [filteredPlayers, sortCol, sortDir]);

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortCol(col);
      setSortDir('desc');
    }
  };

  const availableTeams = divFilter === 'all'
    ? TEAMS
    : TEAMS.filter(t => t.division === divFilter);

  return (
    <section className="sec">
      <div className="container">
        <div className="sec-eyebrow">Statistics</div>
        <h2 className="sec-title">Batting Leaders</h2>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 8 }}>
          Spring 2026 &middot; Min 10 PA &middot; {BATTING_STATS.length} qualified batters
        </p>

        {/* Filters */}
        <div className="filter-row">
          <DivisionFilter value={divFilter} onChange={(d) => { setDivFilter(d); setTeamFilter('all'); }} />
          <select
            className="filter-select"
            value={teamFilter}
            onChange={e => setTeamFilter(e.target.value)}
          >
            <option value="all">All Teams</option>
            {availableTeams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Stats Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="big-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                {BATTING_COLS.map(col => (
                  <th
                    key={col.key}
                    className={sortCol === col.key ? 'sorted' : ''}
                    onClick={() => handleSort(col.key)}
                    style={{ textAlign: 'center' }}
                  >
                    {col.label}
                    {sortCol === col.key && (
                      <span className="sort-arrow">{sortDir === 'desc' ? '▼' : '▲'}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => {
                const team = TEAMS.find(t => t.id === p.team);
                return (
                  <tr key={`${p.name}-${p.team}`}>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>{i + 1}</td>
                    <td>
                      <Link href={`/player/${encodeURIComponent(p.name as string)}`} className="player-name">{p.name}</Link>
                      {p.jersey && <span style={{ fontSize: 10, color: 'var(--muted2)', marginLeft: 4 }}>#{p.jersey}</span>}
                      <span className="player-team">{team?.abbr || p.team}</span>
                    </td>
                    {BATTING_COLS.map(col => {
                      const val = (p as Record<string, unknown>)[col.key] as number;
                      return (
                        <td key={col.key} style={{ textAlign: 'center', fontWeight: col.key === 'avg' ? 700 : 400 }}>
                          {col.fmt ? col.fmt(val) : val}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>
            No players found for the selected filters.
          </div>
        )}

        <div style={{ marginTop: 24, fontSize: 12, color: 'var(--muted2)', textAlign: 'center' }}>
          Data from BallgameCentral &middot; 35+ and 28+ divisions only (18+ stats not yet entered)
        </div>
      </div>
    </section>
  );
}
