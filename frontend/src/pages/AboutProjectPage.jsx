import React from 'react';
import { 
  HelpCircle, ShieldAlert, Lock, Database, Code2, 
  CheckCircle2, AlertTriangle, FileCode, Cpu, UserCheck
} from 'lucide-react';

export default function AboutProjectPage() {
  const limitations = [
    {
      title: "Synthetic Participant Cohort",
      desc: "The primary dataset contains 7,000 synthetic participants generated algorithmically to mirror epidemiological correlations. Results are experimental research artifacts and should not be misconstrued as empirical findings from a prospective clinical trial."
    },
    {
      title: "Synthetic PRS vs. Clinical Genomic Assays",
      desc: "The Polygenic Risk Score (PRS) in this study is a continuous normalized Z-score proxy (-3.5 to +3.5). It does not derive from real DNA microarray genotyping, next-generation sequencing, or clinical polygenic score assays."
    },
    {
      title: "Pedigree Family History is an Observational Proxy",
      desc: "Family diabetes pedigree history reflects self-reported biological family occurrences, which is an observational surrogate for shared genetic and household environmental risk, not a direct genomic measurement."
    },
    {
      title: "Lack of Prospective Clinical Validation",
      desc: "The champion prediction pipeline has not been evaluated in prospective real-world hospital workflows, randomized control trials, or diverse un-stratified external cohorts."
    },
    {
      title: "Generalizability Boundaries",
      desc: "Due to synthetic formulation and specific sub-cohort proportions, predictive calibration and decision thresholds (27.94%) may not generalize across differing global geographic, age, or ethnic demographics."
    },
    {
      title: "Non-Diagnostic Software",
      desc: "This software is an engineering capstone demonstration (Review III) and must never be utilized for diagnostic screening, clinical triage, pharmacological prescriptions, or clinical lifestyle modifications without board-certified medical supervision."
    }
  ];

  const privacyFeatures = [
    {
      title: "Zero Health Data Persistence",
      desc: "Patient assessment form submissions are processed purely in-memory by the FastAPI prediction pipeline and are never written to disk, database, or persistent cloud storage."
    },
    {
      title: "No PII Collection",
      desc: "The system does not collect names, phone numbers, email addresses, government IDs, or IP addresses."
    },
    {
      title: "Data Isolation",
      desc: "Raw cohort CSV files are strictly isolated within the backend filesystem and are never exposed or transmitted to public frontend network routes."
    },
    {
      title: "Stateless Execution",
      desc: "All counterfactual what-if queries and prediction sessions are stateless and ephemeral."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-teal-600 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Academic Project &amp; Governance</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          About Project, Privacy &amp; Research Limitations
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Comprehensive project documentation, ethical safeguards, data privacy standards, and explicit research boundaries for the university Review III demonstration.
        </p>
      </div>

      {/* Project Abstract */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Project Overview &amp; Research Title</h2>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed">
          <strong>Title:</strong> Inherited-Susceptibility–Aware Lifestyle Risk Modelling for Personalized Type-2 Diabetes Prediction Using Machine Learning and Deep Learning
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Type-2 Diabetes Mellitus (T2DM) arises from complex, multi-scale interactions between polygenic liability and modifiable environmental lifestyles. Traditional predictive instruments evaluate clinical biomarkers or lifestyle questionnaires in isolation, overlooking the non-linear synergies between genetic susceptibility and behavioral habits. This project demonstrates an integrated machine learning framework (E1 to E6) establishing that modeling Gene-Environment (GxE) interactions provides statistically significant discrimination gains (p = 0.0410).
        </p>
      </div>

      {/* Explicit Research Limitations Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-2 text-amber-700 pb-2 border-b border-slate-100">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-base font-bold text-slate-900">Explicit Academic Research Limitations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {limitations.map((item, idx) => (
            <div key={idx} className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-1.5">
              <span className="text-xs font-bold text-amber-950 block">{item.title}</span>
              <p className="text-xs text-amber-900 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Ethical Safeguards */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-2 text-teal-700 pb-2 border-b border-slate-100">
          <Lock className="w-5 h-5" />
          <h2 className="text-base font-bold text-slate-900">Privacy &amp; Data Security Safeguards</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {privacyFeatures.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>{item.title}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Evaluator Contact / Demonstration Notes */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-3 text-xs leading-relaxed">
        <h3 className="text-sm font-bold text-teal-300">Review III Demonstration Guidelines</h3>
        <p className="text-slate-300">
          Evaluators can test individual patient assessments using either the <strong>Evaluator Presets</strong> on the Risk Assessment page or by manually modifying features. The live prediction pipeline executes through the FastAPI backend on port 8000 using the certified E5 Champion model artifact (<code className="text-teal-300 font-mono">champion_diabetes_model.joblib</code>).
        </p>
      </div>

    </div>
  );
}

