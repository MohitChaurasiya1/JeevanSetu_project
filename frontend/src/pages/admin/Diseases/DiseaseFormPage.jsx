import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiActivity,
  FiSave,
  FiPlus,
  FiX,
  FiInfo,
  FiAlertCircle,
} from 'react-icons/fi';
import { Button, Alert } from '../../../components/common';
import { getDiseaseById, createDisease, updateDisease } from '../../../api/diseaseApi';
import { ROUTES } from '../../../constants/routes';

// ── Helpers ───────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: '',
  recommended_specialist: '',
  description: '',
  detailed_description: '',
  symptoms: [],
  risk_factors: [],
  causes: [],
  prevention: [],
  treatment: [],
  when_to_see_doctor: '',
  additional_info: '',
  is_active: true,
};

/**
 * Editable list field — each item is a plain string in an array.
 * Renders a text input row per item with Add/Remove controls.
 */
const ListField = ({ label, items, onChange, placeholder = 'Add item...' }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (idx) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const handleEdit = (idx, value) => {
    const updated = [...items];
    updated[idx] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      {/* Existing items */}
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
            {idx + 1}
          </span>
          <input
            type="text"
            value={typeof item === 'object' ? item.title || JSON.stringify(item) : item}
            onChange={(e) => handleEdit(idx, e.target.value)}
            className="form-input flex-1 text-sm py-1.5"
          />
          <button
            type="button"
            onClick={() => handleRemove(idx)}
            className="p-1.5 rounded-lg text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
            title="Remove item"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      {/* Add new item row */}
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full border-2 border-dashed border-slate-300 flex-shrink-0" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="form-input flex-1 text-sm py-1.5 bg-slate-50 border-dashed"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="p-1.5 rounded-lg text-primary bg-primary/10 hover:bg-primary/20 transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Add item (or press Enter)"
        >
          <FiPlus className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="text-xs text-text-muted">Press Enter or click + to add each item.</p>
    </div>
  );
};

// ── Validation ────────────────────────────────────────────────────────────────
const validateForm = (data) => {
  const errs = {};
  if (!data.name.trim()) errs.name = 'Disease name is required.';
  if (!data.description.trim()) errs.description = 'Short description is required.';
  return errs;
};

// ── Section Heading ───────────────────────────────────────────────────────────
const SectionHeading = ({ icon, title, subtitle }) => (
  <div className="flex items-start gap-3 pb-3 mb-5 border-b border-border">
    {icon && (
      <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
        {icon}
      </div>
    )}
    <div>
      <h2 className="text-base font-bold text-text">{title}</h2>
      {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const DiseaseFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // present only when editing
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [apiError, setApiError] = useState(null);

  // ── Load disease for edit mode ─────────────────────────────────────────────
  useEffect(() => {
    if (!isEditing) return;

    const load = async () => {
      setFetchLoading(true);
      try {
        const data = await getDiseaseById(id);
        setFormData({
          name: data.name || '',
          recommended_specialist: data.recommended_specialist || '',
          description: data.description || '',
          detailed_description: data.detailed_description || '',
          symptoms: Array.isArray(data.symptoms) ? data.symptoms : [],
          risk_factors: Array.isArray(data.risk_factors) ? data.risk_factors : [],
          causes: Array.isArray(data.causes) ? data.causes : [],
          prevention: Array.isArray(data.prevention) ? data.prevention : [],
          treatment: Array.isArray(data.treatment) ? data.treatment : [],
          when_to_see_doctor: data.when_to_see_doctor || '',
          additional_info: data.additional_info || '',
          is_active: data.is_active !== false,
        });
      } catch (err) {
        setApiError('Failed to load disease data. Please go back and try again.');
      } finally {
        setFetchLoading(false);
      }
    };

    load();
  }, [id, isEditing]);

  // ── Field helpers ──────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleListChange = (field) => (newList) => {
    setFormData((prev) => ({ ...prev, [field]: newList }));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        recommended_specialist: formData.recommended_specialist.trim() || null,
        description: formData.description.trim(),
        detailed_description: formData.detailed_description.trim() || null,
        symptoms: formData.symptoms.filter(Boolean),
        risk_factors: formData.risk_factors.filter(Boolean),
        causes: formData.causes.filter(Boolean),
        prevention: formData.prevention.filter(Boolean),
        treatment: formData.treatment.filter(Boolean),
        when_to_see_doctor: formData.when_to_see_doctor.trim() || null,
        additional_info: formData.additional_info.trim() || null,
        is_active: formData.is_active,
      };

      if (isEditing) {
        await updateDisease(id, payload);
        navigate(ROUTES.ADMIN_DISEASES, {
          state: { message: `"${payload.name}" was updated successfully.` },
        });
      } else {
        await createDisease(payload);
        navigate(ROUTES.ADMIN_DISEASES, {
          state: { message: `"${payload.name}" was added to the disease catalog.` },
        });
      }
    } catch (err) {
      console.error('Save failed:', err);
      if (err.response?.data && typeof err.response.data === 'object') {
        // Field-level backend errors
        const backendErrors = {};
        Object.entries(err.response.data).forEach(([key, val]) => {
          backendErrors[key] = Array.isArray(val) ? val.join(' ') : String(val);
        });
        setErrors(backendErrors);
      } else {
        setApiError(
          err.response?.data?.detail ||
          `Failed to ${isEditing ? 'update' : 'create'} disease. Please check your inputs.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch loading ──────────────────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-white rounded-2xl border border-border shadow-card p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm text-text-secondary">Loading disease data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6">

      {/* ── Top Navigation ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.ADMIN_DISEASES}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Disease Management</span>
        </Link>
      </div>

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-primary">
            <FiActivity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text tracking-tight">
              {isEditing ? 'Edit Disease' : 'Add New Disease'}
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              {isEditing
                ? 'Update this disease entry. Changes will immediately reflect on the public disease page.'
                : 'Add a new disease to the catalog. It will appear on the public /diseases page once saved.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── API Error ───────────────────────────────────────────────────── */}
      {apiError && (
        <Alert
          variant="danger"
          message={apiError}
          dismissible
          onClose={() => setApiError(null)}
        />
      )}

      {/* ── Form ────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>

        {/* ── Section 1: Basic Information ──────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6 sm:p-8 space-y-5">
          <SectionHeading
            icon={<FiInfo className="w-4 h-4" />}
            title="Basic Information"
            subtitle="Core fields shown on disease cards and list pages."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Disease Name */}
            <div className="sm:col-span-2">
              <label className="form-label" htmlFor="name">
                Disease Name <span className="text-danger">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Type 2 Diabetes"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'has-error' : ''}`}
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            {/* Specialist */}
            <div>
              <label className="form-label" htmlFor="recommended_specialist">
                Specialist / Medical Category
              </label>
              <input
                id="recommended_specialist"
                name="recommended_specialist"
                type="text"
                placeholder="e.g. Endocrinologist"
                value={formData.recommended_specialist}
                onChange={handleChange}
                className="form-input"
              />
              <p className="form-helper">Shown as a badge on the disease card.</p>
            </div>

            {/* Active toggle */}
            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="form-checkbox text-primary w-4 h-4"
                />
                <span className="text-sm font-medium text-text">
                  Active – visible on public /diseases page
                </span>
              </label>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="form-label" htmlFor="description">
              Short Description <span className="text-danger">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="A concise 1–2 sentence summary shown on the disease card."
              value={formData.description}
              onChange={handleChange}
              className={`form-input resize-none ${errors.description ? 'has-error' : ''}`}
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>
        </div>

        {/* ── Section 2: Detailed Content ──────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6 sm:p-8 space-y-7">
          <SectionHeading
            icon={<FiAlertCircle className="w-4 h-4" />}
            title="Detailed Disease Information"
            subtitle="This content is shown on the full disease details page."
          />

          {/* Detailed Description */}
          <div>
            <label className="form-label" htmlFor="detailed_description">
              What is this disease? (Detailed Overview)
            </label>
            <textarea
              id="detailed_description"
              name="detailed_description"
              rows={5}
              placeholder="A detailed explanation of the disease — its nature, how it affects the body, etc."
              value={formData.detailed_description}
              onChange={handleChange}
              className="form-input resize-y"
            />
          </div>

          {/* Symptoms */}
          <div>
            <label className="form-label mb-3 block">Common Symptoms</label>
            <ListField
              label="Common Symptoms"
              items={formData.symptoms}
              onChange={handleListChange('symptoms')}
              placeholder="e.g. Frequent urination"
            />
          </div>

          {/* Causes */}
          <div>
            <label className="form-label mb-3 block">Causes</label>
            <ListField
              label="Causes"
              items={formData.causes}
              onChange={handleListChange('causes')}
              placeholder="e.g. Insulin resistance"
            />
          </div>

          {/* Risk Factors */}
          <div>
            <label className="form-label mb-3 block">Risk Factors</label>
            <ListField
              label="Risk Factors"
              items={formData.risk_factors}
              onChange={handleListChange('risk_factors')}
              placeholder="e.g. Family history of diabetes"
            />
          </div>

          {/* Prevention */}
          <div>
            <label className="form-label mb-3 block">Prevention / Healthy Habits</label>
            <ListField
              label="Prevention"
              items={formData.prevention}
              onChange={handleListChange('prevention')}
              placeholder="e.g. Maintain a balanced diet"
            />
          </div>

          {/* Treatment */}
          <div>
            <label className="form-label mb-3 block">Treatment / Management</label>
            <ListField
              label="Treatment"
              items={formData.treatment}
              onChange={handleListChange('treatment')}
              placeholder="e.g. Medication and lifestyle changes"
            />
          </div>

          {/* When to See a Doctor */}
          <div>
            <label className="form-label" htmlFor="when_to_see_doctor">
              When to See a Doctor
            </label>
            <textarea
              id="when_to_see_doctor"
              name="when_to_see_doctor"
              rows={3}
              placeholder="Describe symptoms or scenarios that warrant immediate medical attention."
              value={formData.when_to_see_doctor}
              onChange={handleChange}
              className="form-input resize-y"
            />
          </div>

          {/* Additional Info */}
          <div>
            <label className="form-label" htmlFor="additional_info">
              Additional Information
            </label>
            <textarea
              id="additional_info"
              name="additional_info"
              rows={3}
              placeholder="Any supplementary notes, research links, or disclaimers."
              value={formData.additional_info}
              onChange={handleChange}
              className="form-input resize-y"
            />
          </div>
        </div>

        {/* ── Form Actions ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-4 sm:p-6 flex items-center justify-end gap-3">
          <Link to={ROUTES.ADMIN_DISEASES}>
            <Button variant="outline" type="button" disabled={loading}>
              Cancel
            </Button>
          </Link>
          <Button
            variant="primary"
            type="submit"
            loading={loading}
            disabled={loading}
            icon={<FiSave className="w-4 h-4" />}
          >
            {isEditing ? 'Save Changes' : 'Add Disease'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DiseaseFormPage;
