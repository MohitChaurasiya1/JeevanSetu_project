import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import predictionApi from '../../../api/predictionApi';

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        const data = await predictionApi.getHistory();

        const history = Array.isArray(data)
          ? data
          : data.results || [];

        setPredictions(history);
      } catch (error) {
        console.error('Failed to load dashboard predictions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPredictions();
  }, []);

  const latestPrediction =
    predictions.length > 0 ? predictions[0] : null;

  const latestProbability =
    latestPrediction?.probability !== undefined &&
      latestPrediction?.probability !== null
      ? `${(latestPrediction.probability * 100).toFixed(1)}%`
      : 'N/A';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">

      {/* ==================== WELCOME HEADER ==================== */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>
            <p className="text-sm text-textSecondary mb-1">
              Patient Dashboard
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">
              Welcome back,{' '}
              {user?.full_name || user?.username || 'Patient'}
            </h1>

            <p className="text-textSecondary max-w-xl">
              Manage your health assessments and review your
              previous prediction results in one place.
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row gap-3">

            <button
              onClick={() => navigate('/prediction/new')}
              className="w-full md:w-auto px-5 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-opacity"
            >
              + New Assessment
            </button>

            <button
              onClick={handleLogout}
              className="w-full md:w-auto px-5 py-3 rounded-lg border border-border text-text font-medium hover:bg-slate-50 transition-colors"
            >
              Logout
            </button>

          </div>

        </div>
      </div>

      {/* ==================== SUMMARY CARDS ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

        {/* Total Assessments */}
        <div className="bg-white rounded-xl border border-border shadow-card p-5">
          <p className="text-sm text-textSecondary mb-2">
            Total Assessments
          </p>

          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-primary">
              {loading ? '...' : predictions.length}
            </p>

            <span className="text-xs text-textSecondary">
              Completed
            </span>
          </div>
        </div>

        {/* Latest Risk */}
        <div className="bg-white rounded-xl border border-border shadow-card p-5">
          <p className="text-sm text-textSecondary mb-2">
            Latest Risk Level
          </p>

          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-text">
              {loading
                ? '...'
                : latestPrediction?.risk_level || 'N/A'}
            </p>

            {latestPrediction && (
              <span className="text-xs text-textSecondary">
                Latest
              </span>
            )}
          </div>
        </div>

        {/* Latest Probability */}
        <div className="bg-white rounded-xl border border-border shadow-card p-5">
          <p className="text-sm text-textSecondary mb-2">
            Latest Probability
          </p>

          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-text">
              {loading ? '...' : latestProbability}
            </p>

            {latestPrediction && (
              <span className="text-xs text-textSecondary">
                Latest
              </span>
            )}
          </div>
        </div>

      </div>

      {/* ==================== RECENT ASSESSMENTS ==================== */}
      <div className="mb-8">

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-text">
              Recent Assessments
            </h2>

            <p className="text-sm text-textSecondary mt-1">
              Your latest health risk assessments
            </p>
          </div>

          {predictions.length > 0 && (
            <button
              onClick={() => navigate('/predictions')}
              className="text-sm font-medium text-primary hover:underline"
            >
              View All
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl border border-border shadow-card p-8 text-center">
            <p className="text-textSecondary">
              Loading recent assessments...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && predictions.length === 0 && (
          <div className="bg-white rounded-xl border border-border shadow-card p-8 text-center">

            <h3 className="text-lg font-semibold text-text mb-2">
              No Assessments Yet
            </h3>

            <p className="text-sm text-textSecondary max-w-md mx-auto mb-5">
              Complete your first health assessment to start
              building your prediction history.
            </p>

            <button
              onClick={() => navigate('/prediction/new')}
              className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Start Assessment
            </button>

          </div>
        )}

        {/* Recent Predictions */}
        {!loading && predictions.length > 0 && (
          <div className="space-y-3">

            {predictions.slice(0, 3).map((prediction) => (
              <div
                key={prediction.id}
                onClick={() =>
                  navigate(`/predictions/${prediction.id}`)
                }
                className="bg-white rounded-xl border border-border shadow-card p-5 cursor-pointer hover:shadow-md transition-shadow"
              >

                {/* Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">

                  <div>
                    <h3 className="font-semibold text-text">
                      Prediction #{prediction.id}
                    </h3>

                    <p className="text-sm text-textSecondary mt-1">
                      {prediction.created_at
                        ? new Date(
                          prediction.created_at
                        ).toLocaleDateString()
                        : 'Date unavailable'}
                    </p>
                  </div>

                  <span className="text-sm font-medium text-primary">
                    View Details →
                  </span>

                </div>

                {/* Prediction Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

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

      {/* ==================== QUICK ACTIONS ==================== */}
      <div className="mb-8">

        <h2 className="text-xl font-semibold text-text mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <button
            onClick={() => navigate('/prediction/new')}
            className="bg-white rounded-xl border border-border shadow-card p-5 text-left hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-text mb-1">
              New Assessment
            </h3>

            <p className="text-sm text-textSecondary">
              Start a new health risk assessment.
            </p>
          </button>

          <button
            onClick={() => navigate('/predictions')}
            className="bg-white rounded-xl border border-border shadow-card p-5 text-left hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-text mb-1">
              Prediction History
            </h3>

            <p className="text-sm text-textSecondary">
              Review all your previous assessments.
            </p>
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="bg-white rounded-xl border border-border shadow-card p-5 text-left hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-text mb-1">
              My Profile
            </h3>

            <p className="text-sm text-textSecondary">
              View and manage your profile information.
            </p>
          </button>

        </div>

      </div>

      {/* ==================== IMPORTANT INFORMATION ==================== */}
      <div className="bg-white rounded-xl border border-border shadow-card p-5">

        <h2 className="font-semibold text-text mb-2">
          Important Information
        </h2>

        <p className="text-sm text-textSecondary leading-relaxed">
          This assessment is generated by machine learning for
          informational purposes only. It does not replace
          professional medical advice, diagnosis, or treatment.
        </p>

      </div>

    </div>
  );
};

export default UserDashboardPage;