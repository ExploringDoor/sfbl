'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { DivisionFilter as DivFilterType } from '@/lib/types';
import { TEAMS } from '@/lib/teams';
import { BATTING_STATS } from '@/lib/players';
import DivisionFilter from '@/components/DivisionFilter';

const CATEGORIES = [
  { key: 'avg', label: 'Batting Average', stat: 'AVG', fmt: (v: number) => v.toFixed(3).replace(/^0/, '') },
  { key: 'hr', label: 'Home Runs', stat: 'HR' },
  { key: 'rbi', label: 'RBI', stat: 'RBI' },
  { key: 'r', label: 'Runs', stat: 'R' },
  { key: 'h', label: 'Hits', stat: 'H' },
  { key: 'sb', label: 'Stolen Bases', stat: 'SB' },
  { key: 'bb', label: 'Walks', stat: 'BB' },
  { key: 'obp', label: 'On-Base Pct', stat: 'OBP', fmt: (v: number) => v.toFixed(3).replace(/^0/, '') },
  { key: 'slg', label: 'Slugging Pct', stat: 'SLG', fmt: (v: number) => v.toFixed(3).replace(/^0/, '') },
  { key: 'doubles', label: 'Doubles', stat: '2B' },
];

export default function LeadersPage() {
  const [divFilter, setDivFilter] = useState<DivFilterType>('all');

  const leaders = useMemo(() => {
    const filtered = divFilter === 'all'
      ? BATTING_STATS
      : BATTING_STATS.filter(p => p.division === divFilter);

    return CATEGORIES.map(cat => {
      const sorted = [...filtered].sort((a, b) => {
        const av = (a as Record<string, unknown>)[cat.key] as number;
        const bv = (b as Record<string, unknown>)[cat.key] as number;
        return bv - av;
      });
      return {
        ...cat,
        leaders: sorted.slice(0, 5).map(p => {
          const teamObj = TEAMS.find(t => t.id === p.team);
          return {
            name: p.name as string,
            team: teamObj?.name || (p.team as string),
            teamId: p.team as string,
            value: cat.fmt
              ? cat.fmt((p as Record<string, unknown>)[cat.key] as number)
              : String((p as Record<string, unknown>)[cat.key]),
          };
        }),
      };
    }).filter(cat => cat.leaders.length > 0);
  }, [divFilter]);

  return (
    <section className="sec">
      <div className="container">
        <div className="sec-eyebrow">League Leaders</div>
        <h2 className="sec-title">Spring 2026</h2>

        <div style={{ marginTop: 24 }}>
          <DivisionFilter value={divFilter} onChange={setDivFilter} />
        </div>

        <div className="leaders-grid">
          {leaders.map(cat => {
            const top = cat.leaders[0];
            const runners = cat.leaders.slice(1);

            return (
              <div className="ldr-card" key={cat.key}>
                <div className="ldr-ghost">{cat.stat}</div>
                <div className="ldr-cat">{cat.label}</div>
                {top && (
                  <>
                    <div className="ldr-val">{top.value}</div>
                    <Link href={`/player/${encodeURIComponent(top.name)}`} className="ldr-name" style={{ textDecoration: 'none', color: 'var(--white)', cursor: 'pointer' }}>{top.name}</Link>
                    <Link href={`/team/${top.teamId}`} className="ldr-team" style={{ textDecoration: 'none' }}>{top.team}</Link>
                  </>
                )}
                {runners.length > 0 && (
                  <div className="ldr-runners">
                    {runners.map((r, i) => (
                      <div className="rrow" key={i}>
                        <span className="rpos">{i + 2}</span>
                        <Link href={`/player/${encodeURIComponent(r.name)}`} className="rname" style={{ textDecoration: 'none', color: 'var(--white)' }}>{r.name}</Link>
                        <span className="rval">{r.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 24, fontSize: 12, color: 'var(--muted2)', textAlign: 'center' }}>
          Data from BallgameCentral &middot; Min 10 PA
        </div>
      </div>
    </section>
  );
}
