import { useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, Microscope, Atom, Brain, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { topMutations, mlModelResults, pipelineStats } from '../data/mutationData';

gsap.registerPlugin(ScrollTrigger);

// Simple bar chart component
function TherapeuticScoreChart() {
  const data = topMutations.slice(0, 10).sort((a, b) => b.therapeuticScore - a.therapeuticScore);
  const maxScore = Math.max(...data.map(d => d.therapeuticScore));

  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#5EEAD4]" />
          <h3 className="font-mono-clinical text-sm text-[#F8FAFC]">TOP 10 DRUGGABLE MUTATIONS</h3>
        </div>
        <span className="font-mono-clinical text-xs text-[#94A3B8]">T_PRIMARY SCORE</span>
      </div>
      <div className="space-y-3">
        {data.map((m, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="font-mono-clinical text-xs text-[#94A3B8] w-24 truncate">{m.mutation}</span>
            <div className="flex-1 h-6 bg-[rgba(10,22,40,0.6)] rounded-full overflow-hidden relative">
              <div 
                className="h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                style={{ 
                  width: `${(m.therapeuticScore / maxScore) * 100}%`,
                  background: m.therapeuticScore >= 0.55 
                    ? 'linear-gradient(90deg, #22c55e, #5EEAD4)' 
                    : m.therapeuticScore >= 0.40 
                      ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' 
                      : 'linear-gradient(90deg, #ef4444, #f87171)',
                }}
              >
                <span className="font-mono-clinical text-[10px] text-[#F8FAFC] font-semibold">
                  {m.therapeuticScore.toFixed(4)}
                </span>
              </div>
            </div>
            <span className="font-mono-clinical text-[10px] text-[#94A3B8] w-12 text-right">#{m.rank}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ML Model comparison chart
function MLModelChart() {
  const maxAUROC = 0.75;

  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#EC4899]" />
          <h3 className="font-mono-clinical text-sm text-[#F8FAFC]">ML MODEL COMPARISON</h3>
        </div>
        <span className="font-mono-clinical text-xs text-[#94A3B8]">AUROC</span>
      </div>
      <div className="space-y-4">
        {mlModelResults.map((model, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono-clinical text-xs text-[#F8FAFC]">{model.model}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono-clinical text-xs text-[#5EEAD4]">{model.classicalAUROC.toFixed(3)}</span>
                <span className="font-mono-clinical text-xs text-[#818CF8]">{model.quantumAUROC.toFixed(3)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-4 bg-[rgba(10,22,40,0.6)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#5EEAD4] to-[#06B6D4] rounded-full transition-all duration-1000"
                  style={{ width: `${(model.classicalAUROC / maxAUROC) * 100}%` }}
                />
              </div>
              <div className="flex-1 h-4 bg-[rgba(10,22,40,0.6)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#818CF8] to-[#A78BFA] rounded-full transition-all duration-1000"
                  style={{ width: `${(model.quantumAUROC / maxAUROC) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-1">
              <span className="flex-1 font-mono-clinical text-[9px] text-[#5EEAD4]">CLASSICAL</span>
              <span className="flex-1 font-mono-clinical text-[9px] text-[#818CF8]">QUANTUM</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-[rgba(236,72,153,0.05)] rounded-lg border border-[rgba(236,72,153,0.1)]">
        <p className="text-xs text-[#94A3B8]">
          <span className="text-[#EC4899] font-semibold">Note:</span> Classical features outperform quantum features 
          for pathogenicity prediction, suggesting quantum data captures orthogonal conformational information 
          better suited for therapeutic scoring.
        </p>
      </div>
    </div>
  );
}

// Quantum energy scatter plot
function QuantumScatterPlot() {
  const data = topMutations.filter(m => m.quantumEnergy !== undefined);
  const minEnergy = Math.min(...data.map(m => m.quantumEnergy!));
  const maxEnergy = Math.max(...data.map(m => m.quantumEnergy!));
  const minFidelity = Math.min(...data.map(m => m.fidelity || 0));
  const maxFidelity = Math.max(...data.map(m => m.fidelity || 0));

  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Atom className="w-5 h-5 text-[#818CF8]" />
          <h3 className="font-mono-clinical text-sm text-[#F8FAFC]">QUANTUM ENERGY LANDSCAPE</h3>
        </div>
        <span className="font-mono-clinical text-xs text-[#94A3B8]">IBM QUANTUM (ibm_fez)</span>
      </div>
      
      {/* Scatter Plot */}
      <div className="relative h-64 bg-[rgba(10,22,40,0.4)] rounded-lg overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 grid-scan opacity-20" />
        
        {/* Points */}
        <svg className="absolute inset-0 w-full h-full">
          {data.map((m, i) => {
            const x = ((m.fidelity! - minFidelity) / (maxFidelity - minFidelity)) * 90 + 5;
            const y = 100 - ((m.quantumEnergy! - minEnergy) / (maxEnergy - minEnergy)) * 90 - 5;
            const size = Math.max(4, (m.therapeuticScore / 0.7) * 12);
            const isTop = m.therapeuticScore >= 0.55;
            
            return (
              <g key={i}>
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r={size}
                  fill={isTop ? '#5EEAD4' : '#818CF8'}
                  opacity={isTop ? 0.8 : 0.5}
                  className="hover:opacity-100 transition-opacity cursor-pointer"
                />
                {isTop && (
                  <text
                    x={`${x}%`}
                    y={`${y - size - 5}%`}
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize="8"
                    fontFamily="JetBrains Mono"
                  >
                    {m.shortName}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Axis labels */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono-clinical text-[9px] text-[#94A3B8]">
          FIDELITY →
        </div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 font-mono-clinical text-[9px] text-[#94A3B8]">
          QUBO ENERGY →
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#5EEAD4]" />
            <span className="font-mono-clinical text-[10px] text-[#94A3B8]">HIGH DRUGGABILITY</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#818CF8]" />
            <span className="font-mono-clinical text-[10px] text-[#94A3B8]">OTHER</span>
          </div>
        </div>
        <span className="font-mono-clinical text-[10px] text-[#94A3B8]">
          {data.length} mutations with quantum data
        </span>
      </div>
    </div>
  );
}

// Stats cards
function StatCards() {
  const stats = [
    { label: 'TOTAL MUTATIONS', value: pipelineStats.totalMutations, icon: Microscope, color: '#5EEAD4' },
    { label: 'PATHOGENIC', value: pipelineStats.pathogenicMutations, icon: TrendingUp, color: '#EC4899' },
    { label: 'AVG pLDDT', value: pipelineStats.avgPlddt.toFixed(2), icon: Atom, color: '#818CF8' },
    { label: 'ML AUROC', value: pipelineStats.mlAuroc.toFixed(3), icon: Brain, color: '#06B6D4' },
    { label: 'RNA RISK', value: pipelineStats.rnaRiskVariants, icon: ArrowUpRight, color: '#f59e0b' },
    { label: 'QUANTUM TIME', value: '37.3m', icon: Atom, color: '#22c55e' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="glass-panel rounded-xl p-4 text-center hover:border-[rgba(94,234,212,0.3)] transition-all">
          <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
          <div className="font-mono-clinical text-2xl font-bold text-[#F8FAFC] mb-1">{stat.value}</div>
          <div className="font-mono-clinical text-[9px] text-[#94A3B8] tracking-wider">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// Score distribution histogram
function ScoreDistribution() {
  const bins = [
    { range: '0.30-0.35', count: 8, color: '#ef4444' },
    { range: '0.35-0.40', count: 15, color: '#f97316' },
    { range: '0.40-0.45', count: 32, color: '#f59e0b' },
    { range: '0.45-0.50', count: 45, color: '#eab308' },
    { range: '0.50-0.55', count: 28, color: '#84cc16' },
    { range: '0.55-0.60', count: 12, color: '#22c55e' },
    { range: '0.60-0.70', count: 8, color: '#5EEAD4' },
    { range: '0.70+', count: 2, color: '#06B6D4' },
  ];
  const maxCount = Math.max(...bins.map(b => b.count));

  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#06B6D4]" />
          <h3 className="font-mono-clinical text-sm text-[#F8FAFC]">T-SCORE DISTRIBUTION</h3>
        </div>
      </div>
      <div className="flex items-end gap-2 h-40">
        {bins.map((bin, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="font-mono-clinical text-[9px] text-[#94A3B8]">{bin.count}</span>
            <div 
              className="w-full rounded-t-md transition-all duration-1000"
              style={{ 
                height: `${(bin.count / maxCount) * 100}%`,
                backgroundColor: bin.color,
                opacity: 0.7,
              }}
            />
            <span className="font-mono-clinical text-[8px] text-[#94A3B8] rotate-0">{bin.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalysisSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.analysis-card').forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
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
      id="analysis" 
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 px-6 lg:px-12"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: 'url(/neural-field.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050B14] via-[#050B14]/95 to-[#050B14]" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(6,182,212,0.08)] border border-[rgba(6,182,212,0.2)] mb-6">
            <TrendingUp className="w-4 h-4 text-[#06B6D4]" />
            <span className="font-mono-clinical text-xs tracking-wider text-[#06B6D4]">
              ANALYTICS DASHBOARD
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#F8FAFC] mb-4">
            Clinical <span className="text-gradient-cyan">Intelligence</span>
          </h2>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
            Comprehensive analytics across 150 TP53 mutations — from quantum conformational 
            sampling to therapeutic prioritization.
          </p>
        </div>

        {/* Stats Row */}
        <div className="mb-8 analysis-card">
          <StatCards />
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="analysis-card">
            <TherapeuticScoreChart />
          </div>
          <div className="analysis-card">
            <MLModelChart />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="analysis-card">
            <QuantumScatterPlot />
          </div>
          <div className="analysis-card">
            <ScoreDistribution />
          </div>
        </div>
      </div>
    </section>
  );
}
