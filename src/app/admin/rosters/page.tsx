'use client';

import { useState } from 'react';
import { TEAMS, DIVISIONS } from '@/lib/teams';
import { Division } from '@/lib/types';

export default function AdminRostersPage() {
  const [division, setDivision] = useState<Division>('35+');
  const [team, setTeam] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');

  const divTeams = TEAMS.filter(t => t.division === division);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to Firebase
    alert(`Player added: ${playerName} #${playerNumber} (${playerPosition}) to ${team}`);
    setPlayerName('');
    setPlayerNumber('');
    setPlayerPosition('');
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 6,
    border: '1px solid var(--border2)',
    background: 'var(--card)',
    color: 'var(--white)',
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
  } as const;

  const labelStyle = {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '.08em',
    color: 'var(--muted)',
    marginBottom: 6,
    display: 'block',
  };

  return (
    <section className="sec">
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="sec-eyebrow">Admin</div>
        <h2 className="sec-title">Manage Rosters</h2>

        <form onSubmit={handleAdd} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Division */}
          <div>
            <label style={labelStyle}>Division</label>
            <select
              className="filter-select"
              value={division}
              onChange={e => { setDivision(e.target.value as Division); setTeam(''); }}
              style={{ width: '100%' }}
            >
              {DIVISIONS.map(d => (
                <option key={d} value={d}>{d} Division</option>
              ))}
            </select>
          </div>

          {/* Team */}
          <div>
            <label style={labelStyle}>Team</label>
            <select
              className="filter-select"
              value={team}
              onChange={e => setTeam(e.target.value)}
              required
              style={{ width: '100%' }}
            >
              <option value="">Select team...</option>
              {divTeams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Player Info */}
          <div>
            <label style={labelStyle}>Player Name</label>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              required
              placeholder="First Last"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Number</label>
              <input
                type="text"
                value={playerNumber}
                onChange={e => setPlayerNumber(e.target.value)}
                placeholder="#"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Position</label>
              <select
                className="filter-select"
                value={playerPosition}
                onChange={e => setPlayerPosition(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">Select...</option>
                {['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH', 'UTIL'].map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-gold" style={{ marginTop: 8, width: '100%', textAlign: 'center' }}>
            Add Player
          </button>
        </form>
      </div>
    </section>
  );
}
