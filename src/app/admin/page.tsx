'use client';

import { useState } from 'react';
import { TEAMS, DIVISIONS } from '@/lib/teams';
import { GAMES, calculateStandings } from '@/lib/games';
import { BATTING_STATS } from '@/lib/players';
import { FIELDS } from '@/lib/fields';
import { Division } from '@/lib/types';

type Section = 'dashboard' | 'scores' | 'schedule' | 'rosters' | 'standings' | 'recaps';

const NAV_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'scores', label: 'Enter Scores', icon: '⚾' },
  { id: 'schedule', label: 'Schedule', icon: '📅' },
  { id: 'rosters', label: 'Rosters', icon: '🤝' },
  { id: 'standings', label: 'Standings', icon: '🏆' },
  { id: 'recaps', label: 'Recaps', icon: '📜' },
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [section, setSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Score entry state
  const [scoreDivision, setScoreDivision] = useState<Division>('35+');
  const [scoreDate, setScoreDate] = useState('');
  const [scoreTime, setScoreTime] = useState('10:00 AM');
  const [scoreField, setScoreField] = useState(FIELDS[0]?.name || '');
  const [scoreAway, setScoreAway] = useState('');
  const [scoreHome, setScoreHome] = useState('');
  const [scoreAwayRuns, setScoreAwayRuns] = useState('');
  const [scoreHomeRuns, setScoreHomeRuns] = useState('');

  // Roster entry state
  const [rosterDiv, setRosterDiv] = useState<Division>('35+');
  const [rosterTeam, setRosterTeam] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerNum, setPlayerNum] = useState('');
  const [playerPos, setPlayerPos] = useState('');

  if (!authenticated) {
    return (
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0c1829' }}>
        <div style={{ width: 360, background: '#1a1a2e', borderRadius: 16, padding: 40, textAlign: 'center', border: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 32, color: '#5b9aff', letterSpacing: '.1em', marginBottom: 8 }}>SFBL</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 32, letterSpacing: '.1em', textTransform: 'uppercase' }}>Admin Panel</div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') setAuthenticated(true); }}
            placeholder="Enter password"
            style={{ width: '100%', padding: '14px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.05)', color: '#ededed', fontSize: 14, outline: 'none', marginBottom: 16 }}
          />
          <button
            onClick={() => setAuthenticated(true)}
            style={{ width: '100%', padding: '14px', borderRadius: 8, background: '#5b9aff', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', letterSpacing: '.06em', textTransform: 'uppercase' }}
          >
            Sign In
          </button>
        </div>
      </section>
    );
  }

  const standings = calculateStandings();
  const totalGames = GAMES.filter(g => g.status === 'final').length;
  const totalPlayers = BATTING_STATS.length;
  const totalTeams = TEAMS.length;
  const divTeams = TEAMS.filter(t => t.division === scoreDivision);
  const rosterDivTeams = TEAMS.filter(t => t.division === rosterDiv);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,.12)',
    background: 'rgba(255,255,255,.05)', color: '#ededed', fontSize: 14, outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,.4)', marginBottom: 6, display: 'block',
  };
  const selectStyle: React.CSSProperties = {
    ...inputStyle, appearance: 'none', cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0c1829', color: '#ededed', marginTop: -110 }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 220 : 60, flexShrink: 0, background: '#0f1628',
        borderRight: '1px solid rgba(255,255,255,.08)', padding: '80px 0 20px',
        transition: 'width .2s', overflow: 'hidden',
      }}>
        <div style={{ padding: '0 16px', marginBottom: 24 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 20, color: '#5b9aff', letterSpacing: '.1em' }}>
            {sidebarOpen ? 'SFBL' : 'S'}
          </div>
          {sidebarOpen && <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Admin Panel</div>}
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(item => (
            <div
              key={item.id}
              onClick={() => setSection(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: section === item.id ? 'rgba(91,154,255,.12)' : 'transparent',
                color: section === item.id ? '#5b9aff' : 'rgba(255,255,255,.5)',
                borderLeft: section === item.id ? '3px solid #5b9aff' : '3px solid transparent',
                transition: 'all .15s',
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {sidebarOpen && item.label}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '80px 32px 32px', overflow: 'auto' }}>
        {/* Dashboard */}
        {section === 'dashboard' && (
          <div>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase', marginBottom: 24 }}>Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Total Games', value: String(totalGames), color: '#5b9aff' },
                { label: 'Teams', value: String(totalTeams), color: '#4ade80' },
                { label: 'Players', value: String(totalPlayers), color: '#f59e0b' },
                { label: 'Divisions', value: '3', color: '#f87171' },
              ].map(card => (
                <div key={card.label} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: 24 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 36, color: card.color, lineHeight: 1 }}>{card.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 6, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>{card.label}</div>
                </div>
              ))}
            </div>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>Recent Games</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {GAMES.filter(g => g.status === 'final').sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8).map(g => {
                const away = TEAMS.find(t => t.id === g.awayTeam);
                const home = TEAMS.find(t => t.id === g.homeTeam);
                return (
                  <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'rgba(255,255,255,.03)', borderRadius: 6, fontSize: 13 }}>
                    <span style={{ width: 50, color: 'rgba(255,255,255,.3)', fontSize: 11 }}>{new Date(g.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span style={{ flex: 1 }}>{away?.name || g.awayTeam} <span style={{ color: 'rgba(255,255,255,.3)' }}>vs</span> {home?.name || g.homeTeam}</span>
                    <span style={{ fontWeight: 700 }}>{g.awayScore}-{g.homeScore}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>{g.division}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Enter Scores */}
        {section === 'scores' && (
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase', marginBottom: 24 }}>Enter Game Score</h2>
            <form onSubmit={e => { e.preventDefault(); alert(`Game saved: ${scoreAway} ${scoreAwayRuns} @ ${scoreHome} ${scoreHomeRuns}`); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Division</label>
                <select style={selectStyle} value={scoreDivision} onChange={e => { setScoreDivision(e.target.value as Division); setScoreAway(''); setScoreHome(''); }}>
                  {DIVISIONS.map(d => <option key={d} value={d}>{d} Division</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Date</label><input type="date" style={inputStyle} value={scoreDate} onChange={e => setScoreDate(e.target.value)} required /></div>
                <div><label style={labelStyle}>Time</label><input type="text" style={inputStyle} value={scoreTime} onChange={e => setScoreTime(e.target.value)} /></div>
              </div>
              <div><label style={labelStyle}>Field</label>
                <select style={selectStyle} value={scoreField} onChange={e => setScoreField(e.target.value)}>
                  {FIELDS.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Away Team</label>
                  <select style={selectStyle} value={scoreAway} onChange={e => setScoreAway(e.target.value)} required>
                    <option value="">Select...</option>
                    {divTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div><label style={labelStyle}>Away Runs</label>
                  <input type="number" min="0" style={{ ...inputStyle, fontSize: 24, textAlign: 'center', fontWeight: 900 }} value={scoreAwayRuns} onChange={e => setScoreAwayRuns(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Home Team</label>
                  <select style={selectStyle} value={scoreHome} onChange={e => setScoreHome(e.target.value)} required>
                    <option value="">Select...</option>
                    {divTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div><label style={labelStyle}>Home Runs</label>
                  <input type="number" min="0" style={{ ...inputStyle, fontSize: 24, textAlign: 'center', fontWeight: 900 }} value={scoreHomeRuns} onChange={e => setScoreHomeRuns(e.target.value)} />
                </div>
              </div>
              <button type="submit" style={{ padding: '14px', borderRadius: 8, background: '#5b9aff', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', letterSpacing: '.06em', textTransform: 'uppercase', marginTop: 8 }}>
                Save Game
              </button>
            </form>
          </div>
        )}

        {/* Schedule */}
        {section === 'schedule' && (
          <div>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase', marginBottom: 24 }}>Schedule Management</h2>
            <p style={{ color: 'rgba(255,255,255,.4)', marginBottom: 24 }}>Upcoming and recent games. Connect Firebase to manage schedule dynamically.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {GAMES.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20).map(g => {
                const away = TEAMS.find(t => t.id === g.awayTeam);
                const home = TEAMS.find(t => t.id === g.homeTeam);
                return (
                  <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'rgba(255,255,255,.03)', borderRadius: 6, fontSize: 13 }}>
                    <span style={{ width: 60, color: 'rgba(255,255,255,.3)', fontSize: 11 }}>{g.date.slice(5)}</span>
                    <span style={{ width: 60, fontSize: 10, fontWeight: 700, color: g.status === 'final' ? '#4ade80' : g.status === 'postponed' ? '#f87171' : '#5b9aff' }}>
                      {g.status.toUpperCase()}
                    </span>
                    <span style={{ flex: 1 }}>{away?.name} vs {home?.name}</span>
                    {g.status === 'final' && <span style={{ fontWeight: 700 }}>{g.awayScore}-{g.homeScore}</span>}
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>{g.field}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rosters */}
        {section === 'rosters' && (
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase', marginBottom: 24 }}>Manage Rosters</h2>
            <form onSubmit={e => { e.preventDefault(); alert(`Added: ${playerName} #${playerNum} (${playerPos}) to ${rosterTeam}`); setPlayerName(''); setPlayerNum(''); setPlayerPos(''); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label style={labelStyle}>Division</label>
                <select style={selectStyle} value={rosterDiv} onChange={e => { setRosterDiv(e.target.value as Division); setRosterTeam(''); }}>
                  {DIVISIONS.map(d => <option key={d} value={d}>{d} Division</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Team</label>
                <select style={selectStyle} value={rosterTeam} onChange={e => setRosterTeam(e.target.value)} required>
                  <option value="">Select team...</option>
                  {rosterDivTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Player Name</label><input type="text" style={inputStyle} value={playerName} onChange={e => setPlayerName(e.target.value)} required placeholder="Last, First" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Number</label><input type="text" style={inputStyle} value={playerNum} onChange={e => setPlayerNum(e.target.value)} placeholder="#" /></div>
                <div><label style={labelStyle}>Position</label>
                  <select style={selectStyle} value={playerPos} onChange={e => setPlayerPos(e.target.value)}>
                    <option value="">Select...</option>
                    {['P','C','1B','2B','3B','SS','LF','CF','RF','DH','UTIL'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" style={{ padding: '14px', borderRadius: 8, background: '#5b9aff', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', letterSpacing: '.06em', textTransform: 'uppercase', marginTop: 8 }}>
                Add Player
              </button>
            </form>
          </div>
        )}

        {/* Standings */}
        {section === 'standings' && (
          <div>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase', marginBottom: 24 }}>Standings Overview</h2>
            {DIVISIONS.map(div => {
              const divTeams2 = TEAMS.filter(t => t.division === div).map(t => ({ ...t, ...standings[t.id] }));
              return (
                <div key={div} style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#5b9aff', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>{div} Division</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {divTeams2.sort((a, b) => ((b.wins||0)/((b.wins||0)+(b.losses||1))) - ((a.wins||0)/((a.wins||0)+(a.losses||1)))).map(t => (
                      <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', background: 'rgba(255,255,255,.03)', borderRadius: 4, fontSize: 13 }}>
                        <span style={{ fontWeight: 700, flex: 1 }}>{t.name}</span>
                        <span>{t.wins||0}-{t.losses||0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recaps */}
        {section === 'recaps' && (
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase', marginBottom: 24 }}>Game Recaps</h2>
            <p style={{ color: 'rgba(255,255,255,.4)', marginBottom: 24 }}>Write and publish game recaps. Connect Firebase to save recaps to games.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label style={labelStyle}>Select Game</label>
                <select style={selectStyle}>
                  <option value="">Choose a game...</option>
                  {GAMES.filter(g => g.status === 'final').sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20).map(g => {
                    const away = TEAMS.find(t => t.id === g.awayTeam);
                    const home = TEAMS.find(t => t.id === g.homeTeam);
                    return <option key={g.id} value={g.id}>{g.date.slice(5)} — {away?.name} {g.awayScore} vs {home?.name} {g.homeScore}</option>;
                  })}
                </select>
              </div>
              <div><label style={labelStyle}>Recap</label>
                <textarea style={{ ...inputStyle, minHeight: 200, resize: 'vertical' }} placeholder="Write the game recap here..." />
              </div>
              <button type="button" style={{ padding: '14px', borderRadius: 8, background: '#5b9aff', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', letterSpacing: '.06em', textTransform: 'uppercase' }}>
                Save Recap
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
