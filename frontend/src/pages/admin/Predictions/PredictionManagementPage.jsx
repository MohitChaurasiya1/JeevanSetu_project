import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  FiActivity,
  FiSearch,
  FiDownload,
  FiEye,
  FiTrash2,
  FiRefreshCw,
  FiCalendar,
  FiShield,
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
import { getAdminPredictions, deleteAdminPrediction } from '../../../api/adminApi';
import { ROUTES } from '../../../constants/routes';

const RISK_FILTERS = [
  { label: 'All Risk Levels', value: '' },
  { label: 'High Risk', value: 'HIGH' },
  { label: 'Medium Risk', value: 'MEDIUM' },
  { label: 'Low Risk', value: 'LOW' },
];

const getRiskBadgeVariant = (riskLevel) => {
  switch (riskLevel?.toUpperCase()) {
    case 'HIGH':
      return 'danger';
    case 'MEDIUM':
      return 'warning';
    case 'LOW':
    default:
      return 'success';
  }
};

const getProgressBarColor = (riskLevel) => {
  switch (riskLevel?.toUpperCase()) {
    case 'HIGH':
      return 'bg-red-500';
    case 'MEDIUM':
      return 'bg-amber-500';
    case 'LOW':
    default:
      return 'bg-emerald-500';
  }
};

const PredictionManagementPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRisk = searchParams.get('risk_level') || '';
  const initialUserId = searchParams.get('user_id') || '';

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filter States
  const [riskFilter, setRiskFilter] = useState(initialRisk);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Actions / Modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [predToDelete, setPredToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Debounce search query (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadPredictions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        page_size: pageSize,
      };
      if (riskFilter) params.risk_level = riskFilter;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      if (initialUserId) params.user_id = initialUserId;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const data = await getAdminPredictions(params);
      if (data.results) {
        setPredictions(data.results);
        setTotalCount(data.count || 0);
      } else if (Array.isArray(data)) {
        setPredictions(data);
        setTotalCount(data.length);
      } else {
        setPredictions([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Failed to load predictions:', err);
      setError(
        err.response?.data?.detail ||
          'Failed to load prediction records. Please verify administrator permissions.'
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, riskFilter, dateFrom, dateTo, initialUserId, debouncedSearch]);

  useEffect(() => {
    loadPredictions();
  }, [loadPredictions]);

  const openDeleteDialog = (pred, e) => {
    if (e) e.stopPropagation();
    setPredToDelete(pred);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!predToDelete) return;
    setActionLoading(true);
    try {
      await deleteAdminPrediction(predToDelete.id);
      setPredictions((prev) => prev.filter((p) => p.id !== predToDelete.id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      setDeleteModalOpen(false);
      setFeedback({
        type: 'success',
        text: `Prediction #${predToDelete.id} was deleted successfully.`,
      });
      setPredToDelete(null);
    } catch (err) {
      console.error('Failed to delete prediction:', err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to delete prediction record.',
      });
      setDeleteModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  // Export CSV Handler
  const handleExportCSV = async () => {
    setExportLoading(true);
    try {
      // Fetch larger batch of filtered records for complete export
      const exportParams = {
        page: 1,
        page_size: 500,
      };
      if (riskFilter) exportParams.risk_level = riskFilter;
      if (dateFrom) exportParams.date_from = dateFrom;
      if (dateTo) exportParams.date_to = dateTo;
      if (initialUserId) exportParams.user_id = initialUserId;
      if (debouncedSearch.trim()) exportParams.search = debouncedSearch.trim();

      const data = await getAdminPredictions(exportParams);
      const records = data.results || data || [];

      if (records.length === 0) {
        setFeedback({ type: 'warning', text: 'No records available to export with current filters.' });
        return;
      }

      const headers = [
        'ID',
        'User Full Name',
        'Username',
        'Email',
        'Disease',
        'Prediction Result',
        'Probability (%)',
        'Risk Level',
        'Model Version',
        'Created At',
      ];

      const csvRows = [
        headers.join(','),
        ...records.map((r) => [
          r.id,
          `"${(r.user?.full_name || '').replace(/"/g, '""')}"`,
          `"${(r.user?.username || '').replace(/"/g, '""')}"`,
          `"${(r.user?.email || '').replace(/"/g, '""')}"`,
          `"${(r.disease_name || 'Diabetes').replace(/"/g, '""')}"`,
          `"${(r.prediction_result || '').replace(/"/g, '""')}"`,
          (Number(r.probability || 0) * 100).toFixed(2),
          `"${r.risk_level || ''}"`,
          `"${r.model_version || ''}"`,
          `"${r.created_at || ''}"`,
        ].join(',')),
      ];

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `jeevansetu_predictions_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setFeedback({ type: 'success', text: `Exported ${records.length} prediction records successfully.` });
    } catch (err) {
      console.error('Export CSV failed:', err);
      setFeedback({ type: 'error', text: 'Failed to export CSV. Please try again.' });
    } finally {
      setExportLoading(false);
    }
  };

  const getInitials = (user) => {
    if (user?.full_name) {
      const parts = user.full_name.trim().split(' ');
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return user.full_name.substring(0, 2).toUpperCase();
    }
    return (user?.username || 'U').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
              Predictions Management
            </h1>
            <Badge variant="info">Admin</Badge>
          </div>
          <p className="text-sm text-textSecondary mt-1">
            Browse, inspect, filter, and export patient disease risk assessments generated by the AI engine.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            variant="outline"
            onClick={loadPredictions}
            disabled={loading}
            icon={<FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            onClick={handleExportCSV}
            loading={exportLoading}
            disabled={loading || exportLoading}
            icon={<FiDownload className="w-4 h-4" />}
          >
            Export CSV
          </Button>
        </div>
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

      {/* ── Search & Filter Toolbar ────────────────────────────── */}
      <div className="bg-white rounded-xl border border-border shadow-card p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Risk Level Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-textSecondary uppercase">
              Risk:
            </span>
            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-border rounded-lg px-3 py-1.5 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              {RISK_FILTERS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-textSecondary uppercase">
              From:
            </span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-border rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Date To */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-textSecondary uppercase">
              To:
            </span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-border rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {(riskFilter || dateFrom || dateTo || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setRiskFilter('');
                setDateFrom('');
                setDateTo('');
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
        <div className="relative w-full lg:w-80">
          <input
            type="text"
            placeholder="Search user, email, result..."
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
          <LoadingState text="Loading predictions..." />
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-border shadow-card p-8">
          <ErrorState
            title="Failed to load predictions"
            message={error}
            onRetry={loadPredictions}
          />
        </div>
      ) : predictions.length === 0 ? (
        <div className="bg-white rounded-xl border border-border shadow-card p-10">
          <EmptyState
            title="No prediction records found"
            message={
              riskFilter || dateFrom || dateTo || debouncedSearch
                ? 'No predictions match the active filter criteria.'
                : 'No disease assessments have been executed on the platform yet.'
            }
            action={
              riskFilter || dateFrom || dateTo || debouncedSearch ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setRiskFilter('');
                    setDateFrom('');
                    setDateTo('');
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
                  <th className="py-3.5 px-5">Patient / User</th>
                  <th className="py-3.5 px-4">Disease</th>
                  <th className="py-3.5 px-4">Prediction Result</th>
                  <th className="py-3.5 px-4">Probability</th>
                  <th className="py-3.5 px-4">Risk Level</th>
                  <th className="py-3.5 px-4">Version</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {predictions.map((p) => {
                  const probPct = Math.round((p.probability || 0) * 100);
                  const barColor = getProgressBarColor(p.risk_level);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => navigate(`/admin/predictions/${p.id}`)}
                      className="hover:bg-slate-50/75 cursor-pointer transition-colors"
                    >
                      {/* User Info */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-50 text-primary border border-teal-200 font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {getInitials(p.user)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-text truncate">
                              {p.user?.full_name || p.user?.username || 'Anonymous'}
                            </div>
                            <div className="text-xs text-textSecondary truncate">
                              {p.user?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Disease */}
                      <td className="py-3.5 px-4 font-medium text-text">
                        {p.disease_name || 'Diabetes'}
                      </td>

                      {/* Prediction Result */}
                      <td className="py-3.5 px-4 text-text">
                        <span className="font-medium">{p.prediction_result}</span>
                      </td>

                      {/* Probability with Progress Bar */}
                      <td className="py-3.5 px-4 min-w-[130px]">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono font-medium">
                            <span>{probPct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${barColor}`}
                              style={{ width: `${Math.min(100, Math.max(5, probPct))}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Risk Badge */}
                      <td className="py-3.5 px-4">
                        <Badge variant={getRiskBadgeVariant(p.risk_level)}>
                          {p.risk_level}
                        </Badge>
                      </td>

                      {/* Model Version */}
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-500">
                        v{p.model_version || '1.0.0'}
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 text-xs text-textSecondary whitespace-nowrap">
                        {p.created_at
                          ? new Date(p.created_at).toLocaleDateString(undefined, {
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
                            onClick={() => navigate(`/admin/predictions/${p.id}`)}
                            title="View evaluation details"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={(e) => openDeleteDialog(p, e)}
                            disabled={actionLoading}
                            title="Delete prediction record"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Card View (<md) ── */}
          <div className="md:hidden divide-y divide-border">
            {predictions.map((p) => {
              const probPct = Math.round((p.probability || 0) * 100);
              const barColor = getProgressBarColor(p.risk_level);
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/admin/predictions/${p.id}`)}
                  className="p-4 space-y-3 hover:bg-slate-50/75 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal-50 text-primary border border-teal-200 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {getInitials(p.user)}
                      </div>
                      <div>
                        <div className="font-semibold text-text text-sm">
                          {p.user?.full_name || p.user?.username || 'Anonymous'}
                        </div>
                        <div className="text-xs text-textSecondary">{p.disease_name || 'Diabetes'}</div>
                      </div>
                    </div>

                    <Badge variant={getRiskBadgeVariant(p.risk_level)}>
                      {p.risk_level}
                    </Badge>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-textSecondary">Result:</span>
                      <span className="font-semibold text-text">{p.prediction_result}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-textSecondary">
                        <span>Probability:</span>
                        <span className="font-mono font-semibold text-text">{probPct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${barColor}`}
                          style={{ width: `${Math.min(100, Math.max(5, probPct))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-textSecondary pt-1">
                    <span>
                      {p.created_at ? new Date(p.created_at).toLocaleDateString() : '--'}
                    </span>

                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs px-2 py-1"
                        onClick={() => navigate(`/admin/predictions/${p.id}`)}
                      >
                        <FiEye className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs px-2 py-1 text-red-600 hover:bg-red-50"
                        onClick={(e) => openDeleteDialog(p, e)}
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
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
        title="Delete Prediction Record"
        message={`Are you sure you want to delete prediction record #${predToDelete?.id}? This action cannot be reversed.`}
        confirmLabel="Delete Record"
        variant="danger"
        loading={actionLoading}
      />
    </div>
  );
};

export default PredictionManagementPage;
