import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiActivity,
  FiAlertTriangle,
  FiShield,
  FiClock,
  FiArrowRight,
  FiRefreshCw,
  FiMessageSquare,
  FiMail,
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import { getDashboard } from '../../../api/adminApi';
import { ROUTES } from '../../../constants/routes';
import { EmptyState, ErrorState, Button } from '../../../components/common';

const RISK_COLORS = {
  Low: '#16A34A',
  Medium: '#D97706',
  High: '#DC2626',
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return '--';
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (isNaN(diffInSeconds)) return dateString;
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatChartDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return dateStr;
};

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDashboard();
      setData(response);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
      setError(err?.response?.data?.detail || err?.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Derived Stats
  const totals = data?.totals || {};
  const predictionTrend = data?.prediction_trend || [];
  const riskDistribution = data?.risk_distribution || [
    { name: 'Low', value: 0 },
    { name: 'Medium', value: 0 },
    { name: 'High', value: 0 },
  ];
  const recentActivity = data?.recent_activity || [];

  const totalRiskCount = riskDistribution.reduce((acc, curr) => acc + (curr.value || 0), 0);

  const STAT_CARDS = [
    {
      id: 'total-users',
      title: 'Total Users',
      value: totals.users ?? 0,
      subtitle: 'Registered accounts',
      icon: FiUsers,
      iconBg: 'bg-teal-50',
      iconColor: 'text-primary',
      borderColor: 'hover:border-teal-200',
    },
    {
      id: 'total-predictions',
      title: 'Total Predictions',
      value: totals.predictions ?? 0,
      subtitle: 'Health assessments',
      icon: FiActivity,
      iconBg: 'bg-blue-50',
      iconColor: 'text-secondary',
      borderColor: 'hover:border-blue-200',
    },
    {
      id: 'high-risk',
      title: 'High Risk',
      value: totals.high_risk ?? 0,
      subtitle: 'Critical flags',
      icon: FiAlertTriangle,
      iconBg: 'bg-red-50',
      iconColor: 'text-risk-high',
      borderColor: 'hover:border-red-200',
    },
    {
      id: 'low-risk',
      title: 'Low Risk',
      value: totals.low_risk ?? 0,
      subtitle: 'Normal range',
      icon: FiShield,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-risk-low',
      borderColor: 'hover:border-emerald-200',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
            Admin Dashboard Overview
          </h1>
          <p className="text-sm text-textSecondary mt-1">
            Platform performance metrics, prediction monitoring, and recent system activities.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchDashboardData}
            disabled={loading}
            icon={<FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            className="inline-flex items-center justify-center gap-1 px-3"
          >
            Refresh
          </Button>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/60 text-xs font-medium text-primary shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Admin Portal
          </div>
        </div>
      </div>

      {/* ==================== ERROR STATE ==================== */}
      {error && !loading && (
        <div className="bg-white rounded-xl border border-red-200 p-6 shadow-card">
          <ErrorState
            title="Unable to Load Dashboard"
            message={error}
            onRetry={fetchDashboardData}
            retryLabel="Retry Loading"
          />
        </div>
      )}

      {/* ==================== SKELETON LOADING STATE ==================== */}
      {loading && !data && (
        <div className="space-y-6 animate-pulse">
          {/* Stat Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-border p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-slate-200 rounded w-24" />
                  <div className="w-10 h-10 bg-slate-100 rounded-lg" />
                </div>
                <div className="h-8 bg-slate-200 rounded w-16" />
                <div className="h-3 bg-slate-100 rounded w-28" />
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-border p-6 shadow-card h-80">
              <div className="h-5 bg-slate-200 rounded w-40 mb-4" />
              <div className="h-56 bg-slate-100 rounded" />
            </div>
            <div className="bg-white rounded-xl border border-border p-6 shadow-card h-80">
              <div className="h-5 bg-slate-200 rounded w-40 mb-4" />
              <div className="h-56 bg-slate-100 rounded" />
            </div>
          </div>

          {/* Activity Skeleton */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-card space-y-3">
            <div className="h-5 bg-slate-200 rounded w-36 mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-50 rounded-lg" />
            ))}
          </div>
        </div>
      )}

      {/* ==================== LOADED CONTENT ==================== */}
      {(!loading || data) && !error && (
        <>
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
                        {stat.value.toLocaleString()}
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

          {/* ==================== QUICK SUMMARY BADGES ==================== */}
          {(totals.feedback !== undefined || totals.contact_messages_new !== undefined) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to={ROUTES.ADMIN_FEEDBACK}
                className="flex items-center justify-between p-4 bg-teal-50/70 hover:bg-teal-50 border border-teal-100 rounded-xl transition-colors group shadow-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-100 text-primary flex items-center justify-center">
                    <FiMessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-teal-800 font-medium">User Feedback</span>
                    <p className="text-base font-bold text-text">
                      {totals.feedback ?? 0} Submissions
                    </p>
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to={ROUTES.ADMIN_CONTACT_MESSAGES}
                className="flex items-center justify-between p-4 bg-blue-50/70 hover:bg-blue-50 border border-blue-100 rounded-xl transition-colors group shadow-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-secondary flex items-center justify-center">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-blue-800 font-medium">Contact Inquiries</span>
                    <p className="text-base font-bold text-text">
                      {totals.contact_messages_new ?? 0} New Messages
                    </p>
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-secondary group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}

          {/* ==================== CHARTS GRID ==================== */}
          <section aria-labelledby="analytics-heading" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <h2 id="analytics-heading" className="sr-only">
              Analytics and Trends
            </h2>

            {/* Prediction Trend Area Chart */}
            <div className="bg-white rounded-xl border border-border shadow-card p-5 sm:p-6 flex flex-col justify-between">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-text">
                    Predictions (last 30 days)
                  </h3>
                  <span className="text-xs text-textSecondary font-medium px-2 py-0.5 bg-slate-100 rounded">
                    Daily Assessments
                  </span>
                </div>
                <p className="text-xs text-textSecondary mt-0.5">
                  Volume of disease risk predictions over the past 30 days.
                </p>
              </div>

              <div className="w-full h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={predictionTrend}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPredictions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F766E" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#0F766E" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatChartDate}
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      minTickGap={25}
                    />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <RechartsTooltip
                      formatter={(val) => [`${val} predictions`, 'Evaluations']}
                      labelFormatter={(label) => `Date: ${formatChartDate(label)}`}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#0F766E"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorPredictions)"
                      activeDot={{ r: 5, fill: '#0F766E' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Distribution Donut Chart */}
            <div className="bg-white rounded-xl border border-border shadow-card p-5 sm:p-6 flex flex-col justify-between">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-text">
                    Risk Distribution
                  </h3>
                  <span className="text-xs text-textSecondary font-medium px-2 py-0.5 bg-slate-100 rounded">
                    Overall Severity
                  </span>
                </div>
                <p className="text-xs text-textSecondary mt-0.5">
                  Breakdown of predicted patient risk severity categories.
                </p>
              </div>

              <div className="w-full h-64 sm:h-72 flex flex-col items-center justify-center">
                {totalRiskCount === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-textSecondary">
                    <FiShield className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="text-sm font-medium">No risk data recorded yet</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Assessments will populate this breakdown
                    </p>
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={210}>
                      <PieChart>
                        <Pie
                          data={riskDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {riskDistribution.map((entry) => (
                            <Cell
                              key={`cell-${entry.name}`}
                              fill={RISK_COLORS[entry.name] || '#94A3B8'}
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(val, name) => [
                            `${val} (${Math.round((val / totalRiskCount) * 100)}%)`,
                            `${name} Risk`,
                          ]}
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                            fontSize: '12px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Custom Legend / Pills */}
                    <div className="flex items-center justify-center gap-4 sm:gap-6 pt-2 border-t border-slate-100 w-full">
                      {riskDistribution.map((item) => {
                        const color = RISK_COLORS[item.name];
                        const pct = totalRiskCount > 0 ? Math.round((item.value / totalRiskCount) * 100) : 0;
                        return (
                          <div key={item.name} className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            <div className="text-xs">
                              <span className="font-semibold text-text">{item.name}: </span>
                              <span className="text-textSecondary">{item.value} ({pct}%)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* ==================== RECENT ACTIVITY SECTION ==================== */}
          <section aria-labelledby="recent-activity-heading">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div>
                <h2
                  id="recent-activity-heading"
                  className="text-lg sm:text-xl font-bold text-text"
                >
                  Recent Activity
                </h2>
                <p className="text-sm text-textSecondary mt-0.5">
                  Live log of user evaluations, system updates, and administrative events.
                </p>
              </div>

              <Link
                to={ROUTES.ADMIN_ACTIVITY_LOGS}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover hover:underline transition-colors self-start sm:self-auto"
              >
                <span>View all activity logs</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
              {recentActivity.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    icon={<FiClock className="w-6 h-6 text-slate-400" />}
                    title="No recent activity available."
                    message="Recent assessment submissions, administrator actions, and platform alerts will appear here."
                  />
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {recentActivity.map((log) => {
                    const isSuccess = log.status === 'SUCCESS';
                    return (
                      <li
                        key={log.id}
                        className="p-4 sm:px-6 flex items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-3 min-w-0">
                          {/* Status Dot */}
                          <div className="pt-1 sm:pt-0">
                            <span
                              className={`block w-2.5 h-2.5 rounded-full flex-shrink-0 ${isSuccess
                                ? 'bg-emerald-500 ring-4 ring-emerald-100'
                                : 'bg-red-500 ring-4 ring-red-100'
                                }`}
                              title={`Status: ${log.status}`}
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                                {log.action}
                              </span>
                              <span className="text-xs font-semibold text-text">
                                {log.username || 'Anonymous'}
                              </span>
                              {log.module && (
                                <span className="text-[11px] text-slate-400 font-mono">
                                  [{log.module}]
                                </span>
                              )}
                            </div>

                            <p className="text-xs sm:text-sm text-textSecondary mt-0.5 truncate max-w-lg sm:max-w-2xl">
                              {log.description || 'System event triggered'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-xs text-textSecondary font-medium">
                            {formatRelativeTime(log.created_at)}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
