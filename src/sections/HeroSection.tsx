import { useEffect, useState } from 'react';
import { Activity, Scan, ArrowRight, Database, Atom } from 'lucide-react';
import BioFluidBackground from '../components/BioFluidBackground';

export default function HeroSection() {
  const [stats, setStats] = useState({
    integrity: 99.8,
    thermal: 0.04,
    mutations: 150,
    trials: 14,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        integrity: 99.7 + Math.random() * 0.2,
        thermal: 0.03 + Math.random() * 0.02,
        mutations: 150,
        trials: 14,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen w-full overflow-hidden">
      <BioFluidBackground />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-scan opacity-30 pointer-events-none" style={{ zIndex: 1 }} />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full px-6 lg:px-12 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(94,234,212,0.15)] border border-[rgba(94,234,212,0.3)] flex items-center justify-center">
              <Atom className="w-5 h-5 text-[#5EEAD4]" />
            </div>
            <span className="font-mono-clinical text-sm tracking-widest text-[#F8FAFC] font-semibold">
              DynaPocket
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#platform" className="text-sm text-[#94A3B8] hover:text-[#5EEAD4] transition-colors">Platform</a>
            <a href="#mutations" className="text-sm text-[#94A3B8] hover:text-[#5EEAD4] transition-colors">Mutations</a>
            <a href="#analysis" className="text-sm text-[#94A3B8] hover:text-[#5EEAD4] transition-colors">Analysis</a>
            <a href="#pipeline" className="text-sm text-[#94A3B8] hover:text-[#5EEAD4] transition-colors">Pipeline</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
              Clinical Portal
            </button>
            <button className="px-5 py-2.5 rounded-full bg-[rgba(94,234,212,0.1)] border border-[rgba(94,234,212,0.3)] text-sm text-[#5EEAD4] hover:bg-[rgba(94,234,212,0.2)] transition-all glow-cyan">
              Patient Login
            </button>
          </div>
        </header>

        {/* Main Hero Content */}
        <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 py-12">
          <div className="max-w-5xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(94,234,212,0.08)] border border-[rgba(94,234,212,0.2)] mb-8">
              <div className="w-2 h-2 rounded-full bg-[#5EEAD4] animate-pulse" />
              <span className="font-mono-clinical text-xs tracking-wider text-[#5EEAD4]">
                QUANTUM-AI PIPELINE ACTIVE
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
              <span className="text-[#F8FAFC]">PRECISION</span>
              <br />
              <span className="text-gradient-cyan">ONCOLOGY</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[#94A3B8] max-w-2xl mb-10 leading-relaxed">
              Targeted molecular therapy driven by advanced biomechanical analysis. 
              150 TP53 mutations analyzed via IBM Quantum hardware with ML-powered 
              druggability scoring.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-16">
              <a 
                href="#mutations"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[rgba(94,234,212,0.1)] border border-[rgba(94,234,212,0.4)] text-[#5EEAD4] font-medium hover:bg-[rgba(94,234,212,0.2)] transition-all glow-cyan"
              >
                <Scan className="w-5 h-5" />
                INITIATE DIAGNOSTIC SCAN
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#platform"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[rgba(148,163,184,0.2)] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[rgba(148,163,184,0.4)] transition-all"
              >
                <Database className="w-5 h-5" />
                View Research Data
              </a>
            </div>

            {/* Telemetry Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
              {[
                { label: 'CELLULAR INTEGRITY', value: `${stats.integrity.toFixed(1)}%`, icon: Activity },
                { label: 'THERMAL LOAD', value: `${stats.thermal.toFixed(3)}K`, icon: Activity },
                { label: 'MUTATIONS ANALYZED', value: `${stats.mutations}`, icon: Database },
                { label: 'ACTIVE TRIALS', value: `${stats.trials}`, icon: Scan },
              ].map((stat, i) => (
                <div 
                  key={i}
                  className="glass-panel rounded-xl p-4 hover:border-[rgba(94,234,212,0.3)] transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-3.5 h-3.5 text-[#5EEAD4]" />
                    <span className="font-mono-clinical text-[10px] tracking-wider text-[#94A3B8]">
                      {stat.label}
                    </span>
                  </div>
                  <div className="font-mono-clinical text-xl font-bold text-[#F8FAFC]">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono-clinical text-[10px] tracking-widest text-[#94A3B8]">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#5EEAD4] to-transparent" />
        </div>
      </div>
    </section>
  );
}
