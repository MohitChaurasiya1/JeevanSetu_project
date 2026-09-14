import authApi from '../api/authApi';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const register = async (userData) => {
    return await authApi.register(userData);
};

const login = async (username, password) => {
    const data = await authApi.login({
        username,
        password,
    });

    localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);

    return data;
};

const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const getAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

const getRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

const isAuthenticated = () => {
    return !!getAccessToken();
};

export const authService = {
    register,
    login,
    logout,
    getAccessToken,
    getRefreshToken,
    isAuthenticated,
};