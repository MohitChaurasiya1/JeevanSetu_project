import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiActivity,
  FiUser,
  FiMail,
  FiCalendar,
  FiCpu,
  FiTrash2,
  FiCheckCircle,
  FiAlertTriangle,
  FiShield,
  FiSliders,
} from 'react-icons/fi';
import {
  Button,
  Badge,
  Alert,
  LoadingState,
  ErrorState,
} from '../../../components/common';
import ConfirmDialog from '../../../components/modals/ConfirmDialog';
import { getAdminPredictionById, deleteAdminPrediction } from '../../../api/adminApi';
import { ROUTES } from '../../../constants/routes';

const getRiskConfig = (riskLevel) => {
  switch (riskLevel?.toUpperCase()) {
    case 'HIGH':
      return {
        badge: 'danger',
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        bar: 'bg-red-600',
        icon: FiAlertTriangle,
        label: 'High Risk Detected',
        description: 'Prediction indicates high likelihood of disease manifestation. Medical consultation is recommended.',
      };
    case 'MEDIUM':
      return {
        badge: 'warning',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        bar: 'bg-amber-500',
        icon: FiActivity,
        label: 'Moderate Risk',
        description: 'Prediction falls in the borderline or moderate risk category. Lifestyle modifications advised.',
      };
    case 'LOW':
    default:
      return {
        badge: 'success',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        bar: 'bg-emerald-600',
        icon: FiShield,
        label: 'Low Risk',
        description: 'Biomarkers and inputs are within healthy baseline parameters.',
      };
  }
};

const formatFeatureLabel = (key) => {
  const map = {
    pregnancies: 'Pregnancies',
    glucose: 'Glucose Level (mg/dL)',
    blood_pressure: 'Blood Pressure (mm Hg)',
    bloodpressure: 'Blood Pressure',
    skin_thickness: 'Skin Thickness (mm)',
    skinthickness: 'Skin Thickness',
    insulin: '2-Hour Serum Insulin (mu U/ml)',
    bmi: 'Body Mass Index (BMI)',
    diabetes_pedigree: 'Diabetes Pedigree Function',
    diabetespedigreefunction: 'Diabetes Pedigree Function',
    age: 'Age (Years)',
    cholesterol: 'Cholesterol (mg/dL)',
    heart_rate: 'Heart Rate (bpm)',
    hypertension: 'Hypertension History',
    smoking_history: 'Smoking History',
  };
  if (map[key.toLowerCase()]) return map[key.toLowerCase()];
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const AdminPredictionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadPrediction = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminPredictionById(id);
      setPrediction(data);
    } catch (err) {
      console.error('Failed to load prediction details:', err);
      setError(
        err.response?.data?.detail ||
          'Prediction not found or you do not have permission to view it.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPrediction();
  }, [loadPrediction]);

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteAdminPrediction(id);
      navigate(ROUTES.ADMIN_PREDICTIONS, {
        state: { message: `Prediction #${id} has been deleted successfully.` },
      });
    } catch (err) {
      console.error('Failed to delete prediction:', err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to delete prediction record.',
      });
      setDeleteModalOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl border border-border shadow-card p-12">
          <LoadingState text="Loading prediction assessment details..." />
        </div>
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl border border-border shadow-card p-8 text-center space-y-4">
          <ErrorState
            title="Prediction Not Found"
            message={error || 'The requested prediction evaluation does not exist.'}
            onRetry={loadPrediction}
          />
          <div>
            <Link to={ROUTES.ADMIN_PREDICTIONS}>
              <Button variant="outline">← Back to Predictions</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const riskConfig = getRiskConfig(prediction.risk_level);
  const RiskIcon = riskConfig.icon;
  const probPercentage = Math.round((prediction.probability || 0) * 100);
  const inputData = prediction.input_data || {};
  const inputEntries = Object.entries(inputData);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Top Navigation ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.ADMIN_PREDICTIONS}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-textSecondary hover:text-primary transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Predictions</span>
        </Link>

        <Button
          variant="danger"
          size="sm"
          onClick={() => setDeleteModalOpen(true)}
          icon={<FiTrash2 className="w-4 h-4" />}
        >
          Delete Record
        </Button>
      </div>

      {/* ── Feedback Alert ─────────────────────────────────────── */}
      {feedback && (
        <Alert
          variant={feedback.type}
          message={feedback.text}
          dismissible
          onClose={() => setFeedback(null)}
        />
      )}

      {/* ── Main Risk Assessment Card ──────────────────────────── */}
      <div className={`rounded-2xl border ${riskConfig.border} ${riskConfig.bg} p-6 sm:p-8 shadow-card`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
              <RiskIcon className={`w-8 h-8 ${riskConfig.text}`} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className={`text-xl sm:text-2xl font-bold ${riskConfig.text}`}>
                  {riskConfig.label}
                </span>
                <Badge variant={riskConfig.badge}>{prediction.risk_level}</Badge>
              </div>
              <p className="text-sm text-textSecondary mt-1 max-w-xl">
                {riskConfig.description}
              </p>
              <div className="mt-2 text-xs text-textSecondary font-medium">
                Prediction #{prediction.id} • Target Disease:{' '}
                <span className="font-semibold text-text">{prediction.disease_name || 'Diabetes'}</span>
              </div>
            </div>
          </div>

          {/* Probability Gauge Box */}
          <div className="bg-white rounded-xl border border-border p-4 sm:p-5 text-center min-w-[180px] shadow-sm self-start md:self-auto">
            <span className="text-xs text-textSecondary font-semibold uppercase tracking-wider block">
              Confidence / Probability
            </span>
            <span className="text-3xl font-extrabold text-text font-mono mt-1 block">
              {probPercentage}%
            </span>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-2 rounded-full ${riskConfig.bar}`}
                style={{ width: `${Math.min(100, Math.max(5, probPercentage))}%` }}
              />
            </div>
            <span className="text-[11px] text-textSecondary mt-1.5 block">
              Result: {prediction.prediction_result}
            </span>
          </div>
        </div>
      </div>

      {/* ── Metadata Grid: Patient & ML Model Details ─────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User / Patient Card */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-text flex items-center gap-2">
              <FiUser className="w-4 h-4 text-primary" />
              <span>Patient Profile</span>
            </h2>
            {prediction.user && (
              <Link
                to={`/admin/users/${prediction.user.id}`}
                className="text-xs text-primary font-semibold hover:underline"
              >
                View Profile ↗
              </Link>
            )}
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-textSecondary block">Full Name</span>
              <span className="font-semibold text-text">
                {prediction.user?.full_name || 'Anonymous Patient'}
              </span>
            </div>

            <div>
              <span className="text-xs text-textSecondary block">Username</span>
              <span className="font-mono text-text">
                @{prediction.user?.username || 'anonymous'}
              </span>
            </div>

            <div>
              <span className="text-xs text-textSecondary block">Email Address</span>
              {prediction.user?.email ? (
                <a
                  href={`mailto:${prediction.user.email}`}
                  className="text-primary hover:underline font-medium"
                >
                  {prediction.user.email}
                </a>
              ) : (
                <span className="text-textSecondary">Not available</span>
              )}
            </div>
          </div>
        </div>

        {/* Engine & Model Card */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-text flex items-center gap-2">
              <FiCpu className="w-4 h-4 text-primary" />
              <span>Evaluation Context</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">
              v{prediction.model_version || '1.0.0'}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-textSecondary block">Evaluated Disease</span>
              <span className="font-semibold text-text">
                {prediction.disease_name || 'Diabetes Mellitus'}
              </span>
            </div>

            <div>
              <span className="text-xs text-textSecondary block">Assessment Date & Time</span>
              <span className="text-text font-medium flex items-center gap-1.5">
                <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                {prediction.created_at
                  ? new Date(prediction.created_at).toLocaleString()
                  : '--'}
              </span>
            </div>

            <div>
              <span className="text-xs text-textSecondary block">Model Engine Version</span>
              <span className="font-mono text-text text-xs bg-slate-100 px-2 py-0.5 rounded">
                RandomForestClassifier / v{prediction.model_version || '1.0.0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Input Parameters Grid ──────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <FiSliders className="w-5 h-5 text-primary" />
              <span>Clinical Input Parameters</span>
            </h2>
            <p className="text-xs text-textSecondary mt-0.5">
              Medical biomarker features submitted during this risk evaluation.
            </p>
          </div>
          <span className="text-xs font-semibold text-textSecondary bg-slate-100 px-2.5 py-1 rounded-lg">
            {inputEntries.length} Features
          </span>
        </div>

        {inputEntries.length === 0 ? (
          <div className="p-6 text-center text-textSecondary bg-slate-50 rounded-xl border border-border">
            No input parameters recorded for this prediction.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inputEntries.map(([key, val]) => (
              <div
                key={key}
                className="p-4 rounded-xl border border-border bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">
                    {formatFeatureLabel(key)}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {key}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-text font-mono">
                    {typeof val === 'number'
                      ? Number.isInteger(val)
                        ? val
                        : val.toFixed(2)
                      : String(val)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Confirm Delete Modal ───────────────────────────────── */}
      <ConfirmDialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Prediction Assessment"
        message={`Are you sure you want to delete prediction record #${prediction.id}? This will remove all associated assessment metrics.`}
        confirmLabel="Delete Record"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminPredictionDetailsPage;
