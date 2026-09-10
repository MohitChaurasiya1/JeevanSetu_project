import React from 'react';
import { Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

// User Pages
import UserDashboardPage from '../pages/user/Dashboard/UserDashboardPage';
import NewPredictionPage from '../pages/user/NewPrediction/NewPredictionPage';
import PredictionResultPage from '../pages/user/PredictionResult/PredictionResultPage';
import PredictionDetailsPage from '../pages/user/PredictionDetails/PredictionDetailsPage';
import PredictionHistoryPage from '../pages/user/PredictionHistory/PredictionHistoryPage';
import ProfilePage from '../pages/user/Profile/ProfilePage';
import ChangePasswordPage from '../pages/user/ChangePassword/ChangePasswordPage';
import UserSettingsPage from '../pages/user/Settings/UserSettingsPage';
import FeedbackPage from '../pages/user/Feedback/FeedbackPage';

const UserRoutes = () => (
  <>
    <Route path={ROUTES.USER_DASHBOARD} element={<UserDashboardPage />} />
    <Route path={ROUTES.NEW_PREDICTION} element={<NewPredictionPage />} />
    <Route path={ROUTES.PREDICTION_RESULT} element={<PredictionResultPage />} />
    <Route path={ROUTES.PREDICTION_DETAILS} element={<PredictionDetailsPage />} />
    <Route path={ROUTES.PREDICTION_HISTORY} element={<PredictionHistoryPage />} />
    <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
    <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePasswordPage />} />
    <Route path={ROUTES.USER_SETTINGS} element={<UserSettingsPage />} />
    <Route path={ROUTES.FEEDBACK} element={<FeedbackPage />} />
  </>
);

export default UserRoutes;
