import { useEffect, useRef } from 'react';
import { CircuitBoard, Database, Cpu, Brain, FlaskConical, Syringe, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const pipelineStages = [
  {
    step: '01',
    title: 'Structure Prediction',
    description: 'ESMFold2 generates high-confidence 3D structures for all 150 TP53 mutations. Mean pLDDT of 87.55 ensures reliable binding site identification.',
    icon: Database,
    tech: ['ESMFold2', 'pLDDT Scoring', 'RMSD Analysis'],
    color: '#5EEAD4',
    details: [
      '150 mutations modeled',
      'Mean pLDDT: 87.55',
      'DBD residues 102-292 tracked',
      'Tetramerization domain analysis',
    ],
  },
  {
    step: '02',
    title: 'Molecular Docking',
    description: 'AutoDock Vina performs rigid docking against the p53 DNA-binding domain. Binding affinities range from -6.36 to -8.80 kcal/mol.',
    icon: FlaskConical,
    tech: ['AutoDock Vina', 'PDBQT Conversion', 'Affinity Scoring'],
    color: '#06B6D4',
    details: [
      'Best affinity: -8.80 kcal/mol (K132N)',
      'RMSD structural deviation tracked',
      'Binding pocket analysis',
      'Docked pose validation',
    ],
  },
  {
    step: '03',
    title: 'Quantum Sampling',
    description: 'IBM Quantum hardware (ibm_fez) executes QUBO-based conformational sampling. 500 shots per mutation capture energy landscapes.',
    icon: Cpu,
    tech: ['IBM Quantum', 'QUBO Optimization', 'ibm_fez'],
    color: '#818CF8',
    details: [
      'Backend: ibm_fez',
      '500 shots per mutation',
      'QUBO energy: -0.81 to -0.19',
      'Fidelity: 0.19 to 0.81',
    ],
  },
  {
    step: '04',
    title: 'Feature Engineering',
    description: 'Classical and quantum features merged: affinity, RMSD, pLDDT, COSMIC counts, QUBO energy, fidelity, and conformational diversity.',
    icon: CircuitBoard,
    tech: ['Feature Fusion', 'Normalization', 'Entropy Calculation'],
    color: '#EC4899',
    details: [
      '11 features per mutation',
      'Structural + functional scores',
      'Quantum descriptors',
      'Clinical anchor integration',
    ],
  },
  {
    step: '05',
    title: 'ML Prediction',
    description: 'Logistic Regression achieves AUROC 0.711 on classical features. Quantum features show orthogonal information content.',
    icon: Brain,
    tech: ['Logistic Regression', 'Random Forest', 'XGBoost'],
    color: '#A78BFA',
    details: [
      'Best model: LR (AUROC 0.711)',
      'Train/test: 80/20 split',
      'Stratified sampling',
      'StandardScaler normalization',
    ],
  },
  {
    step: '06',
    title: 'Therapeutic Scoring',
    description: 'T_primary = 0.65S + 0.15A + 0.20F combines structural, affinity, and functional scores. Y220C ranks #1 with 0.7024.',
    icon: Syringe,
    tech: ['T_primary Formula', 'Drug Matching', 'RNA-Risk Detection'],
    color: '#22c55e',
    details: [
      'Y220C: T_primary = 0.7024',
      '23 RNA-risk variants flagged',
      'Automated drug hypothesis',
      'COSMIC frequency weighting',
    ],
  },
];

export default function PipelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="pipeline" 
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 px-6 lg:px-12"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#050B14] via-[#0A1628]/20 to-[#050B14]" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] mb-6">
            <CircuitBoard className="w-4 h-4 text-[#22c55e]" />
            <span className="font-mono-clinical text-xs tracking-wider text-[#22c55e]">
              END-TO-END PIPELINE
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#F8FAFC] mb-4">
            From <span className="text-gradient-cyan">Quantum</span> to Clinic
          </h2>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
            A complete computational pipeline integrating quantum hardware, 
            machine learning, and molecular dynamics for therapeutic discovery.
          </p>
        </div>

        {/* Pipeline Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#5EEAD4] via-[#818CF8] to-[#22c55e] opacity-30 hidden md:block" />
          
          <div className="space-y-12">
            {pipelineStages.map((stage, i) => (
              <div
                key={i}
                ref={el => { if (el) cardsRef.current[i] = el; }}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Step Number (Timeline) */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[rgba(10,22,40,0.9)] border-2 items-center justify-center z-10"
                  style={{ borderColor: stage.color }}
                >
                  <span className="font-mono-clinical text-sm font-bold" style={{ color: stage.color }}>
                    {stage.step}
                  </span>
                </div>

                {/* Content Card */}
                <div className={`flex-1 ${i % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                  <div className="glass-panel rounded-xl p-6 hover:border-[rgba(94,234,212,0.3)] transition-all group">
                    <div className="flex items-start gap-4 mb-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${stage.color}15`, border: `1px solid ${stage.color}30` }}
                      >
                        <stage.icon className="w-6 h-6" style={{ color: stage.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono-clinical text-xs" style={{ color: stage.color }}>
                            STEP {stage.step}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">{stage.title}</h3>
                        <p className="text-sm text-[#94A3B8] leading-relaxed">{stage.description}</p>
                      </div>
                    </div>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {stage.tech.map((t, j) => (
                        <span 
                          key={j}
                          className="px-2 py-1 rounded-full font-mono-clinical text-[10px]"
                          style={{ 
                            backgroundColor: `${stage.color}10`, 
                            color: stage.color,
                            border: `1px solid ${stage.color}25`,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2">
                      {stage.details.map((detail, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: stage.color }} />
                          <span className="font-mono-clinical text-[10px] text-[#94A3B8]">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Final Result Banner */}
        <div className="mt-16 glass-panel rounded-2xl p-8 text-center glow-cyan-strong">
          <h3 className="text-2xl font-bold text-[#F8FAFC] mb-3">
            Y220C: <span className="text-gradient-cyan">T_primary = 0.7024</span>
          </h3>
          <p className="text-[#94A3B8] max-w-2xl mx-auto mb-4">
            The top-ranked druggable mutation with a validated clinical candidate: 
            Rezatapopt (PC14586) — PYNNACLE Phase II showing 33% overall response rate 
            and 43% response in ovarian cancer.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="px-4 py-2 rounded-full bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)]">
              <span className="font-mono-clinical text-xs text-[#22c55e]">33% ORR</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-[rgba(236,72,153,0.1)] border border-[rgba(236,72,153,0.2)]">
              <span className="font-mono-clinical text-xs text-[#EC4899]">43% OVARIAN</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-[rgba(129,140,248,0.1)] border border-[rgba(129,140,248,0.2)]">
              <span className="font-mono-clinical text-xs text-[#818CF8]">PHASE II ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
