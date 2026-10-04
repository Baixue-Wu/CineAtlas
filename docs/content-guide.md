# Maintaining the cultural film catalog

The first collection is a small editorial sample, not a balanced survey of world cultures or a complete travel database. In particular, many selected films look at urban family life, migration and unequal access to resources. Future additions can widen those perspectives without claiming representative coverage.

## Add a destination

Add a record to `src/data/destinations.json` with a stable ID, Chinese and English names, geographic coordinates, a short introduction and a cultural question. Coordinates identify the destination, not a filming site. Optional photos need verified source and license entries in `src/data/image-credits.json` and a local file in `public/images/`. A typographic cover works without a photo.

## Add a film

Add a record to `src/data/films.json` that includes:

- A checked title, director and release year, linked to a destination ID.
- A story-period interval, human-readable label and note explaining the precision or inference. Do not copy release year into the story field without evidence.
- One or more editorial culture themes, a short discovery hook, synopsis and original cultural interpretation.
- Observation prompts and a question the traveler can carry into the real place.
- An explicit account of the film's relationship with the destination. Clarify when the story spans places or the production location differs from the setting.
- HTTPS links to supporting film institutions, archives, distributors or other reliable sources.

Theme buttons, counts and decade choices derive from the records. There is no separate manually maintained index. Decade filters include films whose story interval intersects the selected decade; the timeline positions a film at the start of its stated interval and labels the entire range.

The guide is a lens offered to the reader. Avoid statements such as “people here are…” inferred from fictional characters. Do not turn an artistic portrayal into a universal claim about a culture. Historical films describe a period, not necessarily the destination today. Keep serious content notes concise when they help a visitor choose a film.

## Check a change

Run `npm run validate:data`, `npm test` and `npm run build`. Open the destination and film detail to check the guide and sources. Run `npm run test:e2e` after interaction changes. These checks establish consistency and behavior; they do not verify every historical statement or prove audience demand.

Source links were checked during initial preparation on 2026-10-04. Availability can change. The app makes no promise that a source link provides streaming access.
