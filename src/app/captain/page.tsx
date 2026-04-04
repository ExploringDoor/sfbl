'use client';

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback } from 'react';
import { TEAMS, DIVISIONS } from '@/lib/teams';
import { FIELDS } from '@/lib/fields';
import { getDb } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';

interface FBGame {
  id: string;
  away: string;
  home: string;
  away_score: number;
  home_score: number;
  done: boolean;
  postponed?: boolean;
  date: string;
  day: string;
  time: string;
  field: string;
  div: string;
  wk: number;
  editedBy?: string;
  editedAt?: Timestamp;
  [key: string]: unknown;
}

export default function CaptainPage() {
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [captainName, setCaptainName] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [games, setGames] = useState<FBGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingGame, setEditingGame] = useState<string | null>(null);
  const [awayScore, setAwayScore] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  const team = TEAMS.find(t => t.id === selectedTeam);

  const loadGames = useCallback(async () => {
    if (!selectedTeam) return;
    setLoading(true);
    try {
      const db = getDb();
      const snap = await getDocs(query(collection(db, 'games'), orderBy('wk')));
      const allGames = snap.docs.map(d => ({ id: d.id, ...d.data() } as FBGame));
      // Filter to only this team's games
      const teamGames = allGames.filter(g => g.away === selectedTeam || g.home === selectedTeam);
      setGames(teamGames.sort((a, b) => (a.date || '').localeCompare(b.date || '')));
    } catch (e) {
      console.error('Error loading games:', e);
    }
    setLoading(false);
  }, [selectedTeam]);

  useEffect(() => {
    if (loggedIn && selectedTeam) loadGames();
  }, [loggedIn, selectedTeam, loadGames]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !captainName.trim()) return;
    setLoggedIn(true);
  };

  const startEdit = (game: FBGame) => {
    setEditingGame(game.id);
    setAwayScore(String(game.away_score || ''));
    setHomeScore(String(game.home_score || ''));
  };

  const saveScore = async (gameId: string, markFinal: boolean) => {
    const as = parseInt(awayScore);
    const hs = parseInt(homeScore);
    if (isNaN(as) || isNaN(hs)) { alert('Please enter both scores'); return; }

    try {
      const db = getDb();
      await updateDoc(doc(db, 'games', gameId), {
        away_score: as,
        home_score: hs,
        done: markFinal,
        editedBy: `${captainName} (${team?.name || selectedTeam})`,
        editedAt: Timestamp.now(),
      });

      setSaveMsg('Score saved!');
      setTimeout(() => setSaveMsg(''), 3000);
      setEditingGame(null);
      loadGames();
    } catch (e) {
      console.error('Error saving:', e);
      alert('Error saving score. Please try again.');
    }
  };

  // ── LOGIN SCREEN ──
  if (!loggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0c1829' }}>
        <form onSubmit={handleLogin} style={{ width: 420, background: '#1a1a2e', borderRadius: 16, padding: 40, border: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <img src="/logos/sfbl-logo.png" alt="SFBL" style={{ width: 60, height: 60, objectFit: 'contain', marginBottom: 12 }} />
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, color: '#5b9aff', letterSpacing: '.1em' }}>SFBL</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Captain Portal</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 6, display: 'block' }}>
              Your Name
            </label>
            <input
              type="text"
              value={captainName}
              onChange={e => setCaptainName(e.target.value)}
              placeholder="Enter your name"
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.05)', color: '#ededed', fontSize: 14, outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 6, display: 'block' }}>
              Select Your Team
            </label>
            <select
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.05)', color: '#ededed', fontSize: 14, outline: 'none', appearance: 'none' as const }}
            >
              <option value="">-- Choose your team --</option>
              {DIVISIONS.map(div => (
                <optgroup key={div} label={`${div} Division`}>
                  {TEAMS.filter(t => t.division === div).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {selectedTeam && team && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'rgba(255,255,255,.03)', borderRadius: 8, marginBottom: 16, border: '1px solid rgba(255,255,255,.06)' }}>
              {team.logo && <img src={team.logo} alt={team.name} style={{ width: 40, height: 40, objectFit: 'contain' }} />}
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{team.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{team.division} Division</div>
              </div>
            </div>
          )}

          <button
            type="submit"
            style={{ width: '100%', padding: '14px', borderRadius: 8, background: '#5b9aff', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', letterSpacing: '.06em', textTransform: 'uppercase' }}
          >
            Enter Captain Portal
          </button>
        </form>
      </div>
    );
  }

  // ── CAPTAIN DASHBOARD ──
  const teamGamesPlayed = games.filter(g => g.done);
  const teamWins = teamGamesPlayed.filter(g => {
    const isAway = g.away === selectedTeam;
    return isAway ? g.away_score > g.home_score : g.home_score > g.away_score;
  }).length;
  const teamLosses = teamGamesPlayed.length - teamWins;

  return (
    <div style={{ minHeight: '100vh', background: '#0c1829', color: '#ededed', padding: '80px 24px 40px' }}>
      {saveMsg && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#22c55e', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, zIndex: 500 }}>
          {saveMsg}
        </div>
      )}

      {/* Header */}
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {team?.logo && <img src={team.logo} alt={team.name} style={{ width: 60, height: 60, objectFit: 'contain' }} />}
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase' }}>{team?.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Captain: {captainName} &middot; {team?.division} Division</div>
            </div>
          </div>
          <button onClick={() => setLoggedIn(false)} style={{ padding: '8px 16px', borderRadius: 6, background: 'transparent', border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.5)', fontSize: 12, cursor: 'pointer' }}>
            Switch Team
          </button>
        </div>

        {/* Record */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: 20, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 32, color: '#4ade80' }}>{teamWins}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}>Wins</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: 20, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 32, color: '#f87171' }}>{teamLosses}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}>Losses</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: 20, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 32, color: '#5b9aff' }}>{games.length}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}>Total Games</div>
          </div>
        </div>

        {/* Games List */}
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '.06em', color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>
          Your Games
        </div>

        {loading && <div style={{ color: 'rgba(255,255,255,.3)', padding: 20 }}>Loading games...</div>}

        {games.map(g => {
          const awayTeam = TEAMS.find(t => t.id === g.away);
          const homeTeam = TEAMS.find(t => t.id === g.home);
          const isAway = g.away === selectedTeam;
          const opp = isAway ? homeTeam : awayTeam;
          const isEditing = editingGame === g.id;
          const won = g.done && ((isAway && g.away_score > g.home_score) || (!isAway && g.home_score > g.away_score));
          const lost = g.done && !won;

          return (
            <div key={g.id} style={{
              background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)',
              borderRadius: 10, padding: 16, marginBottom: 8,
              borderLeft: g.done ? `4px solid ${won ? '#4ade80' : '#f87171'}` : g.postponed ? '4px solid #f59e0b' : '4px solid rgba(255,255,255,.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 70, flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.5)' }}>Wk {g.wk}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>{g.date?.slice(5)}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  {opp?.logo && <img src={opp.logo} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {isAway ? '@ ' : 'vs '}{opp?.name || (isAway ? g.home : g.away)}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>{g.time} &middot; {g.field}</div>
                  </div>
                </div>

                {g.done && (
                  <div style={{ textAlign: 'right', minWidth: 60 }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 22, color: won ? '#4ade80' : '#f87171' }}>
                      {won ? 'W' : 'L'}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{g.away_score}-{g.home_score}</div>
                  </div>
                )}

                {g.postponed && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>PPD</div>
                )}

                {!g.done && !g.postponed && (
                  <button onClick={() => startEdit(g)} style={{
                    padding: '8px 16px', borderRadius: 6, background: '#5b9aff', color: '#fff',
                    fontWeight: 700, fontSize: 11, border: 'none', cursor: 'pointer',
                    letterSpacing: '.06em', textTransform: 'uppercase',
                  }}>
                    Enter Score
                  </button>
                )}

                {g.done && !isEditing && (
                  <button onClick={() => startEdit(g)} style={{
                    padding: '8px 12px', borderRadius: 6, background: 'transparent',
                    border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.5)',
                    fontSize: 11, cursor: 'pointer',
                  }}>
                    Edit
                  </button>
                )}
              </div>

              {/* Edit form */}
              {isEditing && (
                <div style={{ marginTop: 12, padding: 12, background: 'rgba(255,255,255,.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,.06)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>
                        {awayTeam?.name || g.away} (Away)
                      </label>
                      <input type="number" min="0" value={awayScore} onChange={e => setAwayScore(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.05)', color: '#ededed', fontSize: 20, fontWeight: 900, textAlign: 'center', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>
                        {homeTeam?.name || g.home} (Home)
                      </label>
                      <input type="number" min="0" value={homeScore} onChange={e => setHomeScore(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.05)', color: '#ededed', fontSize: 20, fontWeight: 900, textAlign: 'center', outline: 'none' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => saveScore(g.id, true)} style={{
                      padding: '10px 20px', borderRadius: 6, background: '#22c55e', color: '#fff',
                      fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer',
                    }}>
                      Mark Final
                    </button>
                    <button onClick={() => saveScore(g.id, false)} style={{
                      padding: '10px 20px', borderRadius: 6, background: 'transparent',
                      border: '1px solid rgba(255,255,255,.15)', color: '#ededed',
                      fontWeight: 600, fontSize: 12, cursor: 'pointer',
                    }}>
                      Save Draft
                    </button>
                    <button onClick={() => setEditingGame(null)} style={{
                      padding: '10px 20px', borderRadius: 6, background: 'transparent',
                      border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.4)',
                      fontSize: 12, cursor: 'pointer',
                    }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Audit trail */}
              {g.editedBy && (
                <div style={{ marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,.25)', fontStyle: 'italic' }}>
                  Last edited by {g.editedBy}
                  {g.editedAt && ` on ${g.editedAt.toDate ? g.editedAt.toDate().toLocaleString() : ''}`}
                </div>
              )}
            </div>
          );
        })}

        {games.length === 0 && !loading && (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,.3)', background: 'rgba(255,255,255,.02)', borderRadius: 10 }}>
            No games found for your team. Make sure the database has been seeded.
          </div>
        )}
      </div>
    </div>
  );
}
