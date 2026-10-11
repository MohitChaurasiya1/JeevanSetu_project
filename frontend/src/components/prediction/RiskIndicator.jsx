import React from 'react';

const RiskIndicator = ({ prediction, riskText, riskLevel, disease }) => {
  const isHigh = riskLevel === 'HIGH' || prediction === 1;
  const isModerate = riskLevel === 'MODERATE';

  let styleClass = "bg-emerald-50 text-emerald-700 border-emerald-300";
  let icon = "✅";

  if (isHigh) {
    styleClass = "bg-rose-50 text-rose-700 border-rose-300";
    icon = "⚠";
  } else if (isModerate) {
    styleClass = "bg-amber-50 text-amber-700 border-amber-300";
    icon = "⚡";
  }

  const label = riskText || (isHigh ? `High Risk of ${disease || 'Disease'}` : `Low Risk of ${disease || 'Disease'}`);

  return (
    <div className={`p-3.5 rounded-xl text-center font-bold text-base border shadow-sm ${styleClass}`}>
      <span className="mr-2 text-lg">{icon}</span>
      {label}
    </div>
  );
};

export default RiskIndicator;