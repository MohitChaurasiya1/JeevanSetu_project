import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiUsers,
  FiActivity,
  FiFolder,
  FiList,
  FiMessageSquare,
  FiMail,
  FiCpu,
  FiClock,
  FiLogOut,
  FiX,
} from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    path: ROUTES.ADMIN_DASHBOARD,
    icon: FiGrid,
  },
  {
    name: 'Users',
    path: ROUTES.ADMIN_USERS,
    icon: FiUsers,
  },
  {
    name: 'Predictions',
    path: ROUTES.ADMIN_PREDICTIONS,
    icon: FiActivity,
  },
  {
    name: 'Diseases',
    path: ROUTES.ADMIN_DISEASES,
    icon: FiFolder,
  },
  {
    name: 'Symptoms',
    path: ROUTES.ADMIN_SYMPTOMS,
    icon: FiList,
  },
  {
    name: 'Feedback',
    path: ROUTES.ADMIN_FEEDBACK,
    icon: FiMessageSquare,
  },
  {
    name: 'Contact Messages',
    path: ROUTES.ADMIN_CONTACT_MESSAGES,
    icon: FiMail,
  },
  {
    name: 'ML Models',
    path: ROUTES.ADMIN_ML_MODELS,
    icon: FiCpu,
  },
  {
    name: 'Activity Logs',
    path: ROUTES.ADMIN_ACTIVITY_LOGS,
    icon: FiClock,
  },
];

const AdminSidebar = ({ onItemClick, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onClose) onClose();
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <aside className="flex flex-col h-full w-full bg-white border-r border-border select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-border">
        <NavLink
          to={ROUTES.ADMIN_DASHBOARD}
          onClick={onItemClick}
          className="flex items-center gap-3 group"
        >
          <img
            src="/Logo.jpeg"
            alt="JeevanSetu Logo"
            className="w-9 h-9 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="font-bold text-base text-text tracking-tight flex items-center gap-1.5">
              JeevanSetu
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                Admin
              </span>
            </span>
            <span className="text-[11px] text-textSecondary font-normal -mt-0.5">
              Management Portal
            </span>
          </div>
        </NavLink>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 rounded-lg text-textSecondary hover:bg-slate-100 hover:text-text transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-teal-50 text-primary border-l-4 border-primary font-semibold shadow-sm'
                    : 'text-textSecondary hover:bg-slate-50 hover:text-text border-l-4 border-transparent'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-3 border-t border-border bg-slate-50/60">
        {user && (
          <div className="px-3 py-2 mb-2 rounded-lg bg-white border border-border/80 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-text truncate max-w-[130px]">
                {user.full_name || user.username}
              </p>
              <span className="text-[10px] uppercase font-bold tracking-wide text-primary bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                {user.role || 'ADMIN'}
              </span>
            </div>
            <p className="text-[11px] text-textSecondary truncate mt-0.5">
              {user.email}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors border border-transparent hover:border-red-100"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
