import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminFormPage = () => {
  return <Navigate to="/admin/users/new?role=ADMIN" replace />;
};

export default AdminFormPage;
