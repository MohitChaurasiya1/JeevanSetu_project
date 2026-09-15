import React from 'react';

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'teal',
}) => {
  const variants = {
    teal: {
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
      glow: 'group-hover:shadow-teal-100',
      value: 'text-slate-900',
    },

    green: {
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      glow: 'group-hover:shadow-emerald-100',
      value: 'text-emerald-600',
    },

    blue: {
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      glow: 'group-hover:shadow-blue-100',
      value: 'text-blue-600',
    },

    orange: {
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      glow: 'group-hover:shadow-orange-100',
      value: 'text-orange-600',
    },
  };

  const style = variants[variant] || variants.teal;

  return (
    <div
      className={`
        group relative overflow-hidden
        rounded-2xl border border-slate-200
        bg-white p-5
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-xl
        ${style.glow}
      `}
    >
      {/* Decorative background */}
      <div
        className="
          absolute -right-8 -top-8
          h-24 w-24 rounded-full
          bg-slate-50
          transition-transform duration-500
          group-hover:scale-150
        "
      />

      <div className="relative flex items-start justify-between">
        {/* Left content */}
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <h3
              className={`
                text-3xl font-bold tracking-tight
                ${style.value}
              `}
            >
              {value}
            </h3>

            {trend && (
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                {trend}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="mt-2 text-xs text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Icon */}
        <div
          className={`
            flex h-12 w-12 items-center justify-center
            rounded-xl
            ${style.iconBg}
            ${style.iconColor}
            transition-transform duration-300
            group-hover:scale-110
          `}
        >
          <span className="text-xl">
            {icon}
          </span>
        </div>
      </div>

      {/* Bottom accent */}
      <div
        className="
          absolute bottom-0 left-0
          h-1 w-0
          bg-teal-500
          transition-all duration-300
          group-hover:w-full
        "
      />
    </div>
  );
};

export default DashboardCard;