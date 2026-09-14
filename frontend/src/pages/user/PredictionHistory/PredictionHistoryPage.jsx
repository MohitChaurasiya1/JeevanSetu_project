import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import predictionApi from '../../../api/predictionApi';

const PredictionHistoryPage = () => {
  const navigate = useNavigate();

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const data = await predictionApi.getHistory();

        // Django REST Framework pagination support
        const history = Array.isArray(data) ? data : data.results || [];

        setPredictions(history);
      } catch (error) {
        console.error('Failed to load prediction history:', error);

        const serverMsg =
          error.response?.data?.detail ||
          error.response?.data?.error;

        setErrorMessage(
          serverMsg || 'Unable to load prediction history.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Prediction History
      </h1>

      {loading && (
        <div className="p-6 bg-white rounded-xl shadow-card border border-border text-center">
          <p className="text-textSecondary">
            Loading prediction history...
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
          {errorMessage}
        </div>
      )}

      {!loading && !errorMessage && predictions.length === 0 && (
        <div className="p-6 bg-white rounded-xl shadow-card border border-border text-center">
          <h2 className="text-lg font-semibold text-text mb-2">
            No Predictions Yet
          </h2>

          <p className="text-textSecondary">
            Your prediction history will appear here after you complete an assessment.
          </p>
        </div>
      )}

      {!loading && !errorMessage && predictions.length > 0 && (
        <div className="space-y-4">
          {predictions.map((prediction) => (
            <div
              key={prediction.id}
              onClick={() =>
                navigate(`/predictions/${prediction.id}`)
              }
              className="p-5 bg-white rounded-xl shadow-card border border-border cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-text">
                  Prediction #{prediction.id}
                </h2>

                <span className="text-sm text-textSecondary">
                  {prediction.created_at
                    ? new Date(
                      prediction.created_at
                    ).toLocaleDateString()
                    : 'Date unavailable'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-textSecondary mb-1">
                    Result
                  </p>

                  <p className="font-medium text-text">
                    {prediction.prediction_result || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-textSecondary mb-1">
                    Risk Level
                  </p>

                  <p className="font-medium text-text">
                    {prediction.risk_level || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-textSecondary mb-1">
                    Probability
                  </p>

                  <p className="font-medium text-text">
                    {prediction.probability !== undefined &&
                      prediction.probability !== null
                      ? `${(
                        prediction.probability * 100
                      ).toFixed(1)}%`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictionHistoryPage;