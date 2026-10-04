import destinationData from './destinations.json';
import filmData from './films.json';
import type { Destination, Film } from '../types/catalog';

export const destinations: Destination[] = destinationData;
export const films: Film[] = filmData;
export const themes = [...new Set(films.flatMap((film) => film.themes))];
