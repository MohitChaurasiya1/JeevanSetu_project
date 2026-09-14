import React, {
  createContext,
  useEffect,
  useState,
} from 'react';

import { authService } from '../services/authService';
import authApi from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );

  const [loading, setLoading] = useState(
    authService.isAuthenticated()
  );

  // Load currently logged-in user
  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!authService.isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authApi.getCurrentUser();

        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (error) {
        authService.logout();

        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);

      // Login and store JWT tokens
      await authService.login(username, password);

      // Get actual user information
      const currentUser = await authApi.getCurrentUser();

      setUser(currentUser);
      setIsAuthenticated(true);

      return currentUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();

    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};