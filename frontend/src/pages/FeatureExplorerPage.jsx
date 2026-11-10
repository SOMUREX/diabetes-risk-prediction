import React, { useState, useEffect } from 'react';
import { 
  Dna, Sliders, CheckSquare, Square, Sparkles, AlertCircle, 
  CheckCircle2, ArrowRight, BarChart3, Info, Scale, Layers, ChevronRight
} from 'lucide-react';
import { queryFeatureExplorer, fetchExperiments } from '../services/api';

export default function FeatureExplorerPage({ setActivePage }) {
  const [selectedGroups, setSelectedGroups] = useState([
    'demographics', 'inherited', 'family_history', 'lifestyle', 'clinical'
  ]);
  const [selectedInteractions, setSelectedInteractions] = useState([
    'prs_x_activity', 'prs_x_sleep', 'prs_x_diet', 'prs_x_bmi'
  ]);
  const [explorerData, setExplorerData] = useState(null);
  const [allExperiments, setAllExperiments] = useState(null);
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' or 'experiments'
  const [selectedExpToCompare, setSelectedExpToCompare] = useState('E5');

  // Load experiments data on mount
  useEffect(() => {
    fetchExperiments().then(data => {
      if (data && data.experiments) {
        setAllExperiments(data.experiments);
      }
    }).catch(err => console.warn('Could not load experiments:', err));
  }, []);

  // Update explorer whenever selection changes
  useEffect(() => {
    queryFeatureExplorer(selectedGroups, selectedInteractions)
      .then(res => setExplorerData(res))
      .catch(err => console.error(err));
  }, [selectedGroups, selectedInteractions]);

  const featureGroupsList = [
    {
      id: 'demographics',
      name: 'Demographic Features',
      count: '5 features',
      items: ['Age', 'Sex', 'Race/Ethnicity', 'Education Level', 'Income Level'],
      description: 'Non-modifiable socio-demographic baseline variables.'
    },
    {
      id: 'inherited',
      name: 'Inherited Susceptibility Features',
      count: '3 features',
      items: ['t2d_prs (Polygenic Risk Score)', 'prs_percentile', 'genetic_risk_category'],
      description: 'Normalized aggregate polygenic liability distribution.'
    },
    {
      id: 'family_history',
      name: 'Family History Features',
      count: '7 features',
      items: ['Mother', 'Father', 'Sibling', 'Grandparent', 'Family History Binary', 'Num Affected Relatives', 'Family History Score'],
      description: 'Pedigree multigenerational family diabetes occurrences.'
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle Features',
      count: '17 features',
      items: ['Physical Activity min/wk', 'Moderate/Vigorous Days', 'Sedentary Hours', 'Sleep Duration & Quality', 'Fruit, Veg, Whole Grain', 'Processed Food', 'Sugary Drinks', 'Diet Quality Score', 'Smoking & Pack-Years', 'Alcohol Use & Freq', 'Stress Level'],
      description: 'Modifiable behavioral and dietary exposure factors.'
    },
    {
      id: 'clinical',
      name: 'Clinical Features',
      count: '7 features',
      items: ['BMI', 'Waist Circumference', 'Systolic Blood Pressure', 'Diastolic Blood Pressure', 'Diagnosed Hypertension', 'Total Cholesterol', 'Triglycerides'],
      description: 'Objective anthropometric and hemodynamic parameters.'
    }
  ];

  const interactionsList = [
    {
      id: 'prs_x_activity',
      name: 'PRS × Physical Activity',
      code: 'gxe_physical_activity',
      formula: 'prs_std * activity_std',
      description: 'Models how regular moderate/vigorous exercise counteracts elevated polygenic risk.'
    },
    {
      id: 'prs_x_sleep',
      name: 'PRS × Sleep Duration',
      code: 'gxe_sleep_duration',
      formula: 'prs_std * sleep_std',
      description: 'Models the synergistic effect of sleep duration and circadian disruption with polygenic liability.'
    },
    {
      id: 'prs_x_diet',
      name: 'PRS × Diet Quality',
      code: 'gxe_diet_quality',
      formula: 'prs_std * diet_std',
      description: 'Strongest protective interaction (β = -0.1549). Healthy diet strongly mitigates high PRS.'
    },
    {
      id: 'prs_x_bmi',
      name: 'PRS × BMI',
      code: 'gxe_bmi',
      formula: 'prs_std * bmi_std',
      description: 'Compound amplification: Obese individuals with high genetic risk exhibit compounded risk.'
    }
  ];

  const toggleGroup = (id) => {
    setSelectedGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const toggleInteraction = (id) => {
    setSelectedInteractions(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Preset Configurations
  const applyPreset = (presetType) => {
    if (presetType === 'E1') {
      setSelectedGroups(['demographics', 'lifestyle', 'clinical']);
      setSelectedInteractions([]);
    } else if (presetType === 'E2') {
      setSelectedGroups(['inherited', 'family_history']);
      setSelectedInteractions([]);
    } else if (presetType === 'E3') {
      setSelectedGroups(['demographics', 'inherited', 'family_history', 'lifestyle', 'clinical']);
      setSelectedInteractions([]);
    } else if (presetType === 'E5') {
      setSelectedGroups(['demographics', 'inherited', 'family_history', 'lifestyle', 'clinical']);
      setSelectedInteractions(['prs_x_activity', 'prs_x_sleep', 'prs_x_diet', 'prs_x_bmi']);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-600 text-xs font-bold uppercase tracking-wider">
              <Dna className="w-4 h-4" />
              <span>Project Novelty Component</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Interactive Feature Combination Explorer
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Dynamically select and configure feature groups and Gene-Environment (GxE) interaction terms to examine the research progression from E1 to E6.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-center">
            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'explorer' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Interactive Explorer
            </button>
            <button
              onClick={() => setActiveTab('experiments')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'experiments' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Experiment Comparison (E1–E6)
            </button>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500 mr-1">Load Research Presets:</span>
          <button
            onClick={() => applyPreset('E1')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
          >
            E1 (Lifestyle + Clinical)
          </button>
          <button
            onClick={() => applyPreset('E2')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
          >
            E2 (Genetics + Pedigree)
          </button>
          <button
            onClick={() => applyPreset('E3')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
          >
            E3 (Combined Baseline)
          </button>
          <button
            onClick={() => applyPreset('E5')}
            className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold border border-teal-200"
          >
            E5 Champion (All + 4 GxE Terms)
          </button>
        </div>
      </div>

      {activeTab === 'explorer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Selectors */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Feature Groups Selection Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  Select Feature Modalities ({selectedGroups.length}/5)
                </h3>
                <span className="text-xs text-slate-400">Click to toggle</span>
              </div>

              <div className="space-y-3">
                {featureGroupsList.map(group => {
                  const isSelected = selectedGroups.includes(group.id);
                  return (
                    <div
                      key={group.id}
                      onClick={() => toggleGroup(group.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-teal-500 bg-teal-50/40 shadow-sm' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-teal-600 flex-shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          )}
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{group.name}</span>
                            <span className="text-[11px] text-slate-500 block leading-tight">{group.description}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {group.count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gene-Environment (GxE) Interaction Terms Selection */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Gene-Environment (GxE) Interaction Terms ({selectedInteractions.length}/4)
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Novel Feature
                </span>
              </div>

              <div className="space-y-3">
                {interactionsList.map(item => {
                  const isSelected = selectedInteractions.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleInteraction(item.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-teal-500 bg-teal-50/40 shadow-sm' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-teal-600 flex-shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          )}
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-900">{item.name}</span>
                              <code className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1 rounded">{item.formula}</code>
                            </div>
                            <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">{item.description}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Status & Evaluation */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Real-Time Mapping Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Configuration Analysis
                </span>
                {explorerData?.matched_experiment ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                    Matches {explorerData.matched_experiment}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Exploratory Subset
                  </span>
                )}
              </div>

              {/* Status Message */}
              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                explorerData?.is_supported_for_live_prediction
                  ? 'bg-teal-50 border-teal-200 text-teal-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center space-x-1.5 font-bold mb-1">
                  {explorerData?.is_supported_for_live_prediction ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>Validated Live Pipeline Active</span>
                    </>
                  ) : (
                    <>
                      <Info className="w-4 h-4 text-slate-500" />
                      <span>Research Exploration Status</span>
                    </>
                  )}
                </div>
                <p>{explorerData?.message}</p>
              </div>

              {/* Selected Configuration Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Modalities</span>
                  <span className="text-lg font-bold text-slate-900 font-mono mt-0.5 block">
                    {selectedGroups.length} of 5
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">GxE Interactions</span>
                  <span className="text-lg font-bold text-teal-700 font-mono mt-0.5 block">
                    {selectedInteractions.length} of 4
                  </span>
                </div>
              </div>

              {/* Matched Experiment Historical Benchmark */}
              {explorerData?.experiment_data && (
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <span className="text-xs font-bold text-slate-800 block">
                    Historical Benchmark ({explorerData.matched_experiment}):
                  </span>
                  
                  <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Logistic Regression</span>
                      <span className="text-teal-300 font-bold">
                        AUC: {explorerData.experiment_data.models['Logistic Regression'].test_auc}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div>Val AUC: {explorerData.experiment_data.models['Logistic Regression'].val_auc}</div>
                      <div>Test PR-AUC: {explorerData.experiment_data.models['Logistic Regression'].test_pr}</div>
                      <div>Test Brier: {explorerData.experiment_data.models['Logistic Regression'].test_brier}</div>
                      <div>Threshold: {explorerData.experiment_data.models['Logistic Regression'].threshold}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Critical Rule Academic Notice */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 space-y-1">
                <span className="font-bold block">Rigorous ML Methodology Rule:</span>
                <p className="leading-tight text-amber-800">
                  Arbitrary feature subsets cannot produce live predictions without their own retraining and calibration. Predictions are strictly generated using the fully validated E5 Champion model pipeline.
                </p>
              </div>

              {explorerData?.is_supported_for_live_prediction && (
                <button
                  onClick={() => { setActivePage('assessment'); window.scrollTo(0,0); }}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5"
                >
                  <span>Launch Live Assessment with E5</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Full Experiment Comparison E1-E6 */}
      {activeTab === 'experiments' && allExperiments && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Comparative Analysis Across Research Experiments E1 to E6
            </h3>
            <p className="text-xs text-slate-500">
              Select an experiment to inspect its specific feature configuration, baseline constraints, and exact performance across all 5 benchmarked machine learning model families.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {['E1', 'E2', 'E3', 'E4', 'E5', 'E6'].map(code => (
                <button
                  key={code}
                  onClick={() => setSelectedExpToCompare(code)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedExpToCompare === code
                      ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {code} {code === 'E5' ? '★ Champion' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Experiment Detail Card */}
          {selectedExpToCompare !== 'E6' ? (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-teal-600 uppercase">Experiment Specification</span>
                <h2 className="text-xl font-bold text-slate-900">
                  {allExperiments[selectedExpToCompare]?.name}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  {allExperiments[selectedExpToCompare]?.description}
                </p>
              </div>

              {/* Models Comparison Table for Selected Experiment */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Model Family</th>
                      <th className="py-3 px-3">Val ROC-AUC</th>
                      <th className="py-3 px-3">Val PR-AUC</th>
                      <th className="py-3 px-3">Val Brier</th>
                      <th className="py-3 px-3">Optimal Threshold</th>
                      <th className="py-3 px-3 text-teal-700 font-bold">Test ROC-AUC</th>
                      <th className="py-3 px-3 text-teal-700 font-bold">Test PR-AUC</th>
                      <th className="py-3 px-3 text-teal-700 font-bold">Test Brier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {Object.entries(allExperiments[selectedExpToCompare]?.models || {}).map(([mName, mMetrics]) => (
                      <tr key={mName} className={`hover:bg-slate-50/80 ${mName === 'Logistic Regression' && selectedExpToCompare === 'E5' ? 'bg-teal-50/50 font-bold text-teal-900' : ''}`}>
                        <td className="py-3 px-4 font-sans font-semibold text-slate-900 flex items-center space-x-1.5">
                          <span>{mName}</span>
                          {mName === 'Logistic Regression' && selectedExpToCompare === 'E5' && (
                            <span className="text-[10px] bg-teal-200 text-teal-900 px-1.5 py-0.2 rounded font-bold font-sans">Champion</span>
                          )}
                        </td>
                        <td className="py-3 px-3">{mMetrics.val_auc}</td>
                        <td className="py-3 px-3">{mMetrics.val_pr}</td>
                        <td className="py-3 px-3">{mMetrics.val_brier}</td>
                        <td className="py-3 px-3 text-slate-600">{mMetrics.threshold}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{mMetrics.test_auc}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{mMetrics.test_pr}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{mMetrics.test_brier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* E6 Bootstrapping & Champion Details */
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-teal-600 uppercase">Statistical Hypothesis Testing</span>
                <h2 className="text-xl font-bold text-slate-900">
                  Experiment 6: Statistical Comparison &amp; Champion Selection
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  {allExperiments['E6']?.description}
                </p>
              </div>

              {/* Bootstrapping Card */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Bootstrapped Difference</span>
                  <span className="text-xl font-bold text-teal-700 font-mono block mt-1">+0.0045 AUC</span>
                  <p className="text-[11px] text-slate-500 mt-1">E5 ROC-AUC vs E4 ROC-AUC (1,000 resamples)</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">95% Confidence Interval</span>
                  <span className="text-xl font-bold text-slate-800 font-mono block mt-1">[-0.0006, 0.0094]</span>
                  <p className="text-[11px] text-slate-500 mt-1">Empirical percentile interval</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Empirical Significance</span>
                  <span className="text-xl font-bold text-emerald-700 font-mono block mt-1">p = 0.0410</span>
                  <p className="text-[11px] text-slate-500 mt-1">Statistically significant (p &lt; 0.05)</p>
                </div>
              </div>

              {/* Subgroup Analysis */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Subgroup Discrimination on Independent Test Set (N=1,050)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 block text-xs">By Biological Sex</span>
                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span>Male (N=503):</span>
                        <strong className="text-teal-700">AUC: 0.8257</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Female (N=547):</span>
                        <strong className="text-teal-700">AUC: 0.7529</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 block text-xs">By Genetic Strata</span>
                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span>High PRS (N=250):</span>
                        <strong className="text-teal-700">AUC: 0.7701</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Medium PRS (N=535):</span>
                        <strong className="text-teal-700">AUC: 0.7510</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Low PRS (N=265):</span>
                        <strong className="text-teal-700">AUC: 0.7769</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 block text-xs">By Age Strata</span>
                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span>&lt;30 yrs (N=127):</span>
                        <strong className="text-teal-700">AUC: 0.8230</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>30-45 yrs (N=361):</span>
                        <strong className="text-teal-700">AUC: 0.7339</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>46-60 yrs (N=396):</span>
                        <strong className="text-teal-700">AUC: 0.7411</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>60+ yrs (N=166):</span>
                        <strong className="text-teal-700">AUC: 0.7770</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

