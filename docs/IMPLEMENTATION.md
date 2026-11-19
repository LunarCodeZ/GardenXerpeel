# Implementation plan and decisions

## Scope
Implement the supplied PRD as a single deployable web application. Indonesian UI, public catalogue/detail, protected admin overview/CRUD, image upload, publication gate, stable QR downloads, persistent data and operator documentation.

## Decisions
- React + Vite, Express 5 and SQLite through Node's built-in driver (Node >=24). PHP is absent locally; the PRD permits stack changes. SQLite is appropriate for this single-server, small-garden MVP; it is a real shared server database, not browser storage. Multi-instance hosting requires a database/storage migration.
- One light theme, forest-green accent, restrained motion, airy catalogue and compact dashboard. Public design dials: variance 4, motion 2, density 4. Native CSS, Phosphor icons, native accessible controls.
- Five initial records remain draft with no asserted botanical facts or species photos. Publication requires the administrator's verification confirmation and essential content.
- Slugs are immutable after creation, including drafts: printed QR destinations never silently change. Deletion remains explicit and warns that printed QR codes stop working.
- Server-side opaque sessions, scrypt password hashes, CSRF tokens, same-origin writes, rate-limited login, validated/re-encoded image uploads, authenticated draft images.
- No scan analytics, no third-party visitor tracking.

## Work sequence
1. API acceptance tests, database/authentication, CRUD/publication/uploads/QR.
2. Public catalogue and detail; dashboard, forms, QR tools.
3. Browser acceptance tests, responsive review, production build, deployment/operator docs.

## Status (19 November 2026)
- Implemented the full MVP flow: seeded drafts, public catalogue/detail, admin login/session/CSRF, overview, CRUD, publication gate, photo upload, QR downloads and backup script.
- `npm test` passes all API acceptance tests; `npm run test:e2e` passes the public mobile and full admin browser journeys.
- Production build succeeds. README covers local setup, deployment, backup, portal setup and the pre-print QR checklist.
- Still external: Google Sites portal publication, domain/hosting provisioning, real botanical content verification, and physical Android/iOS QR scan testing.

## External release gates
Google Sites account/domain/hosting are not supplied. Do not claim live deployment. Document portal setup, HTTPS deployment, content verification and physical Android/iOS scan testing as outstanding.

## Technical references consulted
- https://nodejs.org/api/sqlite.html
- https://expressjs.com/en/guide/error-handling/
