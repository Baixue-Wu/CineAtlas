# First-version validation

Validated locally on 2026-10-04 with Node.js 22.22.3 and Chromium through Playwright 1.63.0.

| Check | Result |
| --- | --- |
| Catalog consistency, source URLs, photo credits, land geometry | Passed: 8 destinations, 16 films, 3 photographs |
| Unit behavior | 6 cases passed: geography, time-basis separation, intersecting filters, cross-decade ranges, multilingual search, invalid-data rejection |
| Production build and TypeScript | Passed with Vite 7.3.6 |
| ESLint | Passed |
| Browser tests against production output | 8 passed |
| Dependency audit after compatible updates and build-tool upgrade | 0 known vulnerabilities reported |
| Authorship | Author and committer configured as Baixue Wu; SSH authenticated as Baixue-Wu |

The eight browser checks cover the world-map journey, map markers and browser back, story/release-date differences, search and themes, deep-link refresh and sources, a 390px mobile journey, recovery from failed land loading, and 200% text at 780px width. The main journey also checks Escape dismissal, return of keyboard focus and uncaught browser errors.

Screenshots from the passing production run:

- [Desktop map](screenshots/desktop.png)
- [Mobile map](screenshots/mobile.png)
- [Film cultural guide](screenshots/film-detail.png)
- [Chronological view](screenshots/timeline.png)

The final mobile map permits zooming below level 1 so all destination points fit on a narrow viewport. Legal notices are emitted into the production output from their source files during the build.

## Limits of this evidence

These checks establish consistency and tested browser behavior, not audience demand, cultural representativeness or exhaustive historical accuracy. Content and source preparation are editorial work and can be extended or corrected. Story periods are explicitly approximate where the source does not give an exact date. The sample has limited geographic and thematic coverage.

External source websites and optional Google Fonts were not treated as guaranteed services. No hosted deployment has been verified. The user requested direct code work without waiting for PR access; the existing GitHub API credential cannot access this repository, while the account's SSH connection can. Do not substitute another account for remote administration or publishing.
