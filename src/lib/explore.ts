import type {
  Destination,
  Film,
  Filters,
  TimeBasis,
} from '../types/catalog.ts';

export function filmPeriod(film: Film, basis: TimeBasis): [number, number] {
  return basis === 'release'
    ? [film.releaseYear, film.releaseYear]
    : [film.storyPeriod.start, film.storyPeriod.end];
}

export function filterFilms(
  films: Film[],
  destinations: Destination[],
  filters: Filters
): Film[] {
  const query = filters.query.trim().toLocaleLowerCase();
  const places = new Map(destinations.map((place) => [place.id, place]));
  return films
    .filter((film) => {
      if (
        filters.destination !== 'all' &&
        film.destinationId !== filters.destination
      )
        return false;
      if (filters.theme !== 'all' && !film.themes.includes(filters.theme))
        return false;
      if (filters.decade !== 'all') {
        const decade = Number(filters.decade);
        const [start, end] = filmPeriod(film, filters.basis);
        if (!Number.isInteger(decade) || start > decade + 9 || end < decade)
          return false;
      }
      const place = places.get(film.destinationId);
      return (
        !query ||
        [
          film.title,
          film.originalTitle,
          film.director,
          film.hook,
          film.culturalLens,
          ...film.themes,
          place?.name,
          place?.englishName,
          place?.region,
        ]
          .filter(Boolean)
          .join(' ')
          .toLocaleLowerCase()
          .includes(query)
      );
    })
    .sort(
      (a, b) =>
        filmPeriod(a, filters.basis)[0] - filmPeriod(b, filters.basis)[0] ||
        a.title.localeCompare(b.title)
    );
}

export function availableDecades(films: Film[], basis: TimeBasis): number[] {
  const decades = new Set<number>();
  for (const film of films) {
    const [start, end] = filmPeriod(film, basis);
    for (let decade = Math.floor(start / 10) * 10; decade <= end; decade += 10)
      decades.add(decade);
  }
  return [...decades].sort((a, b) => a - b);
}

export function validateCatalog(
  destinations: Destination[],
  films: Film[]
): string[] {
  const errors: string[] = [];
  const placeIds = new Set<string>();
  const filmIds = new Set<string>();
  for (const place of destinations) {
    if (placeIds.has(place.id))
      errors.push(`Duplicate destination: ${place.id}`);
    placeIds.add(place.id);
    if (
      !Number.isFinite(place.latitude) ||
      Math.abs(place.latitude) > 90 ||
      !Number.isFinite(place.longitude) ||
      Math.abs(place.longitude) > 180
    )
      errors.push(`Invalid coordinates: ${place.id}`);
    if (!place.name || !place.introduction || !place.question)
      errors.push(`Missing destination content: ${place.id}`);
  }
  for (const film of films) {
    if (filmIds.has(film.id)) errors.push(`Duplicate film: ${film.id}`);
    filmIds.add(film.id);
    if (!placeIds.has(film.destinationId))
      errors.push(`Unknown destination: ${film.id}`);
    if (!Number.isInteger(film.releaseYear) || film.releaseYear < 1888)
      errors.push(`Invalid release year: ${film.id}`);
    const { start, end } = film.storyPeriod;
    if (!Number.isInteger(start) || !Number.isInteger(end) || start > end)
      errors.push(`Invalid story period: ${film.id}`);
    if (!film.storyPeriod.note || !film.storyPeriod.label)
      errors.push(`Missing period explanation: ${film.id}`);
    if (
      !film.themes.length ||
      !film.culturalLens ||
      !film.placeConnection ||
      !film.observations.length
    )
      errors.push(`Missing cultural guide: ${film.id}`);
    if (!film.sources.length) errors.push(`Missing sources: ${film.id}`);
    for (const source of film.sources) {
      try {
        if (new URL(source.url).protocol !== 'https:')
          errors.push(`Non-HTTPS source: ${film.id}`);
      } catch {
        errors.push(`Invalid source URL: ${film.id}`);
      }
    }
  }
  for (const id of placeIds)
    if (!films.some((film) => film.destinationId === id))
      errors.push(`Empty destination: ${id}`);
  return errors;
}
