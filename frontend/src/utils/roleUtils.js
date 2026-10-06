import { ROUTES } from '../constants/routes';

/**
 * Checks if a user has an administrative role (ADMIN or SUPER_ADMIN).
 * @param {Object|null} user - The user object from AuthContext
 * @returns {boolean}
 */
export const isAdminRole = (user) => {
  if (!user || !user.role) return false;
  return user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
};

/**
 * Returns the appropriate home/dashboard route based on user role.
 * - Admin users go to /admin/dashboard
 * - Patient/regular users go to /dashboard
 * @param {Object|null} user - The user object from AuthContext
 * @returns {string} Route path
 */
export const getHomeRouteForUser = (user) => {
  if (isAdminRole(user)) {
    return ROUTES.ADMIN_DASHBOARD;
  }
  return ROUTES.USER_DASHBOARD;
};
