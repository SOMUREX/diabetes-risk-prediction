import React from 'react';

export default function CircularGauge({ 
  percentage = 0, 
  threshold = 27.94,
  size = 220, 
  strokeWidth = 16,
  riskLabel = "Elevated Risk",
  badgeColor = "amber"
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // clamp between 0 and 100
  const clamped = Math.min(Math.max(percentage, 0), 100);
  const strokeDashoffset = circumference - (clamped / 100) * circumference;
  const thresholdOffset = circumference - (threshold / 100) * circumference;

  // Determine stroke color based on risk
  let strokeColor = "#10b981"; // emerald
  let trackBg = "text-emerald-50";
  if (clamped >= 50) {
    strokeColor = "#e11d48"; // rose-600
  } else if (clamped >= threshold) {
    strokeColor = "#f59e0b"; // amber-500
  } else if (clamped >= 15) {
    strokeColor = "#2563eb"; // blue-600
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
        />

        {/* Threshold indicator arc background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={thresholdOffset}
          fill="transparent"
          strokeLinecap="round"
        />

        {/* Animated Progress Value */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="transparent"
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-extrabold tracking-tight text-slate-900 font-mono">
          {percentage.toFixed(1)}%
        </span>
        <span className="text-xs uppercase font-semibold tracking-wider text-slate-500 mt-0.5">
          Predicted Risk
        </span>
        <div className={`mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          badgeColor === 'rose' ? 'bg-rose-50 text-rose-700 border-rose-200' :
          badgeColor === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' :
          badgeColor === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
          'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}>
          {riskLabel}
        </div>
      </div>
    </div>
  );
}

