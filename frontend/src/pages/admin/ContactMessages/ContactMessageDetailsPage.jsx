import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Button,
  Badge,
  Alert,
  LoadingState,
  ErrorState,
} from '../../../components/common';
import contactApi from '../../../api/contactApi';
import { ROUTES } from '../../../constants/routes';

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'NEW':
      return 'warning';
    case 'READ':
      return 'info';
    case 'RESOLVED':
      return 'success';
    default:
      return 'info';
  }
};

const ContactMessageDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [status, setStatus] = useState('NEW');
  const [adminResponse, setAdminResponse] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadMessage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactApi.getContactMessageById(id);
      setMessage(data);
      setStatus(data.status || 'NEW');
      setAdminResponse(data.admin_response || '');
    } catch (err) {
      console.error('Failed to load message details:', err);
      setError(
        err.response?.data?.detail ||
          'Message not found or you do not have permission to view it.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadMessage();
  }, [loadMessage]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await contactApi.updateContactMessage(id, {
        status,
        admin_response: adminResponse.trim() || undefined,
        send_email: sendEmail,
      });

      setMessage(updated);
      setFeedback({
        type: 'success',
        text: 'Message successfully updated. ' + (sendEmail && adminResponse.trim() ? 'Email notification sent.' : ''),
      });
    } catch (err) {
      console.error('Save failed:', err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to save changes. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatus = async (newStatus) => {
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await contactApi.updateContactMessage(id, {
        status: newStatus,
        send_email: false,
      });
      setMessage(updated);
      setStatus(newStatus);
      setFeedback({
        type: 'success',
        text: `Status updated to ${newStatus}.`,
      });
    } catch (err) {
      console.error('Quick status update failed:', err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to update status.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-2xl border border-border shadow-card p-12">
          <LoadingState text="Loading contact message details..." />
        </div>
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-2xl border border-border shadow-card p-8">
          <ErrorState
            title="Unable to load contact message"
            message={error || 'Message not found'}
            onRetry={loadMessage}
            retryLabel="Try Again"
          />
          <div className="mt-4 text-center">
            <Link to={ROUTES.ADMIN_CONTACT_MESSAGES}>
              <Button variant="outline">← Back to Contact Messages</Button>
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
          to={ROUTES.ADMIN_CONTACT_MESSAGES}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Contact Messages
        </Link>

        <Badge variant={getStatusBadgeVariant(message.status)}>
          Status: {message.status}
        </Badge>
      </div>

      {/* ── Feedback Notification ──────────────────────────────── */}
      {feedback && (
        <Alert
          variant={feedback.type}
          message={feedback.text}
          dismissible
          onClose={() => setFeedback(null)}
        />
      )}

      {/* ── Main Message Details Header ────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold text-text">
              Inquiry from {message.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Message ID: #{message.id} • Submitted on{' '}
              {message.created_at ? new Date(message.created_at).toLocaleString() : 'N/A'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {message.status === 'NEW' && (
              <Button
                variant="secondary"
                onClick={() => handleQuickStatus('READ')}
                disabled={saving}
                className="text-xs"
              >
                Mark as Read
              </Button>
            )}

            {message.status !== 'RESOLVED' && (
              <Button
                variant="primary"
                onClick={() => handleQuickStatus('RESOLVED')}
                disabled={saving}
                className="text-xs"
              >
                Mark as Resolved
              </Button>
            )}
          </div>
        </div>

        {/* ── Sender Information Grid ──────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border text-sm">
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
              Full Name
            </span>
            <p className="text-text font-medium">{message.full_name}</p>
          </div>

          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
              Email Address
            </span>
            <a
              href={`mailto:${message.email}`}
              className="text-primary hover:underline font-medium break-all"
            >
              {message.email}
            </a>
          </div>

          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
              Phone Number
            </span>
            {message.phone ? (
              <a
                href={`tel:${message.phone}`}
                className="text-primary hover:underline font-medium"
              >
                {message.phone}
              </a>
            ) : (
              <span className="text-text-secondary">Not provided</span>
            )}
          </div>
        </div>

        {/* ── Inquiry Message Content ──────────────────────────── */}
        <div className="pt-6">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider mb-2">
            Inquiry Message
          </h2>
          <div className="p-5 bg-slate-50 rounded-xl border border-border text-sm text-text leading-relaxed whitespace-pre-wrap">
            {message.message}
          </div>
        </div>
      </div>

      {/* ── Admin Management & Response Card ───────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6">
        <h2 className="text-lg font-bold text-text mb-4">
          Admin Review & Response
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
                <option value="NEW">NEW (Awaiting review)</option>
                <option value="READ">READ (In review)</option>
                <option value="RESOLVED">RESOLVED (Completed)</option>
              </select>
            </div>

            <div>
              <span className="block text-sm font-semibold text-text mb-1">
                Last Updated
              </span>
              <p className="text-sm text-text-secondary py-2">
                {message.updated_at ? new Date(message.updated_at).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-response-input"
              className="block text-sm font-semibold text-text mb-1"
            >
              Admin Response Note
            </label>
            <textarea
              id="admin-response-input"
              rows={5}
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              placeholder="Enter your response or resolution note here..."
              disabled={saving}
              className="w-full border border-border rounded-lg p-3.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="send-email-check"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              disabled={saving}
              className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
            />
            <label
              htmlFor="send-email-check"
              className="text-xs sm:text-sm text-text-secondary cursor-pointer"
            >
              Send response email to <span className="font-semibold text-text">{message.email}</span>
            </label>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={saving}
            >
              Save Response & Status
            </Button>
            <Link to={ROUTES.ADMIN_CONTACT_MESSAGES}>
              <Button variant="outline" type="button" disabled={saving}>
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactMessageDetailsPage;
