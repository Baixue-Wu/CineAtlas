import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  availableDecades,
  filterFilms,
  validateCatalog,
} from '../src/lib/explore.ts';
import type { Destination, Film, Filters } from '../src/types/catalog.ts';

const destinations: Destination[] = JSON.parse(
  readFileSync(
    new URL('../src/data/destinations.json', import.meta.url),
    'utf8'
  )
);
const films: Film[] = JSON.parse(
  readFileSync(new URL('../src/data/films.json', import.meta.url), 'utf8')
);
const filters: Filters = {
  destination: 'all',
  theme: 'all',
  decade: 'all',
  basis: 'story',
  query: '',
};
const results = (patch: Partial<Filters>) =>
  filterFilms(films, destinations, { ...filters, ...patch });

test('a film about 1970s Mexico is not filed under Rome or its 2018 release period', () => {
  assert.ok(
    results({ destination: 'mexico-city', decade: '1970' }).some(
      (film) => film.id === 'roma'
    )
  );
  assert.ok(
    !results({ destination: 'rome' }).some((film) => film.id === 'roma')
  );
  assert.ok(!results({ decade: '2010' }).some((film) => film.id === 'roma'));
  assert.ok(
    results({ decade: '2010', basis: 'release' }).some(
      (film) => film.id === 'roma'
    )
  );
});
test('filters intersect instead of unioning unrelated matches', () => {
  assert.deepEqual(
    results({ destination: 'mumbai', theme: '饮食与交往' }).map(
      (film) => film.id
    ),
    ['the-lunchbox']
  );
  assert.equal(
    results({ destination: 'tokyo', theme: '饮食与交往' }).length,
    0
  );
});
test('a story crossing decades matches both intersecting periods', () => {
  assert.ok(results({ decade: '1990' }).some((film) => film.id === 'yi-yi'));
  assert.ok(results({ decade: '2000' }).some((film) => film.id === 'yi-yi'));
  assert.ok(!results({ decade: '2010' }).some((film) => film.id === 'yi-yi'));
});
test('search supports Chinese, original titles and case-insensitive city names', () => {
  assert.equal(results({ query: '  TOKYO  ' }).length, 2);
  assert.equal(results({ query: '午餐盒' })[0].id, 'the-lunchbox');
  assert.equal(results({ query: 'Cléo' })[0].id, 'cleo-from-5-to-7');
  assert.equal(results({ query: '不存在的地方' }).length, 0);
});
test('decades derive from the catalog and the chosen time basis', () => {
  const roma = films.filter((film) => film.id === 'roma');
  assert.deepEqual(availableDecades(roma, 'story'), [1970]);
  assert.deepEqual(availableDecades(roma, 'release'), [2010]);
});
test('catalog is consistent and rejects broken place references, ranges and provenance', () => {
  assert.deepEqual(validateCatalog(destinations, films), []);
  const invalid = structuredClone(films);
  invalid[0].destinationId = 'missing';
  invalid[0].storyPeriod.end = 1900;
  invalid[0].sources = [];
  const errors = validateCatalog(destinations, invalid);
  assert.ok(errors.some((error) => error.startsWith('Unknown destination')));
  assert.ok(errors.some((error) => error.startsWith('Invalid story period')));
  assert.ok(errors.some((error) => error.startsWith('Missing sources')));
});
