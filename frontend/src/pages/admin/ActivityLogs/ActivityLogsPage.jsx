import React, { useState, useEffect, useCallback } from 'react';
import {
  FiClock,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiShield,
  FiChevronDown,
  FiChevronUp,
  FiActivity,
  FiLogIn,
  FiUserPlus,
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
import { getAuditLogs, getAuditSummary } from '../../../api/adminApi';

const ACTION_OPTIONS = [
  { label: 'All Actions', value: '' },
  { label: 'Login', value: 'LOGIN' },
  { label: 'Register', value: 'REGISTER' },
  { label: 'Logout', value: 'LOGOUT' },
  { label: 'Profile Update', value: 'PROFILE_UPDATE' },
  { label: 'Password Change', value: 'PASSWORD_CHANGE' },
  { label: 'Other', value: 'OTHER' },
];

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'Success', value: 'SUCCESS' },
  { label: 'Failed', value: 'FAILED' },
];

const MODULE_OPTIONS = [
  { label: 'All Modules', value: '' },
  { label: 'Auth', value: 'AUTH' },
  { label: 'Users', value: 'USERS' },
  { label: 'Predictions', value: 'PREDICTIONS' },
  { label: 'Diseases', value: 'DISEASES' },
  { label: 'Feedback', value: 'FEEDBACK' },
  { label: 'Settings', value: 'SETTINGS' },
  { label: 'Other', value: 'OTHER' },
];

const getActionBadgeVariant = (action) => {
  switch (action?.toUpperCase()) {
    case 'LOGIN':
      return 'info';
    case 'REGISTER':
      return 'success';
    case 'PASSWORD_CHANGE':
    case 'PROFILE_UPDATE':
      return 'warning';
    case 'LOGOUT':
      return 'secondary';
    default:
      return 'info';
  }
};

const ActivityLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Expanded Row ID for User Agent & Full Details
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Debounce search query (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const data = await getAuditSummary();
      setSummary(data);
    } catch (err) {
      console.warn('Failed to load audit summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        page_size: pageSize,
      };
      if (actionFilter) params.action = actionFilter;
      if (statusFilter) params.status = statusFilter;
      if (moduleFilter) params.module = moduleFilter;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const data = await getAuditLogs(params);
      if (data.results) {
        setLogs(data.results);
        setTotalCount(data.count || 0);
      } else if (Array.isArray(data)) {
        setLogs(data);
        setTotalCount(data.length);
      } else {
        setLogs([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Failed to load activity logs:', err);
      setError(
        err.response?.data?.detail ||
          'Failed to load audit logs. Please verify administrator access permissions.'
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, actionFilter, statusFilter, moduleFilter, debouncedSearch]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleRefreshAll = () => {
    loadSummary();
    loadLogs();
  };

  const toggleRowExpand = (id) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
              System Audit & Activity Logs
            </h1>
            <Badge variant="info">Security</Badge>
          </div>
          <p className="text-sm text-textSecondary mt-1">
            Real-time administrative ledger tracking authentication events, security flags, and system modifications.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            variant="outline"
            onClick={handleRefreshAll}
            disabled={loading}
            icon={<FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* ── 4 Summary Stat Cards ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
              Total Log Entries
            </span>
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-primary flex items-center justify-center">
              <FiActivity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
              {summaryLoading ? '--' : (summary?.total_logs ?? 0).toLocaleString()}
            </span>
            <span className="text-xs text-textSecondary">Recorded</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
              New Registrations
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-secondary flex items-center justify-center">
              <FiUserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
              {summaryLoading ? '--' : (summary?.total_registrations ?? 0).toLocaleString()}
            </span>
            <span className="text-xs text-textSecondary">Accounts</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
              Successful Logins
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FiCheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-text tracking-tight text-emerald-700">
              {summaryLoading ? '--' : (summary?.total_successful_logins ?? 0).toLocaleString()}
            </span>
            <span className="text-xs text-textSecondary">Authorized</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
              Failed Logins
            </span>
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <FiAlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-text tracking-tight text-red-700">
              {summaryLoading ? '--' : (summary?.total_failed_logins ?? 0).toLocaleString()}
            </span>
            <span className="text-xs text-textSecondary">Security Alerts</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Toolbar ────────────────────────────── */}
      <div className="bg-white rounded-xl border border-border shadow-card p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Action Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-textSecondary uppercase">
              Action:
            </span>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-border rounded-lg px-3 py-1.5 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              {ACTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-textSecondary uppercase">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-border rounded-lg px-3 py-1.5 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Module Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-textSecondary uppercase">
              Module:
            </span>
            <select
              value={moduleFilter}
              onChange={(e) => {
                setModuleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-border rounded-lg px-3 py-1.5 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              {MODULE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {(actionFilter || statusFilter || moduleFilter || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setActionFilter('');
                setStatusFilter('');
                setModuleFilter('');
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
            placeholder="Search username, IP, action..."
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
          <LoadingState text="Loading audit logs..." />
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-border shadow-card p-8">
          <ErrorState
            title="Failed to load activity logs"
            message={error}
            onRetry={loadLogs}
          />
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-xl border border-border shadow-card p-10">
          <EmptyState
            title="No audit logs found"
            message={
              actionFilter || statusFilter || moduleFilter || debouncedSearch
                ? 'No activity logs match your filter criteria.'
                : 'No security or audit records have been generated yet.'
            }
            action={
              actionFilter || statusFilter || moduleFilter || debouncedSearch ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setActionFilter('');
                    setStatusFilter('');
                    setModuleFilter('');
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
                  <th className="py-3.5 px-5">Timestamp</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Module</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">IP Address</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => {
                  const isExpanded = expandedRowId === log.id;
                  const isSuccess = log.status === 'SUCCESS';
                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => toggleRowExpand(log.id)}
                        className={`hover:bg-slate-50/75 cursor-pointer transition-colors ${
                          isExpanded ? 'bg-slate-50/90' : ''
                        }`}
                      >
                        {/* Timestamp */}
                        <td className="py-3.5 px-5 text-xs text-textSecondary whitespace-nowrap">
                          {log.created_at
                            ? new Date(log.created_at).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })
                            : '--'}
                        </td>

                        {/* User */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-text">
                            {log.username || log.user?.username || 'Anonymous'}
                          </span>
                        </td>

                        {/* Action Badge */}
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                            {log.action}
                          </span>
                        </td>

                        {/* Module */}
                        <td className="py-3.5 px-4">
                          <span className="text-xs font-mono text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded">
                            {log.module}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isSuccess
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSuccess ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                            />
                            {log.status}
                          </span>
                        </td>

                        {/* IP Address */}
                        <td className="py-3.5 px-4 font-mono text-xs text-textSecondary whitespace-nowrap">
                          {log.ip_address || '127.0.0.1'}
                        </td>

                        {/* Description */}
                        <td className="py-3.5 px-4 max-w-xs truncate text-text">
                          {log.description || '--'}
                        </td>

                        {/* Expand Icon */}
                        <td className="py-3.5 px-4 text-right text-textSecondary">
                          {isExpanded ? (
                            <FiChevronUp className="w-4 h-4 inline" />
                          ) : (
                            <FiChevronDown className="w-4 h-4 inline" />
                          )}
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-border">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="bg-white rounded-xl border border-border p-4 space-y-2.5 text-xs">
                              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <span className="font-semibold text-text">
                                  Log Record #{log.id} Detailed Payload
                                </span>
                                {log.record_id && (
                                  <span className="font-mono text-slate-400">
                                    Target Record ID: {log.record_id}
                                  </span>
                                )}
                              </div>
                              <div>
                                <span className="font-semibold text-textSecondary block mb-0.5">
                                  Description:
                                </span>
                                <p className="text-text font-medium">{log.description || 'No description recorded.'}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-textSecondary block mb-0.5">
                                  User Agent:
                                </span>
                                <p className="font-mono text-slate-500 break-all bg-slate-50 p-2 rounded border border-slate-100">
                                  {log.user_agent || 'Standard HTTP Client / Browser'}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Card View (<md) ── */}
          <div className="md:hidden divide-y divide-border">
            {logs.map((log) => {
              const isExpanded = expandedRowId === log.id;
              const isSuccess = log.status === 'SUCCESS';
              return (
                <div
                  key={log.id}
                  onClick={() => toggleRowExpand(log.id)}
                  className="p-4 space-y-2 hover:bg-slate-50/75 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSuccess ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      />
                      <span className="font-semibold text-text text-sm">
                        {log.username || log.user?.username || 'Anonymous'}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {log.action}
                    </span>
                  </div>

                  <p className="text-xs text-textSecondary">{log.description}</p>

                  <div className="flex items-center justify-between text-[11px] text-textSecondary pt-1">
                    <span>
                      {log.created_at ? new Date(log.created_at).toLocaleString() : '--'}
                    </span>
                    <span className="font-mono text-slate-400">
                      {log.ip_address || '127.0.0.1'}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="pt-2 border-t border-slate-100 text-xs text-textSecondary space-y-1">
                      <div><strong className="text-text">Module:</strong> {log.module}</div>
                      <div><strong className="text-text">User Agent:</strong> {log.user_agent || 'Browser'}</div>
                    </div>
                  )}
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
    </div>
  );
};

export default ActivityLogsPage;
