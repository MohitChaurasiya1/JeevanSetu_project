import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminManagementPage = () => {
  return <Navigate to="/admin/users?role=ADMIN" replace />;
};

export default AdminManagementPage;
