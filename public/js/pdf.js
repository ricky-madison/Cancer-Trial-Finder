/**
 * Builds a PDF the patient can bring to their oncologist. Uses jsPDF, loaded
 * globally via the <script> tag in index.html (see window.jspdf).
 */
export function generatePdf(profile, trials) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - margin * 2;
  let y = margin;

  function ensureSpace(lines = 1, lineHeight = 14) {
    if (y + lines * lineHeight > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  }

  function heading(text, size = 14) {
    ensureSpace(2, size + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size);
    doc.text(text, margin, y);
    y += size + 8;
    doc.setFont('helvetica', 'normal');
  }

  function paragraph(text, size = 10) {
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, usableWidth);
    ensureSpace(lines.length, size + 3);
    doc.text(lines, margin, y);
    y += lines.length * (size + 3) + 4;
  }

  function field(label, value) {
    if (value === undefined || value === null || value === '') return;
    paragraph(`${label}: ${value}`);
  }

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Clinical Trial Discussion Guide', margin, y);
  y += 26;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90);
  paragraph(`Generated ${new Date().toLocaleDateString()} — informational research aid, not medical advice.`, 9);
  doc.setTextColor(0);
  y += 4;

  heading('Patient-reported profile');
  const d = profile.demographics;
  field('Age', d.age);
  field('Sex at birth', d.sexAtBirth);
  if (d.weightKg && d.heightCm) field('Weight / Height', `${d.weightKg} kg / ${d.heightCm} cm (BSA ≈ ${bsa(d.weightKg, d.heightCm)} m²)`);
  field('Location', [d.zip, d.state, d.country].filter(Boolean).join(', '));

  const dx = profile.diagnosis;
  field('Diagnosis', dx.conditionText);
  field('ICD-10', dx.icd10);
  field('Histology', dx.histology);
  field('Stage (T/N/M)', [dx.t, dx.n, dx.m].filter(Boolean).join(' '));
  field('Metastatic sites', dx.metsSites.join(', '));
  field('Date of initial diagnosis', dx.diagnosisDate);

  const bm = profile.biomarkers;
  if (bm.positiveMarkers.length) field('Positive/mutant markers', bm.positiveMarkers.map((m) => m.label).join(', '));
  field('MSI/MMR status', bm.msiStatus);
  field('TMB', bm.tmb);
  field('PD-L1', bm.pdl1);
  field('ER/PR status', [bm.erStatus, bm.prStatus].filter(Boolean).join(' / '));

  const pt = profile.priorTherapy;
  field('Prior therapies', pt.drugs.join(', '));
  field('Best response to last therapy', pt.bestResponse);
  field('Date of last treatment cycle', pt.lastTreatmentDate);

  const labs = profile.labs;
  const labLine = [
    labs.egfr && `eGFR ${labs.egfr}`,
    labs.ast && `AST ${labs.ast}`,
    labs.alt && `ALT ${labs.alt}`,
    labs.bilirubin && `Bilirubin ${labs.bilirubin}`,
    labs.anc && `ANC ${labs.anc}`,
    labs.platelets && `Platelets ${labs.platelets}`,
    labs.hemoglobin && `Hemoglobin ${labs.hemoglobin}`,
    labs.qtc && `QTc ${labs.qtc}`,
    labs.g6pd && `G6PD ${labs.g6pd}`
  ].filter(Boolean).join('  |  ');
  field('Labs (self-reported, for reference)', labLine);

  const co = profile.comorbidities;
  field('Comorbidities', co.conditions.join(', '));
  field('Current medications', co.medications.join(', '));

  y += 6;
  heading('Shortlisted trials');
  if (!trials.length) {
    paragraph('No trials were selected for this summary.');
  }
  for (const t of trials) {
    ensureSpace(4, 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    const titleLines = doc.splitTextToSize(`${t.title}  (${t.nctId})`, usableWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 14;
    doc.setFont('helvetica', 'normal');
    field('Status / Phase', [t.status, (t.phases || []).join(', ')].filter(Boolean).join(' · '));
    field('Sponsor', t.leadSponsor);
    if (t.nearestLocation) {
      field('Nearest site', `${t.nearestLocation.facility || ''}, ${t.nearestLocation.city || ''} ${t.nearestLocation.state || ''} — about ${t.nearestLocation.distanceMiles} miles`);
    }
    if (t.reasons?.length) field('Why it surfaced', t.reasons.join('; '));
    if (t.cautions?.length) field('Check carefully', t.cautions.join('; '));
    field('Link', `https://clinicaltrials.gov/study/${t.nctId}`);
    y += 8;
  }

  y += 10;
  heading('Before enrolling in anything', 12);
  paragraph(
    'This document is a starting point for a conversation with your oncologist and the study team — ' +
    'it is not a clinical determination of eligibility and it does not replace your treating physician\'s judgment. ' +
    'Trial listings can change; always confirm current status and full inclusion/exclusion criteria directly with the site before making any decisions.'
  );

  doc.save(`trial-discussion-guide-${Date.now()}.pdf`);
}

function bsa(weightKg, heightCm) {
  // Mosteller formula
  const val = Math.sqrt((weightKg * heightCm) / 3600);
  return val.toFixed(2);
}
