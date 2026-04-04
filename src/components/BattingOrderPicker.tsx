'use client';

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';

interface Player {
  name: string;
  num: string;
  pos: string;
}

interface Props {
  teamName: string;
  teamColor: string;
  players: Player[];
  onComplete: (orderedPlayers: Player[]) => void;
  onReset: () => void;
  onAddPlayer?: (player: Player) => void;
}

export default function BattingOrderPicker({ teamName, teamColor, players, onComplete, onReset, onAddPlayer }: Props) {
  const [orderMap, setOrderMap] = useState<Record<number, number>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNum, setNewNum] = useState('');
  // orderMap: key = player index, value = batting order position (1-based)

  const assignedCount = Object.keys(orderMap).length;
  const nextOrder = assignedCount + 1;
  const allAssigned = assignedCount >= players.length;

  const tapPlayer = (idx: number) => {
    if (orderMap[idx] !== undefined) {
      // Un-assign: remove this and all after it
      const removedOrder = orderMap[idx];
      const newMap: Record<number, number> = {};
      Object.entries(orderMap).forEach(([k, v]) => {
        if (v < removedOrder) newMap[parseInt(k)] = v;
      });
      setOrderMap(newMap);
    } else {
      // Assign next order
      setOrderMap(prev => ({ ...prev, [idx]: nextOrder }));
    }
  };

  const handleSetOrder = () => {
    // Build ordered list
    const entries = Object.entries(orderMap).sort(([, a], [, b]) => a - b);
    const ordered = entries.map(([idx]) => players[parseInt(idx)]);
    // Add any unassigned players at the end
    players.forEach((p, i) => {
      if (orderMap[i] === undefined) ordered.push(p);
    });
    onComplete(ordered);
  };

  const handleReset = () => {
    setOrderMap({});
    onReset();
  };

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '2px solid ' + teamColor, marginBottom: 24 }}>
      {/* Header */}
      <div style={{
        background: teamColor, color: '#fff', padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 22, textTransform: 'uppercase', letterSpacing: '.04em' }}>
            {teamName}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginTop: 2 }}>
            Tap players in batting order (1 → 2 → 3…)
          </div>
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 900 }}>
          <span style={{ color: '#FFD700' }}>{assignedCount}</span>
          <span style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,.4)' }}>/{players.length}</span>
        </div>
      </div>

      {/* Player Cards Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 10, padding: 14, background: 'var(--bg)',
      }}>
        {players.map((p, i) => {
          const order = orderMap[i];
          const isAssigned = order !== undefined;

          return (
            <div
              key={i}
              onClick={() => tapPlayer(i)}
              style={{
                position: 'relative',
                padding: '16px 12px 12px',
                borderRadius: 10,
                background: isAssigned ? teamColor : 'var(--card)',
                border: `2px solid ${isAssigned ? teamColor : 'var(--border)'}`,
                color: isAssigned ? '#fff' : 'var(--white)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all .15s',
                userSelect: 'none',
              }}
            >
              {/* Order badge */}
              {isAssigned && (
                <div style={{
                  position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                  width: 24, height: 24, borderRadius: '50%',
                  background: '#FFD700', color: '#000',
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,.2)',
                }}>
                  {order}
                </div>
              )}

              {/* Position bar */}
              <div style={{
                width: 32, height: 4, borderRadius: 2, margin: '0 auto 8px',
                background: isAssigned ? 'rgba(255,255,255,.3)' : 'var(--border)',
              }} />

              {/* Number - big and visible */}
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
                fontSize: 22, color: isAssigned ? 'rgba(255,255,255,.7)' : 'var(--gold)',
                marginBottom: 2,
              }}>
                #{p.num || '?'}
              </div>

              {/* Name */}
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                fontSize: 14, textTransform: 'uppercase', lineHeight: 1.2,
              }}>
                {p.name || `Player #${p.num}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Player */}
      <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
        {!showAddForm ? (
          <button onClick={() => setShowAddForm(true)} style={{ fontSize: 12, color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
            + Add Player
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={newNum} onChange={e => setNewNum(e.target.value)} placeholder="#" style={{ width: 50, padding: '8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--white)', fontSize: 14, fontWeight: 700, textAlign: 'center', outline: 'none' }} />
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Player name (optional)" style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--white)', fontSize: 13, outline: 'none' }} />
            <button onClick={() => {
              if (newNum || newName) {
                onAddPlayer?.({ name: newName || `#${newNum}`, num: newNum, pos: '' });
                setNewName(''); setNewNum(''); setShowAddForm(false);
              }
            }} style={{ padding: '8px 14px', borderRadius: 6, background: teamColor, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>Add</button>
            <button onClick={() => setShowAddForm(false)} style={{ padding: '8px 10px', borderRadius: 6, background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer', fontSize: 12 }}>✕</button>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div style={{
        display: 'flex', gap: 10, padding: '12px 14px',
        borderTop: '1px solid var(--border)', background: 'var(--bg)',
      }}>
        <button
          onClick={handleReset}
          style={{
            padding: '12px 20px', borderRadius: 8,
            border: '1px solid var(--red)', color: 'var(--red)',
            background: 'transparent', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: '.06em', textTransform: 'uppercase',
          }}
        >
          ↻ Reset
        </button>
        <button
          onClick={handleSetOrder}
          disabled={assignedCount === 0}
          style={{
            flex: 1, padding: '12px 20px', borderRadius: 8,
            background: assignedCount > 0 ? teamColor : 'var(--card2)',
            color: assignedCount > 0 ? '#fff' : 'var(--muted)',
            border: 'none', fontWeight: 900, fontSize: 15,
            cursor: assignedCount > 0 ? 'pointer' : 'not-allowed',
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: '.06em', textTransform: 'uppercase',
          }}
        >
          Set Order ({assignedCount}/{players.length} tapped)
        </button>
      </div>
    </div>
  );
}
