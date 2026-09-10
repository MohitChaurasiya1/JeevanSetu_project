import React from 'react';

const Spinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    primary: 'border-primary-light border-t-primary',
    white: 'border-white/30 border-t-white',
    secondary: 'border-secondary-light border-t-secondary',
    slate: 'border-slate-200 border-t-slate-700',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;
  const selectedColor = colorClasses[color] || colorClasses.primary;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block rounded-full animate-spin ${selectedSize} ${selectedColor} ${className}`}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
