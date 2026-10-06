import axiosInstance from './axiosInstance';

/**
 * ==========================================
 * DASHBOARD API
 * ==========================================
 */
export const getDashboard = async () => {
  const response = await axiosInstance.get('/admin-panel/dashboard/');
  return response.data;
};

/**
 * ==========================================
 * USER MANAGEMENT APIs
 * ==========================================
 */
export const getUsers = async (params = {}) => {
  const response = await axiosInstance.get('/auth/users/', { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/auth/users/${id}/`);
  return response.data;
};

export const createUser = async (data) => {
  const response = await axiosInstance.post('/auth/users/', data);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await axiosInstance.patch(`/auth/users/${id}/`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/auth/users/${id}/`);
  return response.data;
};

/**
 * ==========================================
 * ADMIN PREDICTIONS APIs
 * ==========================================
 */
export const getAdminPredictions = async (params = {}) => {
  const response = await axiosInstance.get('/admin-panel/predictions/', { params });
  return response.data;
};

export const getAdminPredictionById = async (id) => {
  const response = await axiosInstance.get(`/admin-panel/predictions/${id}/`);
  return response.data;
};

export const deleteAdminPrediction = async (id) => {
  const response = await axiosInstance.delete(`/admin-panel/predictions/${id}/`);
  return response.data;
};

/**
 * ==========================================
 * AUDIT & ACTIVITY LOGS APIs
 * ==========================================
 */
export const getAuditLogs = async (params = {}) => {
  const response = await axiosInstance.get('/audit-logs/', { params });
  return response.data;
};

export const getAuditSummary = async () => {
  const response = await axiosInstance.get('/audit-logs/summary/');
  return response.data;
};

/**
 * ==========================================
 * FEEDBACK APIs
 * ==========================================
 */
export const getFeedbacks = async (params = {}) => {
  const response = await axiosInstance.get('/feedback/', { params });
  return response.data;
};

export const getFeedbackById = async (id) => {
  const response = await axiosInstance.get(`/feedback/${id}/`);
  return response.data;
};

export const updateFeedback = async (id, data) => {
  const response = await axiosInstance.patch(`/feedback/${id}/`, data);
  return response.data;
};

export const deleteFeedback = async (id) => {
  const response = await axiosInstance.delete(`/feedback/${id}/`);
  return response.data;
};

export default {
  getDashboard,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAdminPredictions,
  getAdminPredictionById,
  deleteAdminPrediction,
  getAuditLogs,
  getAuditSummary,
  getFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
};
