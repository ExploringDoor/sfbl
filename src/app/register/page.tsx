'use client';

import { useState } from 'react';
import Link from 'next/link';

const TABS = [
  { id: 'player', label: 'Player Registration' },
  { id: 'team', label: 'Team Registration' },
  { id: 'waiver', label: 'Team Waiver Form' },
];

export default function RegisterPage() {
  const [tab, setTab] = useState('player');

  return (
    <section className="sec">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="sec-eyebrow">Join the League</div>
        <h2 className="sec-title">Register</h2>

        <div className="tab-row" style={{ marginTop: 24 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'player' && (
          <div style={{ marginTop: 24 }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 28 }}>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 20, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
                Player Registration
              </h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20 }}>
                New players are assigned to the Player Pool, then reassigned to league teams based on needs, age, position, and city of residence.
              </p>
              <ul style={{ color: 'var(--muted)', lineHeight: 2, paddingLeft: 20, marginBottom: 24 }}>
                <li><strong>Membership:</strong> $280 per player</li>
                <li><strong>Uniforms:</strong> $25-$45 (team-dependent)</li>
                <li><strong>Divisions:</strong> 18+, 28+, and 35+</li>
                <li><strong>Games:</strong> Sundays only, 12 regular season games + playoffs</li>
              </ul>
              <a
                href="https://sfbl.com/player-registration/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
                style={{ display: 'inline-block' }}
              >
                Register as a Player
              </a>
            </div>
          </div>
        )}

        {tab === 'team' && (
          <div style={{ marginTop: 24 }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 28 }}>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 20, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
                Team Registration
              </h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 24 }}>
                Interested in entering a team in the SFBL? We accept teams for all three divisions (18+, 28+, 35+).
                Contact us for availability and registration details.
              </p>
              <a
                href="https://sfbl.com/team-registration/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
                style={{ display: 'inline-block' }}
              >
                Register a Team
              </a>
            </div>
          </div>
        )}

        {tab === 'waiver' && (
          <div style={{ marginTop: 24 }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 28 }}>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 20, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
                Team Waiver Form
              </h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 24 }}>
                Teams looking to add a player from another team&apos;s roster need to submit a waiver form.
                This form must be completed and approved before the player can participate.
              </p>
              <a
                href="https://sfbl.com/team-waiver-form/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
                style={{ display: 'inline-block' }}
              >
                Submit Waiver Form
              </a>
            </div>
          </div>
        )}

        <div style={{ marginTop: 32, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
          Questions? Contact us at{' '}
          <a href="mailto:playball@sfbl.com" style={{ color: 'var(--gold)', textDecoration: 'none' }}>playball@sfbl.com</a>
          {' '}or call{' '}
          <a href="tel:7863720034" style={{ color: 'var(--gold)', textDecoration: 'none' }}>786-372-0034</a>
        </div>
      </div>
    </section>
  );
}
