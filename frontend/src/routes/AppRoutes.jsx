import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Guards
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';

// Route Groups
import PublicRoutes from './PublicRoutes';
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';

// Auth Pages
import LoginPage from '../pages/auth/Login/LoginPage';
import RegisterPage from '../pages/auth/Register/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPassword/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPassword/ResetPasswordPage';
import EmailVerificationPage from '../pages/auth/EmailVerification/EmailVerificationPage';

// Admin Auth Pages (outside admin layout)
import AdminLoginPage from '../pages/admin/Login/AdminLoginPage';
import OTPVerificationPage from '../pages/admin/OTPVerification/OTPVerificationPage';

// 404 Page
import NotFoundPage from '../pages/public/NotFound/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================================ */}
      {/* Public Routes — PublicLayout     */}
      {/* ================================ */}
      <Route element={<PublicLayout />}>
        {PublicRoutes()}
      </Route>

      {/* ================================ */}
      {/* Auth Routes — AuthLayout         */}
      {/* (Guest only — redirect if logged)*/}
      {/* ================================ */}
      <Route element={<AuthLayout />}>
        <Route
          path={ROUTES.LOGIN}
          element={<GuestRoute><LoginPage /></GuestRoute>}
        />
        <Route
          path={ROUTES.REGISTER}
          element={<GuestRoute><RegisterPage /></GuestRoute>}
        />
        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={<GuestRoute><ForgotPasswordPage /></GuestRoute>}
        />
        <Route
          path={ROUTES.RESET_PASSWORD}
          element={<GuestRoute><ResetPasswordPage /></GuestRoute>}
        />
        <Route
          path={ROUTES.EMAIL_VERIFICATION}
          element={<GuestRoute><EmailVerificationPage /></GuestRoute>}
        />
      </Route>

      {/* ================================ */}
      {/* Admin Auth Routes — AuthLayout   */}
      {/* (Outside admin layout)           */}
      {/* ================================ */}
      <Route element={<AuthLayout />}>
        <Route
          path={ROUTES.ADMIN_LOGIN}
          element={<GuestRoute><AdminLoginPage /></GuestRoute>}
        />
        <Route
          path={ROUTES.ADMIN_VERIFY_OTP}
          element={<GuestRoute><OTPVerificationPage /></GuestRoute>}
        />
      </Route>

      {/* ================================ */}
      {/* User Routes — UserLayout         */}
      {/* (Protected — must be logged in)  */}
      {/* ================================ */}
      <Route element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
        {UserRoutes()}
      </Route>

      {/* ================================ */}
      {/* Admin Routes — AdminLayout       */}
      {/* (Role-based — must be admin)     */}
      {/* ================================ */}
      <Route
        path="/admin"
        element={<RoleBasedRoute><AdminLayout /></RoleBasedRoute>}
      >
        {AdminRoutes()}
      </Route>

      {/* ================================ */}
      {/* 404 Catch-All                    */}
      {/* ================================ */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
