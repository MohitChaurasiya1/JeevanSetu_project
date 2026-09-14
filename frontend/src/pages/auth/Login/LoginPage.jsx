import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../../context/AuthContext';
import { ROUTES } from '../../../constants/routes';

const LoginPage = () => {
  const navigate = useNavigate();

  const { login, loading } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (!username.trim() || !password) {
      setError('Please enter username and password.');
      return;
    }

    try {
      await login(username.trim(), password);

      navigate(ROUTES.USER_DASHBOARD);
    } catch (err) {
      const backendError = err.response?.data;

      if (backendError?.detail) {
        setError(backendError.detail);
      } else if (backendError?.non_field_errors) {
        setError(backendError.non_field_errors[0]);
      } else {
        setError(
          'Login failed. Please check your username and password.'
        );
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-primary mb-2">
          Sign In
        </h1>

        <p className="text-textSecondary mb-6">
          Sign in to your JeevanSetu account.
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              disabled={loading}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={loading}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-4 text-center text-sm">
          <span className="text-textSecondary">
            Don't have an account?{' '}
          </span>

          <button
            type="button"
            onClick={() => navigate(ROUTES.REGISTER)}
            disabled={loading}
            className="text-primary font-medium hover:underline"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;