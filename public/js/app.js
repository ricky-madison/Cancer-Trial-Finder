import {
  CONDITIONS, HISTOLOGIES, METASTATIC_SITES, BIOMARKERS, BIOMARKER_STATUS_OPTIONS,
  RESPONSE_OPTIONS, COMORBIDITIES, COUNTRIES, US_STATES
} from './data.js';
import { Wizard } from './wizard.js';
import { searchTrials, geocodePostalCode, CtGovError } from './ctgov.js';
import { rankTrials } from './scoring.js';
import { generatePdf } from './pdf.js';

const form = document.getElementById('trial-form');
const wizardView = document.getElementById('wizard-view');
const resultsView = document.getElementById('results-view');

/* ---------------------------------------------------------------------- */
/* Populate static form controls                                          */
/* ---------------------------------------------------------------------- */

function fillSelect(select, values, { withBlank = true, blankLabel = 'Select…' } = {}) {
  if (withBlank) select.appendChild(new Option(blankLabel, ''));
  for (const v of values) select.appendChild(new Option(v, v));
}

fillSelect(document.getElementById('country-select'), COUNTRIES, { blankLabel: 'Select a country…' });
document.getElementById('country-select').value = 'United States';

const usStatesDatalist = document.getElementById('us-states');
for (const s of US_STATES) usStatesDatalist.appendChild(new Option(s, s));

const conditionsList = document.getElementById('conditions-list');
for (const c of CONDITIONS) conditionsList.appendChild(new Option(c, c));

const histologyList = document.getElementById('histology-list');
for (const h of HISTOLOGIES) histologyList.appendChild(new Option(h, h));

const metsContainer = document.getElementById('mets-sites');
for (const site of METASTATIC_SITES) {
  const label = document.createElement('label');
  label.innerHTML = `<input type="checkbox" name="metsSites" value="${site}"> ${site}`;
  metsContainer.appendChild(label);
}

const BIOMARKER_SEARCH_TERMS = {
  kras_nras: ['KRAS', 'NRAS'],
  braf: ['BRAF', 'V600E'],
  pik3ca: ['PIK3CA'],
  egfr: ['EGFR'],
  alk: ['ALK'],
  ros1: ['ROS1'],
  her2: ['HER2', 'ERBB2'],
  idh: ['IDH1', 'IDH2'],
  brca: ['BRCA1', 'BRCA2']
};

const biomarkerGrid = document.getElementById('biomarker-grid');
for (const marker of BIOMARKERS) {
  const labelSpan = document.createElement('span');
  labelSpan.className = 'bm-label';
  labelSpan.textContent = marker.label;
  const select = document.createElement('select');
  select.name = `bm_${marker.id}`;
  for (const opt of BIOMARKER_STATUS_OPTIONS) select.appendChild(new Option(opt.label, opt.value));
  biomarkerGrid.appendChild(labelSpan);
  biomarkerGrid.appendChild(select);
}

const bestResponseSelect = document.getElementById('best-response-select');
for (const opt of RESPONSE_OPTIONS) bestResponseSelect.appendChild(new Option(opt.label, opt.value));

const comorbGrid = document.getElementById('comorbidities-grid');
for (const c of COMORBIDITIES) {
  const label = document.createElement('label');
  label.innerHTML = `<input type="checkbox" name="comorbidities" value="${c}"> ${c}`;
  comorbGrid.appendChild(label);
}

/* ---------------------------------------------------------------------- */
/* Tag inputs (prior drugs / medications)                                 */
/* ---------------------------------------------------------------------- */

const chipState = { priorDrugs: [], medications: [] };

function setupTagInput(fieldName, chipsContainerId) {
  const wrapper = document.querySelector(`.tag-input[data-tag-field="${fieldName}"]`);
  const input = wrapper.querySelector('input');
  const chipsContainer = document.getElementById(chipsContainerId);

  function render() {
    chipsContainer.innerHTML = '';
    for (const value of chipState[fieldName]) {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = value;
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.setAttribute('aria-label', `Remove ${value}`);
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => {
        chipState[fieldName] = chipState[fieldName].filter((v) => v !== value);
        render();
        updateCompleteness();
      });
      chip.appendChild(removeBtn);
      chipsContainer.appendChild(chip);
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = input.value.trim();
      if (value && !chipState[fieldName].includes(value)) {
        chipState[fieldName].push(value);
        input.value = '';
        render();
        updateCompleteness();
      }
    }
  });

  render();
}

setupTagInput('priorDrugs', 'prior-drugs-chips');
setupTagInput('medications', 'medications-chips');

/* ---------------------------------------------------------------------- */
/* Completeness meter                                                     */
/* ---------------------------------------------------------------------- */

const SIMPLE_FIELDS = [
  'age', 'sexAtBirth', 'weightKg', 'heightCm', 'country', 'state', 'zip',
  'conditionText', 'icd10', 'histology', 't', 'n', 'm', 'diagnosisDate',
  'msiStatus', 'tmb', 'pdl1', 'erStatus', 'prStatus',
  'bestResponse', 'lastTreatmentDate',
  'egfr', 'ast', 'alt', 'bilirubin', 'anc', 'platelets', 'hemoglobin', 'qtc', 'g6pd',
  ...BIOMARKERS.map((m) => `bm_${m.id}`)
];

function updateCompleteness() {
  let filled = 0;
  const total = SIMPLE_FIELDS.length + 4; // +4 for the array-based groups below

  for (const name of SIMPLE_FIELDS) {
    const el = form.elements[name];
    if (el && el.value) filled++;
  }
  if (form.querySelectorAll('input[name="metsSites"]:checked').length) filled++;
  if (form.querySelectorAll('input[name="comorbidities"]:checked').length) filled++;
  if (chipState.priorDrugs.length) filled++;
  if (chipState.medications.length) filled++;

  const pct = Math.round((filled / total) * 100);
  document.getElementById('completeness-fill').style.width = `${pct}%`;
  document.getElementById('completeness-value').textContent = `${pct}%`;
}

form.addEventListener('input', updateCompleteness);
form.addEventListener('change', updateCompleteness);
updateCompleteness();

/* ---------------------------------------------------------------------- */
/* Wizard wiring                                                          */
/* ---------------------------------------------------------------------- */

function validateStep(stepEl) {
  const invalid = stepEl.querySelector(':invalid');
  if (invalid) {
    invalid.reportValidity();
    return false;
  }
  return true;
}

const wizard = new Wizard({
  stepEls: document.querySelectorAll('.step'),
  railList: document.getElementById('rail-steps'),
  btnBack: document.getElementById('btn-back'),
  btnNext: document.getElementById('btn-next'),
  btnSubmit: document.getElementById('btn-submit'),
  validateStep
});

/* ---------------------------------------------------------------------- */
/* Build profile from form                                                */
/* ---------------------------------------------------------------------- */

function buildProfile() {
  const fd = new FormData(form);
  const num = (name) => (fd.get(name) ? Number(fd.get(name)) : null);
  const str = (name) => (fd.get(name) || '').toString().trim();

  const positiveMarkers = BIOMARKERS
    .filter((m) => fd.get(`bm_${m.id}`) === 'positive')
    .map((m) => ({ id: m.id, label: m.label, searchTerms: BIOMARKER_SEARCH_TERMS[m.id] }));

  return {
    demographics: {
      age: num('age'),
      sexAtBirth: str('sexAtBirth'),
      weightKg: num('weightKg'),
      heightCm: num('heightCm'),
      country: str('country'),
      state: str('state'),
      zip: str('zip')
    },
    diagnosis: {
      conditionText: str('conditionText'),
      icd10: str('icd10'),
      histology: str('histology'),
      t: str('t'), n: str('n'), m: str('m'),
      metsSites: fd.getAll('metsSites'),
      diagnosisDate: str('diagnosisDate')
    },
    biomarkers: {
      positiveMarkers,
      msiStatus: str('msiStatus'),
      tmb: str('tmb'),
      pdl1: str('pdl1'),
      erStatus: str('erStatus'),
      prStatus: str('prStatus')
    },
    priorTherapy: {
      drugs: [...chipState.priorDrugs],
      bestResponse: str('bestResponse'),
      lastTreatmentDate: str('lastTreatmentDate')
    },
    labs: {
      egfr: str('egfr'), ast: str('ast'), alt: str('alt'), bilirubin: str('bilirubin'),
      anc: str('anc'), platelets: str('platelets'), hemoglobin: str('hemoglobin'),
      qtc: str('qtc'), g6pd: str('g6pd')
    },
    comorbidities: {
      conditions: fd.getAll('comorbidities'),
      medications: [...chipState.medications]
    },
    includeNotYetRecruiting: fd.get('includeNotYetRecruiting') === 'on'
  };
}

/* ---------------------------------------------------------------------- */
/* Search + render                                                        */
/* ---------------------------------------------------------------------- */

let lastEligible = [];

function scoreBadgeClass(score) {
  if (score >= 55) return 'score-badge--high';
  if (score >= 25) return 'score-badge--mid';
  return 'score-badge--low';
}

function renderStatus(message, kind) {
  const el = document.getElementById('results-status');
  if (!message) { el.hidden = true; return; }
  el.hidden = false;
  el.className = `results__status results__status--${kind}`;
  el.textContent = message;
}

function renderResults(profile, eligible, excludedCount, totalCount) {
  const list = document.getElementById('results-list');
  list.innerHTML = '';

  document.getElementById('results-summary').textContent =
    eligible.length
      ? `${eligible.length} recruiting ${eligible.length === 1 ? 'trial' : 'trials'} to look into`
      : 'No trials matched this profile';

  const subParts = [];
  subParts.push(`Searched ${totalCount} ${totalCount === 1 ? 'result' : 'results'} from ClinicalTrials.gov`);
  if (excludedCount) subParts.push(`${excludedCount} set aside on age/sex criteria`);
  document.getElementById('results-subtext').textContent = subParts.join(' — ');

  if (!eligible.length) {
    list.innerHTML = `
      <div class="empty-state">
        <h2>Nothing recruiting matched this exact profile</h2>
        <p>Try a broader diagnosis term, clear the ZIP code to widen the search area,
        or check "include trials that are not yet recruiting" in step 6.</p>
      </div>`;
    return;
  }

  for (const t of eligible) {
    const card = document.createElement('article');
    card.className = 'trial-card';

    const statusPill = t.status === 'RECRUITING'
      ? `<span class="score-badge score-badge--high" style="padding:3px 9px;font-size:11px;">Recruiting</span>`
      : `<span class="score-badge score-badge--mid" style="padding:3px 9px;font-size:11px;">${escapeHtml(t.status || '')}</span>`;

    card.innerHTML = `
      <div class="trial-card__top">
        <div>
          <h3 class="trial-card__title">${escapeHtml(t.title)}</h3>
          <div class="trial-card__meta">
            ${statusPill}
            <span class="trial-card__id">${escapeHtml(t.nctId || '')}</span>
            ${t.phases.length ? `<span>${escapeHtml(t.phases.join(', '))}</span>` : ''}
            <span>${escapeHtml(t.leadSponsor)}</span>
            ${t.nearestLocation ? `<span>~${t.nearestLocation.distanceMiles} mi away</span>` : ''}
          </div>
        </div>
        <div class="score-badge ${scoreBadgeClass(t.score)}">${t.score}<span class="score-badge__label">relevance</span></div>
      </div>
      ${t.briefSummary ? `<p class="trial-card__summary">${escapeHtml(truncate(t.briefSummary, 320))}</p>` : ''}
      ${t.reasons.length ? `<ul class="trial-card__reasons">${t.reasons.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>` : ''}
      ${t.cautions.length ? `<ul class="trial-card__cautions">${t.cautions.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>` : ''}
      <div class="trial-card__bottom">
        <label class="trial-card__include">
          <input type="checkbox" class="include-checkbox" data-nct="${escapeHtml(t.nctId || '')}" checked />
          Include in PDF
        </label>
        <a class="trial-card__link" href="https://clinicaltrials.gov/study/${encodeURIComponent(t.nctId)}" target="_blank" rel="noopener">View full listing on ClinicalTrials.gov ↗</a>
      </div>
    `;
    list.appendChild(card);
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}
function truncate(str, n) {
  return str.length > n ? str.slice(0, n).trim() + '…' : str;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateStep(wizard.steps[wizard.current])) return;

  const profile = buildProfile();

  wizardView.hidden = true;
  resultsView.hidden = false;
  document.getElementById('results-summary').textContent = 'Searching…';
  document.getElementById('results-subtext').textContent = '';
  document.getElementById('results-list').innerHTML = '';
  renderStatus('Searching ClinicalTrials.gov and scoring results against your profile…', 'info');

  try {
    let geo = null;
    if (profile.demographics.zip) {
      geo = await geocodePostalCode(profile.demographics.zip, profile.demographics.country);
    }

    const termKeywords = [
      profile.diagnosis.histology,
      ...profile.biomarkers.positiveMarkers.map((m) => m.searchTerms[0])
    ].filter(Boolean).join(' ');

    const locationText = !geo
      ? [profile.demographics.state, profile.demographics.country].filter(Boolean).join(' ')
      : '';

    const { studies, totalCount } = await searchTrials({
      condition: profile.diagnosis.conditionText,
      termKeywords,
      locationText,
      geo,
      radiusMiles: 200,
      includeNotYetRecruiting: profile.includeNotYetRecruiting,
      pageSize: 50
    });

    const { eligible, excluded } = rankTrials(studies, profile, geo);
    lastEligible = eligible;

    renderStatus('', null);
    renderResults(profile, eligible, excluded.length, totalCount);
  } catch (err) {
    console.error(err);
    const message = err instanceof CtGovError
      ? err.message
      : 'Something went wrong while searching ClinicalTrials.gov. Please try again in a moment.';
    document.getElementById('results-summary').textContent = 'Search didn\u2019t complete';
    document.getElementById('results-subtext').textContent = '';
    renderStatus(message, 'error');
  }
});

document.getElementById('btn-refine').addEventListener('click', () => {
  resultsView.hidden = true;
  wizardView.hidden = false;
});

document.getElementById('btn-download-pdf').addEventListener('click', () => {
  const profile = buildProfile();
  const checked = new Set(
    Array.from(document.querySelectorAll('.include-checkbox:checked')).map((el) => el.dataset.nct)
  );
  const selected = lastEligible.filter((t) => checked.has(t.nctId));
  generatePdf(profile, selected);
});
