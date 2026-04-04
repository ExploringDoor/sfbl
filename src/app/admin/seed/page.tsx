'use client';

import { useState } from 'react';
import { getDb } from '@/lib/firebase';
import { collection, getDocs, doc, writeBatch, addDoc } from 'firebase/firestore';
import { GAMES } from '@/lib/games';
import { TEAMS } from '@/lib/teams';
import { BATTING_STATS } from '@/lib/players';

// Map dates to week numbers
function getWeekNumber(date: string): number {
  const weeks: Record<string, number> = {
    '2026-02-15': 1, '2026-02-22': 2, '2026-03-01': 3, '2026-03-08': 4,
    '2026-03-15': 5, '2026-03-22': 6, '2026-03-29': 7,
    '2026-04-05': 8, '2026-04-12': 8, '2026-04-19': 9, '2026-04-26': 10,
  };
  return weeks[date] || 0;
}

function getDayOfWeek(date: string): string {
  const d = new Date(date + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

// Map team IDs to short names (DVSL admin uses 'short' field)
function getTeamShort(teamId: string): string {
  const t = TEAMS.find(t => t.id === teamId);
  return t?.abbr || teamId;
}

export default function SeedPage() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  const clearCollection = async (name: string) => {
    const db = getDb();
    const snap = await getDocs(collection(db, name));
    if (snap.docs.length === 0) return 0;
    // Delete in batches of 450
    let deleted = 0;
    let batch = writeBatch(db);
    let count = 0;
    for (const d of snap.docs) {
      batch.delete(d.ref);
      count++;
      deleted++;
      if (count >= 450) {
        await batch.commit();
        batch = writeBatch(db);
        count = 0;
      }
    }
    if (count > 0) await batch.commit();
    return deleted;
  };

  const seedGames = async () => {
    addLog('Clearing existing games...');
    const deleted = await clearCollection('games');
    if (deleted > 0) addLog(`Deleted ${deleted} existing games`);

    addLog('Seeding games...');
    const db = getDb();
    let count = 0;
    let batch = writeBatch(db);
    let batchCount = 0;

    for (const game of GAMES) {
      const ref = doc(collection(db, 'games'));
      const isFinal = game.status === 'final';
      const isPostponed = game.status === 'postponed';

      // Use DVSL admin field names
      batch.set(ref, {
        away: game.awayTeam,
        home: game.homeTeam,
        away_score: game.awayScore ?? 0,
        home_score: game.homeScore ?? 0,
        done: isFinal,
        postponed: isPostponed,
        date: game.date,
        day: getDayOfWeek(game.date),
        time: game.time,
        field: game.field,
        div: game.division,
        wk: getWeekNumber(game.date),
        active: true,
      });
      count++;
      batchCount++;

      if (batchCount >= 450) {
        await batch.commit();
        addLog(`Wrote batch: ${count} games so far...`);
        batch = writeBatch(db);
        batchCount = 0;
      }
    }

    if (batchCount > 0) await batch.commit();
    addLog(`✅ Seeded ${count} games!`);
  };

  const seedTeams = async () => {
    addLog('Clearing existing teams...');
    const deleted = await clearCollection('teams');
    if (deleted > 0) addLog(`Deleted ${deleted} existing teams`);

    addLog('Seeding teams...');
    const db = getDb();
    let count = 0;

    for (const team of TEAMS) {
      await addDoc(collection(db, 'teams'), {
        id: team.id,
        name: team.name,
        short: team.abbr,
        div: team.division,
        subDiv: team.subDivision || null,
        color: team.color,
        color2: team.color2 || null,
        logo: team.logo || null,
        active: true,
        w: 0, l: 0, t: 0, rs: 0, ra: 0, pct: 0, gb: '-', streak: '',
      });
      count++;
    }
    addLog(`✅ Seeded ${count} teams!`);
  };

  const seedPlayers = async () => {
    addLog('Clearing existing players...');
    const deleted = await clearCollection('players');
    if (deleted > 0) addLog(`Deleted ${deleted} existing players`);

    addLog('Seeding players...');
    const db = getDb();
    let count = 0;

    for (const p of BATTING_STATS) {
      await addDoc(collection(db, 'players'), {
        name: p.name as string,
        team: p.team as string,
        num: (p.jersey as string) || '',
        pos: '',
        active: true,
      });
      count++;
    }
    addLog(`✅ Seeded ${count} players!`);
  };

  const seedAll = async () => {
    setRunning(true);
    try {
      await seedGames();
      await seedTeams();
      await seedPlayers();
      addLog('🎉 All data seeded! Go to /admin to use the dashboard.');
    } catch (e) {
      addLog(`❌ Error: ${e}`);
    }
    setRunning(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0c1829', color: '#ededed', padding: '120px 40px 40px' }}>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 32, textTransform: 'uppercase', marginBottom: 8 }}>
        Seed Firebase Database
      </h1>
      <p style={{ color: 'rgba(255,255,255,.4)', marginBottom: 32 }}>
        Push all {GAMES.length} games, {TEAMS.length} teams, and {BATTING_STATS.length} players into Firestore using DVSL-compatible field names.
      </p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <button onClick={seedAll} disabled={running}
          style={{ padding: '14px 28px', borderRadius: 8, background: '#22c55e', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.5 : 1 }}>
          {running ? 'Running...' : '🚀 Seed Everything'}
        </button>
        <button onClick={() => { setRunning(true); seedGames().then(() => setRunning(false)); }} disabled={running}
          style={{ padding: '14px 28px', borderRadius: 8, background: '#5b9aff', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.5 : 1 }}>
          Games Only ({GAMES.length})
        </button>
        <button onClick={() => { setRunning(true); seedTeams().then(() => setRunning(false)); }} disabled={running}
          style={{ padding: '14px 28px', borderRadius: 8, background: '#5b9aff', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.5 : 1 }}>
          Teams Only ({TEAMS.length})
        </button>
        <button onClick={() => { setRunning(true); seedPlayers().then(() => setRunning(false)); }} disabled={running}
          style={{ padding: '14px 28px', borderRadius: 8, background: '#5b9aff', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.5 : 1 }}>
          Players Only ({BATTING_STATS.length})
        </button>
      </div>

      <div style={{ background: '#0f1628', borderRadius: 10, padding: 20, border: '1px solid rgba(255,255,255,.08)', fontFamily: 'monospace', fontSize: 13, minHeight: 300, maxHeight: 500, overflowY: 'auto' }}>
        {log.length === 0 && <div style={{ color: 'rgba(255,255,255,.3)' }}>Click a button to start seeding...</div>}
        {log.map((msg, i) => (
          <div key={i} style={{ padding: '4px 0', color: msg.startsWith('✅') || msg.startsWith('🎉') ? '#4ade80' : msg.startsWith('❌') ? '#f87171' : '#ededed' }}>
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}
