import { lazy, Suspense, useMemo, useState, type CSSProperties } from 'react';
import { destinations, films, themes } from './data/catalog';
import imageCredits from './data/image-credits.json';
import { availableDecades, filterFilms } from './lib/explore';
import { defaultRoute, useHashRoute } from './hooks/useHashRoute';
import type { Destination, Film } from './types/catalog';
import { Icon } from './components/Icon';
import { FilmCard } from './components/FilmCard';
import { FilmDialog } from './components/FilmDialog';
import { TimelineView } from './components/TimelineView';

const MapView = lazy(() =>
  import('./components/map/MapView').then((module) => ({
    default: module.MapView,
  }))
);

export default function App() {
  const { route, navigate } = useHashRoute();
  const [creditsOpen, setCreditsOpen] = useState(false);
  const destination = destinations.find(
    (place) => place.id === route.destination
  );
  const filters = {
    ...route,
    destination: destination?.id ?? 'all',
    theme: themes.includes(route.theme) ? route.theme : 'all',
  };
  const filtered = filterFilms(films, destinations, filters);
  const matchingEverywhere = filterFilms(films, destinations, {
    ...filters,
    destination: 'all',
  });
  const counts = Object.fromEntries(
    destinations.map((place) => [
      place.id,
      matchingEverywhere.filter((film) => film.destinationId === place.id)
        .length,
    ])
  );
  const activeFilm = films.find((film) => film.id === route.film);
  const decades = useMemo(
    () => availableDecades(films, route.basis),
    [route.basis]
  );
  const openFilm = (film: Film) => navigate({ film: film.id });
  const selectDestination = (place: Destination) =>
    navigate({ destination: place.id, film: null });
  const clearFilters = () =>
    navigate({ query: '', decade: 'all', theme: 'all' });
  const filteredActive =
    route.query || route.decade !== 'all' || filters.theme !== 'all';
  const featured = destination ?? destinations[0];
  const imageCredit = imageCredits.find(
    (credit) => credit.destinationId === featured.id
  );

  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        跳至探索内容
      </a>
      <header className="site-header">
        <button
          className="brand"
          onClick={() => navigate(defaultRoute)}
          aria-label="映游 CineAtlas 首页"
        >
          <span className="brand-symbol">
            <Icon name="globe" size={25} />
          </span>
          <span>
            CineAtlas<small>映游</small>
          </span>
        </button>
        <nav className="view-switch" aria-label="探索方式">
          <button
            className={route.view === 'map' ? 'active' : ''}
            aria-pressed={route.view === 'map'}
            onClick={() => navigate({ view: 'map' })}
          >
            <Icon name="globe" size={17} />
            <span>地图探索</span>
          </button>
          <button
            className={route.view === 'timeline' ? 'active' : ''}
            aria-pressed={route.view === 'timeline'}
            onClick={() => navigate({ view: 'timeline' })}
          >
            <Icon name="timeline" size={17} />
            <span>时间漫游</span>
          </button>
        </nav>
        <span className="header-note">A PLACE. A FILM. A NEW PERSPECTIVE.</span>
      </header>
      <main id="main-content" tabIndex={-1}>
        <section className="intro-row">
          <div>
            <p className="eyebrow">EXPLORE CULTURE THROUGH CINEMA</p>
            <h1>
              跟着电影，<span>走进一个地方。</span>
            </h1>
            <p className="intro-copy">
              从目的地出发，发现银幕里的日常、关系与时代。
            </p>
          </div>
          <div className="search-box">
            <Icon name="search" />
            <input
              aria-label="搜索城市、电影或文化主题"
              type="search"
              placeholder="想去哪里？搜索城市或电影"
              value={route.query}
              onChange={(event) =>
                navigate(
                  { query: event.target.value, destination: 'all' },
                  true
                )
              }
            />
            {route.query && (
              <button
                className="search-clear"
                onClick={() => navigate({ query: '' }, true)}
                aria-label="清空搜索"
              >
                <Icon name="close" size={16} />
              </button>
            )}
          </div>
        </section>
        <section className="explorer" aria-label="电影文化探索">
          <div className="explorer-toolbar">
            <div className="breadcrumb">
              <Icon name="pin" size={16} />
              <button
                onClick={() => navigate({ destination: 'all' })}
                className={!destination ? 'current' : ''}
              >
                世界
              </button>
              {destination && (
                <>
                  <span>/</span>
                  <span className="current">{destination.name}</span>
                </>
              )}
              <span className="count-badge">
                {destination
                  ? films.filter(
                      (film) => film.destinationId === destination.id
                    ).length
                  : films.length}{' '}
                部影片
              </span>
            </div>
            <div className="time-controls">
              <select
                aria-label="时间依据"
                value={route.basis}
                onChange={(event) =>
                  navigate({
                    basis:
                      event.target.value === 'release' ? 'release' : 'story',
                    decade: 'all',
                  })
                }
              >
                <option value="story">故事时代</option>
                <option value="release">上映年代</option>
              </select>
              <select
                aria-label="年代筛选"
                value={route.decade}
                onChange={(event) => navigate({ decade: event.target.value })}
              >
                <option value="all">所有年代</option>
                {decades.map((decade) => (
                  <option key={decade} value={String(decade)}>
                    {decade} 年代
                  </option>
                ))}
              </select>
            </div>
          </div>
          {route.view === 'map' ? (
            <div className="map-workspace">
              <div className="map-column">
                <Suspense
                  fallback={
                    <div className="map-loading" role="status">
                      正在展开世界地图…
                    </div>
                  }
                >
                  <MapView
                    destinations={destinations}
                    selected={destination}
                    counts={counts}
                    onSelect={selectDestination}
                  />
                </Suspense>
                <div className="destination-strip" aria-label="选择目的地">
                  {destinations.map((place) => (
                    <button
                      key={place.id}
                      className={destination?.id === place.id ? 'selected' : ''}
                      aria-pressed={destination?.id === place.id}
                      onClick={() => selectDestination(place)}
                    >
                      <span>{place.name}</span>
                      <small>{counts[place.id]} 部</small>
                    </button>
                  ))}
                </div>
              </div>
              <aside
                className="destination-panel"
                aria-label={`${featured.name}文化入口`}
              >
                <div
                  className={`destination-cover ${
                    featured.image ? '' : 'type-cover'
                  }`}
                  style={{ '--place-color': featured.color } as CSSProperties}
                >
                  {featured.image ? (
                    <img
                      src={`${import.meta.env.BASE_URL}${featured.image}`}
                      alt={featured.imageAlt}
                    />
                  ) : (
                    <span className="place-monogram" aria-hidden="true">
                      {featured.englishName}
                    </span>
                  )}
                  <div className="cover-shade" />
                  <div className="cover-text">
                    <p className="eyebrow">
                      {destination ? 'YOUR DESTINATION' : '从这里开始'}
                    </p>
                    <h2>
                      {featured.name}
                      <span>{featured.englishName}</span>
                    </h2>
                    <p>{featured.region}</p>
                  </div>
                </div>
                <div className="destination-copy">
                  <p>{featured.introduction}</p>
                  <blockquote>{featured.question}</blockquote>
                  {!destination && (
                    <button
                      className="primary-button"
                      onClick={() => selectDestination(featured)}
                    >
                      <Icon name="compass" size={18} />
                      探索{featured.name}的电影
                    </button>
                  )}
                  {imageCredit && (
                    <p className="photo-credit">
                      目的地摄影：
                      <a
                        href={imageCredit.source}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {imageCredit.author}
                      </a>
                    </p>
                  )}
                </div>
              </aside>
            </div>
          ) : (
            <div className="timeline-heading">
              <div>
                <p className="eyebrow">CULTURE, ACROSS TIME</p>
                <h2>
                  {destination ? `${destination.name}的` : '世界各地的'}生活切片
                </h2>
                <p>
                  {destination?.question ??
                    '沿着年代，看看不同地方的人如何生活、相爱与寻找归属。'}
                </p>
              </div>
              <label className="destination-select">
                目的地
                <select
                  aria-label="时间线目的地"
                  value={destination?.id ?? 'all'}
                  onChange={(event) =>
                    navigate({ destination: event.target.value })
                  }
                >
                  <option value="all">全部目的地</option>
                  {destinations.map((place) => (
                    <option value={place.id} key={place.id}>
                      {place.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          <div className="theme-bar">
            <span className="theme-label">你想了解</span>
            <div className="theme-options" role="group" aria-label="文化主题">
              {['all', ...themes].map((theme) => (
                <button
                  key={theme}
                  className={filters.theme === theme ? 'selected' : ''}
                  aria-pressed={filters.theme === theme}
                  onClick={() => navigate({ theme })}
                >
                  {theme === 'all' ? '全部文化侧面' : theme}
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className="results-section" aria-labelledby="results-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A DIFFERENT WAY TO KNOW A PLACE</p>
              <h2 id="results-title">
                {destination
                  ? `从电影认识${destination.name}`
                  : '选择一部电影，打开一种视角'}
              </h2>
            </div>
            <div className="results-meta">
              <span aria-live="polite">{filtered.length} 部匹配影片</span>
              {filteredActive && (
                <button onClick={clearFilters}>清除筛选</button>
              )}
            </div>
          </div>
          {!filtered.length ? (
            <div className="empty-state">
              <Icon name="compass" size={34} />
              <h3>还没有符合这些条件的影片</h3>
              <p>
                试试其他年代或文化主题。当前只收录了 {destinations.length}{' '}
                个目的地的精选内容。
              </p>
              <button className="primary-button" onClick={clearFilters}>
                重置筛选
              </button>
              {destination && (
                <button
                  className="text-button"
                  onClick={() => navigate({ destination: 'all' })}
                >
                  看看其他目的地
                </button>
              )}
            </div>
          ) : route.view === 'timeline' ? (
            <TimelineView
              films={filtered}
              destinations={destinations}
              basis={route.basis}
              onOpen={openFilm}
            />
          ) : (
            <div className="film-grid">
              {filtered.map((film) => (
                <FilmCard
                  key={film.id}
                  film={film}
                  destination={
                    destinations.find(
                      (place) => place.id === film.destinationId
                    )!
                  }
                  onOpen={openFilm}
                />
              ))}
            </div>
          )}
        </section>
        <div className="editorial-footer">
          <Icon name="film" size={24} />
          <p>电影是一扇窗。透过它看见具体的人，再带着好奇走进真实的地方。</p>
          <span>
            {destinations.length} 个目的地 · {films.length} 部精选电影
          </span>
        </div>
      </main>
      <footer className="site-footer">
        <span>映游 CineAtlas · Baixue Wu</span>
        <button
          onClick={() => setCreditsOpen((value) => !value)}
          aria-expanded={creditsOpen}
        >
          关于内容与鸣谢
        </button>
        <a
          href="https://github.com/Baixue-Wu/CineAtlas"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </footer>
      {creditsOpen && (
        <section className="credits-panel" aria-label="内容与鸣谢">
          <h2>关于这份电影地图</h2>
          <p>
            这是持续整理中的精选文化导览，尚未覆盖全球所有地区。时间范围有约略值，详见每部电影的说明；城市标记是探索入口，不是取景地导航。文化主题与导读是编辑视角，影片事实出处列在详情中。
          </p>
          <p>
            地图与路由代码改编自{' '}
            <a
              href="https://github.com/rafsunsheikh/The-Chronicle-of-Light"
              target="_blank"
              rel="noreferrer"
            >
              The Chronicle of Light
            </a>
            （MD Rafsun Sheikh，MIT）；陆地轮廓来自{' '}
            <a
              href="https://www.naturalearthdata.com/about/terms-of-use/"
              target="_blank"
              rel="noreferrer"
            >
              Natural Earth
            </a>
            （公有领域）。
          </p>
          <p>
            照片为目的地实景，不是电影剧照。
            {imageCredits.map((credit) => (
              <span key={credit.destinationId}>
                {' '}
                <a href={credit.source} target="_blank" rel="noreferrer">
                  {credit.author}
                </a>{' '}
                / Unsplash；
              </span>
            ))}
            使用遵循{' '}
            <a
              href="https://unsplash.com/license"
              target="_blank"
              rel="noreferrer"
            >
              Unsplash License
            </a>
            。
          </p>
          <button className="text-button" onClick={() => setCreditsOpen(false)}>
            收起说明
          </button>
        </section>
      )}
      {activeFilm && (
        <FilmDialog
          film={activeFilm}
          destination={
            destinations.find((place) => place.id === activeFilm.destinationId)!
          }
          onClose={() => navigate({ film: null }, true)}
        />
      )}
    </>
  );
}
