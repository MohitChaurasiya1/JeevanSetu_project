import React from 'react';

const RiskIndicator = ({ prediction }) => {
  const isHighRisk = prediction === 1;
  return (
    <div className={`p-3 rounded-lg text-center font-semibold ${
      isHighRisk ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-green-100 text-green-700 border border-green-300"
    }`}>
      {isHighRisk ? "⚠ High Risk of Diabetes" : "✅ Low Risk of Diabetes"}
    </div>
  );
};

export default RiskIndicator;