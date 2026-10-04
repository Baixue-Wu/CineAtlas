import type { Destination, Film } from '../types/catalog';
import { Icon } from './Icon';

export function FilmCard({
  film,
  destination,
  onOpen,
}: {
  film: Film;
  destination: Destination;
  onOpen: (film: Film) => void;
}) {
  return (
    <button
      className="film-card"
      onClick={() => onOpen(film)}
      aria-label={`阅读《${film.title}》文化导读`}
    >
      <div className="film-card-top">
        <span style={{ color: destination.color }}>{destination.name}</span>
        <span>{film.releaseYear} 上映</span>
      </div>
      <h3>{film.title}</h3>
      <p className="original-title">{film.originalTitle}</p>
      <p className="film-hook">{film.hook}</p>
      <div className="film-card-bottom">
        <span>{film.themes[0]}</span>
        <span className="read-label">
          <Icon name="book" size={16} />
          文化导读
        </span>
      </div>
    </button>
  );
}
