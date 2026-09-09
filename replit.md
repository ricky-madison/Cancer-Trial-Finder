# Global Trial Matcher

Global Trial Matcher helps patients and caregivers explore potential oncology clinical trials worldwide using live ClinicalTrials.gov data and a transparent, informational scoring model.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/global-trial-matcher/` — the deployable React/Vite one-page matcher.
- `artifacts/global-trial-matcher/src/App.tsx` — patient profile flow, ClinicalTrials.gov normalization, scoring, results, and discussion guide.
- `artifacts/global-trial-matcher/src/index.css` — app theme and responsive layout utilities.
- `attached_assets/Pasted-This-is-an-excellent-pivot-You-are-now-designing-a-prec_1788928597575.txt` — source MVP blueprint.

## Architecture decisions

- The first build reads the public ClinicalTrials.gov v2 API directly in the browser; no patient profile is saved.
- Worldwide search is the default. Country filtering is optional and accepts any country or territory rather than a short US-centric allowlist.
- Results are presented as weighted match signals, not eligibility decisions; hard-stop conflicts are surfaced for clinician review.
- The results surface only active or upcoming study statuses and ranks the top 10 studies returned by the live query.

## Product

- Six-step patient profile covering demographics, cancer diagnosis/stage, biomarkers, prior treatment, safety labs, and comorbidities/medications.
- Live global ClinicalTrials.gov search with loading, empty, retry, and partial-data-safe states.
- Transparent match cards with scores, strengths, cautions, study details, source links, and a copyable oncologist discussion guide.

## User preferences

 - Prefer global trial coverage rather than a US-only search.

## Gotchas

- Trial records and eligibility change; every result needs confirmation with the study team and an oncologist.
- The public API can return study text but does not establish patient eligibility or enrollment availability.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
