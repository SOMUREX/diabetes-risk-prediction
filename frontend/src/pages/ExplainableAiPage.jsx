import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Layers, Info, TrendingUp, TrendingDown, 
  HelpCircle, ShieldCheck, CheckCircle2, Filter
} from 'lucide-react';
import { fetchShapSummary } from '../services/api';

export default function ExplainableAiPage() {
  const [shapData, setShapData] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShapSummary().then(data => {
      setShapData(data);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load SHAP data:', err);
      setLoading(false);
    });
  }, []);

  if (loading || !shapData) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading SHAP Interpretability Analytics...</p>
      </div>
    );
  }

  const allFeatures = shapData.all_features || [];
  const categories = ['All', 'Clinical', 'Inherited & Family History', 'Lifestyle', 'Domain Engineered', 'Gene-Environment Interaction', 'Demographic'];

  const filteredFeatures = categoryFilter === 'All'
    ? allFeatures
    : allFeatures.filter(f => f.category === categoryFilter);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-teal-600 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Transparent Machine Learning</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Explainable AI (XAI) &amp; Global SHAP Analysis
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
          Based on the authoritative SHAP analysis implemented in <strong>Notebook Cell 47</strong> for the champion E5 Logistic Regression model. Quantifies exact global feature importance using Shapley Additive Explanations across the independent test cohort.
        </p>

        {/* Global vs Local Distinction Box */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs text-sky-900 space-y-1">
          <div className="flex items-center space-x-2 font-bold">
            <Info className="w-4 h-4 text-sky-600" />
            <span>Methodological Rule: Global Importance vs Individual Patient Explanation</span>
          </div>
          <p className="leading-relaxed">
            Global SHAP represents population-average absolute feature importance across all 1,050 test participants. It demonstrates how the model behaves in general. Conversely, individual patient predictions (on the Prediction Results page) decompose the patient's specific log-odds, showing how their personal BMI or PRS alters their risk.
          </p>
        </div>
      </div>

      {/* Domain Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold text-teal-700 block">Top Inherited Driver</span>
          <h3 className="text-sm font-bold text-slate-900">Polygenic Risk Score (PRS)</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Mean |SHAP| = 0.1338 (PRS percentile) and 0.1158 (PRS Z-score). High genetic susceptibility consistently shifts the baseline logit upward.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold text-teal-700 block">Top Clinical Driver</span>
          <h3 className="text-sm font-bold text-slate-900">BMI &amp; Visceral Adiposity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Mean |SHAP| = 0.3576 (highest across all features) and Obesity-Age Score = 0.2603. Adiposity represents the single strongest clinical hazard.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold text-teal-700 block">Top Interaction (GxE)</span>
          <h3 className="text-sm font-bold text-slate-900">PRS × Diet Quality</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Mean |SHAP| = 0.1050 (Coefficient = -0.1549). High diet quality provides a statistically significant protective buffer for individuals with high PRS.
          </p>
        </div>
      </div>

      {/* Global SHAP Feature Importance Table & Visualization */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Global Feature Importance Ranking (Mean |SHAP| Value)
            </h3>
            <span className="text-xs text-slate-400">Calculated on independent test set (N=1,050)</span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  categoryFilter === cat
                    ? 'bg-navy-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-3">
          {filteredFeatures.slice(0, 20).map((feat, idx) => {
            const maxShap = allFeatures[0]?.mean_abs_shap || 1;
            const barWidth = Math.min((feat.mean_abs_shap / maxShap) * 100, 100);
            return (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-slate-500 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 font-mono">{feat.feature}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                      {feat.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 font-mono text-[11px] self-end sm:self-auto">
                    <span className="text-slate-500">
                      Coef: <strong className={feat.coefficient > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                        {feat.coefficient > 0 ? `+${feat.coefficient.toFixed(4)}` : feat.coefficient.toFixed(4)}
                      </strong>
                    </span>
                    <span className="text-teal-800 font-bold">
                      Mean |SHAP|: {feat.mean_abs_shap.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* Visual Bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      feat.coefficient > 0 ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

