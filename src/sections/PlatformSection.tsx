import { useEffect, useRef, useState } from 'react';
import { Beaker, Cpu, Brain, Zap, Target, Shield } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const pipelineSteps = [
  {
    icon: Beaker,
    title: 'ESMFold2 Structure Prediction',
    description: 'High-confidence protein structure modeling with mean pLDDT 87.55 across 150 mutations.',
    stat: '87.55 pLDDT',
    color: '#5EEAD4',
  },
  {
    icon: Cpu,
    title: 'IBM Quantum Conformational Sampling',
    description: 'Real quantum hardware execution on ibm_fez — 37.3 minutes for full conformational landscape mapping.',
    stat: 'ibm_fez',
    color: '#818CF8',
  },
  {
    icon: Brain,
    title: 'ML Pathogenicity Prediction',
    description: 'Logistic Regression ensemble achieving AUROC 0.711 on classical features alone.',
    stat: 'AUROC 0.711',
    color: '#EC4899',
  },
  {
    icon: Zap,
    title: 'Quantum-ML Hybrid Scoring',
    description: 'T_primary therapeutic score = 0.65S + 0.15A + 0.20F combining structural, affinity, and functional metrics.',
    stat: 'T_primary',
    color: '#06B6D4',
  },
  {
    icon: Target,
    title: 'Drug Hypothesis Generation',
    description: 'Automated matching to clinical trials — Y220C → Rezatapopt (PYNNACLE Phase II: 33% ORR).',
    stat: '33% ORR',
    color: '#22c55e',
  },
  {
    icon: Shield,
    title: 'RNA-Risk Detection',
    description: 'S-F discordance flagging identifies splice-disrupting mutations requiring RT-PCR validation.',
    stat: '23 variants',
    color: '#f59e0b',
  },
];

export default function PlatformSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
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
      id="platform" 
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 px-6 lg:px-12"
    >
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(/clinical-lab.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050B14] via-[#050B14]/90 to-[#050B14]" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(129,140,248,0.08)] border border-[rgba(129,140,248,0.2)] mb-6">
            <Cpu className="w-4 h-4 text-[#818CF8]" />
            <span className="font-mono-clinical text-xs tracking-wider text-[#818CF8]">
              QUANTUM-AI PIPELINE
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#F8FAFC] mb-4">
            The <span className="text-gradient-cyan">Druggability Engine</span>
          </h2>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
            A six-stage computational pipeline integrating quantum computing, 
            machine learning, and molecular dynamics for precision oncology.
          </p>
        </div>

        {/* Pipeline Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pipelineSteps.map((step, i) => (
            <div
              key={i}
              ref={el => { if (el) cardsRef.current[i] = el; }}
              className={`glass-panel rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                activeStep === i ? 'border-[rgba(94,234,212,0.4)] glow-cyan' : ''
              }`}
              onMouseEnter={() => setActiveStep(i)}
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}30` }}
                >
                  <step.icon className="w-6 h-6" style={{ color: step.color }} />
                </div>
                <span className="font-mono-clinical text-xs text-[#94A3B8]">
                  STEP {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">{step.title}</h3>
              <p className="text-sm text-[#94A3B8] mb-4 leading-relaxed">{step.description}</p>
              <div 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono-clinical text-xs"
                style={{ backgroundColor: `${step.color}15`, color: step.color, border: `1px solid ${step.color}30` }}
              >
                {step.stat}
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline Visual Connector */}
        <div className="mt-16 glass-panel rounded-2xl p-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {pipelineSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    activeStep === i ? 'scale-110' : ''
                  }`}
                  style={{ 
                    backgroundColor: activeStep === i ? `${step.color}30` : 'rgba(148,163,184,0.1)',
                    border: `1px solid ${activeStep === i ? step.color : 'rgba(148,163,184,0.2)'}`,
                  }}
                >
                  <span className="font-mono-clinical text-xs" style={{ color: activeStep === i ? step.color : '#94A3B8' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div className="hidden sm:block w-8 h-px bg-gradient-to-r from-[rgba(148,163,184,0.3)] to-[rgba(148,163,184,0.1)]" />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <span className="font-mono-clinical text-sm text-[#5EEAD4]">
              {pipelineSteps[activeStep]?.title}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
