export const ROUTES = {
  // Public Routes
  HOME: '/',
  ABOUT: '/about',
  HOW_IT_WORKS: '/how-it-works',
  DISEASES: '/diseases',
  DISEASE_DETAILS: '/diseases/:id',
  CONTACT: '/contact',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS: '/terms',

  // Auth Routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  EMAIL_VERIFICATION: '/verify-email',

  // User Routes
  USER_DASHBOARD: '/dashboard',
  NEW_PREDICTION: '/prediction/new',
  PREDICTION_RESULT: '/prediction/result',
  PREDICTION_HISTORY: '/predictions',
  PREDICTION_DETAILS: '/predictions/:id',
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
  USER_SETTINGS: '/settings',
  FEEDBACK: '/feedback',

  // Admin Auth Routes (outside admin layout)
  ADMIN_LOGIN: '/admin/login',
  ADMIN_VERIFY_OTP: '/admin/verify-otp',

  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAILS: '/admin/users/:id',
  ADMIN_USER_FORM: '/admin/users/new',
  ADMIN_DISEASES: '/admin/diseases',
  ADMIN_DISEASE_FORM: '/admin/diseases/new',
  ADMIN_SYMPTOMS: '/admin/symptoms',
  ADMIN_SYMPTOM_FORM: '/admin/symptoms/new',
  ADMIN_PREDICTIONS: '/admin/predictions',
  ADMIN_PREDICTION_DETAILS: '/admin/predictions/:id',
  ADMIN_ML_MODELS: '/admin/ml-models',
  ADMIN_ML_MODEL_DETAILS: '/admin/ml-models/:id',
  ADMIN_ML_MODEL_UPLOAD: '/admin/ml-models/upload',
  ADMIN_FEEDBACK: '/admin/feedback',
  ADMIN_FEEDBACK_DETAILS: '/admin/feedback/:id',
  ADMIN_ADMINS: '/admin/admins',
  ADMIN_ADMIN_FORM: '/admin/admins/new',
  ADMIN_ACTIVITY_LOGS: '/admin/activity-logs',
  ADMIN_SETTINGS: '/admin/settings',
};
