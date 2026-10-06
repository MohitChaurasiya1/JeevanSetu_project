import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiUserPlus,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiCalendar,
  FiShield,
} from 'react-icons/fi';
import { Button, Alert } from '../../../components/common';
import { validateUserForm } from '../../../utils/validationUtils';
import { createUser } from '../../../api/adminApi';
import { ROUTES } from '../../../constants/routes';

const UserFormPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'PATIENT';

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    phone: '',
    gender: 'OTHER',
    date_of_birth: '',
    role: initialRole,
    password: '',
    password_confirm: '',
    is_active: true,
    is_email_verified: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear specific field error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const validation = validateUserForm(formData, false);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        full_name: formData.full_name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone ? formData.phone.trim() : null,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth || null,
        role: formData.role,
        password: formData.password,
        is_active: formData.is_active,
        is_email_verified: formData.is_email_verified,
      };

      const newUser = await createUser(payload);
      navigate(ROUTES.ADMIN_USERS, {
        state: { message: `User account for "${newUser.username}" created successfully!` },
      });
    } catch (err) {
      console.error('User creation failed:', err);
      if (err.response?.data && typeof err.response.data === 'object') {
        setErrors(err.response.data);
      } else {
        setApiError(
          err.response?.data?.detail || 'Failed to create user. Please check your inputs.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ── Top Navigation ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.ADMIN_USERS}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-textSecondary hover:text-primary transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to User List</span>
        </Link>
      </div>

      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-primary border border-teal-200 flex items-center justify-center">
            <FiUserPlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text tracking-tight">
              Create New User Account
            </h1>
            <p className="text-sm text-textSecondary mt-0.5">
              Register a new patient, doctor, administrator, or super admin in the system.
            </p>
          </div>
        </div>
      </div>

      {/* ── API Error Alert ────────────────────────────────────── */}
      {apiError && (
        <Alert
          variant="danger"
          message={apiError}
          dismissible
          onClose={() => setApiError(null)}
        />
      )}

      {/* ── User Form Card ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Basic Information */}
          <div>
            <h2 className="text-base font-bold text-text mb-4 pb-2 border-b border-border flex items-center gap-2">
              <FiUser className="w-4 h-4 text-primary" />
              <span>Personal Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="form-label" htmlFor="full_name">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`form-input ${errors.full_name ? 'has-error' : ''}`}
                  required
                />
                {errors.full_name && (
                  <p className="form-error">{errors.full_name}</p>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="username">
                  Username <span className="text-danger">*</span>
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="e.g. rahul_sharma"
                  value={formData.username}
                  onChange={handleChange}
                  className={`form-input ${errors.username ? 'has-error' : ''}`}
                  required
                />
                {errors.username && (
                  <p className="form-error">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="email">
                  Email Address <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input pl-9 ${errors.email ? 'has-error' : ''}`}
                    required
                  />
                  <FiMail className="w-4 h-4 text-textSecondary absolute left-3 top-3" />
                </div>
                {errors.email && (
                  <p className="form-error">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="phone">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-input pl-9 ${errors.phone ? 'has-error' : ''}`}
                  />
                  <FiPhone className="w-4 h-4 text-textSecondary absolute left-3 top-3" />
                </div>
                {errors.phone && (
                  <p className="form-error">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="gender">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="form-label" htmlFor="date_of_birth">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    id="date_of_birth"
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Role and Access */}
          <div className="pt-2">
            <h2 className="text-base font-bold text-text mb-4 pb-2 border-b border-border flex items-center gap-2">
              <FiShield className="w-4 h-4 text-primary" />
              <span>Role & Permissions</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="form-label" htmlFor="role">
                  System Role <span className="text-danger">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="PATIENT">Patient (Standard User)</option>
                  <option value="DOCTOR">Doctor (Medical Practitioner)</option>
                  <option value="ADMIN">Admin (Portal Administrator)</option>
                  <option value="SUPER_ADMIN">Super Admin (Full System Access)</option>
                </select>
                <p className="form-helper">
                  Sets default privileges and access level across the platform.
                </p>
              </div>

              <div className="flex flex-col justify-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="form-checkbox text-primary w-4 h-4"
                  />
                  <span className="text-sm font-medium text-text">Account Active immediately</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_email_verified"
                    checked={formData.is_email_verified}
                    onChange={handleChange}
                    className="form-checkbox text-primary w-4 h-4"
                  />
                  <span className="text-sm font-medium text-text">Mark Email as Verified</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section: Security / Password */}
          <div className="pt-2">
            <h2 className="text-base font-bold text-text mb-4 pb-2 border-b border-border flex items-center gap-2">
              <FiLock className="w-4 h-4 text-primary" />
              <span>Security Credentials</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="form-label" htmlFor="password">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'has-error' : ''}`}
                  required
                />
                {errors.password && (
                  <p className="form-error">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="password_confirm">
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <input
                  id="password_confirm"
                  type="password"
                  name="password_confirm"
                  placeholder="Re-enter password"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  className={`form-input ${errors.password_confirm ? 'has-error' : ''}`}
                  required
                />
                {errors.password_confirm && (
                  <p className="form-error">{errors.password_confirm}</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Form Actions ── */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Link to={ROUTES.ADMIN_USERS}>
              <Button variant="outline" type="button" disabled={loading}>
                Cancel
              </Button>
            </Link>

            <Button
              variant="primary"
              type="submit"
              loading={loading}
              disabled={loading}
              icon={<FiUserPlus className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormPage;
