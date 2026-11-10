import React, { useState, useEffect } from 'react';
import { 
  Sliders, User, Dna, Activity, HeartPulse, Sparkles, AlertCircle, 
  RotateCcw, ArrowRight, ArrowLeft, CheckCircle2, Info, ChevronRight, Bookmark
} from 'lucide-react';
import { submitRiskAssessment, fetchDatasetStats } from '../services/api';

export default function RiskAssessmentPage({ setActivePage, setPredictionResult }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [sampleProfiles, setSampleProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState('');

  // Default initial form state
  const defaultForm = {
    // Demographics
    age: 45,
    sex: "Male",
    race_ethnicity: "South Asian",
    education_level: "Undergraduate",
    income_level: "Middle",

    // Inherited & Family
    t2d_prs: 0.15,
    prs_percentile: 52.0,
    genetic_risk_category: "Medium",
    mother_diabetes: 0,
    father_diabetes: 0,
    sibling_diabetes: 0,
    grandparent_diabetes: 0,
    family_diabetes_history: 0,
    num_affected_relatives: 0,
    family_history_score: 0.0,

    // Lifestyle
    physical_activity_minutes_week: 150,
    moderate_activity_days: 3,
    vigorous_activity_days: 1,
    sedentary_hours_day: 6.5,
    sleep_duration_hours: 7.0,
    sleep_quality_score: 70,
    fruit_intake: 2.0,
    vegetable_intake: 3.0,
    whole_grain_intake: 2.0,
    processed_food_frequency: 2,
    sugary_drink_frequency: 1,
    diet_quality_score: 60,
    smoking_status: "Never",
    smoking_pack_years: 0.0,
    alcohol_use: 1,
    alcohol_frequency: "Social",
    stress_level: 45,

    // Clinical
    bmi: 26.5,
    waist_circumference: 86.0,
    systolic_bp: 122,
    diastolic_bp: 78,
    hypertension: 0,
    cholesterol: 195.0,
    triglycerides: 140.0
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    fetchDatasetStats().then(stats => {
      if (stats && stats.sample_profiles) {
        setSampleProfiles(stats.sample_profiles);
      }
    }).catch(err => console.warn('Could not load sample profiles:', err));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Automatic synchronization of pedigree helper fields
      if (['mother_diabetes', 'father_diabetes', 'sibling_diabetes', 'grandparent_diabetes'].includes(field)) {
        const m = field === 'mother_diabetes' ? Number(value) : prev.mother_diabetes;
        const f = field === 'father_diabetes' ? Number(value) : prev.father_diabetes;
        const s = field === 'sibling_diabetes' ? Number(value) : prev.sibling_diabetes;
        const g = field === 'grandparent_diabetes' ? Number(value) : prev.grandparent_diabetes;

        const totalAffected = m + f + s + g;
        updated.num_affected_relatives = totalAffected;
        updated.family_diabetes_history = totalAffected > 0 ? 1 : 0;
        updated.family_history_score = (m * 1.0) + (f * 1.0) + (s * 1.0) + (g * 0.5);
      }

      // Automatic sync of PRS percentile to category if adjusted
      if (field === 'prs_percentile') {
        const p = Number(value);
        if (p < 20) updated.genetic_risk_category = 'Low';
        else if (p > 80) updated.genetic_risk_category = 'High';
        else updated.genetic_risk_category = 'Medium';
      }

      return updated;
    });
  };

  const handleLoadProfile = (profileId) => {
    setSelectedProfileId(profileId);
    const profile = sampleProfiles.find(p => p.id === profileId);
    if (profile) {
      setFormData(profile.data);
      setErrorMsg(null);
    }
  };

  const handleReset = () => {
    setFormData(defaultForm);
    setSelectedProfileId('');
    setErrorMsg(null);
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const result = await submitRiskAssessment(formData);
      setPredictionResult({
        ...result,
        inputSnapshot: formData
      });
      setActivePage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission failed:', err);
      setErrorMsg(err.message || 'Failed to generate risk estimate from backend.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: "Demographics", icon: User },
    { num: 2, title: "Genetics & Pedigree", icon: Dna },
    { num: 3, title: "Lifestyle Factors", icon: Activity },
    { num: 4, title: "Clinical Parameters", icon: HeartPulse },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Header & Preset Profile Bar */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-teal-600 text-xs font-bold uppercase tracking-wider">
              <Sliders className="w-4 h-4" />
              <span>Multi-Modal Risk Assessment</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Patient Assessment Form
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Captures all validated predictor features required by the E5 Champion ML Model. Non-predictor columns (participant IDs, diagnosis dates) are excluded.
            </p>
          </div>

          {/* Quick Preset Selector for Review III Evaluators */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 sm:w-72 flex-shrink-0">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-1.5">
              <Bookmark className="w-3.5 h-3.5 text-teal-600" />
              <span>Load Evaluator Preset:</span>
            </div>
            <select
              value={selectedProfileId}
              onChange={(e) => handleLoadProfile(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="">-- Choose a test persona --</option>
              {sampleProfiles.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {selectedProfileId && (
              <p className="text-[10px] text-teal-700 mt-1.5 font-medium leading-tight">
                {sampleProfiles.find(p => p.id === selectedProfileId)?.description}
              </p>
            )}
          </div>
        </div>

        {/* Step Progress Indicator */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {steps.map(s => {
            const Icon = s.icon;
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`flex flex-col sm:flex-row items-center sm:space-x-3 p-3 rounded-xl border text-left transition-all ${
                  isCurrent 
                    ? 'border-teal-500 bg-teal-50/50 shadow-sm' 
                    : isDone
                    ? 'border-slate-300 bg-slate-50/50 hover:bg-slate-100'
                    : 'border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isCurrent ? 'bg-teal-600 text-white' : isDone ? 'bg-navy-800 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <div className="mt-1 sm:mt-0 text-center sm:text-left">
                  <span className="text-[10px] uppercase font-semibold text-slate-600 block">Step 0{s.num}</span>
                  <span className="text-xs font-bold text-slate-800 block truncate">{s.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Error Banner */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 flex items-start space-x-3">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Prediction Generation Error:</span>
            <p>{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Multi-Section Form Body */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
        
        {/* STEP 1: DEMOGRAPHICS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-slate-900">Section A: Demographic Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Age */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {formData.age} years
                  </span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="90"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>18 yrs</span>
                  <span>50 yrs</span>
                  <span>90 yrs</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Type-2 diabetes incidence rises non-linearly with age due to chronic metabolic stress.
                </p>
              </div>

              {/* Sex */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Biological Sex <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Male', 'Female'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleInputChange('sex', s)}
                      className={`p-2.5 rounded-lg text-xs font-bold border transition-all ${
                        formData.sex === s 
                          ? 'bg-navy-900 text-white border-navy-900 shadow-sm' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500">
                  Recorded baseline biological sex (Cohort: 50.3% Male, 49.7% Female).
                </p>
              </div>

              {/* Race / Ethnicity */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Race / Ethnicity <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.race_ethnicity}
                  onChange={(e) => handleInputChange('race_ethnicity', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500"
                >
                  <option value="South Asian">South Asian (High Predisposition)</option>
                  <option value="White">White</option>
                  <option value="East Asian">East Asian</option>
                  <option value="Black">Black</option>
                  <option value="Hispanic">Hispanic</option>
                  <option value="Other">Other</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Certain ethnic groups experience diabetes onset at lower average BMI thresholds.
                </p>
              </div>

              {/* Education Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Education Level <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.education_level}
                  onChange={(e) => handleInputChange('education_level', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Primary or below">Primary or below</option>
                  <option value="Secondary">Secondary</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Ordinal socioeconomic determinant encoded using hierarchical mapping.
                </p>
              </div>

              {/* Income Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Household Income Tier <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.income_level}
                  onChange={(e) => handleInputChange('income_level', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Low">Low Income</option>
                  <option value="Middle">Middle Income</option>
                  <option value="High">High Income</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Socioeconomic health proxy factor.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: INHERITED SUSCEPTIBILITY & FAMILY HISTORY */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Dna className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-slate-900">Section B: Inherited Susceptibility &amp; Pedigree</h2>
            </div>

            {/* Scientific Distinction Notice */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs text-sky-900 flex items-start space-x-3">
              <Info className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Genomic Clarification:</span> Synthetic PRS (Polygenic Risk Score) represents an experimental normalized distribution of common genetic variant risk. <strong className="underline">Family history is an observational pedigree proxy, not genomic data</strong>.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Synthetic PRS Z-score */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Synthetic PRS (Z-Score) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {Number(formData.t2d_prs).toFixed(2)} SD
                  </span>
                </div>
                <input
                  type="range"
                  min="-3.5"
                  max="3.5"
                  step="0.05"
                  value={formData.t2d_prs}
                  onChange={(e) => {
                    const z = Number(e.target.value);
                    handleInputChange('t2d_prs', z);
                  }}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>-3.5 (Lowest)</span>
                  <span>0.0 (Average)</span>
                  <span>+3.5 (Highest)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Standardized liability scale (Mean 0, SD 1). Values &gt; 1.0 indicate top ~15% genetic predisposition.
                </p>
              </div>

              {/* PRS Population Percentile */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    PRS Population Percentile <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {Number(formData.prs_percentile).toFixed(1)}% ({formData.genetic_risk_category})
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="99.9"
                  step="0.5"
                  value={formData.prs_percentile}
                  onChange={(e) => handleInputChange('prs_percentile', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.1%</span>
                  <span>50%</span>
                  <span>99.9%</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Rank against the 7,000 synthetic cohort: &lt;20% Low, 20-80% Medium, &gt;80% High.
                </p>
              </div>

            </div>

            {/* Pedigree Relatives Checklist */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-800 block">
                Pedigree History: Affected Biological Relatives
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { field: 'mother_diabetes', label: 'Mother' },
                  { field: 'father_diabetes', label: 'Father' },
                  { field: 'sibling_diabetes', label: 'Sibling' },
                  { field: 'grandparent_diabetes', label: 'Grandparent' },
                ].map(item => (
                  <button
                    key={item.field}
                    type="button"
                    onClick={() => handleInputChange(item.field, formData[item.field] === 1 ? 0 : 1)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                      formData[item.field] === 1
                        ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                      formData[item.field] === 1 ? 'bg-teal-400 text-navy-950 font-black' : 'bg-slate-300'
                    }`}>
                      {formData[item.field] === 1 ? '✓' : ''}
                    </span>
                  </button>
                ))}
              </div>

              {/* Calculated Family Metrics Display */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="text-lg font-bold text-slate-800 font-mono">{formData.num_affected_relatives}</span>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Total Affected</p>
                </div>
                <div>
                  <span className="text-lg font-bold text-slate-800 font-mono">{formData.family_history_score.toFixed(1)}</span>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Weighted Score</p>
                </div>
                <div>
                  <span className="text-lg font-bold text-teal-700 font-mono">
                    {formData.family_diabetes_history === 1 ? 'Yes' : 'None'}
                  </span>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Family History</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: LIFESTYLE INFORMATION */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Activity className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-slate-900">Section C: Modifiable Lifestyle Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Physical Activity Minutes / Week */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Physical Activity <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {formData.physical_activity_minutes_week} min/week
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="10"
                  value={formData.physical_activity_minutes_week}
                  onChange={(e) => handleInputChange('physical_activity_minutes_week', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0 min</span>
                  <span>150 min (WHO Target)</span>
                  <span>600 min</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Moderate-to-vigorous exercise enhances skeletal muscle GLUT4 glucose translocation.
                </p>
              </div>

              {/* Diet Quality Score */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Diet Quality Score <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {formData.diet_quality_score} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={formData.diet_quality_score}
                  onChange={(e) => handleInputChange('diet_quality_score', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>10 (Poor)</span>
                  <span>55 (Average)</span>
                  <span>100 (Optimal)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Composite score reflecting fiber, antioxidant, and unprocessed nutrient density.
                </p>
              </div>

              {/* Sleep Duration */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Sleep Duration <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {Number(formData.sleep_duration_hours).toFixed(1)} hrs/night
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={formData.sleep_duration_hours}
                  onChange={(e) => handleInputChange('sleep_duration_hours', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>4.0h</span>
                  <span>7.5h (Optimal)</span>
                  <span>12.0h</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Chronic sleep deprivation (&lt;6h) elevates nocturnal cortisol and impairs insulin sensitivity.
                </p>
              </div>

              {/* Sedentary Hours Day */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Sedentary Hours <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {Number(formData.sedentary_hours_day).toFixed(1)} hrs/day
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  step="0.5"
                  value={formData.sedentary_hours_day}
                  onChange={(e) => handleInputChange('sedentary_hours_day', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1h</span>
                  <span>7h (Average)</span>
                  <span>16h</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Used in the E4 Sleep-to-Sedentary Ratio engineered index.
                </p>
              </div>

              {/* Sugary Drink Frequency */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Sugary Drinks / Day</label>
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {formData.sugary_drink_frequency} drinks
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={formData.sugary_drink_frequency}
                  onChange={(e) => handleInputChange('sugary_drink_frequency', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              {/* Processed Food Frequency */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Ultra-Processed Meals / Day</label>
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {formData.processed_food_frequency} meals
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="7"
                  value={formData.processed_food_frequency}
                  onChange={(e) => handleInputChange('processed_food_frequency', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              {/* Smoking Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Smoking Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Never', 'Former', 'Current'].map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleInputChange('smoking_status', status)}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                        formData.smoking_status === status
                          ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stress Level */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Perceived Stress Index</label>
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {formData.stress_level} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.stress_level}
                  onChange={(e) => handleInputChange('stress_level', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

            </div>
          </div>
        )}

        {/* STEP 4: CLINICAL INFORMATION */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <HeartPulse className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-slate-900">Section D: Clinical &amp; Anthropometric Parameters</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* BMI */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Body Mass Index (BMI) <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    formData.bmi >= 30 ? 'bg-rose-100 text-rose-800' :
                    formData.bmi >= 25 ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {Number(formData.bmi).toFixed(1)} kg/m²
                  </span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="48"
                  step="0.1"
                  value={formData.bmi}
                  onChange={(e) => handleInputChange('bmi', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>18.5 (Normal)</span>
                  <span>25.0 (Overweight)</span>
                  <span>30.0 (Obese)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Primary clinical risk factor; heavily interacts with genetic PRS (GxE BMI term).
                </p>
              </div>

              {/* Waist Circumference */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Waist Circumference <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {Number(formData.waist_circumference).toFixed(1)} cm
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  step="0.5"
                  value={formData.waist_circumference}
                  onChange={(e) => handleInputChange('waist_circumference', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>60 cm</span>
                  <span>90 cm</span>
                  <span>140 cm</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Direct proxy of visceral adiposity and ectopic liver fat deposition.
                </p>
              </div>

              {/* Systolic BP */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Systolic Blood Pressure <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {formData.systolic_bp} mmHg
                  </span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="190"
                  value={formData.systolic_bp}
                  onChange={(e) => handleInputChange('systolic_bp', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>90 mmHg</span>
                  <span>120 mmHg (Normal)</span>
                  <span>190 mmHg</span>
                </div>
              </div>

              {/* Diastolic BP */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Diastolic Blood Pressure <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {formData.diastolic_bp} mmHg
                  </span>
                </div>
                <input
                  type="range"
                  min="55"
                  max="120"
                  value={formData.diastolic_bp}
                  onChange={(e) => handleInputChange('diastolic_bp', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>55 mmHg</span>
                  <span>80 mmHg (Normal)</span>
                  <span>120 mmHg</span>
                </div>
              </div>

              {/* Total Cholesterol */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Total Serum Cholesterol</label>
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {Number(formData.cholesterol).toFixed(0)} mg/dL
                  </span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="320"
                  value={formData.cholesterol}
                  onChange={(e) => handleInputChange('cholesterol', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              {/* Triglycerides */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Serum Triglycerides</label>
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {Number(formData.triglycerides).toFixed(0)} mg/dL
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="400"
                  value={formData.triglycerides}
                  onChange={(e) => handleInputChange('triglycerides', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <p className="text-[11px] text-slate-500">
                  Hypertriglyceridemia strongly reflects underlying hepatic insulin resistance.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Navigation & Submission Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div>
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 active:scale-95 transition-all shadow-sm"
              >
                <span>Continue to Step 0{currentStep + 1}</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 disabled:opacity-50 transition-all shadow-md shadow-teal-600/30"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing E5 ML Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Risk Prediction</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}

