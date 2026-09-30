import React from 'react';
import {
  FiUsers,
  FiActivity,
  FiAlertTriangle,
  FiShield,
  FiClock,
} from 'react-icons/fi';
import { EmptyState } from '../../../components/common';

const STAT_CARDS = [
  {
    id: 'total-users',
    title: 'Total Users',
    value: '--',
    subtitle: 'Registered accounts',
    icon: FiUsers,
    iconBg: 'bg-teal-50',
    iconColor: 'text-primary',
    borderColor: 'hover:border-teal-200',
  },
  {
    id: 'total-predictions',
    title: 'Total Predictions',
    value: '--',
    subtitle: 'Health assessments',
    icon: FiActivity,
    iconBg: 'bg-blue-50',
    iconColor: 'text-secondary',
    borderColor: 'hover:border-blue-200',
  },
  {
    id: 'high-risk',
    title: 'High Risk',
    value: '--',
    subtitle: 'Critical flags',
    icon: FiAlertTriangle,
    iconBg: 'bg-red-50',
    iconColor: 'text-risk-high',
    borderColor: 'hover:border-red-200',
  },
  {
    id: 'low-risk',
    title: 'Low Risk',
    value: '--',
    subtitle: 'Normal range',
    icon: FiShield,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-risk-low',
    borderColor: 'hover:border-emerald-200',
  },
];

const AdminDashboardPage = () => {
  return (
    <div className="container mx-auto space-y-8">
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">
            Admin Dashboard Overview
          </h1>
          <p className="text-sm text-textSecondary mt-1">
            Platform performance metrics, prediction monitoring, and recent system activities.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/60 text-xs font-medium text-primary">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Admin Portal
        </div>
      </div>

      {/* ==================== STATISTICS SECTION ==================== */}
      <section aria-labelledby="statistics-heading">
        <h2 id="statistics-heading" className="sr-only">
          Platform Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STAT_CARDS.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.id}
                className={`bg-white rounded-xl border border-border shadow-card p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated ${stat.borderColor}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-textSecondary">
                    {stat.title}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.iconBg} ${stat.iconColor}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-text tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-textSecondary font-medium">
                    {stat.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== RECENT ACTIVITY SECTION ==================== */}
      <section aria-labelledby="recent-activity-heading">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              id="recent-activity-heading"
              className="text-xl font-bold text-text"
            >
              Recent Activity
            </h2>
            <p className="text-sm text-textSecondary mt-0.5">
              Live log of user evaluations, system updates, and administrative events.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border shadow-card p-6 sm:p-8">
          <EmptyState
            icon={<FiClock className="w-6 h-6 text-slate-400" />}
            title="No recent activity available."
            message="Recent assessment submissions, administrator actions, and platform alerts will appear here."
          />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
