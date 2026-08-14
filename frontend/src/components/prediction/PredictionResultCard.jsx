import React from 'react';
import RiskIndicator from './RiskIndicator';

const PredictionResultCard = ({ result }) => {
  if (!result) return null;
  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-2">Prediction Result</h3>
      <RiskIndicator prediction={result.prediction} />
    </div>
  );
};

export default PredictionResultCard;