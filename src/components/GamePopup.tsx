'use client';

/* eslint-disable @next/next/no-img-element */
import { Game } from '@/lib/types';
import { getTeam } from '@/lib/teams';
import { GAMES, calculateStandings, calculateStreaks } from '@/lib/games';

interface Props {
  game: Game | null;
  onClose: () => void;
}

function generateRecap(game: Game): string {
  const away = getTeam(game.awayTeam);
  const home = getTeam(game.homeTeam);
  if (!away || !home || game.awayScore === null || game.homeScore === null) return '';

  const awayWon = game.awayScore > game.homeScore;
  const winner = awayWon ? away : home;
  const loser = awayWon ? home : away;
  const winScore = awayWon ? game.awayScore : game.homeScore;
  const loseScore = awayWon ? game.homeScore : game.awayScore;
  const margin = winScore - loseScore;

  const standings = calculateStandings();
  const streaks = calculateStreaks();
  const winRec = standings[winner.id];
  const loseRec = standings[loser.id];
  const winStreak = streaks[winner.id] || '';
  const loseStreak = streaks[loser.id] || '';

  let recap = `The ${winner.name} defeated the ${loser.name} ${winScore}-${loseScore}`;
  if (game.field !== 'TBD') recap += ` at ${game.field}`;
  recap += '.';

  if (margin >= 10) {
    recap += ` It was a dominant performance by ${winner.name}, winning by ${margin} runs.`;
  } else if (margin <= 2) {
    recap += ` It was a tightly contested game decided by just ${margin === 1 ? 'a single run' : 'two runs'}.`;
  }

  if (winStreak && winStreak.startsWith('W') && parseInt(winStreak.slice(1)) >= 3) {
    recap += ` ${winner.name} are on a ${winStreak.slice(1)}-game winning streak.`;
  }
  if (loseStreak && loseStreak.startsWith('L') && parseInt(loseStreak.slice(1)) >= 3) {
    recap += ` ${loser.name} have now lost ${loseStreak.slice(1)} straight.`;
  }

  if (winRec) {
    recap += ` ${winner.name} improve to ${winRec.wins}-${winRec.losses} on the season.`;
  }

  // Check head-to-head
  const h2h = GAMES.filter(g =>
    g.status === 'final' &&
    ((g.awayTeam === game.awayTeam && g.homeTeam === game.homeTeam) ||
     (g.awayTeam === game.homeTeam && g.homeTeam === game.awayTeam))
  );
  if (h2h.length > 1) {
    const winnerH2hWins = h2h.filter(g => {
      const wId = winner.id;
      return (g.awayTeam === wId && (g.awayScore ?? 0) > (g.homeScore ?? 0)) ||
             (g.homeTeam === wId && (g.homeScore ?? 0) > (g.awayScore ?? 0));
    }).length;
    recap += ` ${winner.name} lead the season series ${winnerH2hWins}-${h2h.length - winnerH2hWins}.`;
  }

  return recap;
}

export default function GamePopup({ game, onClose }: Props) {
  if (!game) return null;

  const away = getTeam(game.awayTeam);
  const home = getTeam(game.homeTeam);
  if (!away || !home) return null;

  const isFinal = game.status === 'final';
  const awayWon = isFinal && game.awayScore !== null && game.homeScore !== null && game.awayScore > game.homeScore;

  const dateLabel = new Date(game.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const recap = isFinal ? (game.recap || generateRecap(game)) : '';

  return (
    <>
      <div className="pop-overlay" onClick={onClose} />
      <div className="pop-wrap">
        <button className="pop-close" onClick={onClose}>&times;</button>
        <div className="pop-content">
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
                    <div className="pop-badge upcoming">{game.status === 'postponed' ? 'Postponed' : 'Upcoming'}</div>
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
              {game.field !== 'TBD' && <span>{game.field}</span>}
              <span>{game.division} Division</span>
            </div>
          </div>

          {isFinal && (
            <div className="pop-body">
              {/* Recap */}
              {recap && (
                <>
                  <div className="pop-sec-title">Recap</div>
                  <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20 }}>{recap}</p>
                </>
              )}

              {/* Only show box score if we have hits/errors data */}
              {(game.awayHits !== undefined || game.homeHits !== undefined) && (
                <>
                  <div className="pop-sec-title">Box Score</div>
                  <table className="ptbl">
                    <thead>
                      <tr><th>Team</th><th>R</th><th>H</th><th>E</th></tr>
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
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
