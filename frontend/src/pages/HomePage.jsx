import React from 'react';
import { 
  ArrowRight, Activity, Dna, Users, HeartPulse, Sparkles, BrainCircuit, 
  CheckCircle2, TrendingUp, ShieldCheck, FileText, Microscope, Scale, Cpu
} from 'lucide-react';

export default function HomePage({ setActivePage }) {
  const featureCards = [
    {
      title: "Inherited Susceptibility Analysis",
      icon: Dna,
      color: "from-teal-500 to-emerald-600",
      description: "Incorporates normalized Polygenic Risk Scores (PRS) and population percentiles to quantify baseline genetic liability for Type-2 Diabetes."
    },
    {
      title: "Family History Assessment",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      description: "Evaluates multigenerational pedigree burden across maternal, paternal, sibling, and grandparental history using weighted scoring."
    },
    {
      title: "Lifestyle Risk Analysis",
      icon: Activity,
      color: "from-cyan-500 to-blue-600",
      description: "Analyzes modifiable lifestyle habits including weekly physical activity, sleep architecture, diet quality score, and sedentary patterns."
    },
    {
      title: "Clinical Parameter Analysis",
      icon: HeartPulse,
      color: "from-rose-500 to-pink-600",
      description: "Integrates anthropometric and hemodynamic markers: BMI, waist circumference, blood pressure (systolic/diastolic), and serum lipid panels."
    },
    {
      title: "Machine Learning Prediction",
      icon: Cpu,
      color: "from-violet-500 to-purple-600",
      description: "Employs the E5 Champion Logistic Regression model trained on 57 engineered and standardized features with validated decision boundaries."
    },
    {
      title: "Explainable AI (SHAP)",
      icon: Sparkles,
      color: "from-amber-500 to-orange-600",
      description: "Decomposes exact individual risk-increasing and protective log-odds contributions, supported by global SHAP feature importance rankings."
    }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Enter Health Inputs",
      desc: "Provide demographic, synthetic PRS, pedigree family history, lifestyle habits, and clinical measurements in a structured multi-section form."
    },
    {
      step: "02",
      title: "Feature Engineering & Interactions",
      desc: "Computes non-interaction indices (CVRI, SSR, DAS, OAS) and standardized Gene-Environment interaction terms (PRS × Activity, PRS × Diet, etc.)."
    },
    {
      step: "03",
      title: "Trained Model Processing",
      desc: "The fitted ColumnTransformer applies median imputation, outlier winsorization, and scaling before feeding into the E5 Champion model."
    },
    {
      step: "04",
      title: "Risk Score & Explainability",
      desc: "Review your model-estimated risk probability, validated F1-optimal threshold evaluation (27.9%), and actionable lifestyle breakdown."
    }
  ];

  return (
    <div className="space-y-16 py-6">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 text-white shadow-2xl border border-navy-700/50">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-5xl mx-auto px-6 py-16 sm:py-20 lg:px-8 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-semibold tracking-wide">
            <Microscope className="w-4 h-4 text-teal-400" />
            <span>Academic Final-Year Research Project • Review III</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Inherited-Susceptibility–Aware Lifestyle Risk Modelling for Personalized Type-2 Diabetes Prediction
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Demonstrating how synthetic polygenic susceptibility (PRS), multigenerational family history, modifiable lifestyle interactions, and clinical parameters can be synthesized into an explainable machine learning architecture.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => { setActivePage('assessment'); window.scrollTo(0,0); }}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 active:scale-95 transition-all shadow-lg shadow-teal-600/30"
            >
              <Activity className="w-4 h-4" />
              <span>Start Risk Assessment</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => { setActivePage('explorer'); window.scrollTo(0,0); }}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-navy-800/80 hover:bg-navy-700/80 border border-navy-600/60 transition-all"
            >
              <Dna className="w-4 h-4 text-teal-400" />
              <span>Explore Feature Combinations</span>
            </button>

            <button
              onClick={() => { setActivePage('dashboard'); window.scrollTo(0,0); }}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              <span>View Research Dashboard</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="bg-navy-800/50 p-4 rounded-xl border border-navy-700/40">
              <span className="text-2xl font-bold text-teal-300 font-mono">7,000</span>
              <p className="text-xs text-slate-400 mt-0.5">Synthetic Participants</p>
            </div>
            <div className="bg-navy-800/50 p-4 rounded-xl border border-navy-700/40">
              <span className="text-2xl font-bold text-teal-300 font-mono">0.7835</span>
              <p className="text-xs text-slate-400 mt-0.5">Champion Test ROC-AUC</p>
            </div>
            <div className="bg-navy-800/50 p-4 rounded-xl border border-navy-700/40">
              <span className="text-2xl font-bold text-teal-300 font-mono">p = 0.041</span>
              <p className="text-xs text-slate-400 mt-0.5">GxE Bootstrapping Sig.</p>
            </div>
            <div className="bg-navy-800/50 p-4 rounded-xl border border-navy-700/40">
              <span className="text-2xl font-bold text-teal-300 font-mono">27.94%</span>
              <p className="text-xs text-slate-400 mt-0.5">Validated F1 Threshold</p>
            </div>
          </div>

        </div>
      </section>

      {/* Novelty Spotlight: Gene-Environment (GxE) Interaction */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-sky-50 rounded-2xl p-6 sm:p-8 border border-teal-200 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-teal-500/20">
            <Scale className="w-7 h-7" />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Core Scientific Novelty: GxE Modeling</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Can Modifiable Lifestyle Counteract High Polygenic Liability?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our <strong>Experiment 5 (E5)</strong> models specific non-linear interactions: <code className="text-xs font-mono bg-teal-100/60 px-1.5 py-0.5 rounded text-teal-900">PRS × Diet Quality</code> (β = -0.1549) and <code className="text-xs font-mono bg-teal-100/60 px-1.5 py-0.5 rounded text-teal-900">PRS × Physical Activity</code>. Empirical bootstrapping (1,000 iterations) proves that modeling these cross-domain synergies statistically outperforms non-interaction models (p = 0.0410).
            </p>
          </div>
          <button
            onClick={() => { setActivePage('explorer'); window.scrollTo(0,0); }}
            className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-sm"
          >
            Test GxE Terms
          </button>
        </div>
      </section>

      {/* Six Feature Cards Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Multi-Modal Risk Architecture
          </h2>
          <p className="text-sm text-slate-500">
            Traditional calculators focus exclusively on lifestyle or genetics in silos. Our platform demonstrates a unified 4-domain framework.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all duration-300 space-y-4 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Four-Step Workflow Section */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Methodological Pipeline</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How The Prediction Engine Works
          </h2>
          <p className="text-sm text-slate-500">
            From raw user inputs to leak-free preprocessed standardized log-odds attributions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="relative bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-3">
              <span className="text-3xl font-black text-teal-600/30 font-mono">
                {step.step}
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => { setActivePage('assessment'); window.scrollTo(0,0); }}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-all shadow-md"
          >
            <span>Proceed to Step 01: Risk Assessment</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </button>
        </div>
      </section>

      {/* Research Disclaimer Box */}
      <section className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-amber-900 flex items-start space-x-4 text-xs leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-amber-900">Academic Prototype Notice for Review III Evaluators</h4>
          <p className="mt-1 text-amber-800">
            This system was constructed as an engineering implementation of the research paper &amp; notebook titled <em>"Inherited-Susceptibility–Aware Lifestyle Risk Modelling for Personalized Type-2 Diabetes Prediction Using Machine Learning and Deep Learning"</em>. The underlying dataset consists of 7,000 synthetic participant records generated to mirror real-world epidemiological distributions. It is strictly an experimental machine learning demonstrator, not an FDA/CE-cleared diagnostic device.
          </p>
        </div>
      </section>

    </div>
  );
}

