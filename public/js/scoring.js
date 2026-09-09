/**
 * Turns a raw ClinicalTrials.gov study record + the patient profile into a
 * transparent relevance assessment.
 *
 * Design intent (please keep this if you extend the app):
 * - Only hard-exclude on fields the API returns as structured data (age, sex).
 *   We do NOT claim to parse lab thresholds or exact drug requirements out of
 *   free-text eligibility criteria — that text is written for clinicians and
 *   is too inconsistent to filter on reliably. Getting a "hard exclude" wrong
 *   could hide a trial someone was actually eligible for, and getting a
 *   "hard include" wrong could send someone toward a trial they can't join.
 * - Everything else is a soft, additive "relevance score" with plain-language
 *   reasons attached, and the UI must say this is a starting point for a
 *   conversation with the trial site and the patient's oncologist — never a
 *   determination of eligibility.
 */

const EARTH_RADIUS_MILES = 3958.8;

function haversineMiles(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(h));
}

/** "18 Years" / "6 Months" / "N/A" -> years as a float, or null if unknown. */
function parseAgeToYears(ageStr) {
  if (!ageStr || typeof ageStr !== 'string') return null;
  const m = ageStr.match(/(\d+(\.\d+)?)\s*(year|month|week|day)/i);
  if (!m) return null;
  const value = parseFloat(m[1]);
  const unit = m[3].toLowerCase();
  if (unit.startsWith('year')) return value;
  if (unit.startsWith('month')) return value / 12;
  if (unit.startsWith('week')) return value / 52;
  return value / 365;
}

/** CT.gov escapes markdown comparison operators like "\>3.2" — clean that up for display. */
export function cleanCriteriaText(text) {
  if (!text) return '';
  return text.replace(/\\([><=])/g, '$1');
}

function textIncludesAny(haystack, needles) {
  const hits = [];
  const lower = haystack.toLowerCase();
  for (const needle of needles) {
    if (needle && lower.includes(needle.toLowerCase())) hits.push(needle);
  }
  return hits;
}

/**
 * @param {object} study - one entry from CT.gov `studies[]`
 * @param {object} profile - the patient profile built by the wizard
 * @param {{lat:number, lon:number}|null} userGeo
 */
export function evaluateTrial(study, profile, userGeo) {
  const ps = study.protocolSection || {};
  const id = ps.identificationModule || {};
  const elig = ps.eligibilityModule || {};
  const conditions = ps.conditionsModule || {};
  const design = ps.designModule || {};
  const locations = ps.contactsLocationsModule?.locations || [];
  const interventions = ps.armsInterventionsModule?.interventions || [];
  const description = ps.descriptionModule || {};

  const criteriaTextRaw = elig.eligibilityCriteria || '';
  const criteriaText = cleanCriteriaText(criteriaTextRaw);
  const searchableText = [
    id.briefTitle, id.officialTitle, (conditions.conditions || []).join(' '),
    criteriaText, interventions.map((i) => i.name).join(' ')
  ].join(' ').toLowerCase();

  const exclusionReasons = [];

  // --- Hard filters: only on structured fields ---
  if (profile.demographics.age != null) {
    const minYears = parseAgeToYears(elig.minimumAge);
    const maxYears = parseAgeToYears(elig.maximumAge);
    if (minYears != null && profile.demographics.age < minYears) {
      exclusionReasons.push(`Trial requires minimum age ${elig.minimumAge}`);
    }
    if (maxYears != null && profile.demographics.age > maxYears) {
      exclusionReasons.push(`Trial requires maximum age ${elig.maximumAge}`);
    }
  }
  if (profile.demographics.sexAtBirth && elig.sex && elig.sex !== 'ALL') {
    const trialSex = elig.sex.toUpperCase();
    const patientSex = profile.demographics.sexAtBirth.toUpperCase();
    if (trialSex !== patientSex) {
      exclusionReasons.push(`Trial is limited to ${elig.sex.toLowerCase()} participants`);
    }
  }

  // --- Soft, transparent scoring ---
  let score = 0;
  const reasons = [];
  const cautions = [];

  // Biomarkers the patient marked positive/mutant
  for (const marker of profile.biomarkers.positiveMarkers) {
    const hits = textIncludesAny(searchableText, marker.searchTerms);
    if (hits.length) {
      score += 20;
      reasons.push(`Mentions ${marker.label}, which matches your reported status`);
    }
  }

  // Histology / stage keywords
  if (profile.diagnosis.histology) {
    if (searchableText.includes(profile.diagnosis.histology.toLowerCase())) {
      score += 10;
      reasons.push(`Mentions your histologic subtype (${profile.diagnosis.histology})`);
    }
  }

  // Metastatic sites - informational caution only, never a hard exclude,
  // since "excludes brain mets" phrasing varies too much to parse safely.
  if (profile.diagnosis.metsSites.includes('Brain') && /brain metastas/i.test(criteriaText)) {
    cautions.push('Mentions brain metastases in the criteria — check the full listing, some trials exclude and some specifically require treated/stable brain mets.');
  }

  // Prior therapies
  for (const drug of profile.priorTherapy.drugs) {
    if (drug && searchableText.includes(drug.toLowerCase())) {
      score += 8;
      reasons.push(`References ${drug}, which is in your treatment history`);
    }
  }

  // Recruiting status (already filtered, but a currently-recruiting study
  // with a posted contact is a genuinely stronger practical match)
  const statusModule = ps.statusModule || {};
  if (statusModule.overallStatus === 'RECRUITING') {
    score += 5;
  }

  // Proximity
  let nearestLocation = null;
  if (userGeo && locations.length) {
    let best = null;
    for (const loc of locations) {
      const gp = loc.geoPoint;
      if (gp && Number.isFinite(gp.lat) && Number.isFinite(gp.lon)) {
        const dist = haversineMiles(userGeo, gp);
        if (!best || dist < best.dist) best = { dist, loc };
      }
    }
    if (best) {
      nearestLocation = { ...best.loc, distanceMiles: Math.round(best.dist) };
      if (best.dist < 50) { score += 15; reasons.push(`A site is about ${Math.round(best.dist)} miles from you`); }
      else if (best.dist < 150) { score += 10; reasons.push(`A site is about ${Math.round(best.dist)} miles from you`); }
      else if (best.dist < 500) { score += 4; }
    }
  }

  const cappedScore = Math.max(0, Math.min(100, score));

  return {
    study,
    nctId: id.nctId,
    title: id.briefTitle || id.officialTitle || 'Untitled study',
    status: statusModule.overallStatus,
    phases: design.phases || [],
    leadSponsor: ps.sponsorCollaboratorsModule?.leadSponsor?.name || 'Not listed',
    briefSummary: description.briefSummary || '',
    criteriaText,
    interventions: interventions.map((i) => i.name).filter(Boolean),
    locations,
    nearestLocation,
    hardExcluded: exclusionReasons.length > 0,
    exclusionReasons,
    score: cappedScore,
    reasons,
    cautions
  };
}

export function rankTrials(studies, profile, userGeo) {
  const evaluated = studies.map((s) => evaluateTrial(s, profile, userGeo));
  const eligible = evaluated.filter((e) => !e.hardExcluded).sort((a, b) => b.score - a.score);
  const excluded = evaluated.filter((e) => e.hardExcluded);
  return { eligible, excluded };
}
