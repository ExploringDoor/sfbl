import { Team, Division } from './types';

export const DIVISIONS: Division[] = ['18+', '28+', '35+'];

export const TEAMS: Team[] = [
  // ── 35+ Division — American ──
  { id: 'miami-cardinals',    name: 'Miami Cardinals',         abbr: 'MC',  division: '35+', subDivision: 'American', color: '#c41e3a', color2: '#0c2340', logo: '/logos/miami-cardinals.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'miami-amigos',       name: 'Miami Amigos',            abbr: 'MA',  division: '35+', subDivision: 'American', color: '#00a3e0', color2: '#e4002b', logo: '/logos/miami-amigos.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'sf-astros',          name: 'South Florida Astros',    abbr: 'SFA2',division: '35+', subDivision: 'American', color: '#002d62', color2: '#eb6e1f', logo: '/logos/sf-astros.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'miami-yankees',      name: 'Miami Yankees',           abbr: 'MY',  division: '35+', subDivision: 'American', color: '#0c2340', color2: '#c4ced4', logo: '/logos/miami-yankees.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'sf-dodgers',         name: 'South Florida Dodgers',   abbr: 'SFD', division: '35+', subDivision: 'American', color: '#005a9c', color2: '#ef3e42', logo: '/logos/sf-dodgers.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'matanzas',           name: 'Matanzas',                abbr: 'MAT', division: '35+', subDivision: 'American', color: '#8b0000', color2: '#ffd700', logo: '/logos/matanzas.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'miami-charros',      name: 'Miami Charros',           abbr: 'MCH', division: '35+', subDivision: 'American', color: '#2e4a2e', color2: '#d4af37', logo: '/logos/miami-charros.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'dade-nationals',     name: 'Dade Nationals',          abbr: 'DN',  division: '35+', subDivision: 'American', color: '#ab0003', color2: '#14225a', logo: '/logos/dade-nationals.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  // ── 35+ Division — National ──
  { id: 'delray-devil-rays',  name: 'Delray Devil Rays',       abbr: 'DDR', division: '35+', subDivision: 'National', color: '#092c5c', color2: '#8fbce6', logo: '/logos/delray-devil-rays.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'southern-yankees',   name: 'Southern Yankees',        abbr: 'SY',  division: '35+', subDivision: 'National', color: '#0c2340', color2: '#c4ced4', logo: '/logos/southern-yankees.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'sf-travelers',       name: 'South Florida Travelers', abbr: 'SFT', division: '35+', subDivision: 'National', color: '#333333', color2: '#e8a317', logo: '/logos/sf-travelers.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'boca-mets',          name: 'Boca Mets',              abbr: 'BM',  division: '35+', subDivision: 'National', color: '#002d72', color2: '#ff5910', logo: '/logos/boca-mets.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'kooper-city-royals', name: 'Kooper City Royals',      abbr: 'KCR', division: '35+', subDivision: 'National', color: '#004687', color2: '#c09a5c', logo: '/logos/kooper-city-royals.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'sf-angels',          name: 'South Florida Angels',    abbr: 'SFA', division: '35+', subDivision: 'National', color: '#ba0021', color2: '#003263', logo: '/logos/sf-angels.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },

  // ── 28+ Division ──
  { id: 'aventura-braves',    name: 'Aventura Braves',         abbr: 'AB',  division: '28+', color: '#ce1141', color2: '#13274f', logo: '/logos/aventura-braves.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'aventura-dodgers',   name: 'Aventura Dodgers',        abbr: 'AD',  division: '28+', color: '#005a9c', color2: '#ef3e42', logo: '/logos/aventura-dodgers.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'broward-senators',   name: 'Broward Senators',        abbr: 'BS',  division: '28+', color: '#14225a', color2: '#c8102e', logo: '/logos/broward-senators.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'miami-brewers',      name: 'Miami Brewers',           abbr: 'MB',  division: '28+', color: '#12284b', color2: '#ffc52f', logo: '/logos/miami-brewers.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'miami-jc',           name: 'Miami JC',                abbr: 'MJC', division: '28+', color: '#0e3386', color2: '#ff6600', logo: '/logos/miami-jc.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'palm-beach-pirates', name: 'Palm Beach Pirates',      abbr: 'PBP', division: '28+', color: '#27251f', color2: '#fdb827', logo: '/logos/palm-beach-pirates.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'sunrise-giants',     name: 'Sunrise Giants',          abbr: 'SG',  division: '28+', color: '#fd5a1e', color2: '#27251f', logo: '/logos/sunrise-giants.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },

  // ── 18+ Division ──
  { id: 'broward-yankees',    name: 'Broward Yankees',         abbr: 'BY',  division: '18+', color: '#0c2340', color2: '#c4ced4', logo: '/logos/broward-yankees.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'margate-marlins',    name: 'Margate Marlins',         abbr: 'MM',  division: '18+', color: '#00a3e0', color2: '#ef3340', logo: '/logos/margate-marlins.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'miami-buccaneers',   name: 'Miami Buccaneers',        abbr: 'MBU', division: '18+', color: '#d50a0a', color2: '#34302b', logo: '/logos/miami-buccaneers.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'miami-orioles',      name: 'Miami Orioles',           abbr: 'MO',  division: '18+', color: '#df4601', color2: '#27251f', logo: '/logos/miami-orioles.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'miami-red-sox',      name: 'Miami Red Sox',           abbr: 'MRS', division: '18+', color: '#bd3039', color2: '#0c2340', logo: '/logos/miami-red-sox.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'sf-rays',            name: 'South Florida Rays',      abbr: 'SFR', division: '18+', color: '#092c5c', color2: '#8fbce6', logo: '/logos/sf-rays.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
  { id: 'wpb-cardinals',      name: 'West Palm Beach Cardinals',abbr: 'WPB',division: '18+', color: '#c41e3a', color2: '#0c2340', logo: '/logos/wpb-cardinals.png', wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 },
];

export function getTeam(id: string): Team | undefined {
  return TEAMS.find(t => t.id === id);
}

export function getTeamByName(name: string): Team | undefined {
  return TEAMS.find(t => t.name === name);
}

export function getTeamsByDivision(division: Division): Team[] {
  return TEAMS.filter(t => t.division === division);
}

export function getTeamAbbr(id: string): string {
  return TEAMS.find(t => t.id === id)?.abbr || '??';
}

export function getTeamColor(id: string): string {
  return TEAMS.find(t => t.id === id)?.color || '#333';
}
