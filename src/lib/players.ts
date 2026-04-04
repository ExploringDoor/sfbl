// Real batting stats from BallgameCentral Spring 2026

export interface PlayerBattingStats {
  [key: string]: string | number | null;
  name: string; jersey: string | null; team: string; division: string;
  avg: number; ab: number; h: number; r: number; rbi: number; pa: number;
  slg: number; obp: number; doubles: number; triples: number; hr: number;
  sb: number; bb: number; hbp: number;
}

export const BATTING_STATS: PlayerBattingStats[] = [
  { name: 'Bartoletta, Sam', jersey: "7", team: 'southern-yankees', division: '35+', avg: 0.6, ab: 10, h: 6, r: 5, rbi: 5, pa: 10, slg: 0.9, obp: 0.6, doubles: 1, triples: 1, hr: 0, sb: 0, bb: 0, hbp: 0 },
  { name: 'Batista, Alex', jersey: "11", team: 'dade-nationals', division: '35+', avg: 0.6, ab: 10, h: 6, r: 3, rbi: 2, pa: 11, slg: 0.8, obp: 0.636, doubles: 2, triples: 0, hr: 0, sb: 1, bb: 1, hbp: 0 },
  { name: 'Olivo, Reidy', jersey: "12", team: 'southern-yankees', division: '35+', avg: 0.571, ab: 7, h: 4, r: 5, rbi: 4, pa: 10, slg: 0.571, obp: 0.6, doubles: 0, triples: 0, hr: 0, sb: 2, bb: 1, hbp: 1 },
  { name: 'Batista, Juan', jersey: "66", team: 'dade-nationals', division: '35+', avg: 0.556, ab: 9, h: 5, r: 4, rbi: 3, pa: 11, slg: 0.556, obp: 0.636, doubles: 0, triples: 0, hr: 0, sb: 2, bb: 1, hbp: 1 },
  { name: 'Peralta, Ruben', jersey: "14", team: 'dade-nationals', division: '35+', avg: 0.5, ab: 10, h: 5, r: 2, rbi: 4, pa: 10, slg: 0.7, obp: 0.5, doubles: 2, triples: 0, hr: 0, sb: 1, bb: 0, hbp: 0 },
  { name: 'Nabut, Rafael', jersey: "25", team: 'sf-dodgers', division: '35+', avg: 0.467, ab: 15, h: 7, r: 4, rbi: 3, pa: 17, slg: 0.533, obp: 0.529, doubles: 1, triples: 0, hr: 0, sb: 5, bb: 2, hbp: 0 },
  { name: 'Mendoza, Carmelo', jersey: "10", team: 'kooper-city-royals', division: '35+', avg: 0.455, ab: 11, h: 5, r: 3, rbi: 1, pa: 11, slg: 0.455, obp: 0.455, doubles: 0, triples: 0, hr: 0, sb: 8, bb: 0, hbp: 0 },
  { name: 'Piloto, Julio', jersey: "26", team: 'sf-dodgers', division: '35+', avg: 0.444, ab: 9, h: 4, r: 3, rbi: 1, pa: 10, slg: 0.667, obp: 0.5, doubles: 2, triples: 0, hr: 0, sb: 0, bb: 0, hbp: 1 },
  { name: 'Basterra, Josue', jersey: "23", team: 'dade-nationals', division: '35+', avg: 0.4, ab: 10, h: 4, r: 2, rbi: 4, pa: 11, slg: 0.4, obp: 0.455, doubles: 0, triples: 0, hr: 0, sb: 1, bb: 0, hbp: 1 },
  { name: 'Pena, Adrian', jersey: "99", team: 'sf-angels', division: '35+', avg: 0.4, ab: 15, h: 6, r: 9, rbi: 4, pa: 18, slg: 0.667, obp: 0.5, doubles: 2, triples: 1, hr: 0, sb: 2, bb: 1, hbp: 2 },
  { name: 'Cancino, Luis', jersey: "1", team: 'sf-dodgers', division: '35+', avg: 0.389, ab: 18, h: 7, r: 3, rbi: 4, pa: 19, slg: 0.444, obp: 0.421, doubles: 1, triples: 0, hr: 0, sb: 0, bb: 1, hbp: 0 },
  { name: 'Martines, Asiel', jersey: "27", team: 'dade-nationals', division: '35+', avg: 0.333, ab: 9, h: 3, r: 2, rbi: 1, pa: 10, slg: 0.333, obp: 0.4, doubles: 0, triples: 0, hr: 0, sb: 1, bb: 1, hbp: 0 },
  { name: 'Sanchez, Ronnal', jersey: "22", team: 'sf-dodgers', division: '35+', avg: 0.333, ab: 15, h: 5, r: 4, rbi: 2, pa: 17, slg: 0.333, obp: 0.412, doubles: 0, triples: 0, hr: 0, sb: 0, bb: 2, hbp: 0 },
  { name: 'Phelps, Paul', jersey: "81", team: 'sf-angels', division: '35+', avg: 0.286, ab: 14, h: 4, r: 7, rbi: 3, pa: 19, slg: 0.5, obp: 0.474, doubles: 0, triples: 0, hr: 1, sb: 2, bb: 5, hbp: 0 },
  { name: 'Zottoli, Patrick', jersey: "99", team: 'sf-angels', division: '35+', avg: 0.278, ab: 18, h: 5, r: 2, rbi: 4, pa: 20, slg: 0.389, obp: 0.35, doubles: 2, triples: 0, hr: 0, sb: 0, bb: 1, hbp: 1 },
  { name: 'Claudio, G M', jersey: "33", team: 'sf-angels', division: '35+', avg: 0.273, ab: 11, h: 3, r: 1, rbi: 2, pa: 15, slg: 0.273, obp: 0.467, doubles: 0, triples: 0, hr: 0, sb: 0, bb: 2, hbp: 2 },
  { name: 'Dickson, Alex', jersey: "11", team: 'sf-dodgers', division: '35+', avg: 0.267, ab: 15, h: 4, r: 1, rbi: 4, pa: 16, slg: 0.267, obp: 0.312, doubles: 0, triples: 0, hr: 0, sb: 2, bb: 1, hbp: 0 },
  { name: 'Diaz, Albie', jersey: "8", team: 'sf-dodgers', division: '35+', avg: 0.25, ab: 16, h: 4, r: 1, rbi: 4, pa: 19, slg: 0.25, obp: 0.368, doubles: 0, triples: 0, hr: 0, sb: 0, bb: 3, hbp: 0 },
  { name: 'Claudio, Louie', jersey: "7", team: 'sf-angels', division: '35+', avg: 0.222, ab: 9, h: 2, r: 0, rbi: 1, pa: 11, slg: 0.222, obp: 0.364, doubles: 0, triples: 0, hr: 0, sb: 0, bb: 2, hbp: 0 },
  { name: 'Artigas, Leo', jersey: "13", team: 'sf-dodgers', division: '35+', avg: 0.214, ab: 14, h: 3, r: 3, rbi: 2, pa: 17, slg: 0.214, obp: 0.353, doubles: 0, triples: 0, hr: 0, sb: 3, bb: 3, hbp: 0 },
  { name: 'Flores, Henry', jersey: "17", team: 'sf-dodgers', division: '35+', avg: 0.214, ab: 14, h: 3, r: 2, rbi: 3, pa: 16, slg: 0.429, obp: 0.312, doubles: 3, triples: 0, hr: 0, sb: 0, bb: 1, hbp: 1 },
  { name: 'Gonzalez, Alex', jersey: "5", team: 'sf-dodgers', division: '35+', avg: 0.214, ab: 14, h: 3, r: 7, rbi: 1, pa: 19, slg: 0.214, obp: 0.421, doubles: 0, triples: 0, hr: 0, sb: 3, bb: 5, hbp: 0 },
  { name: 'Doud, Thomas', jersey: "6", team: 'sf-angels', division: '35+', avg: 0.182, ab: 11, h: 2, r: 1, rbi: 2, pa: 12, slg: 0.273, obp: 0.25, doubles: 1, triples: 0, hr: 0, sb: 0, bb: 1, hbp: 0 },
  { name: 'Young, John', jersey: "13", team: 'sf-angels', division: '35+', avg: 0.182, ab: 11, h: 2, r: 1, rbi: 0, pa: 13, slg: 0.182, obp: 0.308, doubles: 0, triples: 0, hr: 0, sb: 0, bb: 1, hbp: 1 },
  { name: 'Morales, Ramon', jersey: "35", team: 'sf-dodgers', division: '35+', avg: 0.154, ab: 13, h: 2, r: 4, rbi: 2, pa: 17, slg: 0.154, obp: 0.353, doubles: 0, triples: 0, hr: 0, sb: 0, bb: 3, hbp: 1 },
  { name: 'Rimoli, Alex', jersey: "10", team: 'aventura-dodgers', division: '28+', avg: 0.6, ab: 15, h: 9, r: 4, rbi: 7, pa: 19, slg: 0.667, obp: 0.684, doubles: 1, triples: 0, hr: 0, sb: 0, bb: 4, hbp: 0 },
  { name: 'Lupinacci, Jon', jersey: "9", team: 'aventura-dodgers', division: '28+', avg: 0.429, ab: 14, h: 6, r: 2, rbi: 3, pa: 14, slg: 0.5, obp: 0.429, doubles: 1, triples: 0, hr: 0, sb: 1, bb: 0, hbp: 0 },
  { name: 'Bensur, Blaine', jersey: "21", team: 'aventura-dodgers', division: '28+', avg: 0.364, ab: 11, h: 4, r: 3, rbi: 3, pa: 13, slg: 0.636, obp: 0.462, doubles: 1, triples: 1, hr: 0, sb: 2, bb: 1, hbp: 1 },
  { name: 'Duffy, Dan', jersey: "15", team: 'aventura-dodgers', division: '28+', avg: 0.364, ab: 11, h: 4, r: 2, rbi: 0, pa: 13, slg: 0.364, obp: 0.462, doubles: 0, triples: 0, hr: 0, sb: 0, bb: 2, hbp: 0 },
  { name: 'Hannon, Dan', jersey: null, team: 'aventura-dodgers', division: '28+', avg: 0.357, ab: 14, h: 5, r: 5, rbi: 2, pa: 15, slg: 0.357, obp: 0.4, doubles: 0, triples: 0, hr: 0, sb: 0, bb: 0, hbp: 1 },
  { name: 'Dar, Jonathan', jersey: null, team: 'aventura-dodgers', division: '28+', avg: 0.308, ab: 13, h: 4, r: 2, rbi: 3, pa: 15, slg: 0.385, obp: 0.4, doubles: 1, triples: 0, hr: 0, sb: 1, bb: 2, hbp: 0 },
  { name: 'Vallejo, Moises', jersey: null, team: 'aventura-dodgers', division: '28+', avg: 0.286, ab: 14, h: 4, r: 5, rbi: 5, pa: 16, slg: 0.429, obp: 0.375, doubles: 2, triples: 0, hr: 0, sb: 0, bb: 1, hbp: 1 },
  { name: 'Barber, Chris', jersey: "11", team: 'aventura-dodgers', division: '28+', avg: 0.2, ab: 10, h: 2, r: 2, rbi: 2, pa: 14, slg: 0.2, obp: 0.429, doubles: 0, triples: 0, hr: 0, sb: 1, bb: 2, hbp: 2 },
  { name: 'Jackson, Ronald', jersey: "5", team: 'aventura-dodgers', division: '28+', avg: 0.2, ab: 10, h: 2, r: 4, rbi: 1, pa: 11, slg: 0.2, obp: 0.273, doubles: 0, triples: 0, hr: 0, sb: 0, bb: 1, hbp: 0 },
  { name: 'Oliveros, Javier', jersey: "14", team: 'aventura-dodgers', division: '28+', avg: 0.2, ab: 15, h: 3, r: 1, rbi: 2, pa: 18, slg: 0.2, obp: 0.333, doubles: 0, triples: 0, hr: 0, sb: 0, bb: 2, hbp: 1 },
  { name: 'Rivera, Alex', jersey: null, team: 'aventura-dodgers', division: '28+', avg: 0.118, ab: 17, h: 2, r: 1, rbi: 2, pa: 18, slg: 0.118, obp: 0.167, doubles: 0, triples: 0, hr: 0, sb: 0, bb: 1, hbp: 0 },
];
