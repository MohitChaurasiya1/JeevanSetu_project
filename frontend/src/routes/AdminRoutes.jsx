import React from 'react';
import { Route } from 'react-router-dom';

// Admin Pages
import AdminDashboardPage from '../pages/admin/Dashboard/AdminDashboardPage';
import UserListPage from '../pages/admin/Users/UserListPage';
import UserDetailsPage from '../pages/admin/Users/UserDetailsPage';
import UserFormPage from '../pages/admin/Users/UserFormPage';
import AdminManagementPage from '../pages/admin/Admins/AdminManagementPage';
import AdminFormPage from '../pages/admin/Admins/AdminFormPage';
import DiseaseManagementPage from '../pages/admin/Diseases/DiseaseManagementPage';
import DiseaseFormPage from '../pages/admin/Diseases/DiseaseFormPage';
import SymptomManagementPage from '../pages/admin/Symptoms/SymptomManagementPage';
import SymptomFormPage from '../pages/admin/Symptoms/SymptomFormPage';
import PredictionManagementPage from '../pages/admin/Predictions/PredictionManagementPage';
import AdminPredictionDetailsPage from '../pages/admin/Predictions/AdminPredictionDetailsPage';
import FeedbackManagementPage from '../pages/admin/Feedback/FeedbackManagementPage';
import FeedbackDetailsPage from '../pages/admin/Feedback/FeedbackDetailsPage';
import MLModelManagementPage from '../pages/admin/MLModels/MLModelManagementPage';
import MLModelDetailsPage from '../pages/admin/MLModels/MLModelDetailsPage';
import MLModelUploadPage from '../pages/admin/MLModels/MLModelUploadPage';
import ActivityLogsPage from '../pages/admin/ActivityLogs/ActivityLogsPage';
import SystemSettingsPage from '../pages/admin/Settings/SystemSettingsPage';

const AdminRoutes = () => (
  <>
    {/* Dashboard */}
    <Route path="dashboard" element={<AdminDashboardPage />} />

    {/* User Management */}
    <Route path="users" element={<UserListPage />} />
    <Route path="users/new" element={<UserFormPage />} />
    <Route path="users/:id" element={<UserDetailsPage />} />

    {/* Admin Management */}
    <Route path="admins" element={<AdminManagementPage />} />
    <Route path="admins/new" element={<AdminFormPage />} />

    {/* Disease Management */}
    <Route path="diseases" element={<DiseaseManagementPage />} />
    <Route path="diseases/new" element={<DiseaseFormPage />} />

    {/* Symptom Management */}
    <Route path="symptoms" element={<SymptomManagementPage />} />
    <Route path="symptoms/new" element={<SymptomFormPage />} />

    {/* Prediction Management */}
    <Route path="predictions" element={<PredictionManagementPage />} />
    <Route path="predictions/:id" element={<AdminPredictionDetailsPage />} />

    {/* Feedback Management */}
    <Route path="feedback" element={<FeedbackManagementPage />} />
    <Route path="feedback/:id" element={<FeedbackDetailsPage />} />

    {/* ML Model Management */}
    <Route path="ml-models" element={<MLModelManagementPage />} />
    <Route path="ml-models/upload" element={<MLModelUploadPage />} />
    <Route path="ml-models/:id" element={<MLModelDetailsPage />} />

    {/* Activity Logs */}
    <Route path="activity-logs" element={<ActivityLogsPage />} />

    {/* System Settings */}
    <Route path="settings" element={<SystemSettingsPage />} />
  </>
);

export default AdminRoutes;
