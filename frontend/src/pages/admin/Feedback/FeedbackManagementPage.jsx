import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiMessageSquare,
  FiSearch,
  FiStar,
  FiEye,
  FiTrash2,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiUser,
} from 'react-icons/fi';
import {
  Button,
  Badge,
  Alert,
  LoadingState,
  EmptyState,
  ErrorState,
} from '../../../components/common';
import Pagination from '../../../components/tables/Pagination';
import ConfirmDialog from '../../../components/modals/ConfirmDialog';
import { getFeedbacks, updateFeedback, deleteFeedback } from '../../../api/adminApi';

const STATUS_FILTERS = [
  { label: 'All Feedback', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Reviewed', value: 'REVIEWED' },
  { label: 'Resolved', value: 'RESOLVED' },
];

const RATING_FILTERS = [
  { label: 'All Ratings', value: '' },
  { label: '5 Stars', value: '5' },
  { label: '4 Stars', value: '4' },
  { label: '3 Stars', value: '3' },
  { label: '2 Stars', value: '2' },
  { label: '1 Star', value: '1' },
];

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
    <div className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
            }`}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-text">{rating}</span>
    </div>
  );
};

const FeedbackManagementPage = () => {
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackAlert, setFeedbackAlert] = useState(null);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Modals & Actions
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce search query (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        page_size: pageSize,
      };
      if (statusFilter) params.status = statusFilter;
      if (ratingFilter) params.rating = ratingFilter;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const data = await getFeedbacks(params);
      if (data.results) {
        setFeedbacks(data.results);
        setTotalCount(data.count || 0);
      } else if (Array.isArray(data)) {
        setFeedbacks(data);
        setTotalCount(data.length);
      } else {
        setFeedbacks([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Failed to load feedback:', err);
      setError(
        err.response?.data?.detail ||
        'Failed to load feedback submissions. Please check administrator permissions.'
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, statusFilter, ratingFilter, debouncedSearch]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  // Compute status summary counts
  const pendingCount = feedbacks.filter((f) => f.status === 'PENDING').length;
  const reviewedCount = feedbacks.filter((f) => f.status === 'REVIEWED').length;
  const resolvedCount = feedbacks.filter((f) => f.status === 'RESOLVED').length;

  const handleQuickStatus = async (item, newStatus, e) => {
    if (e) e.stopPropagation();
    setActionLoading(true);
    try {
      await updateFeedback(item.id, { status: newStatus });
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: newStatus } : f))
      );
      setFeedbackAlert({
        type: 'success',
        text: `Feedback #${item.id} status updated to ${newStatus}.`,
      });
    } catch (err) {
      console.error('Failed to update feedback status:', err);
      setFeedbackAlert({
        type: 'error',
        text: 'Failed to update feedback status.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteDialog = (item, e) => {
    if (e) e.stopPropagation();
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setActionLoading(true);
    try {
      await deleteFeedback(itemToDelete.id);
      setFeedbacks((prev) => prev.filter((f) => f.id !== itemToDelete.id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      setDeleteModalOpen(false);
      setFeedbackAlert({
        type: 'success',
        text: `Feedback #${itemToDelete.id} was deleted successfully.`,
      });
      setItemToDelete(null);
    } catch (err) {
      console.error('Failed to delete feedback:', err);
      setFeedbackAlert({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to delete feedback.',
      });
      setDeleteModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
              Feedback Management
            </h1>
            <Badge variant="info">Admin</Badge>
          </div>
          <p className="text-sm text-textSecondary mt-1">
            Review patient feedback ratings, usability suggestions, and record administrative resolution responses.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            variant="secondary"
            onClick={loadFeedbacks}
            disabled={loading}
            icon={<FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            className="inline-flex items-center justify-center gap-1 px-3"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* ── Summary Status Strip ───────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-border p-4 shadow-card">
          <span className="text-xs font-semibold text-textSecondary uppercase">Total</span>
          <p className="text-2xl font-bold text-text mt-1">{totalCount}</p>
        </div>

        <div className="bg-white rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-card">
          <span className="text-xs font-semibold text-amber-800 uppercase">Pending</span>
          <p className="text-2xl font-bold text-amber-700 mt-1">{pendingCount}</p>
        </div>

        <div className="bg-white rounded-xl border border-blue-200 bg-blue-50/40 p-4 shadow-card">
          <span className="text-xs font-semibold text-blue-800 uppercase">Reviewed</span>
          <p className="text-2xl font-bold text-blue-700 mt-1">{reviewedCount}</p>
        </div>

        <div className="bg-white rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-card">
          <span className="text-xs font-semibold text-emerald-800 uppercase">Resolved</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{resolvedCount}</p>
        </div>
      </div>

      {/* ── Feedback Alert ─────────────────────────────────────── */}
      {feedbackAlert && (
        <Alert
          variant={feedbackAlert.type}
          message={feedbackAlert.text}
          dismissible
          onClose={() => setFeedbackAlert(null)}
        />
      )}

      {/* ── Search & Filter Toolbar ────────────────────────────── */}
      <div className="bg-white rounded-xl border border-border shadow-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => {
                  setStatusFilter(f.value);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${statusFilter === f.value
                  ? 'bg-white text-text font-semibold shadow-xs'
                  : 'text-textSecondary hover:text-text'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-textSecondary uppercase">
              Rating:
            </span>
            <select
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-border rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              {RATING_FILTERS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {(statusFilter || ratingFilter || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('');
                setRatingFilter('');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="text-xs text-primary hover:underline font-medium px-2 py-1"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search subject, message, user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          <FiSearch className="w-4 h-4 text-textSecondary absolute left-3 top-2.5" />
        </div>
      </div>

      {/* ── Content States & Tables ────────────────────────────── */}
      {loading ? (
        <div className="bg-white rounded-xl border border-border shadow-card p-12">
          <LoadingState text="Loading feedback entries..." />
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-border shadow-card p-8">
          <ErrorState
            title="Failed to load feedback"
            message={error}
            onRetry={loadFeedbacks}
          />
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-white rounded-xl border border-border shadow-card p-10">
          <EmptyState
            title="No feedback submissions found"
            message={
              statusFilter || ratingFilter || debouncedSearch
                ? 'No feedback matches the selected filter parameters.'
                : 'No users have submitted feedback yet.'
            }
            action={
              statusFilter || ratingFilter || debouncedSearch ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter('');
                    setRatingFilter('');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              ) : null
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
          {/* ── Desktop Table View (md+) ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-border text-xs uppercase font-semibold text-textSecondary">
                <tr>
                  <th className="py-3.5 px-5">User</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {feedbacks.map((f) => (
                  <tr
                    key={f.id}
                    onClick={() => navigate(`/admin/feedback/${f.id}`)}
                    className="hover:bg-slate-50/75 cursor-pointer transition-colors"
                  >
                    {/* User */}
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-text">
                        {f.user_name || f.user_username || `User #${f.user}`}
                      </div>
                      <div className="text-xs text-textSecondary truncate">
                        {f.user_email || 'N/A'}
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-text truncate">{f.subject}</div>
                      <p className="text-xs text-textSecondary truncate mt-0.5">{f.message}</p>
                      {f.admin_response && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-0.5">
                          ✓ Response recorded
                        </span>
                      )}
                    </td>

                    {/* Rating Stars */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <RenderStars rating={f.rating} />
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(f.status)}>
                        {f.status}
                      </Badge>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-xs text-textSecondary whitespace-nowrap">
                      {f.created_at
                        ? new Date(f.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                        : '--'}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-5 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs px-2.5 py-1"
                          onClick={() => navigate(`/admin/feedback/${f.id}`)}
                          title="View Details"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                        </Button>

                        {f.status !== 'RESOLVED' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs px-2 py-1"
                            onClick={(e) => handleQuickStatus(f, 'RESOLVED', e)}
                            title="Mark as Resolved"
                          >
                            <FiCheckCircle className="w-3.5 h-3.5" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={(e) => openDeleteDialog(f, e)}
                          title="Delete Feedback"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Card View (<md) ── */}
          <div className="md:hidden divide-y divide-border">
            {feedbacks.map((f) => (
              <div
                key={f.id}
                onClick={() => navigate(`/admin/feedback/${f.id}`)}
                className="p-4 space-y-2 hover:bg-slate-50/75 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-text text-sm">{f.subject}</div>
                    <div className="text-xs text-textSecondary">
                      {f.user_name || f.user_username || 'Anonymous'}
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(f.status)}>{f.status}</Badge>
                </div>

                <p className="text-xs text-textSecondary line-clamp-2">{f.message}</p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <RenderStars rating={f.rating} />
                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-1"
                      onClick={() => navigate(`/admin/feedback/${f.id}`)}
                    >
                      <FiEye className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs px-2 py-1 text-red-600 hover:bg-red-50"
                      onClick={(e) => openDeleteDialog(f, e)}
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Pagination ── */}
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* ── Confirm Delete Modal ───────────────────────────────── */}
      <ConfirmDialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Feedback"
        message={`Are you sure you want to delete feedback #${itemToDelete?.id} "${itemToDelete?.subject}"? This action cannot be reversed.`}
        confirmLabel="Delete Feedback"
        variant="danger"
        loading={actionLoading}
      />
    </div>
  );
};

export default FeedbackManagementPage;
