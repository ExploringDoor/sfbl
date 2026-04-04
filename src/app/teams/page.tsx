'use client';

/* eslint-disable @next/next/no-img-element */
import { useMemo } from 'react';
import Link from 'next/link';
import { TEAMS, DIVISIONS, getTeamsByDivision } from '@/lib/teams';
import { calculateStandings } from '@/lib/games';
import { calcPct } from '@/lib/stats';

export default function TeamsPage() {
  const standings = useMemo(() => calculateStandings(), []);

  return (
    <section className="sec">
      <div className="container">
        <div className="sec-eyebrow">Teams</div>
        <h2 className="sec-title">All Teams</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>
          27 teams across 3 divisions &middot; Spring 2026
        </p>

        {DIVISIONS.map(div => {
          const divTeams = getTeamsByDivision(div);
          return (
            <div key={div} style={{ marginTop: 36 }}>
              <h3 style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18,
                letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gold)',
                paddingBottom: 10, borderBottom: '2px solid var(--border)', marginBottom: 16,
              }}>
                {div} Division ({divTeams.length} teams)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
                {divTeams.map(t => {
                  const rec = standings[t.id] || { wins: 0, losses: 0, rs: 0, ra: 0 };
                  return (
                    <Link
                      key={t.id}
                      href={`/team/${t.id}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 18px', background: 'var(--card)',
                        border: '1px solid var(--border)', borderRadius: 12,
                        borderLeft: `4px solid ${t.color}`,
                        textDecoration: 'none', color: 'var(--white)',
                        transition: 'all .2s',
                      }}
                    >
                      <img
                        src={t.logo}
                        alt={t.name}
                        style={{ width: 48, height: 48, objectFit: 'contain', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 18 }}>
                          {t.name}
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                          <span style={{ fontWeight: 700 }}>
                            {rec.wins}-{rec.losses} ({calcPct(rec.wins, rec.losses)})
                          </span>
                          <span>RS: {rec.rs}</span>
                          <span>RA: {rec.ra}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 18, color: 'var(--muted2)' }}>&rsaquo;</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
