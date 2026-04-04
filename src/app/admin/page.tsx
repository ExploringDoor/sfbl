'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  if (!authenticated) {
    return (
      <section className="sec">
        <div className="container" style={{ maxWidth: 400, textAlign: 'center' }}>
          <div className="sec-eyebrow">Admin</div>
          <h2 className="sec-title">Sign In</h2>
          <div style={{ marginTop: 32 }}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              onKeyDown={e => { if (e.key === 'Enter') setAuthenticated(true); }}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: 8,
                border: '1px solid var(--border2)',
                background: 'var(--card)',
                color: 'var(--white)',
                fontSize: 16,
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
              }}
            />
            <button
              onClick={() => setAuthenticated(true)}
              className="btn-gold"
              style={{ marginTop: 16, width: '100%' }}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>
    );
  }

  const adminCards = [
    { title: 'Enter Game Scores', desc: 'Add box scores and game results', href: '/admin/games', icon: '9' },
    { title: 'Manage Rosters', desc: 'Add/edit players and team rosters', href: '/admin/rosters', icon: '25' },
    { title: 'Schedule', desc: 'Manage upcoming schedule', href: '/schedule', icon: '31' },
    { title: 'View Stats', desc: 'Check player and team statistics', href: '/stats', icon: '42' },
  ];

  return (
    <section className="sec">
      <div className="container">
        <div className="sec-eyebrow">Admin Dashboard</div>
        <h2 className="sec-title">SFBL Admin</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 16,
          marginTop: 32,
        }}>
          {adminCards.map(card => (
            <Link
              key={card.title}
              href={card.href}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: 24,
                textDecoration: 'none',
                color: 'var(--white)',
                transition: 'all .2s',
                display: 'block',
              }}
            >
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                fontSize: 48,
                color: 'var(--gold)',
                opacity: 0.15,
                lineHeight: 1,
                marginBottom: 8,
              }}>
                {card.icon}
              </div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                textTransform: 'uppercase',
                letterSpacing: '.04em',
              }}>
                {card.title}
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                {card.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
