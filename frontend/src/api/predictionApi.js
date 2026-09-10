import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const predictionApi = {
  // Post medical features to Django ML prediction endpoint
  predict: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PREDICT, data);
    return response.data;
  },

  // Get user prediction history
  getHistory: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.PREDICTIONS);
    return response.data;
  },

  // Get prediction detail by ID
  getById: async (id) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.PREDICTIONS}${id}/`);
    return response.data;
  },
};

export default predictionApi;
