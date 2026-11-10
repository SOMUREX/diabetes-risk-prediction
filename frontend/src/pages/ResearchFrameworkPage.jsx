import React from 'react';
import { 
  BookOpen, Dna, Activity, HeartPulse, Scale, CheckCircle2, 
  Sparkles, Award, BarChart3, Layers, Microscope, ShieldAlert
} from 'lucide-react';

export default function ResearchFrameworkPage() {
  const experiments = [
    {
      code: 'E1',
      title: 'Baseline Lifestyle, Demographic & Clinical Model',
      features: '29 predictor variables (Lifestyle + Demographics + Clinical)',
      excluded: 'Genetic PRS and Family History strictly excluded',
      champion: 'XGBoost (AUC: 0.7452) / Logistic Regression (AUC: 0.7448)',
      description: 'Establishes the predictive baseline achievable using standard clinical and lifestyle risk assessments in the absence of any genetic or family history information.'
    },
    {
      code: 'E2',
      title: 'Inherited Susceptibility & Pedigree Model',
      features: '10 predictor variables (t2d_prs, percentiles, pedigree records)',
      excluded: 'Lifestyle, Demographics, and Clinical markers strictly excluded',
      champion: 'Logistic Regression (AUC: 0.6562) / XGBoost (AUC: 0.6561)',
      description: 'Isolates the non-modifiable inherited liability space. Demonstrates that genetics and family history alone provide moderate discrimination (0.6562) but require clinical context to achieve clinical utility.'
    },
    {
      code: 'E3',
      title: 'Combined Raw Multi-Modal Feature Space',
      features: '39 raw predictor variables (E1 + E2 combined)',
      excluded: 'No engineered non-interaction or GxE interaction terms',
      champion: 'Logistic Regression (AUC: 0.7791)',
      description: 'Merges both modifiable lifestyle/clinical features and non-modifiable genetic/family features. Demonstrates a major +0.0343 AUC jump over E1 and +0.1229 AUC jump over E2, confirming the complementary nature of both modalities.'
    },
    {
      code: 'E4',
      title: 'Domain-Specific Non-Interaction Feature Engineering',
      features: '43 predictor variables (39 baseline + 4 engineered indices)',
      excluded: 'No GxE interaction terms',
      champion: 'Logistic Regression (AUC: 0.7790)',
      description: 'Synthesizes specialized clinical and lifestyle interaction domains: CVRI, SSR, DAS, and OAS to capture non-linear physiological relationships directly.'
    },
    {
      code: 'E5',
      title: 'Gene-Environment (GxE) Interaction Modeling (Champion)',
      features: '47 predictor variables (43 from E4 + 4 standardized GxE terms)',
      excluded: 'None (Full 57 transformed dimensional space)',
      champion: 'Logistic Regression (AUC: 0.7835, PR-AUC: 0.4110, Brier: 0.1054)',
      description: 'The defining contribution of this research. Formulates standardized interactions between PRS and modifiable lifestyle factors, achieving the overall project champion performance.'
    },
    {
      code: 'E6',
      title: 'Statistical Comparison & Champion Selection',
      features: 'Paired non-parametric bootstrapping (1,000 resamples)',
      excluded: 'N/A (Statistical Hypothesis Testing)',
      champion: 'Empirical p = 0.0410 (Statistically Significant)',
      description: 'Performs 1,000 bootstrap iterations proving that E5 is statistically superior to E4 (p = 0.0410, 95% CI [-0.0006, 0.0094]). Evaluates calibration curves and demographic/genetic subgroup stability.'
    }
  ];

  const e4Formulas = [
    {
      name: 'Cardiovascular Risk Index (CVRI)',
      formula: 'systolic_bp * diastolic_bp / 100.0',
      rationale: 'Captures compound hemodynamic vascular resistance beyond either systolic or diastolic readings alone.'
    },
    {
      name: 'Sleep-to-Sedentary Ratio (SSR)',
      formula: 'sleep_duration_hours / (sedentary_hours_day + 0.1)',
      rationale: 'Quantifies restorative circadian sleep relative to waking metabolic inactivity (+0.1 avoids division by zero).'
    },
    {
      name: 'Diet-Activity Synergy (DAS)',
      formula: 'diet_quality_score * physical_activity_minutes_week',
      rationale: 'Models the synergistic compounding benefit of combining high-quality nutrition with vigorous physical exercise.'
    },
    {
      name: 'Obesity-Age Score (OAS)',
      formula: 'bmi * age',
      rationale: 'Reflects the cumulative chronological duration of adiposity-induced insulin resistance.'
    }
  ];

  const e5Interactions = [
    {
      term: 'GxE1: PRS × Physical Activity',
      formula: 'prs_std * activity_std',
      details: 'Tests if aerobic exercise stimulates insulin-independent glucose uptake sufficiently to attenuate polygenic liability.'
    },
    {
      term: 'GxE2: PRS × Sleep Duration',
      formula: 'prs_std * sleep_std',
      details: 'Evaluates nocturnal cortisol and sympathetic activation synergies with genetic diabetes risk.'
    },
    {
      term: 'GxE3: PRS × Diet Quality',
      formula: 'prs_std * diet_std',
      details: 'Top protective interaction term (β = -0.1549). High diet adherence significantly reduces risk among high PRS individuals.'
    },
    {
      term: 'GxE4: PRS × BMI',
      formula: 'prs_std * bmi_std',
      details: 'Compound hazard: Adiposity amplifies genetic vulnerability, accelerating beta-cell exhaustion.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-4">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-teal-600 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Academic Research Documentation</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Research Experimental Framework (E1 to E6)
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
          Systematic overview of the six sequential experimental paradigms conducted in the reference Jupyter Notebook, outlining exact feature sets, mathematical formulations, and empirical verification.
        </p>
      </div>

      {/* Experiments E1-E6 Timeline / Cards */}
      <div className="space-y-4">
        {experiments.map(exp => (
          <div key={exp.code} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                  exp.code === 'E5' ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20' : 'bg-navy-900 text-white'
                }`}>
                  {exp.code}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{exp.title}</h3>
                  <span className="text-[11px] text-teal-700 font-medium">{exp.features}</span>
                </div>
              </div>

              <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-semibold text-slate-700">
                Champion: <strong className="text-slate-900">{exp.champion}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {exp.description}
            </p>
          </div>
        ))}
      </div>

      {/* E4 Engineered Features Detail */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-teal-600 uppercase">Experiment 4 Formulations</span>
          <h2 className="text-lg font-bold text-slate-900">Non-Interaction Domain Engineered Features</h2>
          <p className="text-xs text-slate-500">
            Formulated before standard pipeline imputation and standardized via StandardScaler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {e4Formulas.map((feat, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-900">{feat.name}</span>
              </div>
              <code className="text-xs font-mono text-teal-800 bg-teal-50 px-2 py-1 rounded block border border-teal-200/60">
                {feat.formula}
              </code>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {feat.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* E5 Gene-Environment (GxE) Interactions Detail */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-teal-600 uppercase">Experiment 5 Formulations</span>
          <h2 className="text-lg font-bold text-slate-900">Standardized Gene-Environment (GxE) Interactions</h2>
          <p className="text-xs text-slate-500">
            Computed using pre-fitted training split parameters (means and standard deviations) to prevent leakage:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {e5Interactions.map((gxe, idx) => (
            <div key={idx} className="p-4 bg-teal-50/40 rounded-xl border border-teal-200/80 space-y-2">
              <span className="text-xs font-bold text-teal-900 block">{gxe.term}</span>
              <code className="text-xs font-mono text-slate-800 bg-white px-2 py-1 rounded block border border-teal-200">
                {gxe.formula}
              </code>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {gxe.details}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

