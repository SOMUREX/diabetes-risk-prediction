import React, { useState, useEffect } from 'react';
import { 
  Sliders, ArrowRight, RotateCcw, AlertCircle, Sparkles, 
  TrendingDown, TrendingUp, ShieldAlert, CheckCircle2, UserCheck
} from 'lucide-react';
import { submitWhatIfSimulation, fetchDatasetStats } from '../services/api';
import CircularGauge from '../components/CircularGauge';

export default function WhatIfPage({ whatIfBaseline, setWhatIfBaseline }) {
  const [baselineData, setBaselineData] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sampleProfiles, setSampleProfiles] = useState([]);

  // Modifiable inputs state
  const [activity, setActivity] = useState(150);
  const [sleep, setSleep] = useState(7.0);
  const [diet, setDiet] = useState(55);
  const [bmi, setBmi] = useState(27.0);

  useEffect(() => {
    fetchDatasetStats().then(stats => {
      if (stats && stats.sample_profiles) {
        setSampleProfiles(stats.sample_profiles);
        // Default to High Risk profile if no baseline provided
        if (!whatIfBaseline) {
          const highRisk = stats.sample_profiles[1]?.data;
          if (highRisk) {
            setBaselineData(highRisk);
            setActivity(highRisk.physical_activity_minutes_week || 30);
            setSleep(highRisk.sleep_duration_hours || 5.5);
            setDiet(highRisk.diet_quality_score || 32);
            setBmi(highRisk.bmi || 34.2);
          }
        } else {
          setBaselineData(whatIfBaseline);
          setActivity(whatIfBaseline.physical_activity_minutes_week || 150);
          setSleep(whatIfBaseline.sleep_duration_hours || 7.0);
          setDiet(whatIfBaseline.diet_quality_score || 55);
          setBmi(whatIfBaseline.bmi || 26.5);
        }
      }
    });
  }, [whatIfBaseline]);

  // Run simulation whenever sliders move
  useEffect(() => {
    if (!baselineData) return;

    const modifications = {
      physical_activity_minutes_week: Number(activity),
      sleep_duration_hours: Number(sleep),
      diet_quality_score: Number(diet),
      bmi: Number(bmi)
    };

    setLoading(true);
    submitWhatIfSimulation(baselineData, modifications)
      .then(res => {
        setSimulationResult(res);
        setLoading(false);
      })
      .catch(err => {
        console.error('What-If error:', err);
        setLoading(false);
      });
  }, [baselineData, activity, sleep, diet, bmi]);

  const handleSelectPreset = (profileId) => {
    const profile = sampleProfiles.find(p => p.id === profileId);
    if (profile) {
      setBaselineData(profile.data);
      setActivity(profile.data.physical_activity_minutes_week);
      setSleep(profile.data.sleep_duration_hours);
      setDiet(profile.data.diet_quality_score);
      setBmi(profile.data.bmi);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-600 text-xs font-bold uppercase tracking-wider">
              <Sliders className="w-4 h-4" />
              <span>Counterfactual Scenario Simulator</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              What-If Lifestyle Risk Simulator
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Dynamically modify physical activity, sleep, diet quality, and BMI to observe how the E5 model recalculates domain synergies and GxE interaction terms in real-time.
            </p>
          </div>

          {/* Persona selector */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 block mb-1">Baseline Profile:</span>
            <select
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-medium text-slate-800"
            >
              {sampleProfiles.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Scientific Non-Causal Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start space-x-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-bold">Non-Causality Warning:</strong> Results represent hypothetical statistical projections from the fitted model pipeline with fixed covariates. Modifying these factors in this software does not guarantee biological disease prevention or replace personalized medical counsel.
          </p>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sliders Column */}
        <div className="md:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Adjust Modifiable Variables
          </h2>

          {/* Physical Activity Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">Physical Activity (min/wk)</span>
              <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                {activity} min
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={activity}
              onChange={(e) => setActivity(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 (Sedentary)</span>
              <span>150 (WHO Min)</span>
              <span>500 min</span>
            </div>
          </div>

          {/* Diet Quality Score Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">Diet Quality Score (/100)</span>
              <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                {diet} / 100
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={diet}
              onChange={(e) => setDiet(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10 (Poor)</span>
              <span>55 (Average)</span>
              <span>100 (Optimal)</span>
            </div>
          </div>

          {/* Sleep Duration Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">Sleep Duration (hrs/night)</span>
              <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                {sleep.toFixed(1)} hrs
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="12"
              step="0.5"
              value={sleep}
              onChange={(e) => setSleep(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>4.0h</span>
              <span>7.5h (Optimal)</span>
              <span>12.0h</span>
            </div>
          </div>

          {/* Body Mass Index (BMI) Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">Body Mass Index (kg/m²)</span>
              <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                {bmi.toFixed(1)} kg/m²
              </span>
            </div>
            <input
              type="range"
              min="18"
              max="45"
              step="0.2"
              value={bmi}
              onChange={(e) => setBmi(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>18.5 (Normal)</span>
              <span>25.0 (Overweight)</span>
              <span>30.0 (Obese)</span>
            </div>
          </div>
        </div>

        {/* Results Comparison Column */}
        <div className="md:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Real-Time Counterfactual Impact
          </h2>

          {simulationResult && (
            <div className="space-y-6">
              
              {/* Comparison Score Boxes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Baseline Risk</span>
                  <span className="text-2xl font-extrabold text-slate-800 font-mono block mt-1">
                    {simulationResult.baseline_percentage}%
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">
                    {simulationResult.baseline_risk_level}
                  </span>
                </div>

                <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-teal-700">Scenario Risk</span>
                  <span className="text-2xl font-extrabold text-teal-900 font-mono block mt-1">
                    {simulationResult.modified_percentage}%
                  </span>
                  <span className="text-[10px] font-semibold text-teal-700 block mt-0.5">
                    {simulationResult.modified_risk_level}
                  </span>
                </div>
              </div>

              {/* Delta Callout */}
              <div className={`p-4 rounded-xl border text-center space-y-1 ${
                simulationResult.percentage_point_change < 0
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center justify-center space-x-1.5 font-bold text-sm">
                  {simulationResult.percentage_point_change < 0 ? (
                    <>
                      <TrendingDown className="w-5 h-5 text-emerald-600" />
                      <span>{simulationResult.percentage_point_change} Percentage Points Risk Shift</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5 text-rose-600" />
                      <span>+{simulationResult.percentage_point_change} Percentage Points Risk Shift</span>
                    </>
                  )}
                </div>
                <p className="text-xs opacity-90">
                  Relative Change: <strong>{simulationResult.relative_change_percentage}%</strong>
                </p>
              </div>

              {/* Recalculated GxE Terms */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
                <span className="font-bold text-slate-700 block">Recalculated GxE Interaction Values:</span>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-600">
                  <div>PRS × Activity: <strong>{simulationResult.modified_engineered.gxe_physical_activity}</strong></div>
                  <div>PRS × Sleep: <strong>{simulationResult.modified_engineered.gxe_sleep_duration}</strong></div>
                  <div>PRS × Diet: <strong>{simulationResult.modified_engineered.gxe_diet_quality}</strong></div>
                  <div>PRS × BMI: <strong>{simulationResult.modified_engineered.gxe_bmi}</strong></div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

