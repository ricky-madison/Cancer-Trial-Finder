// Processed TP53 mutation data from the research pipeline
// Source: therapeutic_scores_corrected.csv + quantum_docking_results + full_dataset

export interface MutationData {
  mutation: string;
  shortName: string;
  rmsd: number;
  affinity: number;
  functionalScore: number;
  structuralScore: number;
  affinityScore: number;
  clinicalAnchor: number;
  therapeuticScore: number;
  rank: number;
  cosmicCount: number;
  cosmicPercent: number;
  meanPlddt: number;
  minPlddt: number;
  maxPlddt: number;
  hasDbd: boolean;
  hasTetramerization: boolean;
  pathogenicity: number;
  rnaRiskFlag: boolean;
  quantumEnergy?: number;
  fidelity?: number;
  conformationalDiversity?: number;
}

export interface QuantumResult {
  mutation: string;
  energy: number;
  fidelity: number;
  backend: string;
}

export interface MLModelResult {
  model: string;
  classicalAUROC: number;
  quantumAUROC: number;
  improvement: number;
}

// Top druggable mutations (sorted by therapeutic score)
export const topMutations: MutationData[] = [
  { mutation: "TP53_Y220C", shortName: "Y220C", rmsd: 1.081, affinity: -7.09, functionalScore: 1.0, structuralScore: 0.480, affinityScore: 0.701, clinicalAnchor: 1.0, therapeuticScore: 0.7024, rank: 105, cosmicCount: 1967, cosmicPercent: 0.80, meanPlddt: 87.29, minPlddt: 45.67, maxPlddt: 98.92, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.554, fidelity: 0.554 },
  { mutation: "TP53_R248Q", shortName: "R248Q", rmsd: 1.133, affinity: -6.57, functionalScore: 0.7, structuralScore: 0.469, affinityScore: 0.914, clinicalAnchor: 0.0, therapeuticScore: 0.6017, rank: 149, cosmicCount: 5385, cosmicPercent: 2.21, meanPlddt: 86.78, minPlddt: 48.32, maxPlddt: 98.91, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.340, fidelity: 0.340 },
  { mutation: "TP53_R282W", shortName: "R282W", rmsd: 1.076, affinity: -6.89, functionalScore: 0.8, structuralScore: 0.482, affinityScore: 0.783, clinicalAnchor: 0.0, therapeuticScore: 0.5875, rank: 130, cosmicCount: 1567, cosmicPercent: 0.64, meanPlddt: 87.12, minPlddt: 52.91, maxPlddt: 98.93, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.292, fidelity: 0.292 },
  { mutation: "TP53_R273H", shortName: "R273H", rmsd: 0.888, affinity: -7.37, functionalScore: 0.7, structuralScore: 0.530, affinityScore: 0.586, clinicalAnchor: 0.0, therapeuticScore: 0.5276, rank: 80, cosmicCount: 4766, cosmicPercent: 1.96, meanPlddt: 86.96, minPlddt: 51.34, maxPlddt: 98.96, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.216, fidelity: 0.216 },
  { mutation: "TP53_R248W", shortName: "R248W", rmsd: 0.880, affinity: -7.05, functionalScore: 0.5, structuralScore: 0.532, affinityScore: 0.717, clinicalAnchor: 0.0, therapeuticScore: 0.5279, rank: 112, cosmicCount: 3892, cosmicPercent: 1.60, meanPlddt: 87.31, minPlddt: 50.21, maxPlddt: 98.91, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.286, fidelity: 0.286 },
  { mutation: "TP53_R175H", shortName: "R175H", rmsd: 1.171, affinity: -7.70, functionalScore: 0.8, structuralScore: 0.461, affinityScore: 0.451, clinicalAnchor: 0.0, therapeuticScore: 0.4795, rank: 44, cosmicCount: 5866, cosmicPercent: 2.41, meanPlddt: 86.78, minPlddt: 45.35, maxPlddt: 98.92, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.378, fidelity: 0.378 },
  { mutation: "TP53_R273C", shortName: "R273C", rmsd: 1.018, affinity: -7.57, functionalScore: 0.7, structuralScore: 0.496, affinityScore: 0.504, clinicalAnchor: 0.0, therapeuticScore: 0.4895, rank: 54, cosmicCount: 2934, cosmicPercent: 1.21, meanPlddt: 86.50, minPlddt: 50.15, maxPlddt: 98.90, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.308, fidelity: 0.308 },
  { mutation: "TP53_R249S", shortName: "R249S", rmsd: 0.923, affinity: -7.09, functionalScore: 0.5, structuralScore: 0.520, affinityScore: 0.701, clinicalAnchor: 0.0, therapeuticScore: 0.5182, rank: 104, cosmicCount: 1834, cosmicPercent: 0.75, meanPlddt: 87.45, minPlddt: 53.12, maxPlddt: 98.91, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.364, fidelity: 0.364 },
  { mutation: "TP53_V157F", shortName: "V157F", rmsd: 1.079, affinity: -7.10, functionalScore: 0.6, structuralScore: 0.481, affinityScore: 0.697, clinicalAnchor: 0.0, therapeuticScore: 0.5214, rank: 103, cosmicCount: 892, cosmicPercent: 0.37, meanPlddt: 87.89, minPlddt: 54.23, maxPlddt: 98.92, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.216, fidelity: 0.216 },
  { mutation: "TP53_R158L", shortName: "R158L", rmsd: 0.933, affinity: -7.51, functionalScore: 0.6, structuralScore: 0.517, affinityScore: 0.529, clinicalAnchor: 0.0, therapeuticScore: 0.4855, rank: 60, cosmicCount: 756, cosmicPercent: 0.31, meanPlddt: 88.12, minPlddt: 55.01, maxPlddt: 98.97, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.466, fidelity: 0.466 },
  { mutation: "TP53_H214R", shortName: "H214R", rmsd: 0.798, affinity: -7.10, functionalScore: 0.5, structuralScore: 0.556, affinityScore: 0.697, clinicalAnchor: 0.0, therapeuticScore: 0.5315, rank: 102, cosmicCount: 445, cosmicPercent: 0.18, meanPlddt: 88.34, minPlddt: 56.78, maxPlddt: 98.95, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.274, fidelity: 0.274 },
  { mutation: "TP53_G245S", shortName: "G245S", rmsd: 1.027, affinity: -6.67, functionalScore: 0.5, structuralScore: 0.493, affinityScore: 0.873, clinicalAnchor: 0.0, therapeuticScore: 0.5593, rank: 142, cosmicCount: 1234, cosmicPercent: 0.51, meanPlddt: 87.56, minPlddt: 51.89, maxPlddt: 98.94, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.748, fidelity: 0.748 },
  { mutation: "TP53_P119S", shortName: "P119S", rmsd: 0.931, affinity: -6.64, functionalScore: 0.5, structuralScore: 0.518, affinityScore: 0.885, clinicalAnchor: 0.0, therapeuticScore: 0.5727, rank: 143, cosmicCount: 678, cosmicPercent: 0.28, meanPlddt: 87.73, minPlddt: 52.45, maxPlddt: 98.97, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.490, fidelity: 0.490 },
  { mutation: "TP53_R234C", shortName: "R234C", rmsd: 1.046, affinity: -7.85, functionalScore: 0.5, structuralScore: 0.489, affinityScore: 0.389, clinicalAnchor: 0.0, therapeuticScore: 0.4124, rank: 30, cosmicCount: 2405, cosmicPercent: 0.99, meanPlddt: 87.28, minPlddt: 50.75, maxPlddt: 98.95, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.776, fidelity: 0.776 },
  { mutation: "TP53_R136H", shortName: "R136H", rmsd: 0.917, affinity: -8.11, functionalScore: 0.5, structuralScore: 0.522, affinityScore: 0.283, clinicalAnchor: 0.0, therapeuticScore: 0.3935, rank: 13, cosmicCount: 4190, cosmicPercent: 1.72, meanPlddt: 86.66, minPlddt: 34.69, maxPlddt: 98.94, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.628, fidelity: 0.628 },
];

// All mutations for search
export const allMutations: MutationData[] = [
  ...topMutations,
  { mutation: "TP53_G266E", shortName: "G266E", rmsd: 1.139, affinity: -6.95, functionalScore: 0.5, structuralScore: 0.468, affinityScore: 0.758, clinicalAnchor: 0.0, therapeuticScore: 0.5145, rank: 122, cosmicCount: 534, cosmicPercent: 0.22, meanPlddt: 87.12, minPlddt: 50.89, maxPlddt: 98.88, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.232, fidelity: 0.232 },
  { mutation: "TP53_Y163C", shortName: "Y163C", rmsd: 1.117, affinity: -8.27, functionalScore: 0.5, structuralScore: 0.473, affinityScore: 0.217, clinicalAnchor: 0.0, therapeuticScore: 0.3542, rank: 8, cosmicCount: 952, cosmicPercent: 0.39, meanPlddt: 87.58, minPlddt: 53.69, maxPlddt: 98.91, hasDbd: true, hasTetramerization: true, pathogenicity: 0, rnaRiskFlag: false, quantumEnergy: -0.224, fidelity: 0.224 },
  { mutation: "TP53_R114H", shortName: "R114H", rmsd: 0.862, affinity: -6.78, functionalScore: 0.5, structuralScore: 0.537, affinityScore: 0.828, clinicalAnchor: 0.0, therapeuticScore: 0.5632, rank: 136, cosmicCount: 889, cosmicPercent: 0.36, meanPlddt: 87.45, minPlddt: 52.11, maxPlddt: 98.94, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.542, fidelity: 0.542 },
  { mutation: "TP53_C176Y", shortName: "C176Y", rmsd: 1.033, affinity: -6.88, functionalScore: 0.5, structuralScore: 0.492, affinityScore: 0.787, clinicalAnchor: 0.0, therapeuticScore: 0.5328, rank: 132, cosmicCount: 567, cosmicPercent: 0.23, meanPlddt: 87.23, minPlddt: 49.87, maxPlddt: 98.91, hasDbd: true, hasTetramerization: true, pathogenicity: 0, rnaRiskFlag: false, quantumEnergy: -0.458, fidelity: 0.458 },
  { mutation: "TP53_P146S", shortName: "P146S", rmsd: 0.959, affinity: -6.75, functionalScore: 0.5, structuralScore: 0.511, affinityScore: 0.840, clinicalAnchor: 0.0, therapeuticScore: 0.5563, rank: 138, cosmicCount: 445, cosmicPercent: 0.18, meanPlddt: 87.67, minPlddt: 51.23, maxPlddt: 98.93, hasDbd: true, hasTetramerization: true, pathogenicity: 1, rnaRiskFlag: false, quantumEnergy: -0.406, fidelity: 0.406 },
  { mutation: "TP53_E285K", shortName: "E285K", rmsd: 0.909, affinity: -6.68, functionalScore: 0.5, structuralScore: 0.524, affinityScore: 0.869, clinicalAnchor: 0.0, therapeuticScore: 0.5702, rank: 140, cosmicCount: 334, cosmicPercent: 0.14, meanPlddt: 87.89, minPlddt: 54.12, maxPlddt: 98.95, hasDbd: true, hasTetramerization: true, pathogenicity: 0, rnaRiskFlag: false, quantumEnergy: -0.344, fidelity: 0.344 },
  { mutation: "TP53_H47R", shortName: "H47R", rmsd: 1.069, affinity: -6.58, functionalScore: 0.5, structuralScore: 0.483, affinityScore: 0.910, clinicalAnchor: 0.0, therapeuticScore: 0.5663, rank: 148, cosmicCount: 289, cosmicPercent: 0.12, meanPlddt: 87.45, minPlddt: 50.67, maxPlddt: 98.91, hasDbd: true, hasTetramerization: true, pathogenicity: 0, rnaRiskFlag: false, quantumEnergy: -0.428, fidelity: 0.428 },
  { mutation: "TP53_H193P", shortName: "H193P", rmsd: 1.217, affinity: -6.58, functionalScore: 0.5, structuralScore: 0.451, affinityScore: 0.910, clinicalAnchor: 0.0, therapeuticScore: 0.5534, rank: 147, cosmicCount: 212, cosmicPercent: 0.09, meanPlddt: 87.12, minPlddt: 48.90, maxPlddt: 98.92, hasDbd: true, hasTetramerization: true, pathogenicity: 0, rnaRiskFlag: false, quantumEnergy: -0.736, fidelity: 0.736 },
  { mutation: "TP53_E126K", shortName: "E126K", rmsd: 1.237, affinity: -6.59, functionalScore: 0.5, structuralScore: 0.447, affinityScore: 0.906, clinicalAnchor: 0.0, therapeuticScore: 0.5505, rank: 146, cosmicCount: 378, cosmicPercent: 0.16, meanPlddt: 87.34, minPlddt: 49.56, maxPlddt: 98.94, hasDbd: true, hasTetramerization: true, pathogenicity: 0, rnaRiskFlag: false, quantumEnergy: -0.370, fidelity: 0.370 },
  { mutation: "TP53_H175R", shortName: "H175R", rmsd: 1.137, affinity: -6.59, functionalScore: 0.5, structuralScore: 0.468, affinityScore: 0.906, clinicalAnchor: 0.0, therapeuticScore: 0.5589, rank: 145, cosmicCount: 445, cosmicPercent: 0.18, meanPlddt: 87.56, minPlddt: 51.23, maxPlddt: 98.93, hasDbd: true, hasTetramerization: true, pathogenicity: 0, rnaRiskFlag: false, quantumEnergy: -0.362, fidelity: 0.362 },
];

// ML Model comparison data
export const mlModelResults: MLModelResult[] = [
  { model: "Logistic Regression", classicalAUROC: 0.711, quantumAUROC: 0.690, improvement: -0.021 },
  { model: "Random Forest", classicalAUROC: 0.701, quantumAUROC: 0.583, improvement: -0.118 },
  { model: "XGBoost", classicalAUROC: 0.661, quantumAUROC: 0.617, improvement: -0.044 },
];

// Pipeline stats
export const pipelineStats = {
  totalMutations: 150,
  pathogenicMutations: 112,
  benignMutations: 38,
  avgTherapeuticScore: 0.472,
  topDruggable: "Y220C (0.7024)",
  quantumBackend: "ibm_fez",
  quantumExecutionTime: "37.3 min",
  avgPlddt: 87.55,
  rnaRiskVariants: 23,
  mlAuroc: 0.711,
};

// Drug hypotheses for top mutations
export const drugHypotheses: Record<string, string> = {
  "Y220C": "Rezatapopt (PC14586) — PYNNACLE Phase II: 33% ORR, 43% Ovarian response. First-in-class Y220C-specific stabilizer.",
  "R248Q": "APR-246 (Eprenetapopt) — Reactivates mutant p53 by binding cysteines. Phase III for MDS.",
  "R273H": "COTI-2 — Restores wild-type conformation. Phase I/II for gynecologic malignancies.",
  "R175H": "PC14586 analogue — Structural stabilization of DNA-binding domain. Preclinical.",
  "R282W": "ALRN-6924 — Dual MDM2/MDMX inhibitor. Reactivates p53 pathway. Phase II.",
  "R248W": "APR-246 combination — Synergistic with 5-azacitidine in TP53-mutant AML.",
};

// Get drug hypothesis for a mutation
export function getDrugHypothesis(mutationShortName: string): string {
  return drugHypotheses[mutationShortName] || "Potential candidate for stabilization therapy — experimental validation recommended.";
}

// Get pathogenicity label
export function getPathogenicityLabel(score: number): string {
  if (score >= 0.7) return "Highly Pathogenic";
  if (score >= 0.5) return "Pathogenic";
  if (score >= 0.3) return "Likely Benign";
  return "Benign";
}

// Get druggability class
export function getDruggabilityClass(score: number): { label: string; color: string } {
  if (score >= 0.55) return { label: "High", color: "#22c55e" };
  if (score >= 0.40) return { label: "Medium", color: "#f59e0b" };
  return { label: "Low", color: "#ef4444" };
}

// Format mutation name
export function formatMutation(name: string): string {
  if (name.startsWith("TP53_")) return name;
  return `TP53_${name}`;
}

// Search mutations
export function searchMutations(query: string): MutationData[] {
  const q = query.toUpperCase().trim();
  if (!q) return [];
  return allMutations.filter(m => 
    m.mutation.includes(q) || m.shortName.includes(q)
  );
}
