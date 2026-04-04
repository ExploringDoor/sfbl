'use client';

import { useState } from 'react';
import { TEAMS, DIVISIONS } from '@/lib/teams';
import { FIELDS } from '@/lib/fields';
import { Division } from '@/lib/types';

export default function AdminGamesPage() {
  const [division, setDivision] = useState<Division>('35+');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [field, setField] = useState(FIELDS[0].name);
  const [awayTeam, setAwayTeam] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [homeScore, setHomeScore] = useState('');

  const divTeams = TEAMS.filter(t => t.division === division);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to Firebase
    alert(`Game saved: ${awayTeam} ${awayScore} @ ${homeTeam} ${homeScore}`);
  };

  return (
    <section className="sec">
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="sec-eyebrow">Admin</div>
        <h2 className="sec-title">Enter Game Score</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Division */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>
              Division
            </label>
            <select
              className="filter-select"
              value={division}
              onChange={e => { setDivision(e.target.value as Division); setAwayTeam(''); setHomeTeam(''); }}
              style={{ width: '100%' }}
            >
              {DIVISIONS.map(d => (
                <option key={d} value={d}>{d} Division</option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 6,
                  border: '1px solid var(--border2)', background: 'var(--card)',
                  color: 'var(--white)', fontSize: 14, fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 6,
                  border: '1px solid var(--border2)', background: 'var(--card)',
                  color: 'var(--white)', fontSize: 14, fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
          </div>

          {/* Field */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>
              Field
            </label>
            <select
              className="filter-select"
              value={field}
              onChange={e => setField(e.target.value)}
              style={{ width: '100%' }}
            >
              {FIELDS.map(f => (
                <option key={f.id} value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Teams & Scores */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>
                Away Team
              </label>
              <select
                className="filter-select"
                value={awayTeam}
                onChange={e => setAwayTeam(e.target.value)}
                required
                style={{ width: '100%' }}
              >
                <option value="">Select team...</option>
                {divTeams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>
                Away Score
              </label>
              <input
                type="number"
                value={awayScore}
                onChange={e => setAwayScore(e.target.value)}
                min="0"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 6,
                  border: '1px solid var(--border2)', background: 'var(--card)',
                  color: 'var(--white)', fontSize: 20, fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900, textAlign: 'center',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>
                Home Team
              </label>
              <select
                className="filter-select"
                value={homeTeam}
                onChange={e => setHomeTeam(e.target.value)}
                required
                style={{ width: '100%' }}
              >
                <option value="">Select team...</option>
                {divTeams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>
                Home Score
              </label>
              <input
                type="number"
                value={homeScore}
                onChange={e => setHomeScore(e.target.value)}
                min="0"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 6,
                  border: '1px solid var(--border2)', background: 'var(--card)',
                  color: 'var(--white)', fontSize: 20, fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900, textAlign: 'center',
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn-gold" style={{ marginTop: 8, width: '100%', textAlign: 'center' }}>
            Save Game
          </button>
        </form>
      </div>
    </section>
  );
}
