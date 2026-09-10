import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * Fetch diseases list from backend
 * @param {Object} params - Query parameters (e.g. search, page)
 * @returns {Promise<any>}
 */
export const getDiseases = async (params = {}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.DISEASES, { params });
  return response.data;
};

/**
 * Fetch a single disease by ID from backend
 * @param {string|number} id
 * @returns {Promise<any>}
 */
export const getDiseaseById = async (id) => {
  const response = await axiosInstance.get(`${API_ENDPOINTS.DISEASES}${id}/`);
  return response.data;
};

const diseaseApi = {
  getDiseases,
  getDiseaseById,
};

export default diseaseApi;

