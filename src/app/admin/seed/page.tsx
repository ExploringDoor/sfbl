'use client';

import { useState } from 'react';
import { getDb } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { GAMES } from '@/lib/games';
import { TEAMS } from '@/lib/teams';
import { BATTING_STATS } from '@/lib/players';

export default function SeedPage() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  const seedGames = async () => {
    setRunning(true);
    addLog('Seeding games...');
    const db = getDb();

    // Clear existing games
    addLog('Clearing existing games...');
    const existing = await getDocs(collection(db, 'games'));
    const batch1 = writeBatch(db);
    existing.docs.forEach(d => batch1.delete(d.ref));
    if (existing.docs.length > 0) {
      await batch1.commit();
      addLog(`Deleted ${existing.docs.length} existing games`);
    }

    // Add all games in batches of 500
    let count = 0;
    let batch = writeBatch(db);
    let batchCount = 0;

    for (const game of GAMES) {
      const ref = doc(collection(db, 'games'));
      batch.set(ref, {
        gameId: game.id,
        date: game.date,
        time: game.time,
        field: game.field,
        division: game.division,
        awayTeam: game.awayTeam,
        homeTeam: game.homeTeam,
        awayScore: game.awayScore,
        homeScore: game.homeScore,
        status: game.status,
        awayHits: null,
        homeHits: null,
        awayErrors: null,
        homeErrors: null,
        recap: null,
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

    if (batchCount > 0) {
      await batch.commit();
    }

    addLog(`✅ Seeded ${count} games!`);
    setRunning(false);
  };

  const seedTeams = async () => {
    setRunning(true);
    addLog('Seeding teams...');
    const db = getDb();

    const existing = await getDocs(collection(db, 'teams'));
    const batch1 = writeBatch(db);
    existing.docs.forEach(d => batch1.delete(d.ref));
    if (existing.docs.length > 0) {
      await batch1.commit();
      addLog(`Deleted ${existing.docs.length} existing teams`);
    }

    let count = 0;
    for (const team of TEAMS) {
      await addDoc(collection(db, 'teams'), {
        teamId: team.id,
        name: team.name,
        abbr: team.abbr,
        division: team.division,
        subDivision: team.subDivision || null,
        color: team.color,
        color2: team.color2 || null,
        logo: team.logo || null,
      });
      count++;
    }
    addLog(`✅ Seeded ${count} teams!`);
    setRunning(false);
  };

  const seedPlayers = async () => {
    setRunning(true);
    addLog('Seeding players...');
    const db = getDb();

    const existing = await getDocs(collection(db, 'players'));
    const batch1 = writeBatch(db);
    existing.docs.forEach(d => batch1.delete(d.ref));
    if (existing.docs.length > 0) {
      await batch1.commit();
      addLog(`Deleted ${existing.docs.length} existing players`);
    }

    let count = 0;
    for (const p of BATTING_STATS) {
      await addDoc(collection(db, 'players'), {
        name: p.name,
        team: p.team,
        division: p.division,
        number: p.jersey || null,
        position: null,
        battingStats: {
          avg: p.avg, ab: p.ab, h: p.h, r: p.r, rbi: p.rbi, pa: p.pa,
          slg: p.slg, obp: p.obp, doubles: p.doubles, triples: p.triples,
          hr: p.hr, sb: p.sb, bb: p.bb, hbp: p.hbp,
        },
      });
      count++;
    }
    addLog(`✅ Seeded ${count} players!`);
    setRunning(false);
  };

  const seedAll = async () => {
    await seedGames();
    await seedTeams();
    await seedPlayers();
    addLog('🎉 All data seeded!');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0c1829', color: '#ededed', padding: '120px 40px 40px' }}>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 32, textTransform: 'uppercase', marginBottom: 8 }}>
        Seed Firebase Database
      </h1>
      <p style={{ color: 'rgba(255,255,255,.4)', marginBottom: 32 }}>
        Push all hardcoded game, team, and player data into Firestore.
      </p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <button onClick={seedAll} disabled={running}
          style={{ padding: '14px 28px', borderRadius: 8, background: '#22c55e', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.5 : 1 }}>
          {running ? 'Running...' : '🚀 Seed Everything'}
        </button>
        <button onClick={seedGames} disabled={running}
          style={{ padding: '14px 28px', borderRadius: 8, background: '#5b9aff', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.5 : 1 }}>
          Games Only ({GAMES.length})
        </button>
        <button onClick={seedTeams} disabled={running}
          style={{ padding: '14px 28px', borderRadius: 8, background: '#5b9aff', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.5 : 1 }}>
          Teams Only ({TEAMS.length})
        </button>
        <button onClick={seedPlayers} disabled={running}
          style={{ padding: '14px 28px', borderRadius: 8, background: '#5b9aff', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.5 : 1 }}>
          Players Only ({BATTING_STATS.length})
        </button>
      </div>

      <div style={{ background: '#0f1628', borderRadius: 10, padding: 20, border: '1px solid rgba(255,255,255,.08)', fontFamily: 'monospace', fontSize: 13, minHeight: 300, maxHeight: 500, overflowY: 'auto' }}>
        {log.length === 0 && <div style={{ color: 'rgba(255,255,255,.3)' }}>Click a button to start seeding...</div>}
        {log.map((msg, i) => (
          <div key={i} style={{ padding: '4px 0', color: msg.startsWith('✅') || msg.startsWith('🎉') ? '#4ade80' : '#ededed' }}>
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}
