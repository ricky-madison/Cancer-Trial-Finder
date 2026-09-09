# Trial Finder

A patient-profile → clinical trial matching tool. You fill in a six-step
profile (demographics, diagnosis, biomarkers, treatment history, labs,
other health info), and it searches the public [ClinicalTrials.gov](https://clinicaltrials.gov)
registry for recruiting studies, scores each one for relevance against your
profile, and lets you export a PDF discussion sheet to bring to your
oncologist.

No backend, no build step, no API key required for the core app — it's
static HTML/CSS/JS that calls ClinicalTrials.gov's free public API directly
from the browser.

## A deliberate scope decision

This project does **not** curate or feature a fixed list of "repurposed
drugs" (things like fenbendazole or ivermectin) as a special matching
category. A couple of those substances have no real oncology trial base and
are mostly known from online cancer-cure misinformation — wrapping them in a
scoring UI would hand them false algorithmic legitimacy to people who are
often scared and searching for options. What's here instead searches *all*
of ClinicalTrials.gov based on the patient's actual diagnosis and biomarkers,
which will surface real drug-repurposing trials on their own merits
(metformin, aspirin, propranolol, disulfiram, itraconazole, and statins all
have genuine active oncology trials) without a thumb on the scale for any
particular drug.

In the same spirit, the matching logic only hard-excludes a trial on
structured fields the API actually provides (age range, sex). Everything
else — biomarkers, prior therapy, proximity — is a transparent, additive
"relevance score" with plain-language reasons attached, not a manufactured
percentage. The UI says so directly, and a mandatory disclaimer/consent
checkbox has to be checked before a search can run. See the comments at the
top of `js/scoring.js` if you extend the logic — please keep that framing.

## Project structure

```
index.html              wizard + results markup
css/styles.css           all styling
js/data.js                dropdown/option lists
js/wizard.js               step navigation
js/ctgov.js                  ClinicalTrials.gov API client + ZIP geocoding
js/scoring.js                 profile-vs-trial matching logic
js/pdf.js                      PDF discussion-guide export (jsPDF)
js/app.js                       glue: form → search → render
server/explain-proxy.example.js  optional, NOT wired in — see below
```

## Running it locally

Any static file server works. From this folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly via `file://` will usually work too, but some
browsers block cross-origin `fetch()` calls from `file://` pages — if trial
search doesn't load, use the command above (or just deploy to GitHub Pages,
which serves over `https://` and avoids the issue entirely).

## Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

Then in the repo: **Settings → Pages → Deploy from a branch → main → / (root)**.
No build step, no environment variables needed for the core app.

## Notes on the two external services this uses

- **ClinicalTrials.gov API v2** (`https://clinicaltrials.gov/api/v2/studies`)
  — free, public, no key. Docs: https://clinicaltrials.gov/data-api/api
- **OpenStreetMap Nominatim** — used once per search to turn a ZIP/postal
  code into coordinates for distance sorting, so the app can do proximity
  scoring without a paid geocoding key. It's free but has a light usage
  policy (attribution, ~1 request/second) — see
  https://operations.osmfoundation.org/policies/nominatim/. If a person
  doesn't enter a ZIP, or geocoding fails, the app just falls back to
  searching by state/country text instead of failing.

Both are called directly from the browser. If either ever changes its CORS
policy and browser requests start failing, the fix is a one-file serverless
proxy (same pattern as the example below) rather than any change to the
matching logic.

## Optional: adding an AI-generated plain-language explainer

This isn't built in, on purpose — wiring up a "free AI" would mean either
shipping an API key in client-side code (which anyone could copy out of your
public repo and use on your bill) or standing up a backend, which is outside
the scope of a static site. `server/explain-proxy.example.js` is a template
for the second option if you want it later: a small serverless function
(Vercel/Netlify-style) that keeps your Anthropic API key server-side and
proxies one request at a time. Instructions are in that file's comments.
There's no free tier that doesn't require you to hold an API key somewhere
safe — Anthropic's current pricing and setup docs are at
https://docs.claude.com.

## Disclaimer

This tool is an informational research aid built on public registry data.
It is not medical advice, does not determine trial eligibility, and is not
affiliated with ClinicalTrials.gov or the U.S. National Library of Medicine.
Anyone using it should confirm every detail with the trial site and their
own treating physician before making any treatment decisions.
