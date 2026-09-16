import axiosInstance from './axiosInstance';

/**
 * Submit a new contact message (publicly accessible).
 * @param {Object} data - { full_name, email, phone, message }
 */
export const submitContactMessage = async (data) => {
  const response = await axiosInstance.post('/contact/', data);
  return response.data;
};

/**
 * Get all contact messages with optional filter and search params (admin only).
 * @param {Object} params - { status, search, page }
 */
export const getContactMessages = async (params = {}) => {
  const response = await axiosInstance.get('/contact/', { params });
  return response.data;
};

/**
 * Get a single contact message by ID (admin only).
 * @param {number|string} id
 */
export const getContactMessageById = async (id) => {
  const response = await axiosInstance.get(`/contact/${id}/`);
  return response.data;
};

/**
 * Update a contact message's status or admin response (admin only).
 * @param {number|string} id
 * @param {Object} data - { status, admin_response, send_email }
 */
export const updateContactMessage = async (id, data) => {
  const response = await axiosInstance.patch(`/contact/${id}/`, data);
  return response.data;
};

/**
 * Delete a contact message (admin only).
 * @param {number|string} id
 */
export const deleteContactMessage = async (id) => {
  const response = await axiosInstance.delete(`/contact/${id}/`);
  return response.data;
};

const contactApi = {
  submitContactMessage,
  getContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage,
};

export default contactApi;
