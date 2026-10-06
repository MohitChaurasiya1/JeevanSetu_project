import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiMessageSquare,
  FiUser,
  FiMail,
  FiStar,
  FiCheckCircle,
  FiTrash2,
  FiClock,
} from 'react-icons/fi';
import {
  Button,
  Badge,
  Alert,
  LoadingState,
  ErrorState,
} from '../../../components/common';
import ConfirmDialog from '../../../components/modals/ConfirmDialog';
import { getFeedbackById, updateFeedback, deleteFeedback } from '../../../api/adminApi';
import { ROUTES } from '../../../constants/routes';

const getStatusBadgeVariant = (status) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return 'warning';
    case 'REVIEWED':
      return 'info';
    case 'RESOLVED':
    default:
      return 'success';
  }
};

const RenderStars = ({ rating = 5 }) => {
  return (
    <div className="flex items-center gap-1 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
          }`}
        />
      ))}
      <span className="ml-1.5 text-sm font-bold text-text">{rating} / 5</span>
    </div>
  );
};

const FeedbackDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [status, setStatus] = useState('PENDING');
  const [adminResponse, setAdminResponse] = useState('');
  const [saving, setSaving] = useState(false);
  const [alertFeedback, setAlertFeedback] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadFeedback = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeedbackById(id);
      setFeedback(data);
      setStatus(data.status || 'PENDING');
      setAdminResponse(data.admin_response || '');
    } catch (err) {
      console.error('Failed to load feedback details:', err);
      setError(
        err.response?.data?.detail ||
          'Feedback not found or you do not have permission to view it.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlertFeedback(null);
    try {
      const payload = {
        status,
        admin_response: adminResponse.trim() || '',
      };
      const updated = await updateFeedback(id, payload);
      setFeedback(updated);
      setAlertFeedback({
        type: 'success',
        text: 'Feedback status and admin resolution note saved successfully.',
      });
    } catch (err) {
      console.error('Save failed:', err);
      setAlertFeedback({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to save changes. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatus = async (newStatus) => {
    setSaving(true);
    setAlertFeedback(null);
    try {
      const updated = await updateFeedback(id, { status: newStatus });
      setFeedback(updated);
      setStatus(newStatus);
      setAlertFeedback({
        type: 'success',
        text: `Feedback status marked as ${newStatus}.`,
      });
    } catch (err) {
      console.error('Quick status update failed:', err);
      setAlertFeedback({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to update status.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteFeedback(id);
      navigate(ROUTES.ADMIN_FEEDBACK, {
        state: { message: `Feedback #${id} deleted successfully.` },
      });
    } catch (err) {
      console.error('Delete failed:', err);
      setAlertFeedback({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to delete feedback entry.',
      });
      setDeleteModalOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 max-w-5xl">
        <div className="bg-white rounded-2xl border border-border shadow-card p-12">
          <LoadingState text="Loading feedback details..." />
        </div>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="container mx-auto p-4 sm:p-6 max-w-5xl">
        <div className="bg-white rounded-2xl border border-border shadow-card p-8 text-center space-y-4">
          <ErrorState
            title="Feedback Entry Not Found"
            message={error || 'Feedback record does not exist.'}
            onRetry={loadFeedback}
          />
          <div>
            <Link to={ROUTES.ADMIN_FEEDBACK}>
              <Button variant="outline">← Back to Feedback List</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-5xl">
      {/* ── Breadcrumb & Back Link ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.ADMIN_FEEDBACK}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-textSecondary hover:text-primary transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Feedback</span>
        </Link>

        <div className="flex items-center gap-3">
          <Badge variant={getStatusBadgeVariant(feedback.status)}>
            Status: {feedback.status}
          </Badge>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteModalOpen(true)}
            icon={<FiTrash2 className="w-4 h-4" />}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* ── Feedback Notification ──────────────────────────────── */}
      {alertFeedback && (
        <Alert
          variant={alertFeedback.type}
          message={alertFeedback.text}
          dismissible
          onClose={() => setAlertFeedback(null)}
        />
      )}

      {/* ── Main Feedback Details Header Card ─────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold text-text">
              {feedback.subject}
            </h1>
            <p className="text-xs sm:text-sm text-textSecondary mt-1 flex items-center gap-2">
              <FiClock className="w-3.5 h-3.5 text-slate-400" />
              Feedback ID: #{feedback.id} • Submitted on{' '}
              {feedback.created_at ? new Date(feedback.created_at).toLocaleString() : 'N/A'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {feedback.status === 'PENDING' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleQuickStatus('REVIEWED')}
                disabled={saving}
                className="text-xs"
              >
                Mark Reviewed
              </Button>
            )}

            {feedback.status !== 'RESOLVED' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleQuickStatus('RESOLVED')}
                disabled={saving}
                className="text-xs"
              >
                Mark Resolved
              </Button>
            )}
          </div>
        </div>

        {/* ── Sender Information Grid ──────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border text-sm">
          <div>
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider block mb-1">
              User / Submitter
            </span>
            <p className="text-text font-semibold flex items-center gap-1.5">
              <FiUser className="w-4 h-4 text-primary" />
              {feedback.user_name || feedback.user_username || `User #${feedback.user}`}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider block mb-1">
              Email Address
            </span>
            {feedback.user_email ? (
              <a
                href={`mailto:${feedback.user_email}`}
                className="text-primary hover:underline font-medium break-all flex items-center gap-1.5"
              >
                <FiMail className="w-4 h-4 flex-shrink-0" />
                {feedback.user_email}
              </a>
            ) : (
              <span className="text-textSecondary">Not available</span>
            )}
          </div>

          <div>
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider block mb-1">
              Rating Provided
            </span>
            <RenderStars rating={feedback.rating} />
          </div>
        </div>

        {/* ── Message Content ──────────────────────────────────── */}
        <div className="pt-6">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FiMessageSquare className="w-4 h-4 text-primary" />
            <span>Feedback Message</span>
          </h2>
          <div className="p-5 bg-slate-50 rounded-xl border border-border text-sm text-text leading-relaxed whitespace-pre-wrap">
            {feedback.message}
          </div>
        </div>
      </div>

      {/* ── Admin Management & Response Card ───────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6">
        <h2 className="text-lg font-bold text-text mb-4">
          Admin Review & Resolution Notes
        </h2>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="status-select"
                className="block text-sm font-semibold text-text mb-1"
              >
                Status
              </label>
              <select
                id="status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving}
                className="w-full border border-border rounded-lg px-3.5 py-2 text-sm bg-white focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="PENDING">PENDING (Awaiting Review)</option>
                <option value="REVIEWED">REVIEWED (Under Evaluation)</option>
                <option value="RESOLVED">RESOLVED (Action Taken)</option>
              </select>
            </div>

            <div>
              <span className="block text-sm font-semibold text-text mb-1">
                Last Updated
              </span>
              <p className="text-sm text-textSecondary py-2">
                {feedback.updated_at ? new Date(feedback.updated_at).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-response-input"
              className="block text-sm font-semibold text-text mb-1"
            >
              Admin Resolution / Internal Response Note
            </label>
            <textarea
              id="admin-response-input"
              rows={5}
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              placeholder="Enter your administrative review response or resolution log..."
              disabled={saving}
              className="w-full border border-border rounded-lg p-3.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none leading-relaxed"
            />
            <p className="text-xs text-textSecondary mt-1">
              Internal note for system records regarding this user feedback.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={saving}
            >
              Save Resolution Note
            </Button>
            <Link to={ROUTES.ADMIN_FEEDBACK}>
              <Button variant="outline" type="button" disabled={saving}>
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>

      {/* ── Confirm Delete Dialog ──────────────────────────────── */}
      <ConfirmDialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Feedback Record"
        message={`Are you sure you want to permanently delete feedback #${feedback.id} ("${feedback.subject}")?`}
        confirmLabel="Delete Feedback"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default FeedbackDetailsPage;
