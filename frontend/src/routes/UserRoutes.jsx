import React from 'react';
import { Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

// Dashboard
import UserDashboardPage from '../pages/user/Dashboard/UserDashboardPage';

// Prediction Pages
import NewPredictionPage from '../pages/user/NewPrediction/NewPredictionPage';
import PredictionResultPage from '../pages/user/PredictionResult/PredictionResultPage';
import PredictionHistoryPage from '../pages/user/PredictionHistory/PredictionHistoryPage';
import PredictionDetailsPage from '../pages/user/PredictionDetails/PredictionDetailsPage';

// Profile & Account Pages
import ProfilePage from '../pages/user/Profile/ProfilePage';
import ChangePasswordPage from '../pages/user/ChangePassword/ChangePasswordPage';
import UserSettingsPage from '../pages/user/Settings/UserSettingsPage';

// Feedback
import FeedbackPage from '../pages/user/Feedback/FeedbackPage';

const UserRoutes = () => {
  return (
    <>
      {/* ==================== DASHBOARD ==================== */}

      <Route
        path={ROUTES.USER_DASHBOARD}
        element={<UserDashboardPage />}
      />

      {/* ==================== PREDICTIONS ==================== */}

      <Route
        path={ROUTES.NEW_PREDICTION}
        element={<NewPredictionPage />}
      />

      <Route
        path={ROUTES.PREDICTION_RESULT}
        element={<PredictionResultPage />}
      />

      <Route
        path={ROUTES.PREDICTION_HISTORY}
        element={<PredictionHistoryPage />}
      />

      <Route
        path={ROUTES.PREDICTION_DETAILS}
        element={<PredictionDetailsPage />}
      />

      {/* ==================== PROFILE ==================== */}

      <Route
        path={ROUTES.PROFILE}
        element={<ProfilePage />}
      />

      {/* ==================== ACCOUNT SETTINGS ==================== */}

      <Route
        path={ROUTES.CHANGE_PASSWORD}
        element={<ChangePasswordPage />}
      />

      <Route
        path={ROUTES.USER_SETTINGS}
        element={<UserSettingsPage />}
      />

      {/* ==================== FEEDBACK ==================== */}

      <Route
        path={ROUTES.FEEDBACK}
        element={<FeedbackPage />}
      />
    </>
  );
};

export default UserRoutes;