export interface Field {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lon: number;
}

export const FIELDS: Field[] = [
  { id: 'sabal-pines', name: 'Sabal Pines Park', address: '5005 Lyons Rd', city: 'Coconut Creek, FL 33073', lat: 26.2801, lon: -80.1787 },
  { id: 'coral-springs', name: 'Coral Springs Sportsplex', address: '2501 Coral Springs Dr', city: 'Coral Springs, FL 33065', lat: 26.2712, lon: -80.2484 },
  { id: 'flamingo-park', name: 'Flamingo Park', address: '999 11th St', city: 'Miami Beach, FL 33139', lat: 25.7783, lon: -80.1367 },
  { id: 'floyd-hull', name: 'Floyd Hull Stadium', address: '', city: 'South Florida', lat: 26.1, lon: -80.2 },
  { id: 'sugar-sand', name: 'Sugar Sand Park #6', address: '300 S Military Trail', city: 'Boca Raton, FL 33486', lat: 26.3683, lon: -80.1268 },
  { id: 'sunset-park', name: 'Sunset Park', address: '', city: 'South Florida', lat: 25.9, lon: -80.2 },
  { id: 'west-perrine', name: 'West Perrine Park', address: '', city: 'Miami, FL', lat: 25.6, lon: -80.3 },
  { id: 'pompey-park', name: 'Pompey Park', address: '1101 NW 2nd St', city: 'Delray Beach, FL 33444', lat: 26.4614, lon: -80.0789 },
  { id: 'margate-sports', name: 'Margate Sports Complex #3', address: '', city: 'Margate, FL', lat: 26.2445, lon: -80.2064 },
];

export function getField(id: string): Field | undefined {
  return FIELDS.find(f => f.id === id);
}

export function getFieldByName(name: string): Field | undefined {
  return FIELDS.find(f => f.name.toLowerCase().includes(name.toLowerCase()));
}
