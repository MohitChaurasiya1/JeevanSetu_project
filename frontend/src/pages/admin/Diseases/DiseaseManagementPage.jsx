import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiSearch,
  FiEye,
  FiActivity,
  FiToggleLeft,
  FiToggleRight,
} from 'react-icons/fi';
import {
  Button,
  Badge,
  Alert,
  LoadingState,
  EmptyState,
  ErrorState,
} from '../../../components/common';
import ConfirmDialog from '../../../components/modals/ConfirmDialog';
import {
  getDiseases,
  deleteDisease,
  updateDisease,
} from '../../../api/diseaseApi';
import { ROUTES } from '../../../constants/routes';

const DiseaseManagementPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Feedback
  const [pageAlert, setPageAlert] = useState(
    location.state?.message ? { type: 'success', text: location.state.message } : null
  );

  // Delete confirmation
  const [deleteDialog, setDeleteDialog] = useState({ open: false, disease: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toggle active loading
  const [togglingId, setTogglingId] = useState(null);

  // ── Debounce search ──────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // ── Load diseases ────────────────────────────────────────────────────────────
  const loadDiseases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      const data = await getDiseases(params);
      let items = Array.isArray(data) ? data : data?.results ?? [];
      setDiseases(items);
    } catch (err) {
      console.error('Failed to load diseases:', err);
      setError(
        err.response?.data?.detail ||
        'Failed to load diseases. Please check your connection.'
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadDiseases();
  }, [loadDiseases]);

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteDialog.disease) return;
    setDeleteLoading(true);
    try {
      await deleteDisease(deleteDialog.disease.id);
      setDiseases((prev) => prev.filter((d) => d.id !== deleteDialog.disease.id));
      setPageAlert({ type: 'success', text: `"${deleteDialog.disease.name}" was deleted successfully.` });
      setDeleteDialog({ open: false, disease: null });
    } catch (err) {
      console.error('Delete failed:', err);
      setPageAlert({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to delete disease. Please try again.',
      });
      setDeleteDialog({ open: false, disease: null });
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Toggle active/inactive ───────────────────────────────────────────────────
  const handleToggleActive = async (disease) => {
    setTogglingId(disease.id);
    try {
      const updated = await updateDisease(disease.id, { is_active: !disease.is_active });
      setDiseases((prev) => prev.map((d) => (d.id === disease.id ? updated : d)));
    } catch (err) {
      setPageAlert({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to update disease status.',
      });
    } finally {
      setTogglingId(null);
    }
  };

  // ── Filtered locally for instant UX ─────────────────────────────────────────
  const filteredDiseases = diseases.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.recommended_specialist?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-primary">
              <FiActivity className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text">Disease Management</h1>
          </div>
          <p className="text-sm text-text-secondary mt-1 ml-13">
            Manage the disease catalog visible on the public disease listing page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={loadDiseases}
            disabled={loading}
            icon={<FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            className="inline-flex items-center gap-1 px-3"
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/admin/diseases/new')}
            icon={<FiPlus className="w-4 h-4" />}
            className="inline-flex items-center justify-center gap-1 px-3"
          >
            Add Disease
          </Button>
        </div>
      </div>

      {/* ── Page Alert ──────────────────────────────────────────────────── */}
      {pageAlert && (
        <Alert
          variant={pageAlert.type === 'success' ? 'success' : 'danger'}
          message={pageAlert.text}
          dismissible
          onClose={() => setPageAlert(null)}
        />
      )}

      {/* ── Search & Stats Bar ──────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-border shadow-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <FiSearch className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search diseases, specialists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="font-medium text-text">{filteredDiseases.length}</span>
          {filteredDiseases.length === diseases.length
            ? ' diseases in catalog'
            : ` of ${diseases.length} matching`}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="bg-white rounded-xl border border-border shadow-card p-12">
          <LoadingState message="Loading diseases..." />
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-border shadow-card p-8">
          <ErrorState title="Failed to load diseases" message={error} onRetry={loadDiseases} />
        </div>
      ) : filteredDiseases.length === 0 ? (
        <div className="bg-white rounded-xl border border-border shadow-card p-10">
          <EmptyState
            title="No diseases found"
            message={
              searchQuery
                ? `No diseases matched "${searchQuery}".`
                : 'No diseases have been added yet. Click "Add Disease" to get started.'
            }
            action={
              searchQuery ? (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => navigate('/admin/diseases/new')}
                  icon={<FiPlus className="w-4 h-4" />}
                >
                  Add First Disease
                </Button>
              )
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-border text-xs uppercase font-semibold text-text-secondary">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Disease Name</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Specialist</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Short Description</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDiseases.map((disease) => (
                  <tr
                    key={disease.id}
                    className="hover:bg-slate-50/75 transition-colors"
                  >
                    {/* Name */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-semibold text-text">{disease.name}</div>
                      <div className="text-xs text-text-secondary sm:hidden mt-0.5">
                        {disease.recommended_specialist || 'No specialist'}
                      </div>
                    </td>

                    {/* Specialist */}
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      {disease.recommended_specialist ? (
                        <Badge variant="info" className="text-xs">
                          {disease.recommended_specialist}
                        </Badge>
                      ) : (
                        <span className="text-text-muted text-xs">—</span>
                      )}
                    </td>

                    {/* Short description */}
                    <td className="py-3.5 px-4 hidden md:table-cell max-w-xs">
                      <p className="text-text-secondary truncate text-xs">
                        {disease.description || '—'}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge variant={disease.is_active ? 'success' : 'default'} className="text-xs">
                        {disease.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* View public details */}
                        <button
                          type="button"
                          onClick={() => navigate(ROUTES.DISEASE_DETAILS.replace(':id', disease.id))}
                          title="View public page"
                          className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>

                        {/* Toggle active */}
                        <button
                          type="button"
                          onClick={() => handleToggleActive(disease)}
                          disabled={togglingId === disease.id}
                          title={disease.is_active ? 'Deactivate' : 'Activate'}
                          className={`p-1.5 rounded-lg transition-colors ${disease.is_active
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-slate-400 hover:bg-slate-100'
                            }`}
                        >
                          {disease.is_active ? (
                            <FiToggleRight className="w-4 h-4" />
                          ) : (
                            <FiToggleLeft className="w-4 h-4" />
                          )}
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/diseases/${disease.id}/edit`)}
                          title="Edit disease"
                          className="p-1.5 rounded-lg text-text-secondary hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteDialog({ open: true, disease })
                          }
                          title="Delete disease"
                          className="p-1.5 rounded-lg text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <div className="px-6 py-3 border-t border-border bg-slate-50 text-xs text-text-secondary flex items-center justify-between">
            <span>
              Showing <span className="font-medium text-text">{filteredDiseases.length}</span> diseases
            </span>
            <span className="hidden sm:block">Active diseases appear on the public /diseases page</span>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Dialog ────────────────────────────────────────── */}
      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => !deleteLoading && setDeleteDialog({ open: false, disease: null })}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete Disease?"
        message={
          deleteDialog.disease
            ? `Are you sure you want to permanently delete "${deleteDialog.disease.name}"? This action cannot be undone and will remove it from the public disease page.`
            : 'Are you sure you want to delete this disease?'
        }
        confirmLabel="Delete Disease"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default DiseaseManagementPage;
