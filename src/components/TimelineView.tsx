import type { Destination, Film, TimeBasis } from '../types/catalog';
import { filmPeriod } from '../lib/explore';
import { FilmCard } from './FilmCard';

export function TimelineView({
  films,
  destinations,
  basis,
  onOpen,
}: {
  films: Film[];
  destinations: Destination[];
  basis: TimeBasis;
  onOpen: (film: Film) => void;
}) {
  const groups = new Map<number, Film[]>();
  for (const film of films) {
    const decade = Math.floor(filmPeriod(film, basis)[0] / 10) * 10;
    groups.set(decade, [...(groups.get(decade) ?? []), film]);
  }
  return (
    <div className="timeline-view">
      <p className="timeline-note">
        {basis === 'story'
          ? '按故事时代的起点排列；跨时代的电影保留完整时间说明。'
          : '按电影上映年代排列，了解不同时代创作者的目光。'}
      </p>
      {[...groups]
        .sort(([a], [b]) => a - b)
        .map(([decade, group]) => (
          <section
            className="timeline-group"
            key={decade}
            aria-labelledby={`decade-${decade}`}
          >
            <div className="decade-label">
              <h3 id={`decade-${decade}`}>
                {decade}
                <span>s</span>
              </h3>
              <p>{basis === 'story' ? '故事时代' : '上映年代'}</p>
            </div>
            <div className="timeline-films">
              {group.map((film) => (
                <div className="timeline-entry" key={film.id}>
                  <p className="period-label">
                    {basis === 'story'
                      ? film.storyPeriod.label
                      : `${film.releaseYear} 年上映`}
                  </p>
                  <FilmCard
                    film={film}
                    destination={
                      destinations.find(
                        (place) => place.id === film.destinationId
                      )!
                    }
                    onOpen={onOpen}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
