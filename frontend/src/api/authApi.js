import axiosInstance from './axiosInstance';

const register = async (userData) => {
    const response = await axiosInstance.post('/auth/register/', userData);

    return response.data;
};

const login = async (credentials) => {
    const response = await axiosInstance.post('/auth/login/', credentials);

    return response.data;
};

const refreshToken = async (refresh) => {
    const response = await axiosInstance.post('/auth/token/refresh/', {
        refresh,
    });

    return response.data;
};

const getCurrentUser = async () => {
    const response = await axiosInstance.get('/auth/me/');

    return response.data;
};

const authApi = {
    register,
    login,
    refreshToken,
    getCurrentUser,
};

export default authApi;