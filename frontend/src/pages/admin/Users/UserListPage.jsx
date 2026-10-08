import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  FiUserPlus,
  FiSearch,
  FiFilter,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiTrash2,
  FiRefreshCw,
  FiUserCheck,
  FiUserX,
  FiActivity,
  FiClock,
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
import { getUsers, updateUser, deleteUser } from '../../../api/adminApi';
import { AuthContext } from '../../../context/AuthContext';
import { ROUTES } from '../../../constants/routes';

const ROLE_OPTIONS = [
  { label: 'All Roles', value: '' },
  { label: 'Patient', value: 'PATIENT' },
  { label: 'Doctor', value: 'DOCTOR' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
];

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' },
];

const getRoleBadgeVariant = (role) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'danger';
    case 'ADMIN':
      return 'warning';
    case 'DOCTOR':
      return 'info';
    case 'PATIENT':
    default:
      return 'success';
  }
};

const UserListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: currentAdmin } = useContext(AuthContext);

  const initialRole = searchParams.get('role') || '';
  const initialStatus = searchParams.get('is_active') || '';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filters & Pagination
  const [roleFilter, setRoleFilter] = useState(initialRole);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Modals / Action states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce search query (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync role param if URL changes
  useEffect(() => {
    const r = searchParams.get('role');
    if (r !== null && r !== roleFilter) {
      setRoleFilter(r);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        page_size: pageSize,
      };
      if (roleFilter) params.role = roleFilter;
      if (statusFilter !== '') params.is_active = statusFilter;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const data = await getUsers(params);
      if (data.results) {
        setUsers(data.results);
        setTotalCount(data.count || 0);
      } else if (Array.isArray(data)) {
        setUsers(data);
        setTotalCount(data.length);
      } else {
        setUsers([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(
        err.response?.data?.detail ||
        'Failed to load user records. Please verify administrator permissions.'
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, roleFilter, statusFilter, debouncedSearch]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleStatus = async (user, e) => {
    if (e) e.stopPropagation();
    if (user.id === currentAdmin?.id) {
      setFeedback({
        type: 'error',
        text: 'You cannot deactivate your own account.',
      });
      return;
    }

    const newStatus = !user.is_active;
    setActionLoading(true);
    setFeedback(null);
    try {
      await updateUser(user.id, { is_active: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: newStatus } : u))
      );
      setFeedback({
        type: 'success',
        text: `User "${user.username}" ${newStatus ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (err) {
      console.error('Failed to toggle user status:', err);
      const errDetail =
        err.response?.data?.is_active ||
        err.response?.data?.detail ||
        'Could not update user status.';
      setFeedback({
        type: 'error',
        text: typeof errDetail === 'string' ? errDetail : JSON.stringify(errDetail),
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteDialog = (user, e) => {
    if (e) e.stopPropagation();
    if (user.id === currentAdmin?.id) {
      setFeedback({
        type: 'error',
        text: 'You cannot delete your own account.',
      });
      return;
    }
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setActionLoading(true);
    try {
      await deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      setDeleteModalOpen(false);
      setFeedback({
        type: 'success',
        text: `User "${userToDelete.username}" has been deleted permanently.`,
      });
      setUserToDelete(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
      const errDetail =
        err.response?.data?.detail ||
        'Failed to delete user account.';
      setFeedback({
        type: 'error',
        text: errDetail,
      });
      setDeleteModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const getInitials = (user) => {
    if (user.full_name) {
      const parts = user.full_name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return user.full_name.substring(0, 2).toUpperCase();
    }
    return (user.username || 'U').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
              User Management
            </h1>
            <Badge variant="info">Admin</Badge>
          </div>
          <p className="text-sm text-textSecondary mt-1">
            Manage user accounts, roles, access permissions, and prediction counts across the platform.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            variant="secondary"
            onClick={loadUsers}
            disabled={loading}
            icon={<FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            className="inline-flex items-center justify-center gap-1 px-3"
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.ADMIN_USER_FORM)}
            icon={<FiUserPlus className="w-4 h-4" />}
            className="inline-flex items-center justify-center gap-1 px-3"
          >
            Add User
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
      <div className="bg-white rounded-xl border border-border shadow-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-textSecondary uppercase">
              Role:
            </span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-border rounded-lg px-3 py-1.5 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              {ROLE_OPTIONS.map((opt) => (
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

          {(roleFilter || statusFilter || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setRoleFilter('');
                setStatusFilter('');
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
            placeholder="Search by name, username, email..."
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
          <LoadingState text="Loading users..." />
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-border shadow-card p-8">
          <ErrorState
            title="Failed to load users"
            message={error}
            onRetry={loadUsers}
          />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl border border-border shadow-card p-10">
          <EmptyState
            title="No users found"
            message={
              roleFilter || statusFilter || debouncedSearch
                ? 'No user records match your selected filters or search query.'
                : 'No user accounts have been registered yet.'
            }
            action={
              roleFilter || statusFilter || debouncedSearch ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setRoleFilter('');
                    setStatusFilter('');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                >
                  Reset Filters
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => navigate(ROUTES.ADMIN_USER_FORM)}
                >
                  Create First User
                </Button>
              )
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
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Verified</th>
                  <th className="py-3.5 px-4 text-center">Predictions</th>
                  <th className="py-3.5 px-4">Last Login</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => {
                  const isCurrent = u.id === currentAdmin?.id;
                  return (
                    <tr
                      key={u.id}
                      onClick={() => navigate(`/admin/users/${u.id}`)}
                      className="hover:bg-slate-50/75 cursor-pointer transition-colors"
                    >
                      {/* User Info (Avatar + Full Name + Username + Email) */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-teal-50 text-primary border border-teal-200 font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {getInitials(u)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-text truncate flex items-center gap-1.5">
                              {u.full_name || u.username}
                              {isCurrent && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-normal">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-textSecondary truncate">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <Badge variant={getRoleBadgeVariant(u.role)}>
                          {u.role ? u.role.replace('_', ' ') : 'PATIENT'}
                        </Badge>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${u.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                          />
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Email Verified */}
                      <td className="py-3.5 px-4 text-center">
                        {u.is_email_verified ? (
                          <span
                            className="inline-flex text-emerald-600"
                            title="Email Verified"
                          >
                            <FiCheckCircle className="w-4 h-4" />
                          </span>
                        ) : (
                          <span
                            className="inline-flex text-slate-400"
                            title="Not Verified"
                          >
                            <FiXCircle className="w-4 h-4" />
                          </span>
                        )}
                      </td>

                      {/* Prediction Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-text font-semibold text-xs">
                          <FiActivity className="w-3 h-3 text-primary" />
                          {u.prediction_count ?? 0}
                        </span>
                      </td>

                      {/* Last Login */}
                      <td className="py-3.5 px-4 text-xs text-textSecondary whitespace-nowrap">
                        {u.last_login ? (
                          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                            <FiClock className="w-3 h-3 text-emerald-600" />
                            {new Date(u.last_login).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Never</span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-xs text-textSecondary whitespace-nowrap">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString(undefined, {
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
                            onClick={() => navigate(`/admin/users/${u.id}`)}
                            title="View user details & activity history"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50"
                            onClick={() => navigate(`/admin/activity-logs?username=${u.username}`)}
                            title="View all Login / Logout Activity Logs"
                          >
                            <FiClock className="w-3.5 h-3.5" />
                          </Button>

                          {!isCurrent && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`text-xs px-2 py-1 ${u.is_active
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                                }`}
                              onClick={(e) => handleToggleStatus(u, e)}
                              disabled={actionLoading}
                              title={u.is_active ? 'Deactivate User' : 'Activate User'}
                            >
                              {u.is_active ? (
                                <FiUserX className="w-3.5 h-3.5" />
                              ) : (
                                <FiUserCheck className="w-3.5 h-3.5" />
                              )}
                            </Button>
                          )}

                          {!isCurrent && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={(e) => openDeleteDialog(u, e)}
                              disabled={actionLoading}
                              title="Delete user"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
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
            {users.map((u) => {
              const isCurrent = u.id === currentAdmin?.id;
              return (
                <div
                  key={u.id}
                  onClick={() => navigate(`/admin/users/${u.id}`)}
                  className="p-4 space-y-3 hover:bg-slate-50/75 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-50 text-primary border border-teal-200 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {getInitials(u)}
                      </div>
                      <div>
                        <div className="font-semibold text-text flex items-center gap-1.5">
                          {u.full_name || u.username}
                          {isCurrent && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-textSecondary">{u.email}</div>
                      </div>
                    </div>

                    <Badge variant={getRoleBadgeVariant(u.role)}>
                      {u.role ? u.role.replace('_', ' ') : 'PATIENT'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-textSecondary pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${u.is_active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                          }`}
                      >
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span>Predictions: {u.prediction_count ?? 0}</span>
                    </div>

                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs px-2 py-1"
                        onClick={() => navigate(`/admin/users/${u.id}`)}
                      >
                        <FiEye className="w-3.5 h-3.5" />
                      </Button>

                      {!isCurrent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs px-2 py-1 text-red-600 hover:bg-red-50"
                          onClick={(e) => openDeleteDialog(u, e)}
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
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
        title="Delete User Account"
        message={`Are you sure you want to permanently delete user "${userToDelete?.username}" (${userToDelete?.email})? All associated predictions and feedback will be removed.`}
        confirmLabel="Delete User"
        variant="danger"
        loading={actionLoading}
      />
    </div>
  );
};

export default UserListPage;
