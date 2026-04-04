'use client';

import { DIVISIONS } from '@/lib/teams';

export default function PlayoffsPage() {
  return (
    <section className="sec">
      <div className="container">
        <div className="sec-eyebrow">Postseason</div>
        <h2 className="sec-title">Spring 2026 Playoffs</h2>

        <p style={{ marginTop: 16, color: 'var(--muted)', maxWidth: 600 }}>
          Each division holds its own playoff tournament: Quarterfinals, Semifinals, and Championship.
          Championship winners receive $1,000 cash prize, team trophy, MVP trophy, championship t-shirts,
          and authentic SFBL logo caps.
        </p>

        {DIVISIONS.map(div => (
          <div key={div} style={{ marginTop: 48 }}>
            <h3 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 20,
              textTransform: 'uppercase',
              letterSpacing: '.08em',
              color: 'var(--gold)',
              marginBottom: 20,
              paddingBottom: 10,
              borderBottom: '2px solid var(--border)',
            }}>
              {div} Division Bracket
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              minHeight: 200,
            }}>
              {['Quarterfinals', 'Semifinals', 'Championship'].map(round => (
                <div key={round}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: 12,
                    textAlign: 'center',
                  }}>
                    {round}
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    alignItems: 'center',
                  }}>
                    {Array.from({ length: round === 'Quarterfinals' ? 4 : round === 'Semifinals' ? 2 : 1 }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '100%',
                          maxWidth: 220,
                          background: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          padding: '10px 14px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 600 }}>
                          <span style={{ color: 'var(--muted)' }}>TBD</span>
                          <span style={{ color: 'var(--muted2)' }}>-</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, fontWeight: 600 }}>
                          <span style={{ color: 'var(--muted)' }}>TBD</span>
                          <span style={{ color: 'var(--muted2)' }}>-</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
