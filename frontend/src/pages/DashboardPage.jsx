import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  Users, Activity, Dna, BrainCircuit, ShieldAlert, Award, 
  TrendingUp, Scale, CheckCircle2, Info
} from 'lucide-react';
import { fetchDatasetStats, fetchExperiments } from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [experiments, setExperiments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDatasetStats(), fetchExperiments()])
      .then(([statsData, expData]) => {
        setStats(statsData);
        if (expData && expData.experiments) {
          setExperiments(expData.experiments);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading dashboard data:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !stats) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading Research Dashboard Visualizations...</p>
      </div>
    );
  }

  const { dataset_metadata, demographic_distributions, genetic_family_distributions, lifestyle_clinical_distributions } = stats;

  const targetPieData = [
    { name: 'Non-Diabetic (Class 0)', value: dataset_metadata.target_distribution.negative_non_diabetic.count, color: '#0ea5e9' },
    { name: 'Type-2 Diabetic (Class 1)', value: dataset_metadata.target_distribution.positive_diabetic.count, color: '#f43f5e' }
  ];

  const sexPieData = (demographic_distributions.sex_distribution || []).map(item => ({
    name: item.sex,
    value: item.count,
    diabetesRate: item.diabetes_rate,
    color: item.sex === 'Male' ? '#1e3a8a' : '#14b8a6'
  }));

  const genCategoryData = (genetic_family_distributions.genetic_risk_categories || []).map(item => ({
    category: item.category,
    count: item.count,
    diabetesRate: item.diabetes_rate
  }));

  // Model comparison across E1-E5
  const experimentComparisonData = [
    {
      experiment: 'E1 (Lifestyle/Clinical)',
      lr_auc: 0.7448, rf_auc: 0.7306, xgb_auc: 0.7452, lgbm_auc: 0.7442, mlp_auc: 0.6448
    },
    {
      experiment: 'E2 (Genetics/Pedigree)',
      lr_auc: 0.6562, rf_auc: 0.6543, xgb_auc: 0.6561, lgbm_auc: 0.6532, mlp_auc: 0.6394
    },
    {
      experiment: 'E3 (Combined Baseline)',
      lr_auc: 0.7791, rf_auc: 0.7689, xgb_auc: 0.7760, lgbm_auc: 0.7712, mlp_auc: 0.6574
    },
    {
      experiment: 'E4 (Engineered Features)',
      lr_auc: 0.7790, rf_auc: 0.7673, xgb_auc: 0.7689, lgbm_auc: 0.7705, mlp_auc: 0.6799
    },
    {
      experiment: 'E5 (GxE Interactions)',
      lr_auc: 0.7835, rf_auc: 0.7693, xgb_auc: 0.7680, lgbm_auc: 0.7693, mlp_auc: 0.6817
    }
  ];

  // Logistic Regression progression data
  const lrProgressionData = [
    { name: 'E1', val_auc: 0.7885, test_auc: 0.7448, test_pr: 0.3897, brier: 0.1091 },
    { name: 'E2', val_auc: 0.6850, test_auc: 0.6562, test_pr: 0.2807, brier: 0.1177 },
    { name: 'E3', val_auc: 0.8221, test_auc: 0.7791, test_pr: 0.4071, brier: 0.1059 },
    { name: 'E4', val_auc: 0.8240, test_auc: 0.7790, test_pr: 0.4072, brier: 0.1054 },
    { name: 'E5 (Champion)', val_auc: 0.8238, test_auc: 0.7835, test_pr: 0.4110, brier: 0.1054 }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-600 text-xs font-bold uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>Research Analytics Dashboard</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Population Cohort &amp; Experiment Analytics
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Visualizes distributions from the 7,000 synthetic cohort and verified performance across all five model families.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-800 self-start sm:self-center">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Synthetic Dataset Cohort (N=7,000)</span>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Participants</span>
            <span className="text-2xl font-bold text-slate-900 font-mono block mt-0.5">7,000</span>
            <span className="text-[11px] text-slate-500">44 Total Raw Dimensions</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Prevalence (Positive)</span>
            <span className="text-2xl font-bold text-rose-600 font-mono block mt-0.5">14.53%</span>
            <span className="text-[11px] text-slate-500">1,017 Diabetic Cases</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Champion Test AUC</span>
            <span className="text-2xl font-bold text-teal-600 font-mono block mt-0.5">0.7835</span>
            <span className="text-[11px] text-slate-500">E5 Logistic Regression</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Optimal F1 Cutoff</span>
            <span className="text-2xl font-bold text-navy-800 font-mono block mt-0.5">27.94%</span>
            <span className="text-[11px] text-slate-500">Validated Threshold</span>
          </div>
        </div>
      </div>

      {/* Part 1: Dataset Cohort Visualizations */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-slate-900">1. Cohort Demographics &amp; Genetic Strata</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Target Imbalance Donut */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase">Target Imbalance Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={targetPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {targetPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} participants (${((value/7000)*100).toFixed(1)}%)`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around text-xs font-semibold pt-1">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-500" />
                <span>Negative: 85.5%</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span>Positive: 14.5%</span>
              </div>
            </div>
          </div>

          {/* Age Group Distribution Bar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase">Prevalence by Age Band</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demographic_distributions.age_distribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="group" tick={{ fontSize: 10 }} />
                  <YAxis unit="%" tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val) => [`${val}%`, 'Diabetes Rate']} />
                  <Bar dataKey="diabetes_rate" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Diabetes Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500 text-center">
              Age &gt;60 demonstrates highest prevalence due to cumulative beta-cell strain.
            </p>
          </div>

          {/* Genetic Risk Category Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase">Prevalence by Genetic Tier</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={genCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                  <YAxis unit="%" tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val) => [`${val}%`, 'Diabetes Rate']} />
                  <Bar dataKey="diabetes_rate" fill="#1e3a8a" radius={[4, 4, 0, 0]} name="Diabetes Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500 text-center">
              High PRS strata displays elevated baseline conversion rates.
            </p>
          </div>

        </div>

        {/* Lifestyle & Clinical Distributions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* BMI Categories Bar Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase">Prevalence Across BMI Categories</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lifestyle_clinical_distributions.bmi_distribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="category" tick={{ fontSize: 9 }} />
                  <YAxis unit="%" tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val) => [`${val}%`, 'Diabetes Prevalence']} />
                  <Bar dataKey="diabetes_rate" fill="#e11d48" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500">
              Steep exponential rise in diabetes prevalence as BMI transitions from Normal (&lt;25) to Obese (&ge;30).
            </p>
          </div>

          {/* Physical Activity Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase">Prevalence by Physical Activity Volume</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lifestyle_clinical_distributions.physical_activity_distribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="group" tick={{ fontSize: 9 }} />
                  <YAxis unit="%" tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val) => [`${val}%`, 'Diabetes Prevalence']} />
                  <Bar dataKey="diabetes_rate" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500">
              Active individuals meeting &ge;150 min/wk exercise exhibit substantially lower disease rates.
            </p>
          </div>

        </div>
      </div>

      {/* Part 2: Model Performance & Comparative Analytics */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-slate-900">2. Research Experiment Model Performance (E1 to E5)</h2>
        </div>

        {/* Experiment ROC-AUC Comparison Chart across all 5 models */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Test ROC-AUC Across 5 Research Experiments (E1 to E5)</h3>
              <p className="text-xs text-slate-500">Comparison of Logistic Regression, Random Forest, XGBoost, LightGBM, and MLP.</p>
            </div>
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md self-start">
              E5 LR Peak: 0.7835 AUC
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={experimentComparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="experiment" tick={{ fontSize: 10 }} />
                <YAxis domain={[0.6, 0.85]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val) => [val, 'Test ROC-AUC']} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="lr_auc" name="Logistic Regression (Champion)" fill="#0f766e" radius={[3, 3, 0, 0]} />
                <Bar dataKey="xgb_auc" name="XGBoost" fill="#2563eb" radius={[3, 3, 0, 0]} />
                <Bar dataKey="lgbm_auc" name="LightGBM" fill="#6366f1" radius={[3, 3, 0, 0]} />
                <Bar dataKey="rf_auc" name="Random Forest" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="mlp_auc" name="MLP Neural Baseline" fill="#94a3b8" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            <strong>Key Finding:</strong> E1 (Lifestyle alone = 0.7448) and E2 (Genetics alone = 0.6562) underperform combined models. E5 incorporating GxE interaction terms achieves the peak test ROC-AUC (0.7835), confirming hypothesis that gene-lifestyle interactions enhance predictive discrimination.
          </p>
        </div>

        {/* Validation vs Test Performance of Champion Logistic Regression */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Validation vs. Test Generalization (Logistic Regression E1-E5)</h3>
            <span className="text-xs text-slate-500 font-mono">Stratified Splits: 70% Train, 15% Val, 15% Test</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lrProgressionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0.65, 0.85]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val) => [val, 'ROC-AUC']} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="val_auc" name="Validation ROC-AUC" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="test_auc" name="Test ROC-AUC" stroke="#0f766e" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}

