import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';
import { isAdminRole } from '../utils/roleUtils';

const RoleBasedRoute = ({ children }) => {
  const {
    user,
    isAuthenticated,
    loading,
  } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-textSecondary">
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Only ADMIN and SUPER_ADMIN can access admin routes
  if (!isAdminRole(user)) {
    return <Navigate to={ROUTES.USER_DASHBOARD} replace />;
  }

  return children;
};

export default RoleBasedRoute;