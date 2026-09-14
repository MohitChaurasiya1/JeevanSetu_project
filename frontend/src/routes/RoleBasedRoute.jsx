import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

const RoleBasedRoute = ({ children }) => {
  const {
    user,
    isAuthenticated,
    loading,
  } = useContext(AuthContext);

  // User information load hone tak wait karo
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-textSecondary">
          Loading...
        </p>
      </div>
    );
  }

  // User logged in nahi hai
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
  }

  // Only ADMIN and SUPER_ADMIN can access admin routes
  const allowedRoles = ['ADMIN', 'SUPER_ADMIN'];

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.USER_DASHBOARD} replace />;
  }

  return children;
};

export default RoleBasedRoute;