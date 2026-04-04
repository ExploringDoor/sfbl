export type Division = '18+' | '28+' | '35+';

export interface Team {
  id: string;
  name: string;
  abbr: string;
  division: Division;
  color: string;
  color2?: string;
  logo?: string;
  wins: number;
  losses: number;
  ties: number;
  rs: number;
  ra: number;
  streak?: string;
}

export interface Game {
  id: string;
  date: string;
  time: string;
  field: string;
  division: Division;
  awayTeam: string;
  homeTeam: string;
  awayScore: number | null;
  homeScore: number | null;
  status: 'scheduled' | 'final' | 'in_progress' | 'postponed';
  awayHits?: number;
  homeHits?: number;
  awayErrors?: number;
  homeErrors?: number;
  linescore?: {
    away: number[];
    home: number[];
  };
  wp?: string;
  lp?: string;
  sv?: string;
  recap?: string;
}

export interface Player {
  id: string;
  name: string;
  team: string;
  division: Division;
  number?: string;
  position?: string;
  bats?: string;
  throws?: string;
  photo?: string;
}

export interface BattingStats {
  playerId: string;
  season: string;
  gp: number;
  ab: number;
  r: number;
  h: number;
  '2b': number;
  '3b': number;
  hr: number;
  rbi: number;
  bb: number;
  so: number;
  sb: number;
  cs: number;
  hbp: number;
  sac: number;
  avg: number;
  obp: number;
  slg: number;
  ops: number;
}

export interface PitchingStats {
  playerId: string;
  season: string;
  gp: number;
  gs: number;
  w: number;
  l: number;
  sv: number;
  ip: number;
  h: number;
  r: number;
  er: number;
  bb: number;
  so: number;
  hr: number;
  era: number;
  whip: number;
}

export interface BoxScore {
  gameId: string;
  away: {
    batters: BoxScoreBatter[];
    pitchers: BoxScorePitcher[];
  };
  home: {
    batters: BoxScoreBatter[];
    pitchers: BoxScorePitcher[];
  };
  linescore: {
    away: number[];
    home: number[];
  };
}

export interface BoxScoreBatter {
  name: string;
  ab: number;
  r: number;
  h: number;
  rbi: number;
  bb: number;
  so: number;
  hr: number;
  '2b'?: number;
  '3b'?: number;
}

export interface BoxScorePitcher {
  name: string;
  ip: number;
  h: number;
  r: number;
  er: number;
  bb: number;
  so: number;
  hr: number;
  decision?: 'W' | 'L' | 'S';
}

export type DivisionFilter = Division | 'all';
export type StatType = 'batting' | 'pitching';
export type Split = 'total' | 'home' | 'away';
