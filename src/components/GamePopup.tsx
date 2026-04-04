'use client';

/* eslint-disable @next/next/no-img-element */
import { Game } from '@/lib/types';
import { getTeam } from '@/lib/teams';

interface Props {
  game: Game | null;
  onClose: () => void;
}

export default function GamePopup({ game, onClose }: Props) {
  if (!game) return null;

  const away = getTeam(game.awayTeam);
  const home = getTeam(game.homeTeam);
  if (!away || !home) return null;

  const isFinal = game.status === 'final';
  const awayWon = isFinal && game.awayScore !== null && game.homeScore !== null && game.awayScore > game.homeScore;

  const dateLabel = new Date(game.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <div className="pop-overlay" onClick={onClose} />
      <div className="pop-wrap">
        <button className="pop-close" onClick={onClose}>&times;</button>
        <div className="pop-content">
          {/* Header */}
          <div className="pop-hd">
            <div className="pop-matchup">
              <div className="pop-team">
                {away.logo && <img src={away.logo} alt={away.abbr} className="pop-logo" />}
                <div className="pop-abbr" style={{ color: away.color }}>{away.abbr}</div>
                <div className="pop-team-name">{away.name}</div>
                <div className="pop-role-lbl">Away</div>
              </div>
              <div className="pop-sc-mid">
                {isFinal ? (
                  <>
                    <div className="pop-sc">
                      <span style={{ color: awayWon ? away.color : 'rgba(0,0,0,.3)' }}>{game.awayScore}</span>
                      <span className="pop-dash">&ndash;</span>
                      <span style={{ color: !awayWon ? home.color : 'rgba(0,0,0,.3)' }}>{game.homeScore}</span>
                    </div>
                    <div className="pop-badge">Final</div>
                  </>
                ) : (
                  <>
                    <div className="pop-time">{game.time}</div>
                    <div className="pop-badge upcoming">Upcoming</div>
                  </>
                )}
              </div>
              <div className="pop-team">
                {home.logo && <img src={home.logo} alt={home.abbr} className="pop-logo" />}
                <div className="pop-abbr" style={{ color: home.color }}>{home.abbr}</div>
                <div className="pop-team-name">{home.name}</div>
                <div className="pop-role-lbl">Home</div>
              </div>
            </div>
            <div className="pop-meta">
              <span>{dateLabel}</span>
              <span>{game.field}</span>
              <span>{game.division} Division</span>
            </div>
          </div>

          {/* Box Score */}
          {isFinal && (
            <div className="pop-body">
              <div className="pop-sec-title">Line Score</div>
              <table className="ptbl">
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>R</th>
                    <th>H</th>
                    <th>E</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ color: away.color, fontWeight: 700 }}>{away.abbr}</td>
                    <td style={{ fontWeight: awayWon ? 700 : 400 }}>{game.awayScore}</td>
                    <td>{game.awayHits ?? '-'}</td>
                    <td>{game.awayErrors ?? '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ color: home.color, fontWeight: 700 }}>{home.abbr}</td>
                    <td style={{ fontWeight: !awayWon ? 700 : 400 }}>{game.homeScore}</td>
                    <td>{game.homeHits ?? '-'}</td>
                    <td>{game.homeErrors ?? '-'}</td>
                  </tr>
                </tbody>
              </table>

              {game.wp && (
                <div style={{ marginTop: 16, fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)', fontWeight: 600, marginRight: 8 }}>WP:</span> {game.wp}
                  {game.lp && <><span style={{ color: 'var(--muted)', fontWeight: 600, marginLeft: 16, marginRight: 8 }}>LP:</span> {game.lp}</>}
                  {game.sv && <><span style={{ color: 'var(--muted)', fontWeight: 600, marginLeft: 16, marginRight: 8 }}>SV:</span> {game.sv}</>}
                </div>
              )}

              {game.recap && (
                <>
                  <div className="pop-sec-title" style={{ marginTop: 20 }}>Recap</div>
                  <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{game.recap}</p>
                </>
              )}

              <div style={{ marginTop: 24, padding: 20, background: 'var(--card2)', borderRadius: 8, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                Detailed batting and pitching box scores will be available once player stats are populated via the admin dashboard.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
