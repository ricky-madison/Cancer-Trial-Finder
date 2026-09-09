/**
 * ClinicalTrials.gov API v2 client.
 * Public, keyless, official US National Library of Medicine API.
 * Docs: https://clinicaltrials.gov/data-api/api
 *
 * We deliberately fetch full protocolSection records (no `fields=` projection)
 * so we always have eligibilityCriteria text, locations, and interventions
 * available for scoring — the payload is bigger but the code is far less
 * brittle than trying to keep a field allow-list in sync with the API.
 */

const CTGOV_BASE = 'https://clinicaltrials.gov/api/v2/studies';

/**
 * Build the query string for a search and fetch results.
 * @param {object} params
 * @param {string} params.condition - free-text condition/diagnosis
 * @param {string} [params.termKeywords] - extra keywords (biomarkers, histology) space separated
 * @param {string} [params.locationText] - free-text location (state/country) fallback
 * @param {{lat:number, lon:number}} [params.geo] - precise coordinate for radius search
 * @param {number} [params.radiusMiles]
 * @param {boolean} [params.includeNotYetRecruiting]
 * @param {number} [params.pageSize]
 */
export async function searchTrials(params) {
  const {
    condition,
    termKeywords,
    locationText,
    geo,
    radiusMiles = 150,
    includeNotYetRecruiting = false,
    pageSize = 50
  } = params;

  const qs = new URLSearchParams();
  if (condition) qs.set('query.cond', condition);
  if (termKeywords && termKeywords.trim()) qs.set('query.term', termKeywords.trim());
  if (locationText && !geo) qs.set('query.locn', locationText);

  const statuses = includeNotYetRecruiting
    ? 'RECRUITING,NOT_YET_RECRUITING'
    : 'RECRUITING';
  qs.set('filter.overallStatus', statuses);

  if (geo && Number.isFinite(geo.lat) && Number.isFinite(geo.lon)) {
    qs.set('filter.geo', `distance(${geo.lat},${geo.lon},${radiusMiles}mi)`);
  }

  qs.set('pageSize', String(Math.min(pageSize, 200)));
  qs.set('countTotal', 'true');
  qs.set('format', 'json');

  const url = `${CTGOV_BASE}?${qs.toString()}`;

  let res;
  try {
    res = await fetch(url, { headers: { Accept: 'application/json' } });
  } catch (networkErr) {
    throw new CtGovError(
      'Could not reach ClinicalTrials.gov. If you opened this file directly from disk, ' +
      'your browser may be blocking the request — serve the site over http(s) instead ' +
      '(GitHub Pages, or `python3 -m http.server` locally). See README.md.',
      { cause: networkErr }
    );
  }

  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body?.message || '';
    } catch {
      /* ignore parse failure */
    }
    throw new CtGovError(`ClinicalTrials.gov returned ${res.status}. ${detail}`.trim());
  }

  const data = await res.json();
  return {
    studies: data.studies || [],
    totalCount: typeof data.totalCount === 'number' ? data.totalCount : (data.studies || []).length
  };
}

export class CtGovError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = 'CtGovError';
  }
}

/**
 * Geocode a postal code to coordinates using OpenStreetMap's free Nominatim API.
 * No API key required. Please keep usage light (Nominatim's usage policy asks for
 * at most ~1 request/second and attribution) — this app only calls it once per search.
 * https://operations.osmfoundation.org/policies/nominatim/
 */
export async function geocodePostalCode(postalCode, country) {
  if (!postalCode) return null;
  const qs = new URLSearchParams({
    postalcode: postalCode,
    format: 'json',
    limit: '1'
  });
  if (country) qs.set('country', country);

  const url = `https://nominatim.openstreetmap.org/search?${qs.toString()}`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const results = await res.json();
    if (!results.length) return null;
    return { lat: parseFloat(results[0].lat), lon: parseFloat(results[0].lon) };
  } catch {
    // Geocoding is a nice-to-have for proximity sorting — fail quietly and
    // fall back to text-based location search.
    return null;
  }
}
