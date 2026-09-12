import { useState, useRef, useEffect } from 'react';
import { Search, Dna, Activity, Trophy, AlertTriangle, FlaskConical, ChevronRight, Filter } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  allMutations, 
  getDrugHypothesis, 
  getDruggabilityClass,
  searchMutations,
  type MutationData 
} from '../data/mutationData';

gsap.registerPlugin(ScrollTrigger);

function MutationCard({ mutation }: { mutation: MutationData }) {
  const druggability = getDruggabilityClass(mutation.therapeuticScore);
  const drugHypothesis = getDrugHypothesis(mutation.shortName);

  return (
    <div className="glass-panel rounded-xl p-6 hover:border-[rgba(94,234,212,0.3)] transition-all glow-cyan">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[rgba(94,234,212,0.1)] border border-[rgba(94,234,212,0.2)] flex items-center justify-center">
            <Dna className="w-5 h-5 text-[#5EEAD4]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#F8FAFC] font-mono-clinical">{mutation.mutation}</h3>
            <span className="text-xs text-[#94A3B8]">Rank #{mutation.rank} / 150</span>
          </div>
        </div>
        <div 
          className="px-3 py-1.5 rounded-full font-mono-clinical text-xs font-semibold"
          style={{ 
            backgroundColor: `${druggability.color}20`, 
            color: druggability.color,
            border: `1px solid ${druggability.color}40`,
          }}
        >
          {druggability.label} DRUGGABILITY
        </div>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[rgba(10,22,40,0.6)] rounded-lg p-3 text-center">
          <div className="font-mono-clinical text-[10px] text-[#94A3B8] mb-1">STRUCTURAL</div>
          <div className="font-mono-clinical text-lg font-bold text-[#5EEAD4]">{mutation.structuralScore.toFixed(3)}</div>
          <div className="w-full bg-[rgba(148,163,184,0.1)] rounded-full h-1 mt-2">
            <div 
              className="bg-[#5EEAD4] h-1 rounded-full transition-all"
              style={{ width: `${mutation.structuralScore * 100}%` }}
            />
          </div>
        </div>
        <div className="bg-[rgba(10,22,40,0.6)] rounded-lg p-3 text-center">
          <div className="font-mono-clinical text-[10px] text-[#94A3B8] mb-1">AFFINITY</div>
          <div className="font-mono-clinical text-lg font-bold text-[#06B6D4]">{mutation.affinityScore.toFixed(3)}</div>
          <div className="w-full bg-[rgba(148,163,184,0.1)] rounded-full h-1 mt-2">
            <div 
              className="bg-[#06B6D4] h-1 rounded-full transition-all"
              style={{ width: `${mutation.affinityScore * 100}%` }}
            />
          </div>
        </div>
        <div className="bg-[rgba(10,22,40,0.6)] rounded-lg p-3 text-center">
          <div className="font-mono-clinical text-[10px] text-[#94A3B8] mb-1">FUNCTIONAL</div>
          <div className="font-mono-clinical text-lg font-bold text-[#EC4899]">{mutation.functionalScore.toFixed(1)}</div>
          <div className="w-full bg-[rgba(148,163,184,0.1)] rounded-full h-1 mt-2">
            <div 
              className="bg-[#EC4899] h-1 rounded-full transition-all"
              style={{ width: `${mutation.functionalScore * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Therapeutic Score Gauge */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono-clinical text-xs text-[#94A3B8]">THERAPEUTIC SCORE (T_primary)</span>
          <span className="font-mono-clinical text-sm font-bold text-[#F8FAFC]">{mutation.therapeuticScore.toFixed(4)}</span>
        </div>
        <div className="w-full h-3 bg-[rgba(10,22,40,0.8)] rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-1000"
            style={{ 
              width: `${mutation.therapeuticScore * 100}%`,
              background: `linear-gradient(90deg, #ef4444 0%, #f59e0b 40%, #22c55e 70%, #5EEAD4 100%)`,
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="font-mono-clinical text-[9px] text-[#94A3B8]">0.0</span>
          <span className="font-mono-clinical text-[9px] text-[#94A3B8]">0.5</span>
          <span className="font-mono-clinical text-[9px] text-[#94A3B8]">1.0</span>
        </div>
      </div>

      {/* Clinical Data */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="text-[#94A3B8]">Affinity:</span>
          <span className="text-[#F8FAFC] font-mono-clinical">{mutation.affinity.toFixed(2)} kcal/mol</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="text-[#94A3B8]">RMSD:</span>
          <span className="text-[#F8FAFC] font-mono-clinical">{mutation.rmsd.toFixed(3)} Å</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="text-[#94A3B8]">COSMIC:</span>
          <span className="text-[#F8FAFC] font-mono-clinical">{mutation.cosmicCount} ({mutation.cosmicPercent}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="text-[#94A3B8]">pLDDT:</span>
          <span className="text-[#F8FAFC] font-mono-clinical">{mutation.meanPlddt.toFixed(1)}</span>
        </div>
      </div>

      {/* Quantum Data */}
      {mutation.quantumEnergy !== undefined && (
        <div className="flex items-center gap-4 mb-4 p-3 bg-[rgba(129,140,248,0.05)] rounded-lg border border-[rgba(129,140,248,0.1)]">
          <div className="flex items-center gap-2">
            <span className="font-mono-clinical text-[10px] text-[#818CF8]">QUBO ENERGY</span>
            <span className="font-mono-clinical text-sm text-[#F8FAFC]">{mutation.quantumEnergy.toFixed(4)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono-clinical text-[10px] text-[#818CF8]">FIDELITY</span>
            <span className="font-mono-clinical text-sm text-[#F8FAFC]">{mutation.fidelity?.toFixed(4)}</span>
          </div>
        </div>
      )}

      {/* Drug Hypothesis */}
      <div className="p-3 bg-[rgba(34,197,94,0.05)] rounded-lg border border-[rgba(34,197,94,0.15)]">
        <div className="flex items-center gap-2 mb-1">
          <FlaskConical className="w-3.5 h-3.5 text-[#22c55e]" />
          <span className="font-mono-clinical text-[10px] text-[#22c55e]">DRUG HYPOTHESIS</span>
        </div>
        <p className="text-sm text-[#F8FAFC] leading-relaxed">{drugHypothesis}</p>
      </div>

      {/* RNA Risk */}
      {mutation.rnaRiskFlag && (
        <div className="mt-3 flex items-center gap-2 p-3 bg-[rgba(245,158,11,0.05)] rounded-lg border border-[rgba(245,158,11,0.15)]">
          <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
          <span className="text-sm text-[#f59e0b]">
            Splice-disrupting mutation detected. Recommend RT-PCR validation.
          </span>
        </div>
      )}
    </div>
  );
}

export default function MutationSearchSection() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MutationData[]>([]);
  const [selectedMutation, setSelectedMutation] = useState<MutationData | null>(null);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.search-container',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: {
            trigger: '.search-container',
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      const matches = searchMutations(value);
      setResults(matches);
    } else {
      setResults([]);
    }
  };

  const filteredTopMutations = allMutations
    .filter(m => {
      if (filter === 'high') return m.therapeuticScore >= 0.55;
      if (filter === 'medium') return m.therapeuticScore >= 0.40 && m.therapeuticScore < 0.55;
      if (filter === 'low') return m.therapeuticScore < 0.40;
      return true;
    })
    .sort((a, b) => b.therapeuticScore - a.therapeuticScore)
    .slice(0, 12);

  return (
    <section 
      id="mutations" 
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 px-6 lg:px-12"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#050B14] via-[#0A1628]/30 to-[#050B14]" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 search-container">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(236,72,153,0.08)] border border-[rgba(236,72,153,0.2)] mb-6">
            <Dna className="w-4 h-4 text-[#EC4899]" />
            <span className="font-mono-clinical text-xs tracking-wider text-[#EC4899]">
              MUTATION ANALYZER
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#F8FAFC] mb-4">
            Search <span className="text-gradient-cyan">TP53 Mutations</span>
          </h2>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
            Query 150 clinically-validated TP53 mutations with quantum-AI druggability scoring 
            and automated drug hypothesis generation.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 search-container">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Enter mutation (e.g., Y220C, R175H, R248Q)..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-[rgba(10,22,40,0.8)] border border-[rgba(94,234,212,0.2)] text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus:outline-none focus:border-[rgba(94,234,212,0.5)] focus:ring-1 focus:ring-[rgba(94,234,212,0.3)] transition-all font-mono-clinical"
            />
            {query && (
              <button 
                onClick={() => { setQuery(''); setResults([]); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                ×
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {results.length > 0 && (
            <div className="absolute z-50 w-full max-w-2xl mt-2 glass-panel-strong rounded-xl overflow-hidden">
              {results.map((m, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedMutation(m); setResults([]); setQuery(''); }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-[rgba(94,234,212,0.05)] transition-colors border-b border-[rgba(148,163,184,0.05)] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Dna className="w-4 h-4 text-[#5EEAD4]" />
                    <span className="font-mono-clinical text-sm text-[#F8FAFC]">{m.mutation}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono-clinical text-xs text-[#94A3B8]">T: {m.therapeuticScore.toFixed(4)}</span>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Mutation Detail */}
        {selectedMutation && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#F8FAFC]">Mutation Detail</h3>
              <button 
                onClick={() => setSelectedMutation(null)}
                className="text-sm text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Close
              </button>
            </div>
            <MutationCard mutation={selectedMutation} />
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Filter className="w-4 h-4 text-[#94A3B8]" />
          <span className="font-mono-clinical text-xs text-[#94A3B8]">FILTER BY DRUGGABILITY:</span>
          {(['all', 'high', 'medium', 'low'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full font-mono-clinical text-xs transition-all ${
                filter === f 
                  ? 'bg-[rgba(94,234,212,0.15)] text-[#5EEAD4] border border-[rgba(94,234,212,0.3)]' 
                  : 'text-[#94A3B8] border border-[rgba(148,163,184,0.15)] hover:border-[rgba(148,163,184,0.3)]'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Mutation Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopMutations.map((mutation, i) => (
            <button
              key={i}
              onClick={() => setSelectedMutation(mutation)}
              className="glass-panel rounded-xl p-5 text-left hover:border-[rgba(94,234,212,0.3)] transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Dna className="w-4 h-4 text-[#5EEAD4]" />
                  <span className="font-mono-clinical text-sm font-semibold text-[#F8FAFC]">{mutation.mutation}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#5EEAD4] group-hover:translate-x-1 transition-all" />
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono-clinical text-[10px] text-[#94A3B8]">T-SCORE</span>
                    <span className="font-mono-clinical text-xs text-[#F8FAFC]">{mutation.therapeuticScore.toFixed(4)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[rgba(10,22,40,0.8)] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${mutation.therapeuticScore * 100}%`,
                        background: mutation.therapeuticScore >= 0.55 
                          ? '#22c55e' 
                          : mutation.therapeuticScore >= 0.40 
                            ? '#f59e0b' 
                            : '#ef4444',
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-[#94A3B8]">COSMIC: <span className="text-[#F8FAFC] font-mono-clinical">{mutation.cosmicCount}</span></span>
                <span className="text-[#94A3B8]">Affinity: <span className="text-[#F8FAFC] font-mono-clinical">{mutation.affinity.toFixed(2)}</span></span>
                {mutation.quantumEnergy !== undefined && (
                  <span className="text-[#94A3B8]">Q: <span className="text-[#818CF8] font-mono-clinical">{mutation.quantumEnergy.toFixed(3)}</span></span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
