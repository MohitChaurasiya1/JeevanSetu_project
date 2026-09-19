import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Badge,
  Modal,
  LoadingState,
  EmptyState,
  ErrorState,
  Alert,
  Textarea,
  Select,
} from '../../../components/common';
import contactApi from '../../../api/contactApi';

const STATUS_FILTERS = [
  { label: 'All Messages', value: '' },
  { label: 'New', value: 'NEW' },
  { label: 'Read', value: 'READ' },
  { label: 'Resolved', value: 'RESOLVED' },
];

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

const ContactMessageListPage = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Selected message for viewing/editing in Modal
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalStatus, setModalStatus] = useState('NEW');
  const [modalResponse, setModalResponse] = useState('');
  const [modalFeedback, setModalFeedback] = useState(null); // { type: 'success'|'error', text: '' }

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
      };
      if (statusFilter) params.status = statusFilter;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const data = await contactApi.getContactMessages(params);
      if (Array.isArray(data)) {
        setMessages(data);
        setTotalCount(data.length);
      } else if (data.results) {
        setMessages(data.results);
        setTotalCount(data.count || data.results.length);
      } else {
        setMessages([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Failed to load contact messages:', err);
      setError(
        err.response?.data?.detail ||
          'Failed to load contact messages. Please verify admin permissions.'
      );
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch, currentPage]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const openMessageModal = (msg) => {
    setSelectedMessage(msg);
    setModalStatus(msg.status || 'NEW');
    setModalResponse(msg.admin_response || '');
    setModalFeedback(null);
    setModalOpen(true);
  };

  const handleQuickStatusUpdate = async (id, newStatus, e) => {
    if (e) e.stopPropagation();
    try {
      await contactApi.updateContactMessage(id, { status: newStatus });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      console.error('Quick status update failed:', err);
      alert('Could not update message status.');
    }
  };

  const handleSaveModalResponse = async () => {
    if (!selectedMessage) return;
    setModalLoading(true);
    setModalFeedback(null);
    try {
      const updated = await contactApi.updateContactMessage(selectedMessage.id, {
        status: modalStatus,
        admin_response: modalResponse.trim() || undefined,
        send_email: true,
      });

      setSelectedMessage(updated);
      setMessages((prev) =>
        prev.map((m) => (m.id === selectedMessage.id ? updated : m))
      );
      setModalFeedback({
        type: 'success',
        text: 'Contact message updated successfully. Email notification sent if configured.',
      });
    } catch (err) {
      console.error('Failed to update message:', err);
      setModalFeedback({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to update message.',
      });
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-text">
              Contact Messages
            </h1>
            <Badge variant="info">Admin Portal</Badge>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Review, track, and respond to inquiries submitted by visitors and patients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={loadMessages}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <svg
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {/* ── Filters & Search Bar ────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-border shadow-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setStatusFilter(f.value);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                statusFilter === f.value
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-100 text-text-secondary hover:bg-slate-200 hover:text-text'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search name, email, query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          <svg
            className="w-4 h-4 text-text-secondary absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* ── Content States ─────────────────────────────────────── */}
      {loading ? (
        <div className="bg-white rounded-xl border border-border shadow-card p-12">
          <LoadingState text="Loading contact messages..." />
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-border shadow-card p-8">
          <ErrorState
            title="Failed to load contact messages"
            message={error}
            onRetry={loadMessages}
          />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-border shadow-card p-10">
          <EmptyState
            title="No contact messages found"
            message={
              statusFilter || debouncedSearch
                ? 'No messages match your selected filters or search query.'
                : 'No public contact inquiries have been submitted yet.'
            }
            action={
              statusFilter || debouncedSearch ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter('');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </Button>
              ) : null
            }
          />
        </div>
      ) : (
        /* ── Messages Table ───────────────────────────────────── */
        <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-border text-xs uppercase font-semibold text-text-secondary">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Sender</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Contact</th>
                  <th className="py-3.5 px-4">Message Preview</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => openMessageModal(msg)}
                    className="hover:bg-slate-50/75 cursor-pointer transition-colors"
                  >
                    {/* Sender Name */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-semibold text-text">{msg.full_name}</div>
                      <div className="text-xs text-text-secondary sm:hidden">
                        {msg.email}
                      </div>
                    </td>

                    {/* Email / Phone */}
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <div className="text-text">{msg.email}</div>
                      {msg.phone && (
                        <div className="text-xs text-text-secondary">{msg.phone}</div>
                      )}
                    </td>

                    {/* Message Preview */}
                    <td className="py-3.5 px-4 max-w-xs md:max-w-md">
                      <p className="text-text truncate">{msg.message}</p>
                      {msg.admin_response && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-0.5">
                          ✓ Replied
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <Badge variant={getStatusBadgeVariant(msg.status)}>
                        {msg.status}
                      </Badge>
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-xs text-text-secondary whitespace-nowrap">
                      {msg.created_at
                        ? new Date(msg.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'N/A'}
                    </td>

                    {/* Action Buttons */}
                    <td
                      className="py-3.5 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          className="text-xs px-2.5 py-1"
                          onClick={() => openMessageModal(msg)}
                        >
                          Details
                        </Button>

                        {msg.status === 'NEW' && (
                          <Button
                            variant="secondary"
                            className="text-xs px-2.5 py-1"
                            onClick={(e) => handleQuickStatusUpdate(msg.id, 'READ', e)}
                          >
                            Mark Read
                          </Button>
                        )}

                        {msg.status !== 'RESOLVED' && (
                          <Button
                            variant="primary"
                            className="text-xs px-2.5 py-1"
                            onClick={(e) =>
                              handleQuickStatusUpdate(msg.id, 'RESOLVED', e)
                            }
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <div className="px-6 py-4 border-t border-border bg-slate-50 flex items-center justify-between text-xs text-text-secondary">
            <span>
              Showing {messages.length} of {totalCount} messages
            </span>
            <span>Click any row to view details & respond</span>
          </div>
        </div>
      )}

      {/* ── Message Details & Response Modal ────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedMessage ? `Message #${selectedMessage.id} Details` : 'Message Details'}
        maxWidth="max-w-2xl"
        footer={
          <div className="flex items-center justify-between w-full">
            {selectedMessage && (
              <Button
                variant="outline"
                className="text-xs"
                onClick={() => {
                  setModalOpen(false);
                  navigate(`/admin/contact-messages/${selectedMessage.id}`);
                }}
              >
                Open Full Page ↗
              </Button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={modalLoading}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveModalResponse}
                loading={modalLoading}
                disabled={modalLoading}
              >
                Save Changes
              </Button>
            </div>
          </div>
        }
      >
        {selectedMessage && (
          <div className="space-y-5">
            {modalFeedback && (
              <Alert
                variant={modalFeedback.type}
                message={modalFeedback.text}
                dismissible
                onClose={() => setModalFeedback(null)}
              />
            )}

            {/* Sender Meta Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-border grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs font-semibold text-text-secondary uppercase block">
                  Sender Name
                </span>
                <span className="font-medium text-text">{selectedMessage.full_name}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-text-secondary uppercase block">
                  Email
                </span>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="font-medium text-primary hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>
              <div>
                <span className="text-xs font-semibold text-text-secondary uppercase block">
                  Phone Number
                </span>
                <span className="text-text">
                  {selectedMessage.phone || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-text-secondary uppercase block">
                  Submitted At
                </span>
                <span className="text-text">
                  {selectedMessage.created_at
                    ? new Date(selectedMessage.created_at).toLocaleString()
                    : 'N/A'}
                </span>
              </div>
            </div>

            {/* Full Message */}
            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase block mb-1">
                Full Inquiry Message
              </label>
              <div className="p-4 bg-white rounded-xl border border-border text-sm text-text leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            {/* Status Selector */}
            <div>
              <label
                htmlFor="modal-status-select"
                className="text-xs font-semibold text-text-secondary uppercase block mb-1"
              >
                Update Status
              </label>
              <select
                id="modal-status-select"
                value={modalStatus}
                onChange={(e) => setModalStatus(e.target.value)}
                disabled={modalLoading}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="NEW">NEW (Awaiting review)</option>
                <option value="READ">READ (In review)</option>
                <option value="RESOLVED">RESOLVED (Completed)</option>
              </select>
            </div>

            {/* Admin Response Textarea */}
            <div>
              <label
                htmlFor="modal-response-textarea"
                className="text-xs font-semibold text-text-secondary uppercase block mb-1"
              >
                Admin Response
              </label>
              <textarea
                id="modal-response-textarea"
                rows={4}
                value={modalResponse}
                onChange={(e) => setModalResponse(e.target.value)}
                placeholder="Type your official response to this inquiry..."
                disabled={modalLoading}
                className="w-full border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <p className="text-xs text-text-secondary mt-1">
                Saving a response will automatically send an email update to{' '}
                <span className="font-semibold">{selectedMessage.email}</span>.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContactMessageListPage;
