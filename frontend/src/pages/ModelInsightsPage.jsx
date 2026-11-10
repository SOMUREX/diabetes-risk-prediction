import React, { useState } from 'react';
import { 
  BrainCircuit, Award, Layers, CheckCircle2, ChevronRight, 
  Sparkles, FileText, BarChart, Info, ShieldCheck
} from 'lucide-react';

export default function ModelInsightsPage() {
  const [selectedExperiment, setSelectedExperiment] = useState('E5');

  const modelsList = [
    {
      id: 'lr',
      name: 'Logistic Regression',
      type: 'Linear / L2-Regularized Baseline (Champion)',
      badge: 'Selected Champion Model',
      badgeColor: 'teal',
      description: 'Generalized linear model with L2 penalty (Ridge). Selected as the overall project champion due to superior generalization on test data, excellent probability calibration, and direct coefficient interpretability.',
      role: 'Champion Prediction Engine. Evaluated across all experiments E1–E5; achieved the highest test ROC-AUC (0.7835) in E5 with GxE interactions.',
      hyperparameters: 'C = 0.01, penalty = "l2", solver = "lbfgs", max_iter = 1000',
      e5_metrics: {
        val_auc: '0.8238',
        val_pr: '0.4838',
        val_brier: '0.0984',
        threshold: '0.2794',
        test_auc: '0.7835',
        test_pr: '0.4110',
        test_brier: '0.1054'
      }
    },
    {
      id: 'rf',
      name: 'Random Forest',
      type: 'Ensemble Bagging Decision Trees',
      badge: 'Ensemble Tree Baseline',
      badgeColor: 'blue',
      description: 'Non-linear ensemble consisting of bootstrap-aggregated de-correlated decision trees with randomized feature sub-sampling at each split.',
      role: 'Captures non-linear feature threshold interactions in baseline raw spaces without requiring explicit interaction term creation.',
      hyperparameters: 'n_estimators = 100, max_depth = 5, min_samples_split = 2',
      e5_metrics: {
        val_auc: '0.8154',
        val_pr: '0.4629',
        val_brier: '0.1021',
        threshold: '0.2134',
        test_auc: '0.7693',
        test_pr: '0.3921',
        test_brier: '0.1070'
      }
    },
    {
      id: 'xgb',
      name: 'XGBoost',
      type: 'Extreme Gradient Boosting',
      badge: 'Gradient Boosted Trees',
      badgeColor: 'indigo',
      description: 'Second-order gradient boosted decision tree framework with exact greedy split search, shrinkage, and column subsampling.',
      role: 'Industry benchmark for tabular clinical risk prediction; systematically tunes learning rate and depth to minimize logloss.',
      hyperparameters: 'n_estimators = 100, max_depth = 3, learning_rate = 0.01, eval_metric = "logloss"',
      e5_metrics: {
        val_auc: '0.8160',
        val_pr: '0.4581',
        val_brier: '0.1017',
        threshold: '0.2208',
        test_auc: '0.7680',
        test_pr: '0.3775',
        test_brier: '0.1079'
      }
    },
    {
      id: 'lgbm',
      name: 'LightGBM',
      type: 'Fast Leaf-Wise Gradient Boosting',
      badge: 'Leaf-Wise Gradient Boosting',
      badgeColor: 'sky',
      description: 'Histogram-based gradient boosting decision tree with leaf-wise tree growth strategy and gradient-based one-side sampling (GOSS).',
      role: 'Evaluated for fast execution and high sensitivity to complex interactive features.',
      hyperparameters: 'n_estimators = 100, max_depth = 3, learning_rate = 0.01',
      e5_metrics: {
        val_auc: '0.8149',
        val_pr: '0.4595',
        val_brier: '0.1016',
        threshold: '0.2235',
        test_auc: '0.7693',
        test_pr: '0.3805',
        test_brier: '0.1077'
      }
    },
    {
      id: 'mlp',
      name: 'Multi-Layer Perceptron (MLP)',
      type: 'Deep Tabular Neural Baseline',
      badge: 'Neural Network Baseline',
      badgeColor: 'purple',
      description: 'Feed-forward artificial neural network architecture with fully connected hidden layers, ReLU activation functions, and Adam optimization.',
      role: 'Serves as the deep learning tabular baseline to evaluate representation learning on tabular health data without tree-based heuristics.',
      hyperparameters: 'hidden_layer_sizes = (64, 32), alpha = 0.001, learning_rate_init = 0.001, max_iter = 500',
      e5_metrics: {
        val_auc: '0.7215',
        val_pr: '0.3663',
        val_brier: '0.1507',
        threshold: '0.0001',
        test_auc: '0.6817',
        test_pr: '0.2959',
        test_brier: '0.1739'
      }
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-teal-600 text-xs font-bold uppercase tracking-wider">
          <BrainCircuit className="w-4 h-4" />
          <span>Machine Learning Architecture</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Five Evaluated Model Families &amp; Champion Selection
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
          Detailed inspection of the 5 candidate algorithms evaluated in the research notebook. Following empirical validation, <strong>Logistic Regression (E5)</strong> was established as the project champion due to superior test ROC-AUC (0.7835), superior PR-AUC (0.4110), lowest Brier score (0.1054), and direct clinical interpretability.
        </p>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {modelsList.map(m => (
          <div key={m.id} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-slate-900">{m.name}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    m.badgeColor === 'teal' ? 'bg-teal-100 text-teal-900 border border-teal-300' :
                    m.badgeColor === 'indigo' ? 'bg-indigo-100 text-indigo-900' :
                    m.badgeColor === 'blue' ? 'bg-blue-100 text-blue-900' :
                    m.badgeColor === 'sky' ? 'bg-sky-100 text-sky-900' :
                    'bg-purple-100 text-purple-900'
                  }`}>
                    {m.badge}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium block mt-0.5">{m.type}</span>
              </div>

              <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-700">
                Test ROC-AUC: <span className="text-teal-700">{m.e5_metrics.test_auc}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-700">Architectural Role:</span>
                <p className="text-slate-600 leading-relaxed">{m.role}</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-700">Best Tuned Hyperparameters:</span>
                <p className="font-mono text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  {m.hyperparameters}
                </p>
              </div>
            </div>

            {/* Performance Grid */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">E5 Experiment Metrics (Final Independent Test Set, N=1,050):</span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase font-semibold">Val ROC-AUC</span>
                  <span className="text-sm font-bold text-slate-800 font-mono mt-0.5 block">{m.e5_metrics.val_auc}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase font-semibold">Val PR-AUC</span>
                  <span className="text-sm font-bold text-slate-800 font-mono mt-0.5 block">{m.e5_metrics.val_pr}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase font-semibold">Optimal Cutoff</span>
                  <span className="text-sm font-bold text-slate-700 font-mono mt-0.5 block">{m.e5_metrics.threshold}</span>
                </div>
                <div className="p-2.5 bg-teal-50/50 rounded-xl border border-teal-200/60">
                  <span className="text-teal-700 block text-[9px] uppercase font-bold">Test ROC-AUC</span>
                  <span className="text-sm font-bold text-teal-800 font-mono mt-0.5 block">{m.e5_metrics.test_auc}</span>
                </div>
                <div className="p-2.5 bg-teal-50/50 rounded-xl border border-teal-200/60">
                  <span className="text-teal-700 block text-[9px] uppercase font-bold">Test PR-AUC</span>
                  <span className="text-sm font-bold text-teal-800 font-mono mt-0.5 block">{m.e5_metrics.test_pr}</span>
                </div>
                <div className="p-2.5 bg-teal-50/50 rounded-xl border border-teal-200/60">
                  <span className="text-teal-700 block text-[9px] uppercase font-bold">Test Brier</span>
                  <span className="text-sm font-bold text-teal-800 font-mono mt-0.5 block">{m.e5_metrics.test_brier}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Why Logistic Regression Won Champion Section */}
      <div className="bg-gradient-to-br from-navy-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 text-teal-300">
          <Award className="w-5 h-5" />
          <h3 className="text-base font-bold">Scientific Rationale: Why Did Logistic Regression Win?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-1.5">
            <h4 className="font-bold text-white text-sm">1. Explicit Interaction Modeling</h4>
            <p>
              Tree-based models search for step-function threshold interactions, which are sample-inefficient. In contrast, E5 explicitly standardizes continuous terms (<code className="text-teal-300 font-mono">PRS × Diet</code>, <code className="text-teal-300 font-mono">PRS × Activity</code>) allowing the linear classifier to capture smooth biological synergies directly.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-bold text-white text-sm">2. Stronger Regularization &amp; Generalization</h4>
            <p>
              With L2 penalty (C = 0.01), Logistic Regression effectively prevented overfitting on the 57 transformed dimensions, resulting in minimal generalization drop from validation (0.8238) to test set (0.7835).
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-bold text-white text-sm">3. Direct Clinical Interpretability</h4>
            <p>
              In healthcare applications, black-box predictions carry clinical hesitation. Logistic Regression provides exact analytical log-odds decompositions for every single patient without heuristic approximations.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

