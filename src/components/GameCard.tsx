'use client';

import { Game } from '@/lib/types';
import { getTeam } from '@/lib/teams';
import { getTeamRecord } from '@/lib/games';
import TeamLogo from './TeamLogo';

interface Props {
  game: Game;
  onClick?: () => void;
}

export default function GameCard({ game, onClick }: Props) {
  const away = getTeam(game.awayTeam);
  const home = getTeam(game.homeTeam);
  if (!away || !home) return null;

  const isFinal = game.status === 'final';
  const isPostponed = game.status === 'postponed';
  const awayWon = isFinal && game.awayScore !== null && game.homeScore !== null && game.awayScore > game.homeScore;
  const homeWon = isFinal && game.awayScore !== null && game.homeScore !== null && game.homeScore > game.awayScore;

  const awayRec = getTeamRecord(game.awayTeam);
  const homeRec = getTeamRecord(game.homeTeam);

  return (
    <div className={`sched-game-block ${isPostponed ? 'postponed' : ''}`} onClick={onClick}>
      <div className="gb-left">
        <div className={`gb-status-label ${isFinal ? '' : isPostponed ? 'ppd' : 'upcoming'}`}>
          {isFinal ? 'FINAL' : isPostponed ? 'POSTPONED' : game.time}
        </div>
        <div className="gb-team-row">
          <TeamLogo abbr={away.abbr} color={away.color} logo={away.logo} />
          <span className={`gb-name ${isFinal ? (awayWon ? 'winner' : 'loser') : ''} ${isPostponed ? 'ppd-text' : ''}`}>
            {away.name}
          </span>
          <span className="gb-rec">({awayRec})</span>
          {isFinal && game.awayScore !== null && (
            <span className={`gb-score ${awayWon ? 'winner' : 'loser'}`}>
              {game.awayScore}
            </span>
          )}
        </div>
        <div className="gb-team-row">
          <TeamLogo abbr={home.abbr} color={home.color} logo={home.logo} />
          <span className={`gb-name ${isFinal ? (homeWon ? 'winner' : 'loser') : ''} ${isPostponed ? 'ppd-text' : ''}`}>
            {home.name}
          </span>
          <span className="gb-rec">({homeRec})</span>
          {isFinal && game.homeScore !== null && (
            <span className={`gb-score ${homeWon ? 'winner' : 'loser'}`}>
              {game.homeScore}
            </span>
          )}
        </div>
      </div>
      <div className="gb-mid">
        <div className="gb-field">{game.field}</div>
        <div className="gb-div-badge">{game.division} Division</div>
        {!isFinal && !isPostponed && (
          <div className="gb-time">{game.time}</div>
        )}
      </div>
    </div>
  );
}
