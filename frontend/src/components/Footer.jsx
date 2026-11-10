import React from 'react';
import { ShieldAlert, BookOpen, ExternalLink, Code2, HeartPulse } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Research Disclaimer Banner */}
      <div className="bg-navy-950/80 border-b border-navy-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-amber-300">Academic Prototype Notice:</span> This application is an academic final-year computer science and healthcare AI research prototype designed for demonstration and evaluation purposes (Review III). The risk probabilities generated are experimental machine learning estimates and <span className="underline decoration-amber-400 font-semibold">do not constitute clinical medical diagnoses or clinical advice</span>. Synthetic PRS scores represent simulated polygenic distributions, not genomic test assays.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Project Details */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                DiabeteRisk<span className="text-teal-400">.AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              <strong className="text-slate-200">Project Title:</strong> Inherited-Susceptibility–Aware Lifestyle Risk Modelling for Personalized Type-2 Diabetes Prediction Using Machine Learning and Deep Learning.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Demonstrating the empirical benefit of integrating polygenic liability (PRS), family pedigree history, modifiable lifestyle interactions (GxE), and clinical biomarkers using stratified 7,000-cohort experiments (E1–E6).
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-teal-300 border border-slate-700">FastAPI</span>
              <span className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-teal-300 border border-slate-700">Scikit-Learn</span>
              <span className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-teal-300 border border-slate-700">React.js</span>
              <span className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-teal-300 border border-slate-700">Tailwind CSS</span>
              <span className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-teal-300 border border-slate-700">Recharts</span>
              <span className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-teal-300 border border-slate-700">SHAP Interpretability</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => { setActivePage('assessment'); window.scrollTo(0,0); }} className="hover:text-teal-300 transition-colors">
                  Risk Assessment Form
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('explorer'); window.scrollTo(0,0); }} className="hover:text-teal-300 transition-colors">
                  Interactive Feature Explorer
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('what-if'); window.scrollTo(0,0); }} className="hover:text-teal-300 transition-colors">
                  What-If Counterfactual Tool
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('dashboard'); window.scrollTo(0,0); }} className="hover:text-teal-300 transition-colors">
                  Population Research Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('insights'); window.scrollTo(0,0); }} className="hover:text-teal-300 transition-colors">
                  Model Family Comparison (E1–E6)
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('xai'); window.scrollTo(0,0); }} className="hover:text-teal-300 transition-colors">
                  Explainable AI & SHAP Insights
                </button>
              </li>
            </ul>
          </div>

          {/* Research & Limitations */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Research & Governance
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => { setActivePage('framework'); window.scrollTo(0,0); }} className="hover:text-teal-300 transition-colors">
                  Experimental Framework (E1-E6)
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('about'); window.scrollTo(0,0); }} className="hover:text-teal-300 transition-colors">
                  Methodology & Limitations
                </button>
              </li>
              <li>
                <span className="text-slate-500">Cohort: 7,000 Synthetic Records</span>
              </li>
              <li>
                <span className="text-slate-500">Champion: E5 Logistic Regression</span>
              </li>
              <li>
                <span className="text-slate-500">Optimal Threshold: 27.94%</span>
              </li>
              <li>
                <span className="text-slate-500">Test ROC-AUC: 0.7835 | PR-AUC: 0.4110</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between">
          <p>© 2026 Academic Final-Year Research Project • Review III Demonstration</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px] text-slate-400">
            Authoritative Reference: Jupyter Notebook E1-E6 &amp; Champion Model
          </p>
        </div>
      </div>
    </footer>
  );
}

