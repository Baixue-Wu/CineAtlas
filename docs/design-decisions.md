# Design decisions

## 2026-10-04

- Culture exploration is the product purpose; the traveler starts with a destination and finds films that reveal everyday life, relationships and historical perspectives. This governs selection and writing before interface choices.
- Use the existing name 映游 · CineAtlas from the repository. Earlier naming alternatives are not product commitments.
- Ship a curated sample of eight destinations and sixteen films. The global map is extensible, but only places with written, sourced content receive markers; coverage is visible in the interface.
- Reuse upstream Leaflet map/marker and hash-route code under MIT, with explicit provenance. Do not import unrelated historical data or present a wholesale rebuild as original infrastructure.
- Store release year and story period separately. Story ranges have labels and uncertainty notes; decade filtering uses interval intersection, and timeline cards show their complete period.
- Culture themes and guides are editorial entry points, not an exhaustive taxonomy or a claim that one film represents a whole population.
- Bundle public-domain world land geometry and destination photography locally. This keeps the primary experience independent of map APIs, keys, online tiles or external images. Optional web fonts can fall back to system fonts.
- Destination markers are city-level entry points, not filming locations. Explain multi-place films and potentially misleading titles such as Roma or Chungking Express in the guide.
- Use URL hash state for destination, time basis, decade, culture topic, search and open film. Refresh and browser navigation preserve the exploration without a backend or storage account.
- Keep the first version read-only. Accounts, submissions, playback, ticketing, live streaming availability, geolocation and inferred AI recommendations are outside its scope.
- Use a restrained dark atlas and lime controls; factual destination photos supply atmosphere while film cards foreground cultural questions.
- Use native dialog semantics for focus containment and Escape dismissal. The destination list remains available if map geometry fails, and retries do not discard filters.
- Update inherited vulnerable build dependencies and remove unused Tailwind 3 because its dependency chain was flagged by the package audit. Preserve remaining upstream dependencies rather than perform unrelated pruning.
- All authored project materials and commits belong to Baixue Wu; all remote operations must authenticate as Baixue-Wu. Third-party legal notices remain intact.
- The user waived PRs for the initial implementation. Sync tested code directly without blocking on the existing API token's repository scope. Do not deploy through an account whose ownership is unverified.
