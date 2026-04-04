'use client';

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback } from 'react';
import { TEAMS, DIVISIONS } from '@/lib/teams';
import { getDb } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc, query, orderBy, Timestamp, setDoc } from 'firebase/firestore';

interface FBGame {
  id: string;
  away: string; home: string;
  away_score: number; home_score: number;
  done: boolean; postponed?: boolean;
  date: string; day: string; time: string; field: string; div: string; wk: number;
  editedBy?: string; editedAt?: Timestamp;
  away_errors?: number; home_errors?: number;
}

interface BatterLine {
  name: string; num: string; pos: string;
  ab: number; r: number; s: number; d: number; t: number; hr: number;
  rbi: number; bb: number; so: number;
}

interface PitcherLine {
  name: string; ip: string; h: number; r: number; er: number; bb: number; so: number; hr: number; decision: string;
}

const emptyBatter = (): BatterLine => ({ name: '', num: '', pos: '', ab: 0, r: 0, s: 0, d: 0, t: 0, hr: 0, rbi: 0, bb: 0, so: 0 });
const emptyPitcher = (): PitcherLine => ({ name: '', ip: '', h: 0, r: 0, er: 0, bb: 0, so: 0, hr: 0, decision: '' });

export default function CaptainPage() {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [games, setGames] = useState<FBGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Score entry
  const [editingGame, setEditingGame] = useState<string | null>(null);
  const [awayScore, setAwayScore] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayHits, setAwayHits] = useState('');
  const [homeHits, setHomeHits] = useState('');
  const [awayErrors, setAwayErrors] = useState('');
  const [homeErrors, setHomeErrors] = useState('');

  // Box score mode
  const [boxScoreGame, setBoxScoreGame] = useState<FBGame | null>(null);
  const [awayBatters, setAwayBatters] = useState<BatterLine[]>([]);
  const [homeBatters, setHomeBatters] = useState<BatterLine[]>([]);
  const [awayPitchers, setAwayPitchers] = useState<PitcherLine[]>([]);
  const [homePitchers, setHomePitchers] = useState<PitcherLine[]>([]);

  // PDF upload
  const [uploading, setUploading] = useState(false);
  const [parseResult, setParseResult] = useState<string>('');

  const team = TEAMS.find(t => t.id === selectedTeam);

  const loadGames = useCallback(async () => {
    if (!selectedTeam) return;
    setLoading(true);
    try {
      const db = getDb();
      const snap = await getDocs(query(collection(db, 'games'), orderBy('wk')));
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as FBGame));
      setGames(all.filter(g => g.away === selectedTeam || g.home === selectedTeam).sort((a, b) => (a.date || '').localeCompare(b.date || '')));
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [selectedTeam]);

  useEffect(() => { if (loggedIn && selectedTeam) loadGames(); }, [loggedIn, selectedTeam, loadGames]);

  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); if (selectedTeam && captainName.trim()) setLoggedIn(true); };

  const startEdit = (g: FBGame) => {
    setEditingGame(g.id);
    setAwayScore(String(g.away_score || ''));
    setHomeScore(String(g.home_score || ''));
    setAwayHits(''); setHomeHits('');
    setAwayErrors(String(g.away_errors || '')); setHomeErrors('');
  };

  const saveScore = async (gameId: string, markFinal: boolean) => {
    const as = parseInt(awayScore), hs = parseInt(homeScore);
    if (isNaN(as) || isNaN(hs)) { alert('Please enter both scores'); return; }
    try {
      const db = getDb();
      await updateDoc(doc(db, 'games', gameId), {
        away_score: as, home_score: hs, done: markFinal,
        away_errors: awayErrors ? parseInt(awayErrors) : 0,
        home_errors: homeErrors ? parseInt(homeErrors) : 0,
        editedBy: `${captainName} (${team?.name})`,
        editedAt: Timestamp.now(),
      });
      setSaveMsg('Score saved!'); setTimeout(() => setSaveMsg(''), 3000);
      setEditingGame(null); loadGames();
    } catch (e) { console.error(e); alert('Error saving'); }
  };

  // ── BOX SCORE ──
  const openBoxScore = (g: FBGame) => {
    setBoxScoreGame(g);
    setAwayBatters(Array.from({ length: 9 }, emptyBatter));
    setHomeBatters(Array.from({ length: 9 }, emptyBatter));
    setAwayPitchers([emptyPitcher()]);
    setHomePitchers([emptyPitcher()]);
  };

  const updateBatter = (side: 'away' | 'home', idx: number, field: string, value: string | number) => {
    const setter = side === 'away' ? setAwayBatters : setHomeBatters;
    setter(prev => prev.map((b, i) => i === idx ? { ...b, [field]: typeof value === 'string' && field !== 'name' && field !== 'num' && field !== 'pos' ? parseInt(value) || 0 : value } : b));
  };

  const updatePitcher = (side: 'away' | 'home', idx: number, field: string, value: string | number) => {
    const setter = side === 'away' ? setAwayPitchers : setHomePitchers;
    setter(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const addPitcher = (side: 'away' | 'home') => {
    const setter = side === 'away' ? setAwayPitchers : setHomePitchers;
    setter(prev => [...prev, emptyPitcher()]);
  };

  const saveBoxScore = async () => {
    if (!boxScoreGame) return;
    try {
      const db = getDb();
      const activeBattersAway = awayBatters.filter(b => b.name.trim());
      const activeBattersHome = homeBatters.filter(b => b.name.trim());
      const activePitchersAway = awayPitchers.filter(p => p.name.trim());
      const activePitchersHome = homePitchers.filter(p => p.name.trim());

      // Calculate totals
      const awayR = activeBattersAway.reduce((s, b) => s + b.r, 0);
      const homeR = activeBattersHome.reduce((s, b) => s + b.r, 0);
      const awayH = activeBattersAway.reduce((s, b) => s + b.s + b.d + b.t + b.hr, 0);
      const homeH = activeBattersHome.reduce((s, b) => s + b.s + b.d + b.t + b.hr, 0);

      await setDoc(doc(db, 'box_scores', boxScoreGame.id), {
        game_id: boxScoreGame.id,
        away_lineup: activeBattersAway,
        home_lineup: activeBattersHome,
        away_pitchers: activePitchersAway,
        home_pitchers: activePitchersHome,
        editedBy: `${captainName} (${team?.name})`,
        editedAt: Timestamp.now(),
      });

      // Update game score
      await updateDoc(doc(db, 'games', boxScoreGame.id), {
        away_score: awayR, home_score: homeR, done: true,
        editedBy: `${captainName} (${team?.name})`,
        editedAt: Timestamp.now(),
      });

      setSaveMsg('Box score saved!'); setTimeout(() => setSaveMsg(''), 3000);
      setBoxScoreGame(null); loadGames();
    } catch (e) { console.error(e); alert('Error saving box score'); }
  };

  // ── PDF UPLOAD ──
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>, game: FBGame) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setParseResult('Reading file...');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const mimeType = file.type || 'application/pdf';

        setParseResult('Sending to AI for parsing...');
        const awayTeam = TEAMS.find(t => t.id === game.away);
        const homeTeam = TEAMS.find(t => t.id === game.home);

        const res = await fetch('/api/parse-boxscore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64,
            mimeType,
            gameId: game.id,
            awayTeam: awayTeam?.name || game.away,
            homeTeam: homeTeam?.name || game.home,
            date: game.date,
            week: String(game.wk),
            field: game.field,
          }),
        });

        const data = await res.json();
        if (data.success && data.parsed) {
          setParseResult('Parsed successfully! Review below.');
          // Fill in the box score form
          const p = data.parsed;
          if (p.awayBatters) setAwayBatters(p.awayBatters.map((b: BatterLine) => ({ ...emptyBatter(), ...b })));
          if (p.homeBatters) setHomeBatters(p.homeBatters.map((b: BatterLine) => ({ ...emptyBatter(), ...b })));
          if (p.awayPitchers) setAwayPitchers(p.awayPitchers.map((p2: PitcherLine) => ({ ...emptyPitcher(), ...p2 })));
          if (p.homePitchers) setHomePitchers(p.homePitchers.map((p2: PitcherLine) => ({ ...emptyPitcher(), ...p2 })));
          setBoxScoreGame(game);
        } else {
          setParseResult('Error: ' + (data.error || 'Unknown error'));
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setParseResult('Error uploading file');
      setUploading(false);
    }
  };

  const inp: React.CSSProperties = { width: '100%', padding: '6px 8px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--card2)', color: 'var(--white)', fontSize: 12, outline: 'none', textAlign: 'center' };
  const ninp: React.CSSProperties = { ...inp, width: 40 };

  // ── LOGIN ──
  if (!loggedIn) {
    return (
      <section className="sec">
        <div className="container" style={{ maxWidth: 420 }}>
          <form onSubmit={handleLogin} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 40 }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <img src="/logos/sfbl-logo.png" alt="SFBL" style={{ width: 60, height: 60, objectFit: 'contain', marginBottom: 8 }} />
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 24, color: 'var(--gold)', letterSpacing: '.1em' }}>Captain Portal</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Your Name</label>
              <input type="text" value={captainName} onChange={e => setCaptainName(e.target.value)} placeholder="Enter your name" required className="filter-select" style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Select Your Team</label>
              <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)} required className="filter-select" style={{ width: '100%' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: 'var(--card2)', borderRadius: 8, marginBottom: 16, border: '1px solid var(--border)' }}>
                {team.logo && <img src={team.logo} alt="" style={{ width: 36, height: 36, objectFit: 'contain' }} />}
                <div style={{ fontWeight: 700 }}>{team.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{team.division} Div</div>
              </div>
            )}
            <button type="submit" className="btn-gold" style={{ width: '100%', textAlign: 'center' }}>Enter Captain Portal</button>
          </form>
        </div>
      </section>
    );
  }

  // ── BOX SCORE EDITOR ──
  if (boxScoreGame) {
    const awayT = TEAMS.find(t => t.id === boxScoreGame.away);
    const homeT = TEAMS.find(t => t.id === boxScoreGame.home);

    const renderBatterTable = (batters: BatterLine[], side: 'away' | 'home', teamName: string) => (
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>{teamName} — Batting</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '6px 4px', textAlign: 'left', width: 140 }}>Player</th>
                <th style={{ padding: '6px 2px', width: 35 }}>#</th>
                <th style={{ padding: '6px 2px', width: 35 }}>Pos</th>
                <th style={{ padding: '6px 2px', width: 30 }}>AB</th>
                <th style={{ padding: '6px 2px', width: 30 }}>R</th>
                <th style={{ padding: '6px 2px', width: 30 }}>1B</th>
                <th style={{ padding: '6px 2px', width: 30 }}>2B</th>
                <th style={{ padding: '6px 2px', width: 30 }}>3B</th>
                <th style={{ padding: '6px 2px', width: 30 }}>HR</th>
                <th style={{ padding: '6px 2px', width: 30 }}>RBI</th>
                <th style={{ padding: '6px 2px', width: 30 }}>BB</th>
                <th style={{ padding: '6px 2px', width: 30 }}>SO</th>
              </tr>
            </thead>
            <tbody>
              {batters.map((b, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td><input style={{ ...inp, textAlign: 'left', width: '100%' }} value={b.name} onChange={e => updateBatter(side, i, 'name', e.target.value)} placeholder="Player name" /></td>
                  <td><input style={ninp} value={b.num} onChange={e => updateBatter(side, i, 'num', e.target.value)} /></td>
                  <td><input style={ninp} value={b.pos} onChange={e => updateBatter(side, i, 'pos', e.target.value)} /></td>
                  <td><input style={ninp} type="number" min="0" value={b.ab || ''} onChange={e => updateBatter(side, i, 'ab', e.target.value)} /></td>
                  <td><input style={ninp} type="number" min="0" value={b.r || ''} onChange={e => updateBatter(side, i, 'r', e.target.value)} /></td>
                  <td><input style={ninp} type="number" min="0" value={b.s || ''} onChange={e => updateBatter(side, i, 's', e.target.value)} /></td>
                  <td><input style={ninp} type="number" min="0" value={b.d || ''} onChange={e => updateBatter(side, i, 'd', e.target.value)} /></td>
                  <td><input style={ninp} type="number" min="0" value={b.t || ''} onChange={e => updateBatter(side, i, 't', e.target.value)} /></td>
                  <td><input style={ninp} type="number" min="0" value={b.hr || ''} onChange={e => updateBatter(side, i, 'hr', e.target.value)} /></td>
                  <td><input style={ninp} type="number" min="0" value={b.rbi || ''} onChange={e => updateBatter(side, i, 'rbi', e.target.value)} /></td>
                  <td><input style={ninp} type="number" min="0" value={b.bb || ''} onChange={e => updateBatter(side, i, 'bb', e.target.value)} /></td>
                  <td><input style={ninp} type="number" min="0" value={b.so || ''} onChange={e => updateBatter(side, i, 'so', e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={() => (side === 'away' ? setAwayBatters : setHomeBatters)(prev => [...prev, emptyBatter()])}
          style={{ marginTop: 8, fontSize: 12, color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
          + Add Batter
        </button>
      </div>
    );

    const renderPitcherTable = (pitchers: PitcherLine[], side: 'away' | 'home', teamName: string) => (
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>{teamName} — Pitching</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '6px 4px', textAlign: 'left', width: 140 }}>Pitcher</th>
              <th style={{ padding: '6px 2px', width: 40 }}>IP</th>
              <th style={{ padding: '6px 2px', width: 30 }}>H</th>
              <th style={{ padding: '6px 2px', width: 30 }}>R</th>
              <th style={{ padding: '6px 2px', width: 30 }}>ER</th>
              <th style={{ padding: '6px 2px', width: 30 }}>BB</th>
              <th style={{ padding: '6px 2px', width: 30 }}>SO</th>
              <th style={{ padding: '6px 2px', width: 30 }}>HR</th>
              <th style={{ padding: '6px 2px', width: 35 }}>Dec</th>
            </tr>
          </thead>
          <tbody>
            {pitchers.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td><input style={{ ...inp, textAlign: 'left', width: '100%' }} value={p.name} onChange={e => updatePitcher(side, i, 'name', e.target.value)} placeholder="Pitcher name" /></td>
                <td><input style={ninp} value={p.ip} onChange={e => updatePitcher(side, i, 'ip', e.target.value)} placeholder="0.0" /></td>
                <td><input style={ninp} type="number" min="0" value={p.h || ''} onChange={e => updatePitcher(side, i, 'h', parseInt(e.target.value) || 0)} /></td>
                <td><input style={ninp} type="number" min="0" value={p.r || ''} onChange={e => updatePitcher(side, i, 'r', parseInt(e.target.value) || 0)} /></td>
                <td><input style={ninp} type="number" min="0" value={p.er || ''} onChange={e => updatePitcher(side, i, 'er', parseInt(e.target.value) || 0)} /></td>
                <td><input style={ninp} type="number" min="0" value={p.bb || ''} onChange={e => updatePitcher(side, i, 'bb', parseInt(e.target.value) || 0)} /></td>
                <td><input style={ninp} type="number" min="0" value={p.so || ''} onChange={e => updatePitcher(side, i, 'so', parseInt(e.target.value) || 0)} /></td>
                <td><input style={ninp} type="number" min="0" value={p.hr || ''} onChange={e => updatePitcher(side, i, 'hr', parseInt(e.target.value) || 0)} /></td>
                <td>
                  <select style={{ ...ninp, width: 45 }} value={p.decision} onChange={e => updatePitcher(side, i, 'decision', e.target.value)}>
                    <option value="">-</option><option value="W">W</option><option value="L">L</option><option value="S">S</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => addPitcher(side)} style={{ marginTop: 8, fontSize: 12, color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+ Add Pitcher</button>
      </div>
    );

    return (
      <section className="sec">
        <div className="container" style={{ maxWidth: 1000 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div className="sec-eyebrow">Box Score Entry</div>
              <h2 className="sec-title" style={{ fontSize: 28 }}>{awayT?.name} @ {homeT?.name}</h2>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{boxScoreGame.date} &middot; {boxScoreGame.time} &middot; {boxScoreGame.field}</div>
            </div>
            <button onClick={() => setBoxScoreGame(null)} className="btn-outline" style={{ fontSize: 12, padding: '8px 16px' }}>← Back to Games</button>
          </div>

          {parseResult && (
            <div style={{ padding: 12, background: 'var(--card2)', borderRadius: 8, marginBottom: 16, fontSize: 13, color: 'var(--gold)', border: '1px solid var(--border)' }}>
              {parseResult}
            </div>
          )}

          {renderBatterTable(awayBatters, 'away', awayT?.name || boxScoreGame.away)}
          {renderPitcherTable(awayPitchers, 'away', awayT?.name || boxScoreGame.away)}
          <div className="divider" style={{ margin: '24px 0' }} />
          {renderBatterTable(homeBatters, 'home', homeT?.name || boxScoreGame.home)}
          {renderPitcherTable(homePitchers, 'home', homeT?.name || boxScoreGame.home)}

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={saveBoxScore} className="btn-gold">Save Box Score &amp; Mark Final</button>
            <button onClick={() => setBoxScoreGame(null)} className="btn-outline">Cancel</button>
          </div>
        </div>
      </section>
    );
  }

  // ── GAMES LIST ──
  const teamGamesPlayed = games.filter(g => g.done);
  const teamWins = teamGamesPlayed.filter(g => (g.away === selectedTeam ? g.away_score > g.home_score : g.home_score > g.away_score)).length;

  return (
    <section className="sec">
      <div className="container" style={{ maxWidth: 800 }}>
        {saveMsg && <div style={{ position: 'fixed', top: 80, right: 24, background: '#22c55e', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, zIndex: 500 }}>{saveMsg}</div>}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {team?.logo && <img src={team.logo} alt="" style={{ width: 50, height: 50, objectFit: 'contain' }} />}
            <div>
              <div className="sec-title" style={{ fontSize: 28 }}>{team?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Captain: {captainName} &middot; {team?.division} Division &middot; {teamWins}-{teamGamesPlayed.length - teamWins}</div>
            </div>
          </div>
          <button onClick={() => setLoggedIn(false)} className="btn-outline" style={{ fontSize: 11, padding: '6px 14px' }}>Switch Team</button>
        </div>

        <div className="sec-eyebrow" style={{ marginTop: 24 }}>Your Games</div>
        {loading && <div style={{ color: 'var(--muted)', padding: 20 }}>Loading...</div>}

        {games.map(g => {
          const awayT2 = TEAMS.find(t => t.id === g.away);
          const homeT2 = TEAMS.find(t => t.id === g.home);
          const isAway = g.away === selectedTeam;
          const opp = isAway ? homeT2 : awayT2;
          const isEditing = editingGame === g.id;
          const won = g.done && ((isAway && g.away_score > g.home_score) || (!isAway && g.home_score > g.away_score));

          return (
            <div key={g.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 8, borderLeft: `4px solid ${g.done ? (won ? 'var(--green)' : 'var(--red)') : g.postponed ? '#f59e0b' : 'var(--border)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 65, flexShrink: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>Wk {g.wk}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted2)' }}>{g.date?.slice(5)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  {opp?.logo && <img src={opp.logo} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{isAway ? '@ ' : 'vs '}{opp?.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted2)' }}>{g.time} &middot; {g.field}</div>
                  </div>
                </div>
                {g.done && <div style={{ fontWeight: 900, fontSize: 15, color: won ? 'var(--green)' : 'var(--red)' }}>{won ? 'W' : 'L'} {g.away_score}-{g.home_score}</div>}
                {g.postponed && <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b' }}>PPD</span>}
                {!g.postponed && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => startEdit(g)} className="btn-outline" style={{ fontSize: 10, padding: '5px 10px' }}>
                      {g.done ? 'Edit Score' : 'Quick Score'}
                    </button>
                    <button onClick={() => openBoxScore(g)} className="btn-outline" style={{ fontSize: 10, padding: '5px 10px' }}>Box Score</button>
                    <label style={{ fontSize: 10, padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border2)', color: 'var(--gold)', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                      📄 PDF
                      <input type="file" accept=".pdf,image/*" style={{ display: 'none' }} onChange={e => handlePdfUpload(e, g)} disabled={uploading} />
                    </label>
                  </div>
                )}
              </div>

              {isEditing && (
                <div style={{ marginTop: 12, padding: 12, background: 'var(--card2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                    <div><label style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>{awayT2?.abbr} Runs</label><input type="number" min="0" value={awayScore} onChange={e => setAwayScore(e.target.value)} style={{ ...inp, fontSize: 18, fontWeight: 900 }} /></div>
                    <div><label style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>{homeT2?.abbr} Runs</label><input type="number" min="0" value={homeScore} onChange={e => setHomeScore(e.target.value)} style={{ ...inp, fontSize: 18, fontWeight: 900 }} /></div>
                    <div><label style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>{awayT2?.abbr} Hits</label><input type="number" min="0" value={awayHits} onChange={e => setAwayHits(e.target.value)} style={inp} /></div>
                    <div><label style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>{homeT2?.abbr} Hits</label><input type="number" min="0" value={homeHits} onChange={e => setHomeHits(e.target.value)} style={inp} /></div>
                    <div><label style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>{awayT2?.abbr} Err</label><input type="number" min="0" value={awayErrors} onChange={e => setAwayErrors(e.target.value)} style={inp} /></div>
                    <div><label style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>{homeT2?.abbr} Err</label><input type="number" min="0" value={homeErrors} onChange={e => setHomeErrors(e.target.value)} style={inp} /></div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => saveScore(g.id, true)} style={{ padding: '8px 16px', borderRadius: 6, background: '#22c55e', color: '#fff', fontWeight: 700, fontSize: 11, border: 'none', cursor: 'pointer' }}>Mark Final</button>
                    <button onClick={() => saveScore(g.id, false)} className="btn-outline" style={{ fontSize: 11, padding: '8px 16px' }}>Save Draft</button>
                    <button onClick={() => setEditingGame(null)} className="btn-outline" style={{ fontSize: 11, padding: '8px 16px' }}>Cancel</button>
                  </div>
                </div>
              )}

              {g.editedBy && <div style={{ marginTop: 6, fontSize: 10, color: 'var(--muted2)', fontStyle: 'italic' }}>Edited by {g.editedBy}{g.editedAt?.toDate ? ` on ${g.editedAt.toDate().toLocaleString()}` : ''}</div>}
            </div>
          );
        })}

        {uploading && <div style={{ padding: 20, textAlign: 'center', color: 'var(--gold)' }}>Processing PDF... this may take a moment</div>}
      </div>
    </section>
  );
}
