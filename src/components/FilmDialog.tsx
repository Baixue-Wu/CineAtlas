import { useEffect, useRef } from 'react';
import type { Destination, Film } from '../types/catalog';
import { Icon } from './Icon';

export function FilmDialog({
  film,
  destination,
  onClose,
}: {
  film: Film;
  destination: Destination;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previous = document.activeElement as HTMLElement | null;
    element.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="film-dialog"
      aria-labelledby="film-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article className="dialog-inner">
        <header className="dialog-top">
          <span className="eyebrow">
            <Icon name="pin" size={16} />
            {destination.name} / CULTURE NOTES
          </span>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="关闭影片详情"
            autoFocus
          >
            <Icon name="close" />
          </button>
        </header>
        <div className="dialog-heading">
          <p className="kicker">从一部电影，走进一种生活</p>
          <h2 id="film-dialog-title">{film.title}</h2>
          <p className="original-title">{film.originalTitle}</p>
          <p className="film-credits">
            {film.director} · {film.releaseYear} 年上映
          </p>
        </div>
        <div className="dialog-tags">
          {film.themes.map((theme) => (
            <span className="tag" key={theme}>
              {theme}
            </span>
          ))}
        </div>
        <section className="culture-lens">
          <p className="eyebrow">这部电影，让你看见什么</p>
          <h3>{film.hook}</h3>
          <p>{film.culturalLens}</p>
        </section>
        <section className="dialog-section">
          <h3>故事从这里开始</h3>
          <p>{film.synopsis}</p>
        </section>
        <section className="dialog-section">
          <h3>观影时，留意这两个细节</h3>
          <ol>
            {film.observations.map((observation) => (
              <li key={observation}>{observation}</li>
            ))}
          </ol>
        </section>
        <div className="travel-question">
          <Icon name="compass" size={26} />
          <div>
            <p className="eyebrow">带着这个问题，去旅行</p>
            <p>{film.travelQuestion}</p>
          </div>
        </div>
        <section className="dialog-section context-section">
          <h3>地点与时间</h3>
          <dl>
            <div>
              <dt>与目的地的关系</dt>
              <dd>{film.placeConnection}</dd>
            </div>
            <div>
              <dt>故事所处时代</dt>
              <dd>
                {film.storyPeriod.label}
                <small>{film.storyPeriod.note}</small>
              </dd>
            </div>
            <div>
              <dt>上映年份</dt>
              <dd>{film.releaseYear} 年</dd>
            </div>
          </dl>
        </section>
        <section className="dialog-section sources-section">
          <h3>资料与延伸阅读</h3>
          <p className="muted">以下链接提供背景资料，并非在线观看入口。</p>
          <ul>
            {film.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                  <span className="sr-only">（新窗口）</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
        <p className="editorial-note">
          文化导读是映游的编辑视角。一部电影呈现特定人物与时代，不代表当地生活的全部。
        </p>
      </article>
    </dialog>
  );
}
