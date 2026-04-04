import { Team } from './types';

export function calcPct(w: number, l: number): string {
  if (w + l === 0) return '.000';
  const pct = w / (w + l);
  return pct.toFixed(3).replace(/^0/, '');
}

export function calcGB(team: Team, leader: Team): string {
  const gb = ((leader.wins - team.wins) + (team.losses - leader.losses)) / 2;
  if (gb === 0) return '-';
  return gb % 1 === 0 ? gb.toFixed(0) : gb.toFixed(1);
}

export function calcERA(er: number, ip: number): string {
  if (ip === 0) return '-.--';
  return ((er * 9) / ip).toFixed(2);
}

export function calcWHIP(bb: number, h: number, ip: number): string {
  if (ip === 0) return '-.--';
  return ((bb + h) / ip).toFixed(2);
}

export function calcAVG(h: number, ab: number): string {
  if (ab === 0) return '.000';
  return (h / ab).toFixed(3).replace(/^0/, '');
}

export function calcOBP(h: number, bb: number, hbp: number, ab: number, sf: number): string {
  const denom = ab + bb + hbp + sf;
  if (denom === 0) return '.000';
  return ((h + bb + hbp) / denom).toFixed(3).replace(/^0/, '');
}

export function calcSLG(h: number, doubles: number, triples: number, hr: number, ab: number): string {
  if (ab === 0) return '.000';
  const singles = h - doubles - triples - hr;
  const tb = singles + (doubles * 2) + (triples * 3) + (hr * 4);
  return (tb / ab).toFixed(3).replace(/^0/, '');
}

export function sortTeams(teams: Team[]): Team[] {
  return [...teams].sort((a, b) => {
    const pctA = a.wins + a.losses === 0 ? 0 : a.wins / (a.wins + a.losses);
    const pctB = b.wins + b.losses === 0 ? 0 : b.wins / (b.wins + b.losses);
    if (pctB !== pctA) return pctB - pctA;
    return b.wins - a.wins;
  });
}
