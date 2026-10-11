import React from 'react';
import RiskIndicator from './RiskIndicator';

const PredictionResultCard = ({ result }) => {
  if (!result) return null;

  const probabilityPercent = result.probability !== undefined && result.probability !== null
    ? (result.probability * 100).toFixed(1)
    : null;

  const isHeart = result.disease?.toLowerCase().includes('heart');

  return (
    <div className="mt-6 p-6 bg-slate-900/90 rounded-2xl shadow-xl border border-teal-500/30 text-white backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-700/60 gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{isHeart ? '❤️' : '🩸'}</span>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {result.disease || 'Health Assessment'} Result
            </h3>
            <span className="text-xs text-teal-400 font-medium">
              ML Model Version 2.0 (Confidence calibrated)
            </span>
          </div>
        </div>

        {probabilityPercent !== null && (
          <div className="bg-slate-800/80 border border-teal-500/20 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="text-xs text-slate-400">Calculated Risk:</span>
            <span className="text-sm font-bold text-teal-300">{probabilityPercent}%</span>
          </div>
        )}
      </div>

      {/* Probability Gauge Bar */}
      {probabilityPercent !== null && (
        <div className="mb-5">
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-700 rounded-full ${
                Number(probabilityPercent) >= 65
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : Number(probabilityPercent) >= 35
                  ? 'bg-gradient-to-r from-teal-400 to-amber-400'
                  : 'bg-gradient-to-r from-emerald-400 to-teal-400'
              }`}
              style={{ width: `${Math.max(5, Math.min(100, Number(probabilityPercent)))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>Low Risk (&lt;35%)</span>
            <span>Moderate (35-65%)</span>
            <span>High Risk (&gt;65%)</span>
          </div>
        </div>
      )}

      {/* Main Risk Status Indicator */}
      <RiskIndicator
        prediction={result.prediction}
        riskText={result.risk}
        riskLevel={result.risk_level}
        disease={result.disease}
      />

      {/* Contributing Factors */}
      {result.contributing_factors && result.contributing_factors.length > 0 && (
        <div className="mt-5 p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
          <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>⚠️</span> Key Contributing Factors Detected
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {result.contributing_factors.map((factor, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-md bg-amber-950/40 text-amber-200 border border-amber-600/30"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Clinical Guidance & Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-teal-950/30 border border-teal-500/25">
          <h4 className="text-xs font-semibold text-teal-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>🩺</span> Clinical Recommendations
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="leading-relaxed">{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-4 text-[11px] text-slate-400 text-center leading-relaxed">
        🛡️ This assessment is powered by supervised machine learning (Random Forest trained on clinical cohorts)
        for screening purposes and does not replace medical diagnosis by a licensed physician or cardiologist.
      </p>
    </div>
  );
};

export default PredictionResultCard;