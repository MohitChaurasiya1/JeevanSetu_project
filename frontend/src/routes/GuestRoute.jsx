import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import { getHomeRouteForUser } from '../utils/roleUtils';

const GuestRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-textSecondary">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getHomeRouteForUser(user)} replace />;
  }

  return children;
};

export default GuestRoute;