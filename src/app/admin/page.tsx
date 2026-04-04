'use client';

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback } from 'react';
import { TEAMS, DIVISIONS } from '@/lib/teams';
import { FIELDS } from '@/lib/fields';
import { Division } from '@/lib/types';
import { getDb, getFirebaseAuth } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';

type Section = 'dashboard' | 'scores' | 'schedule' | 'rosters' | 'standings' | 'recaps' | 'banner';

interface FirestoreGame {
  id?: string;
  date: string;
  time: string;
  field: string;
  division: string;
  awayTeam: string;
  homeTeam: string;
  awayScore: number | null;
  homeScore: number | null;
  awayHits?: number | null;
  homeHits?: number | null;
  awayErrors?: number | null;
  homeErrors?: number | null;
  status: string;
  recap?: string;
  createdAt?: Timestamp;
}

interface FirestorePlayer {
  id?: string;
  name: string;
  team: string;
  division: string;
  number?: string;
  position?: string;
}

const NAV_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'scores', label: 'Scores', icon: '⚾' },
  { id: 'schedule', label: 'Schedule', icon: '📅' },
  { id: 'rosters', label: 'Rosters', icon: '🤝' },
  { id: 'standings', label: 'Standings', icon: '🏆' },
  { id: 'recaps', label: 'Recaps', icon: '📜' },
  { id: 'banner', label: 'Banner / Alerts', icon: '📢' },
];

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [section, setSection] = useState<Section>('dashboard');

  // Games from Firestore
  const [fbGames, setFbGames] = useState<FirestoreGame[]>([]);
  const [fbPlayers, setFbPlayers] = useState<FirestorePlayer[]>([]);
  const [loading, setLoading] = useState(false);

  // Score entry
  const [scoreDivision, setScoreDivision] = useState<Division>('35+');
  const [scoreDate, setScoreDate] = useState('');
  const [scoreTime, setScoreTime] = useState('10:00 AM');
  const [scoreField, setScoreField] = useState(FIELDS[0]?.name || '');
  const [scoreAway, setScoreAway] = useState('');
  const [scoreHome, setScoreHome] = useState('');
  const [scoreAwayRuns, setScoreAwayRuns] = useState('');
  const [scoreHomeRuns, setScoreHomeRuns] = useState('');
  const [scoreAwayHits, setScoreAwayHits] = useState('');
  const [scoreHomeHits, setScoreHomeHits] = useState('');
  const [scoreAwayErrors, setScoreAwayErrors] = useState('');
  const [scoreHomeErrors, setScoreHomeErrors] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  // Roster
  const [rosterDiv, setRosterDiv] = useState<Division>('35+');
  const [rosterTeam, setRosterTeam] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerNum, setPlayerNum] = useState('');
  const [playerPos, setPlayerPos] = useState('');

  // Schedule add
  const [schedDate, setSchedDate] = useState('');
  const [schedTime, setSchedTime] = useState('9:30 AM');
  const [schedField, setSchedField] = useState(FIELDS[0]?.name || '');
  const [schedDiv, setSchedDiv] = useState<Division>('35+');
  const [schedAway, setSchedAway] = useState('');
  const [schedHome, setSchedHome] = useState('');

  // Auth
  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return unsub;
  }, []);

  // Load data
  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      const db = getDb();
      const snap = await getDocs(query(collection(db, 'games'), orderBy('date', 'desc')));
      setFbGames(snap.docs.map(d => ({ id: d.id, ...d.data() } as FirestoreGame)));
    } catch (e) {
      console.error('Error loading games:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPlayers = useCallback(async () => {
    try {
      const db = getDb();
      const snap = await getDocs(collection(db, 'players'));
      setFbPlayers(snap.docs.map(d => ({ id: d.id, ...d.data() } as FirestorePlayer)));
    } catch (e) {
      console.error('Error loading players:', e);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadGames();
      loadPlayers();
    }
  }, [user, loadGames, loadPlayers]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setAuthError('Invalid email or password');
    }
  };

  const handleLogout = async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
  };

  // Save game
  const saveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const db = getDb();
      const gameData: Omit<FirestoreGame, 'id'> = {
        date: scoreDate,
        time: scoreTime,
        field: scoreField,
        division: scoreDivision,
        awayTeam: scoreAway,
        homeTeam: scoreHome,
        awayScore: scoreAwayRuns ? parseInt(scoreAwayRuns) : null,
        homeScore: scoreHomeRuns ? parseInt(scoreHomeRuns) : null,
        awayHits: scoreAwayHits ? parseInt(scoreAwayHits) : null,
        homeHits: scoreHomeHits ? parseInt(scoreHomeHits) : null,
        awayErrors: scoreAwayErrors ? parseInt(scoreAwayErrors) : null,
        homeErrors: scoreHomeErrors ? parseInt(scoreHomeErrors) : null,
        status: scoreAwayRuns && scoreHomeRuns ? 'final' : 'scheduled',
        createdAt: Timestamp.now(),
      };
      await addDoc(collection(db, 'games'), gameData);
      setSaveMsg('Game saved!');
      setTimeout(() => setSaveMsg(''), 3000);
      setScoreAwayRuns(''); setScoreHomeRuns(''); setScoreAwayHits(''); setScoreHomeHits('');
      setScoreAwayErrors(''); setScoreHomeErrors('');
      loadGames();
    } catch (e) {
      console.error('Error saving game:', e);
      setSaveMsg('Error saving game');
    }
  };

  // Add scheduled game
  const addScheduledGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const db = getDb();
      await addDoc(collection(db, 'games'), {
        date: schedDate, time: schedTime, field: schedField, division: schedDiv,
        awayTeam: schedAway, homeTeam: schedHome,
        awayScore: null, homeScore: null, status: 'scheduled',
        createdAt: Timestamp.now(),
      });
      setSaveMsg('Game added to schedule!');
      setTimeout(() => setSaveMsg(''), 3000);
      loadGames();
    } catch (e) {
      console.error(e);
      setSaveMsg('Error adding game');
    }
  };

  // Add player
  const addPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const db = getDb();
      await addDoc(collection(db, 'players'), {
        name: playerName, team: rosterTeam, division: rosterDiv,
        number: playerNum, position: playerPos,
      });
      setSaveMsg('Player added!');
      setTimeout(() => setSaveMsg(''), 3000);
      setPlayerName(''); setPlayerNum(''); setPlayerPos('');
      loadPlayers();
    } catch (e) {
      console.error(e);
    }
  };

  // Delete game
  const deleteGame = async (gameId: string) => {
    if (!confirm('Delete this game?')) return;
    try {
      const db = getDb();
      await deleteDoc(doc(db, 'games', gameId));
      loadGames();
    } catch (e) {
      console.error(e);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,.12)',
    background: 'rgba(255,255,255,.05)', color: '#ededed', fontSize: 14, outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,.4)', marginBottom: 6, display: 'block',
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, appearance: 'none' as const, cursor: 'pointer' };
  const btnPrimary: React.CSSProperties = {
    padding: '12px 24px', borderRadius: 8, background: '#5b9aff', color: '#fff',
    fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
    letterSpacing: '.06em', textTransform: 'uppercase',
  };

  // Login screen
  if (!authChecked) {
    return <div style={{ minHeight: '100vh', background: '#0c1829', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ededed' }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0c1829' }}>
        <form onSubmit={handleLogin} style={{ width: 360, background: '#1a1a2e', borderRadius: 16, padding: 40, textAlign: 'center', border: '1px solid rgba(255,255,255,.1)' }}>
          <img src="/logos/sfbl-logo.png" alt="SFBL" style={{ width: 60, height: 60, objectFit: 'contain', marginBottom: 12 }} />
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, color: '#5b9aff', letterSpacing: '.1em', marginBottom: 4 }}>SFBL</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 28, letterSpacing: '.1em', textTransform: 'uppercase' }}>Admin Panel</div>
          {authError && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{authError}</div>}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required
            style={{ ...inputStyle, marginBottom: 12 }} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required
            style={{ ...inputStyle, marginBottom: 16 }} />
          <button type="submit" style={{ ...btnPrimary, width: '100%' }}>Sign In</button>
        </form>
      </div>
    );
  }

  const divTeams = TEAMS.filter(t => t.division === scoreDivision);
  const rosterDivTeams = TEAMS.filter(t => t.division === rosterDiv);
  const schedDivTeams = TEAMS.filter(t => t.division === schedDiv);
  const teamPlayers = fbPlayers.filter(p => p.team === rosterTeam);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0c1829', color: '#ededed', paddingTop: 0, marginTop: -110 }}>
      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, background: '#0f1628', borderRight: '1px solid rgba(255,255,255,.08)', paddingTop: 120, position: 'fixed', top: 0, bottom: 0, left: 0, overflowY: 'auto', zIndex: 100 }}>
        <div style={{ padding: '0 16px', marginBottom: 20 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 20, color: '#5b9aff', letterSpacing: '.1em' }}>SFBL</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Admin Panel</div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(item => (
            <div key={item.id} onClick={() => setSection(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: section === item.id ? 'rgba(91,154,255,.12)' : 'transparent',
                color: section === item.id ? '#5b9aff' : 'rgba(255,255,255,.5)',
                borderLeft: section === item.id ? '3px solid #5b9aff' : '3px solid transparent',
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: '20px 16px', borderTop: '1px solid rgba(255,255,255,.08)', marginTop: 20 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginBottom: 8 }}>{user.email}</div>
          <button onClick={handleLogout} style={{ ...btnPrimary, width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,.15)', fontSize: 11, padding: '8px' }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 220, padding: '120px 32px 32px', overflow: 'auto' }}>
        {saveMsg && (
          <div style={{ position: 'fixed', top: 120, right: 32, background: '#22c55e', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, zIndex: 500 }}>
            {saveMsg}
          </div>
        )}

        {/* DASHBOARD */}
        {section === 'dashboard' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase' }}>Dashboard</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>Overview of the SFBL season</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Games in Firebase', value: String(fbGames.length), color: '#5b9aff' },
                { label: 'Teams', value: '28', color: '#4ade80' },
                { label: 'Players in Firebase', value: String(fbPlayers.length), color: '#f59e0b' },
                { label: 'Divisions', value: '3', color: '#f87171' },
              ].map(c => (
                <div key={c.label} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: 24 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 36, color: c.color, lineHeight: 1 }}>{c.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 6, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>{c.label}</div>
                </div>
              ))}
            </div>
            {loading && <div style={{ color: 'rgba(255,255,255,.4)' }}>Loading games...</div>}
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>Recent Firebase Games</div>
            {fbGames.length === 0 && !loading && (
              <div style={{ padding: 32, textAlign: 'center', color: 'rgba(255,255,255,.3)', background: 'rgba(255,255,255,.02)', borderRadius: 8 }}>
                No games in Firebase yet. Use the Scores section to add games.
              </div>
            )}
            {fbGames.slice(0, 10).map(g => {
              const away = TEAMS.find(t => t.id === g.awayTeam);
              const home = TEAMS.find(t => t.id === g.homeTeam);
              return (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'rgba(255,255,255,.03)', borderRadius: 6, fontSize: 13, marginBottom: 4 }}>
                  <span style={{ width: 60, color: 'rgba(255,255,255,.3)', fontSize: 11 }}>{g.date?.slice(5)}</span>
                  <span style={{ width: 60, fontSize: 10, fontWeight: 700, color: g.status === 'final' ? '#4ade80' : g.status === 'postponed' ? '#f87171' : '#5b9aff' }}>{g.status?.toUpperCase()}</span>
                  <span style={{ flex: 1 }}>{away?.name || g.awayTeam} vs {home?.name || g.homeTeam}</span>
                  {g.status === 'final' && <span style={{ fontWeight: 700 }}>{g.awayScore}-{g.homeScore}</span>}
                  <button onClick={() => deleteGame(g.id!)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 12 }}>Delete</button>
                </div>
              );
            })}
          </div>
        )}

        {/* ENTER SCORES */}
        {section === 'scores' && (
          <div style={{ maxWidth: 700 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase' }}>Enter Scores</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>Add game results with box score data</div>
            </div>
            <form onSubmit={saveGame} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Division</label>
                  <select style={selectStyle} value={scoreDivision} onChange={e => { setScoreDivision(e.target.value as Division); setScoreAway(''); setScoreHome(''); }}>
                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div><label style={labelStyle}>Date</label><input type="date" style={inputStyle} value={scoreDate} onChange={e => setScoreDate(e.target.value)} required /></div>
                <div><label style={labelStyle}>Time</label><input type="text" style={inputStyle} value={scoreTime} onChange={e => setScoreTime(e.target.value)} /></div>
              </div>
              <div><label style={labelStyle}>Field</label>
                <select style={selectStyle} value={scoreField} onChange={e => setScoreField(e.target.value)}>
                  {FIELDS.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                </select>
              </div>

              {/* Away Team */}
              <div style={{ background: 'rgba(255,255,255,.03)', borderRadius: 10, padding: 16, border: '1px solid rgba(255,255,255,.06)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>Away Team</div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 10 }}>
                  <div><label style={labelStyle}>Team</label>
                    <select style={selectStyle} value={scoreAway} onChange={e => setScoreAway(e.target.value)} required>
                      <option value="">Select...</option>
                      {divTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div><label style={labelStyle}>Runs</label>
                    <input type="number" min="0" style={{ ...inputStyle, fontSize: 22, textAlign: 'center', fontWeight: 900 }} value={scoreAwayRuns} onChange={e => setScoreAwayRuns(e.target.value)} />
                  </div>
                  <div><label style={labelStyle}>Hits</label>
                    <input type="number" min="0" style={{ ...inputStyle, textAlign: 'center' }} value={scoreAwayHits} onChange={e => setScoreAwayHits(e.target.value)} />
                  </div>
                  <div><label style={labelStyle}>Errors</label>
                    <input type="number" min="0" style={{ ...inputStyle, textAlign: 'center' }} value={scoreAwayErrors} onChange={e => setScoreAwayErrors(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Home Team */}
              <div style={{ background: 'rgba(255,255,255,.03)', borderRadius: 10, padding: 16, border: '1px solid rgba(255,255,255,.06)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>Home Team</div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 10 }}>
                  <div><label style={labelStyle}>Team</label>
                    <select style={selectStyle} value={scoreHome} onChange={e => setScoreHome(e.target.value)} required>
                      <option value="">Select...</option>
                      {divTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div><label style={labelStyle}>Runs</label>
                    <input type="number" min="0" style={{ ...inputStyle, fontSize: 22, textAlign: 'center', fontWeight: 900 }} value={scoreHomeRuns} onChange={e => setScoreHomeRuns(e.target.value)} />
                  </div>
                  <div><label style={labelStyle}>Hits</label>
                    <input type="number" min="0" style={{ ...inputStyle, textAlign: 'center' }} value={scoreHomeHits} onChange={e => setScoreHomeHits(e.target.value)} />
                  </div>
                  <div><label style={labelStyle}>Errors</label>
                    <input type="number" min="0" style={{ ...inputStyle, textAlign: 'center' }} value={scoreHomeErrors} onChange={e => setScoreHomeErrors(e.target.value)} />
                  </div>
                </div>
              </div>

              <button type="submit" style={btnPrimary}>Save Game Score</button>
            </form>
          </div>
        )}

        {/* SCHEDULE */}
        {section === 'schedule' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase' }}>Schedule</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>Manage the game schedule</div>
              </div>
            </div>
            {/* Add game form */}
            <div style={{ background: 'rgba(255,255,255,.03)', borderRadius: 10, padding: 20, border: '1px solid rgba(255,255,255,.06)', marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#5b9aff', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>Add Game to Schedule</div>
              <form onSubmit={addScheduledGame} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr 2fr 1fr auto', gap: 10, alignItems: 'end' }}>
                <div><label style={labelStyle}>Date</label><input type="date" style={inputStyle} value={schedDate} onChange={e => setSchedDate(e.target.value)} required /></div>
                <div><label style={labelStyle}>Time</label><input type="text" style={inputStyle} value={schedTime} onChange={e => setSchedTime(e.target.value)} /></div>
                <div><label style={labelStyle}>Division</label>
                  <select style={selectStyle} value={schedDiv} onChange={e => { setSchedDiv(e.target.value as Division); setSchedAway(''); setSchedHome(''); }}>
                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div><label style={labelStyle}>Away</label>
                  <select style={selectStyle} value={schedAway} onChange={e => setSchedAway(e.target.value)} required>
                    <option value="">Select...</option>
                    {schedDivTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div><label style={labelStyle}>Home</label>
                  <select style={selectStyle} value={schedHome} onChange={e => setSchedHome(e.target.value)} required>
                    <option value="">Select...</option>
                    {schedDivTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div><label style={labelStyle}>Field</label>
                  <select style={selectStyle} value={schedField} onChange={e => setSchedField(e.target.value)}>
                    {FIELDS.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                  </select>
                </div>
                <button type="submit" style={{ ...btnPrimary, padding: '10px 16px', whiteSpace: 'nowrap' }}>+ Add</button>
              </form>
            </div>
            {/* Games list */}
            {fbGames.map(g => {
              const away = TEAMS.find(t => t.id === g.awayTeam);
              const home = TEAMS.find(t => t.id === g.homeTeam);
              return (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'rgba(255,255,255,.03)', borderRadius: 6, fontSize: 13, marginBottom: 4 }}>
                  <span style={{ width: 70, color: 'rgba(255,255,255,.3)', fontSize: 11 }}>{g.date}</span>
                  <span style={{ width: 60, fontSize: 10, fontWeight: 700, color: g.status === 'final' ? '#4ade80' : g.status === 'postponed' ? '#f87171' : '#5b9aff' }}>{g.status?.toUpperCase()}</span>
                  <span style={{ width: 60, color: 'rgba(255,255,255,.3)', fontSize: 11 }}>{g.time}</span>
                  <span style={{ flex: 1 }}>{away?.name || g.awayTeam} vs {home?.name || g.homeTeam}</span>
                  {g.status === 'final' && <span style={{ fontWeight: 700 }}>{g.awayScore}-{g.homeScore}</span>}
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,.2)' }}>{g.field}</span>
                  <button onClick={() => deleteGame(g.id!)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 11 }}>✕</button>
                </div>
              );
            })}
            {fbGames.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: 'rgba(255,255,255,.3)' }}>No games in Firebase. Add games above or use Enter Scores.</div>}
          </div>
        )}

        {/* ROSTERS */}
        {section === 'rosters' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase' }}>Rosters</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>Manage team rosters</div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <select style={{ ...selectStyle, maxWidth: 200 }} value={rosterDiv} onChange={e => { setRosterDiv(e.target.value as Division); setRosterTeam(''); }}>
                {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select style={{ ...selectStyle, maxWidth: 300 }} value={rosterTeam} onChange={e => setRosterTeam(e.target.value)}>
                <option value="">-- Choose a team --</option>
                {rosterDivTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            {rosterTeam && (
              <>
                <form onSubmit={addPlayer} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 10, marginBottom: 20, alignItems: 'end' }}>
                  <div><label style={labelStyle}>Player Name</label><input style={inputStyle} value={playerName} onChange={e => setPlayerName(e.target.value)} required placeholder="Last, First" /></div>
                  <div><label style={labelStyle}>Number</label><input style={inputStyle} value={playerNum} onChange={e => setPlayerNum(e.target.value)} placeholder="#" /></div>
                  <div><label style={labelStyle}>Position</label>
                    <select style={selectStyle} value={playerPos} onChange={e => setPlayerPos(e.target.value)}>
                      <option value="">Pos</option>
                      {['P','C','1B','2B','3B','SS','LF','CF','RF','DH','UTIL'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <button type="submit" style={{ ...btnPrimary, padding: '10px 16px' }}>+ Add</button>
                </form>
                {teamPlayers.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,.3)' }}>No players yet. Add players above.</div>}
                {teamPlayers.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'rgba(255,255,255,.03)', borderRadius: 6, fontSize: 13, marginBottom: 4 }}>
                    <span style={{ width: 30, color: 'rgba(255,255,255,.3)', fontWeight: 700 }}>#{p.number || '-'}</span>
                    <span style={{ flex: 1, fontWeight: 600 }}>{p.name}</span>
                    <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 11 }}>{p.position || '-'}</span>
                    <button onClick={async () => { if (confirm('Delete?')) { const db = getDb(); await deleteDoc(doc(db, 'players', p.id!)); loadPlayers(); } }}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 11 }}>✕</button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* STANDINGS */}
        {section === 'standings' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase' }}>Standings</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>Auto-calculated from game results</div>
            </div>
            {DIVISIONS.map(div => {
              const divGames = fbGames.filter(g => g.division === div && g.status === 'final');
              const records: Record<string, { w: number; l: number; rs: number; ra: number }> = {};
              divGames.forEach(g => {
                if (!records[g.awayTeam]) records[g.awayTeam] = { w: 0, l: 0, rs: 0, ra: 0 };
                if (!records[g.homeTeam]) records[g.homeTeam] = { w: 0, l: 0, rs: 0, ra: 0 };
                records[g.awayTeam].rs += g.awayScore || 0;
                records[g.awayTeam].ra += g.homeScore || 0;
                records[g.homeTeam].rs += g.homeScore || 0;
                records[g.homeTeam].ra += g.awayScore || 0;
                if ((g.awayScore || 0) > (g.homeScore || 0)) { records[g.awayTeam].w++; records[g.homeTeam].l++; }
                else { records[g.homeTeam].w++; records[g.awayTeam].l++; }
              });
              const sorted = TEAMS.filter(t => t.division === div).map(t => ({ ...t, ...(records[t.id] || { w: 0, l: 0, rs: 0, ra: 0 }) }))
                .sort((a, b) => (b.w / (b.w + b.l || 1)) - (a.w / (a.w + a.l || 1)));
              return (
                <div key={div} style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#5b9aff', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>{div} Division</div>
                  {sorted.map(t => (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', background: 'rgba(255,255,255,.03)', borderRadius: 4, fontSize: 13, marginBottom: 2 }}>
                      {t.logo && <img src={t.logo} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />}
                      <span style={{ fontWeight: 700, flex: 1 }}>{t.name}</span>
                      <span style={{ fontWeight: 700 }}>{t.w}-{t.l}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>RS:{t.rs} RA:{t.ra}</span>
                    </div>
                  ))}
                  {divGames.length === 0 && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', padding: '8px 0' }}>No games entered for this division yet.</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* RECAPS */}
        {section === 'recaps' && (
          <div style={{ maxWidth: 700 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase' }}>Recaps</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>Write game recaps</div>
            </div>
            {fbGames.filter(g => g.status === 'final').slice(0, 20).map(g => {
              const away = TEAMS.find(t => t.id === g.awayTeam);
              const home = TEAMS.find(t => t.id === g.homeTeam);
              return (
                <div key={g.id} style={{ background: 'rgba(255,255,255,.03)', borderRadius: 8, padding: 16, marginBottom: 8, border: '1px solid rgba(255,255,255,.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>{g.date}</span>
                    <span style={{ fontWeight: 700 }}>{away?.name} {g.awayScore} - {home?.name} {g.homeScore}</span>
                  </div>
                  <textarea
                    defaultValue={g.recap || ''}
                    placeholder="Write recap..."
                    style={{ ...inputStyle, minHeight: 60, resize: 'vertical', marginBottom: 8 }}
                    onBlur={async (e) => {
                      if (g.id) {
                        const db = getDb();
                        await updateDoc(doc(db, 'games', g.id), { recap: e.target.value });
                      }
                    }}
                  />
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>Auto-saves on blur</div>
                </div>
              );
            })}
            {fbGames.filter(g => g.status === 'final').length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', color: 'rgba(255,255,255,.3)' }}>No completed games to write recaps for.</div>
            )}
          </div>
        )}

        {/* BANNER */}
        {section === 'banner' && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase' }}>Banner / Alerts</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>Manage site-wide banner notification</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.03)', borderRadius: 10, padding: 20, border: '1px solid rgba(255,255,255,.06)' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginBottom: 16 }}>Banner feature requires Firebase configuration. Set up a &quot;settings&quot; collection to store banner text and active state.</div>
              <div><label style={labelStyle}>Banner Text</label>
                <input type="text" style={inputStyle} placeholder="Enter banner message..." />
              </div>
              <div style={{ marginTop: 12 }}><label style={labelStyle}>Banner Color</label>
                <select style={selectStyle}>
                  <option value="blue">Blue (Info)</option>
                  <option value="green">Green (Success)</option>
                  <option value="red">Red (Alert)</option>
                  <option value="yellow">Yellow (Warning)</option>
                </select>
              </div>
              <button style={{ ...btnPrimary, marginTop: 16 }}>Save Banner</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
