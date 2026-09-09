/**
 * Static reference data for the form controls.
 * Nothing in this file talks to the network — it's just option lists.
 */

export const CONDITIONS = [
  'Breast cancer', 'Non-small cell lung cancer', 'Small cell lung cancer',
  'Colorectal cancer', 'Prostate cancer', 'Pancreatic cancer', 'Ovarian cancer',
  'Melanoma', 'Glioblastoma', 'Acute myeloid leukemia', 'Chronic lymphocytic leukemia',
  'Acute lymphoblastic leukemia', 'Chronic myeloid leukemia', "Hodgkin lymphoma",
  'Non-Hodgkin lymphoma', 'Renal cell carcinoma', 'Bladder cancer', 'Gastric cancer',
  'Esophageal cancer', 'Hepatocellular carcinoma', 'Head and neck squamous cell carcinoma',
  'Cervical cancer', 'Endometrial cancer', 'Soft tissue sarcoma', 'Multiple myeloma',
  'Thyroid cancer', 'Mesothelioma', 'Cholangiocarcinoma', 'Neuroendocrine tumor'
];

export const HISTOLOGIES = [
  'Adenocarcinoma', 'Squamous cell carcinoma', 'Large cell carcinoma',
  'Small cell carcinoma', 'Sarcoma', 'Clear cell carcinoma', 'Ductal carcinoma',
  'Lobular carcinoma', 'Papillary carcinoma', 'Follicular carcinoma',
  'Transitional cell carcinoma', 'Neuroendocrine carcinoma', 'Undifferentiated',
  'Other / not specified'
];

export const METASTATIC_SITES = [
  'Bone', 'Liver', 'Lung', 'Brain', 'Peritoneum', 'Lymph nodes', 'Adrenal gland', 'Skin', 'Other'
];

// Genes shown as a status selector: profile can mark wild-type, mutant/positive, or unknown.
// This is a fixed set of markers that routinely appear in real trial eligibility criteria —
// there is no "recommended drug" tied to any of these, they're just genomic facts about the tumor.
export const BIOMARKERS = [
  { id: 'kras_nras', label: 'KRAS / NRAS' },
  { id: 'braf', label: 'BRAF V600E' },
  { id: 'pik3ca', label: 'PIK3CA' },
  { id: 'egfr', label: 'EGFR' },
  { id: 'alk', label: 'ALK' },
  { id: 'ros1', label: 'ROS1' },
  { id: 'her2', label: 'HER2 (ERBB2)' },
  { id: 'idh', label: 'IDH1 / IDH2' },
  { id: 'brca', label: 'BRCA1 / BRCA2' }
];

export const BIOMARKER_STATUS_OPTIONS = [
  { value: '', label: 'Not tested / unknown' },
  { value: 'positive', label: 'Mutant / positive' },
  { value: 'negative', label: 'Wild-type / negative' }
];

export const RESPONSE_OPTIONS = [
  { value: '', label: 'Not yet evaluated' },
  { value: 'CR', label: 'Complete response (CR)' },
  { value: 'PR', label: 'Partial response (PR)' },
  { value: 'SD', label: 'Stable disease (SD)' },
  { value: 'PD', label: 'Progressive disease (PD)' }
];

export const COMORBIDITIES = [
  'Congestive heart failure (NYHA class III/IV)', 'Active hepatitis B', 'Active hepatitis C',
  'Uncontrolled hypertension', 'Autoimmune disorder', 'Diabetes', 'Chronic kidney disease',
  'HIV/AIDS', 'Prior organ transplant'
];

export const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Ireland', 'Australia', 'New Zealand',
  'Germany', 'France', 'Spain', 'Italy', 'Portugal', 'Netherlands', 'Belgium', 'Switzerland',
  'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Czechia', 'Hungary',
  'Romania', 'Greece', 'Turkey', 'Israel', 'United Arab Emirates', 'Saudi Arabia',
  'South Africa', 'Egypt', 'India', 'China', 'Japan', 'South Korea', 'Singapore',
  'Malaysia', 'Thailand', 'Philippines', 'Indonesia', 'Vietnam', 'Taiwan', 'Hong Kong',
  'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Other'
];

export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA',
  'ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK',
  'OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
];
