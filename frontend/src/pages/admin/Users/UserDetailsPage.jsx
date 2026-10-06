import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiUserCheck,
  FiUserX,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShield,
  FiActivity,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';
import {
  Button,
  Badge,
  Alert,
  LoadingState,
  ErrorState,
  Modal,
} from '../../../components/common';
import ConfirmDialog from '../../../components/modals/ConfirmDialog';
import { getUserById, updateUser, deleteUser, getAdminPredictions } from '../../../api/adminApi';
import { AuthContext } from '../../../context/AuthContext';
import { ROUTES } from '../../../constants/routes';

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

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentAdmin } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    gender: 'OTHER',
    date_of_birth: '',
    role: 'PATIENT',
    is_active: true,
    is_email_verified: false,
  });

  // Delete Dialog State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const isSelf = user?.id === currentAdmin?.id;

  const loadUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await getUserById(id);
      setUser(userData);
      setEditForm({
        full_name: userData.full_name || '',
        phone: userData.phone || '',
        gender: userData.gender || 'OTHER',
        date_of_birth: userData.date_of_birth || '',
        role: userData.role || 'PATIENT',
        is_active: userData.is_active ?? true,
        is_email_verified: userData.is_email_verified ?? false,
      });

      // Load user's recent predictions
      try {
        const predData = await getAdminPredictions({ user_id: id });
        setPredictions(predData.results || predData || []);
      } catch (predErr) {
        console.warn('Could not load user predictions:', predErr);
      }
    } catch (err) {
      console.error('Failed to load user details:', err);
      setError(
        err.response?.data?.detail || 'User not found or you do not have permission to view this account.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleToggleStatus = async () => {
    if (isSelf) {
      setFeedback({ type: 'error', text: 'You cannot deactivate your own account.' });
      return;
    }
    const newStatus = !user.is_active;
    setActionLoading(true);
    setFeedback(null);
    try {
      const updated = await updateUser(user.id, { is_active: newStatus });
      setUser(updated);
      setFeedback({
        type: 'success',
        text: `User account has been ${newStatus ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (err) {
      console.error('Failed to toggle status:', err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to update account status.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setFeedback(null);
    try {
      const payload = {
        full_name: editForm.full_name.trim(),
        phone: editForm.phone ? editForm.phone.trim() : null,
        gender: editForm.gender,
        date_of_birth: editForm.date_of_birth || null,
        role: editForm.role,
        is_active: editForm.is_active,
        is_email_verified: editForm.is_email_verified,
      };

      const updated = await updateUser(user.id, payload);
      setUser(updated);
      setEditModalOpen(false);
      setFeedback({
        type: 'success',
        text: 'User profile details updated successfully.',
      });
    } catch (err) {
      console.error('Failed to update user:', err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to update user profile. Check input fields.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (isSelf) {
      setFeedback({ type: 'error', text: 'You cannot delete your own account.' });
      return;
    }
    setActionLoading(true);
    try {
      await deleteUser(user.id);
      navigate(ROUTES.ADMIN_USERS, {
        state: { message: `User "${user.username}" deleted successfully.` },
      });
    } catch (err) {
      console.error('Failed to delete user:', err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to delete user account.',
      });
      setDeleteModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl border border-border shadow-card p-12">
          <LoadingState text="Loading user profile details..." />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl border border-border shadow-card p-8 text-center space-y-4">
          <ErrorState
            title="User Profile Not Found"
            message={error || 'The requested user does not exist.'}
            onRetry={loadUserData}
          />
          <div>
            <Link to={ROUTES.ADMIN_USERS}>
              <Button variant="outline">← Back to User List</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    if (user.full_name) {
      const parts = user.full_name.trim().split(' ');
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return user.full_name.substring(0, 2).toUpperCase();
    }
    return (user.username || 'U').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Breadcrumb & Navigation Bar ────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.ADMIN_USERS}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-textSecondary hover:text-primary transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Users</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant={getRoleBadgeVariant(user.role)}>
            {user.role ? user.role.replace('_', ' ') : 'PATIENT'}
          </Badge>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.is_active
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                user.is_active ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            />
            {user.is_active ? 'Active' : 'Inactive'}
          </span>
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

      {/* ── User Overview Hero Card ────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-primary border border-teal-200 font-bold text-xl flex items-center justify-center shadow-sm flex-shrink-0">
              {getInitials()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text flex items-center gap-2">
                {user.full_name || user.username}
                {isSelf && (
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-normal">
                    You
                  </span>
                )}
              </h1>
              <p className="text-sm text-textSecondary mt-0.5">
                @{user.username} • User ID #{user.id}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditModalOpen(true)}
              icon={<FiEdit className="w-4 h-4" />}
            >
              Edit Profile
            </Button>

            {!isSelf && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleStatus}
                disabled={actionLoading}
                className={user.is_active ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}
                icon={user.is_active ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
              >
                {user.is_active ? 'Deactivate' : 'Activate'}
              </Button>
            )}

            {!isSelf && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteModalOpen(true)}
                disabled={actionLoading}
                icon={<FiTrash2 className="w-4 h-4" />}
              >
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* ── Key User Metrics Strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-border">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-textSecondary block">Predictions Made</span>
            <span className="text-2xl font-bold text-text tracking-tight mt-1 flex items-center gap-2">
              <FiActivity className="w-5 h-5 text-primary" />
              {user.prediction_count ?? predictions.length}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-textSecondary block">Account Role</span>
            <span className="text-base font-bold text-text tracking-tight mt-1.5 flex items-center gap-1.5">
              <FiShield className="w-4 h-4 text-primary" />
              {user.role}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-textSecondary block">Email Status</span>
            <span className="text-sm font-semibold text-text tracking-tight mt-1.5 flex items-center gap-1.5">
              {user.is_email_verified ? (
                <>
                  <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                  Verified
                </>
              ) : (
                <>
                  <FiXCircle className="w-4 h-4 text-slate-400" />
                  Unverified
                </>
              )}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-textSecondary block">Last Login</span>
            <span className="text-xs font-semibold text-text tracking-tight mt-2 flex items-center gap-1.5 truncate">
              <FiClock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
            </span>
          </div>
        </div>

        {/* ── Detailed Profile Fields Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6 text-sm">
          <div>
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider block mb-1">
              Email Address
            </span>
            <a href={`mailto:${user.email}`} className="text-primary hover:underline font-medium flex items-center gap-1.5 truncate">
              <FiMail className="w-4 h-4 flex-shrink-0" />
              {user.email}
            </a>
          </div>

          <div>
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider block mb-1">
              Phone Number
            </span>
            <span className="text-text font-medium flex items-center gap-1.5">
              <FiPhone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {user.phone || 'Not provided'}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider block mb-1">
              Gender
            </span>
            <span className="text-text font-medium capitalize">
              {user.gender ? user.gender.toLowerCase() : 'Other'}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider block mb-1">
              Date of Birth
            </span>
            <span className="text-text font-medium flex items-center gap-1.5">
              <FiCalendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {user.date_of_birth || 'Not specified'}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider block mb-1">
              Account Created
            </span>
            <span className="text-text font-medium">
              {user.created_at ? new Date(user.created_at).toLocaleString() : '--'}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider block mb-1">
              Last Profile Update
            </span>
            <span className="text-text font-medium">
              {user.updated_at ? new Date(user.updated_at).toLocaleString() : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Recent User Predictions Section ────────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-text">Recent Predictions</h2>
            <p className="text-xs text-textSecondary mt-0.5">
              Health assessments and evaluations generated by this user.
            </p>
          </div>
          {predictions.length > 0 && (
            <Link
              to={`/admin/predictions?user_id=${user.id}`}
              className="text-xs font-semibold text-primary hover:underline"
            >
              View in Predictions ↗
            </Link>
          )}
        </div>

        {predictions.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-border">
            <FiActivity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-text">No prediction records</p>
            <p className="text-xs text-textSecondary mt-0.5">
              This user has not generated any disease risk predictions yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-border text-xs uppercase font-semibold text-textSecondary">
                <tr>
                  <th className="py-3 px-4">Disease / Test</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4">Probability</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {predictions.slice(0, 5).map((pred) => (
                  <tr key={pred.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-3 px-4 font-semibold text-text">
                      {pred.disease_name || 'Diabetes'}
                    </td>
                    <td className="py-3 px-4 text-text">{pred.prediction_result}</td>
                    <td className="py-3 px-4 font-mono font-medium">
                      {(pred.probability * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getRiskBadgeVariant(pred.risk_level)}>
                        {pred.risk_level}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-xs text-textSecondary whitespace-nowrap">
                      {pred.created_at ? new Date(pred.created_at).toLocaleDateString() : '--'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link to={`/admin/predictions/${pred.id}`}>
                        <Button variant="outline" size="sm" className="text-xs py-0.5 px-2">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Edit User Modal ────────────────────────────────────── */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit User: ${user.username}`}
        maxWidth="max-w-lg"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveEdit}
              loading={actionLoading}
              disabled={actionLoading}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={editForm.full_name}
              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="form-input"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="form-label">Gender</label>
              <select
                value={editForm.gender}
                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                className="form-input"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                value={editForm.date_of_birth}
                onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Role</label>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                className="form-input"
                disabled={isSelf}
              >
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-border flex flex-col gap-2.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editForm.is_active}
                onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                disabled={isSelf}
                className="form-checkbox text-primary w-4 h-4"
              />
              <span className="text-sm font-medium text-text">Account Active</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editForm.is_email_verified}
                onChange={(e) => setEditForm({ ...editForm, is_email_verified: e.target.checked })}
                className="form-checkbox text-primary w-4 h-4"
              />
              <span className="text-sm font-medium text-text">Email Verified</span>
            </label>
          </div>
        </form>
      </Modal>

      {/* ── Confirm Delete Dialog ──────────────────────────────── */}
      <ConfirmDialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User Account"
        message={`Are you sure you want to delete user "${user.username}" (${user.email})? This action cannot be reversed.`}
        confirmLabel="Delete User"
        variant="danger"
        loading={actionLoading}
      />
    </div>
  );
};

export default UserDetailsPage;
