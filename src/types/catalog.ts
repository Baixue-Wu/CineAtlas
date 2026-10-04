export interface Source {
  label: string;
  url: string;
}

export interface Destination {
  id: string;
  name: string;
  englishName: string;
  region: string;
  latitude: number;
  longitude: number;
  color: string;
  image?: string;
  imageAlt?: string;
  introduction: string;
  question: string;
}

export interface Film {
  id: string;
  title: string;
  originalTitle: string;
  director: string;
  releaseYear: number;
  destinationId: string;
  storyPeriod: { start: number; end: number; label: string; note: string };
  themes: string[];
  hook: string;
  synopsis: string;
  culturalLens: string;
  observations: string[];
  travelQuestion: string;
  placeConnection: string;
  sources: Source[];
}

export type TimeBasis = 'story' | 'release';
export type View = 'map' | 'timeline';
export interface Filters {
  destination: string;
  theme: string;
  decade: string;
  basis: TimeBasis;
  query: string;
}
