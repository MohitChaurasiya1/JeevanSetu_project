import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { ROUTES } from '../../../constants/routes';
import { isAdminRole } from '../../../utils/roleUtils';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter your admin username or email and password.');
      return;
    }

    try {
      const currentUser = await login(username.trim(), password);
      if (isAdminRole(currentUser)) {
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      } else {
        setError('Access denied. This account does not have administrator privileges.');
      }
    } catch (err) {
      const backendError = err.response?.data;
      if (backendError?.detail) {
        setError(backendError.detail);
      } else if (backendError?.non_field_errors) {
        setError(backendError.non_field_errors[0]);
      } else if (backendError?.error) {
        setError(backendError.error);
      } else {
        setError('Invalid credentials. Please check your username and password.');
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal Login</h1>
        </div>

        <p className="text-gray-600 mb-6 text-sm">
          Sign in with your administrative credentials to access the JeevanSetu control panel.
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-username" className="block text-sm font-medium text-gray-700 mb-1">
              Admin Username or Email
            </label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin / admin@jeevansetu.com"
              autoComplete="username"
              disabled={loading}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoComplete="current-password"
              disabled={loading}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Authenticating...' : 'Sign In as Administrator'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;

