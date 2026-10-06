import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

const getPageTitle = (pathname) => {
  if (pathname.startsWith('/admin/users')) {
    if (pathname.includes('/new')) return 'Create New User';
    if (pathname.split('/').length > 3) return 'User Details';
    return 'User Management';
  }
  if (pathname.startsWith('/admin/predictions')) {
    if (pathname.split('/').length > 3) return 'Prediction Details';
    return 'Predictions Management';
  }
  if (pathname.startsWith('/admin/diseases')) {
    if (pathname.includes('/new')) return 'Add Disease';
    return 'Disease Catalog';
  }
  if (pathname.startsWith('/admin/symptoms')) {
    if (pathname.includes('/new')) return 'Add Symptom';
    return 'Symptom Catalog';
  }
  if (pathname.startsWith('/admin/feedback')) {
    return 'User Feedback';
  }
  if (pathname.startsWith('/admin/contact-messages')) {
    return 'Contact Messages';
  }
  if (pathname.startsWith('/admin/ml-models')) {
    if (pathname.includes('/upload')) return 'Upload ML Model';
    return 'Machine Learning Models';
  }
  if (pathname.startsWith('/admin/activity-logs')) {
    return 'Activity & Audit Logs';
  }
  if (pathname.startsWith('/admin/admins')) {
    return 'Admin Management';
  }
  if (pathname.startsWith('/admin/settings')) {
    return 'System Settings';
  }
  return 'Dashboard Overview';
};

const AdminTopbar = ({ onToggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const title = getPageTitle(location.pathname);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const displayName = user?.full_name || user?.username || 'Administrator';
  const roleName = user?.role ? user.role.replace('_', ' ') : 'ADMIN';

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-border h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile hamburger & Dynamic page title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Open sidebar navigation"
          className="lg:hidden p-2 rounded-lg text-textSecondary hover:text-text hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-text tracking-tight line-clamp-1">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Admin info, Role badge & Logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 pl-2">
          <div className="w-8 h-8 rounded-full bg-teal-100 text-primary flex items-center justify-center font-semibold text-xs border border-teal-200 shadow-sm">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-text leading-tight line-clamp-1">
              {displayName}
            </span>
            <span className="text-[10px] font-bold text-primary tracking-wide uppercase">
              {roleName}
            </span>
          </div>
        </div>

        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
          {roleName}
        </span>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Sign Out"
          title="Sign Out"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-textSecondary hover:text-red-600 rounded-lg hover:bg-red-50 border border-border hover:border-red-100 transition-colors"
        >
          <FiLogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;
