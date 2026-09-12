import { Atom, Github, ExternalLink, Mail, Shield, FileText } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="relative w-full py-16 px-6 lg:px-12 bg-[#0A1628] border-t border-[rgba(94,234,212,0.08)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[rgba(94,234,212,0.1)] border border-[rgba(94,234,212,0.2)] flex items-center justify-center">
                <Atom className="w-5 h-5 text-[#5EEAD4]" />
              </div>
              <span className="font-mono-clinical text-sm tracking-widest text-[#F8FAFC] font-semibold">
                DynaPocket
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
              Quantum-AI precision oncology platform for TP53 therapeutic prioritization.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="font-mono-clinical text-[10px] text-[#22c55e] tracking-wider">
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-mono-clinical text-xs tracking-wider text-[#5EEAD4] mb-4">PLATFORM</h4>
            <ul className="space-y-3">
              {['Mutation Analyzer', 'Quantum Pipeline', 'ML Models', 'Clinical Trials'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors flex items-center gap-2">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Research */}
          <div>
            <h4 className="font-mono-clinical text-xs tracking-wider text-[#5EEAD4] mb-4">RESEARCH</h4>
            <ul className="space-y-3">
              {['Publications', 'Datasets', 'API Documentation', 'GitHub Repository'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors flex items-center gap-2">
                    {item}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance */}
          <div>
            <h4 className="font-mono-clinical text-xs tracking-wider text-[#5EEAD4] mb-4">COMPLIANCE</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  HIPAA Compliance
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  Open Source
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[rgba(94,234,212,0.08)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono-clinical text-[10px] text-[#94A3B8]">
            © 2026 DynaPocket. QUANTUM-AI PRECISION ONCOLOGY PLATFORM.
          </p>
          <p className="font-mono-clinical text-[10px] text-[#94A3B8]">
            BUILT ON 150 TP53 MUTATIONS • IBM QUANTUM VALIDATED • AUROC 0.711
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-[rgba(245,158,11,0.03)] rounded-lg border border-[rgba(245,158,11,0.08)]">
          <p className="font-mono-clinical text-[10px] text-[#94A3B8] leading-relaxed text-center">
            <span className="text-[#f59e0b]">DISCLAIMER:</span> All predictions are hypothesis-generating and require 
            prospective experimental validation. This platform is intended for research purposes and clinical 
            decision support, not as a substitute for professional medical judgment.
          </p>
        </div>
      </div>
    </footer>
  );
}
