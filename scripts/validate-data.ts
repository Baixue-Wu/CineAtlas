import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateCatalog } from '../src/lib/explore.ts';

const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log(
    'Usage: npm run validate:data\nValidates local film data, destination references and licensed image files.'
  );
} else if (args.length) {
  console.error('Unknown argument. Run npm run validate:data -- --help.');
  process.exitCode = 2;
} else {
  try {
    const root = new URL('../', import.meta.url);
    const read = (name: string) =>
      JSON.parse(readFileSync(new URL(name, root), 'utf8'));
    const destinations = read('src/data/destinations.json');
    const films = read('src/data/films.json');
    const credits = read('src/data/image-credits.json');
    const errors = validateCatalog(destinations, films);
    for (const place of destinations) {
      if (!place.image) continue;
      if (!existsSync(new URL(`public/${place.image}`, root)))
        errors.push(`Missing image: ${place.id}`);
      if (
        !credits.some(
          (credit: {
            file: string;
            source: string;
            author: string;
            licenseUrl: string;
          }) =>
            credit.file === place.image &&
            credit.source &&
            credit.author &&
            credit.licenseUrl
        )
      )
        errors.push(`Missing photo credit: ${place.id}`);
    }
    const land = read('public/land.geojson');
    if (land.type !== 'FeatureCollection' || !land.features.length)
      errors.push('Missing land geometry.');
    if (errors.length) throw new Error(errors.join('\n'));
    console.log(
      `Validated ${destinations.length} destinations, ${films.length} films, ${credits.length} credited photos and local land geometry.`
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    console.error(
      `Fix the catalog in ${resolve(
        'src/data'
      )}, then run npm run validate:data again.`
    );
    process.exitCode = 1;
  }
}
