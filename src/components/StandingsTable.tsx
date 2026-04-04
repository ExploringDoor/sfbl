'use client';

/* eslint-disable @next/next/no-img-element */
import { Team, Division } from '@/lib/types';
import { calcPct, calcGB, sortTeams } from '@/lib/stats';

interface Props {
  teams: Team[];
  division: Division;
}

export default function StandingsTable({ teams, division }: Props) {
  const sorted = sortTeams(teams);
  const leader = sorted[0];

  return (
    <div className="div-card">
      <div className="div-card-head">
        <div className="div-card-label">{division} Division</div>
      </div>
      <table className="s-tbl">
        <thead>
          <tr>
            <th>Team</th>
            <th>W</th>
            <th>L</th>
            <th>PCT</th>
            <th>GB</th>
            <th className="hide-mobile">RS</th>
            <th className="hide-mobile">RA</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((team, i) => (
            <tr key={team.id} className={i === 0 ? 'leader' : ''}>
              <td style={{ display: 'flex', alignItems: 'center' }}>
                <span className="rank">{i + 1}</span>
                {team.logo ? (
                  <img
                    src={team.logo}
                    alt={team.abbr}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      objectFit: 'contain',
                      marginRight: 10,
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <span className="team-logo" style={{ background: team.color }}>
                    {team.abbr}
                  </span>
                )}
                <span className="tname">{team.name}</span>
              </td>
              <td>{team.wins}</td>
              <td>{team.losses}</td>
              <td>{calcPct(team.wins, team.losses)}</td>
              <td>{calcGB(team, leader)}</td>
              <td className="hide-mobile">{team.rs}</td>
              <td className="hide-mobile">{team.ra}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
