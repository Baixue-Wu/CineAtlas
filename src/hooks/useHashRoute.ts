// Adapted from The Chronicle of Light. MIT notice: docs/LICENSE-upstream.
import { useCallback, useEffect, useState } from 'react';
import type { Filters, View } from '../types/catalog';

export interface ExploreRoute extends Filters {
  view: View;
  film: string | null;
}
export const defaultRoute: ExploreRoute = {
  view: 'map',
  destination: 'all',
  theme: 'all',
  decade: 'all',
  basis: 'story',
  query: '',
  film: null,
};

function currentRoute(): ExploreRoute {
  const [path, search] = window.location.hash.replace(/^#/, '').split('?');
  const query = new URLSearchParams(search);
  const decade = query.get('decade');
  return {
    view: path === '/timeline' ? 'timeline' : 'map',
    destination: query.get('place') || 'all',
    theme: query.get('theme') || 'all',
    decade: decade && /^\d{4}$/.test(decade) ? decade : 'all',
    basis: query.get('time') === 'release' ? 'release' : 'story',
    query: query.get('q') || '',
    film: query.get('film'),
  };
}

export function routeHash(route: ExploreRoute): string {
  const query = new URLSearchParams();
  if (route.destination !== 'all') query.set('place', route.destination);
  if (route.theme !== 'all') query.set('theme', route.theme);
  if (route.decade !== 'all') query.set('decade', route.decade);
  if (route.basis !== 'story') query.set('time', route.basis);
  if (route.query) query.set('q', route.query);
  if (route.film) query.set('film', route.film);
  return `#/${route.view}${query.size ? `?${query}` : ''}`;
}

export function useHashRoute() {
  const [route, setRoute] = useState<ExploreRoute>(currentRoute);
  useEffect(() => {
    const onChange = () => setRoute(currentRoute());
    window.addEventListener('hashchange', onChange);
    window.addEventListener('popstate', onChange);
    return () => {
      window.removeEventListener('hashchange', onChange);
      window.removeEventListener('popstate', onChange);
    };
  }, []);
  const navigate = useCallback(
    (patch: Partial<ExploreRoute>, replace = false) => {
      const next = { ...currentRoute(), ...patch };
      const hash = routeHash(next);
      if (window.location.hash !== hash)
        window.history[replace ? 'replaceState' : 'pushState'](null, '', hash);
      setRoute(next);
    },
    []
  );
  return { route, navigate };
}
