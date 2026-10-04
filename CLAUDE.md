# CineAtlas

CineAtlas (映游) helps culturally curious travelers explore places through films. Culture is the purpose; maps and chronology are ways to explore it. The user authorized independent implementation, asking only about major product uncertainty, indispensable access or new spending.

## Structure

- `src/data`: curated destinations and films, with source links and distinct story periods and release years.
- `src/components`: map, chronological view, film cards and accessible details.
- `src/lib`: pure filtering and validation logic.
- `src/hooks`: route state derived from the URL.
- `public/images`: licensed destination photography. Credits live in `src/data/image-credits.json`.
- `scripts`: executable data checks with `--help`.
- `tests`: behavioral checks for filtering and data invariants.
- `docs`: upstream provenance, implementation decisions and validation results.

## Working agreements

Use the existing `github-baixue` SSH identity for Baixue-Wu/CineAtlas. Author and commit as Baixue Wu <baixuewu0@gmail.com>, without assistant attribution. This project-specific user instruction overrides inherited authorship defaults. All GitHub operations, PRs, deployments and final project materials must use Baixue's account and identity. Verify the authenticated API account is Baixue-Wu before writes; do not use the machine's default account. Preserve required upstream attribution, but do not introduce another collaborator's personal account, email, local filesystem path or authorship into deliverables. The user explicitly waived the PR requirement for this initial implementation on 2026-10-04: finish code directly and sync tested changes to main without waiting for API access. Push committed changes in the same turn. GitHub is the code home. Publish only through a hosting identity verified to belong to Baixue.

Chinese planning and private job-search discussions live outside this repo in `../白雪求职规划/项目规划/电影文化地图/`. Do not publish them. Keep finalized implementation choices in `docs/design-decisions.md`.

Preserve upstream MIT notices. Do not import the upstream historical dataset or unlicensed film stills. Distinguish story locations, shooting locations and production origins. Cultural interpretations are editorial lenses, not claims that a film represents an entire culture. Use explicit parameters, derive counts from data, and show useful errors. No em dashes in code comments or docstrings.

## Commands

`npm ci`, `npm run dev -- --host 127.0.0.1`, `npm run validate:data`, `npm test`, `npm run build`, `npm run preview -- --host 127.0.0.1`.
