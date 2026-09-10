import React from 'react';

const Badge = ({
  variant = 'info',
  children,
  className = '',
  icon = null,
  ...props
}) => {
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    low: 'badge-risk-low',
    medium: 'badge-risk-medium',
    high: 'badge-risk-high',
  };

  const selectedVariant = variantClasses[variant] || variantClasses.info;

  return (
    <span className={`${selectedVariant} ${className}`} {...props}>
      {icon && <span className="inline-flex items-center text-xs">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
