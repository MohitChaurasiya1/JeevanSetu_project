export const getErrorMessage = (error) => {
  return error?.response?.data?.detail || error?.message || 'An unexpected error occurred.';
};
