import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * Fetch diseases list from backend
 * @param {Object} params - Query parameters (e.g. search, page)
 */
export const getDiseases = async (params = {}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.DISEASES, { params });
  return response.data;
};

/**
 * Fetch a single disease by ID
 * @param {string|number} id
 */
export const getDiseaseById = async (id) => {
  const response = await axiosInstance.get(`${API_ENDPOINTS.DISEASES}${id}/`);
  return response.data;
};

/**
 * Create a new disease (Admin only)
 * @param {Object} data
 */
export const createDisease = async (data) => {
  const response = await axiosInstance.post(API_ENDPOINTS.DISEASES, data);
  return response.data;
};

/**
 * Update an existing disease (Admin only)
 * @param {string|number} id
 * @param {Object} data
 */
export const updateDisease = async (id, data) => {
  const response = await axiosInstance.patch(`${API_ENDPOINTS.DISEASES}${id}/`, data);
  return response.data;
};

/**
 * Delete a disease (Admin only)
 * @param {string|number} id
 */
export const deleteDisease = async (id) => {
  await axiosInstance.delete(`${API_ENDPOINTS.DISEASES}${id}/`);
};

const diseaseApi = {
  getDiseases,
  getDiseaseById,
  createDisease,
  updateDisease,
  deleteDisease,
};

export default diseaseApi;
