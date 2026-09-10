import React, { useState } from 'react';

const Alert = ({
  variant = 'info',
  title,
  message,
  dismissible = false,
  onClose,
  className = '',
  children,
  ...props
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  const variantStyles = {
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: 'text-success',
      iconSvg: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: 'text-warning',
      iconSvg: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-900',
      icon: 'text-danger',
      iconSvg: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: 'text-info',
      iconSvg: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const current = variantStyles[variant] || variantStyles.info;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-lg border ${current.container} ${className}`}
      {...props}
    >
      <div className={`flex-shrink-0 mt-0.5 ${current.icon}`}>
        {current.iconSvg}
      </div>
      <div className="flex-1 text-sm">
        {title && <h5 className="font-semibold mb-1">{title}</h5>}
        {message && <p>{message}</p>}
        {children}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleClose}
          aria-label="Dismiss alert"
          className="flex-shrink-0 text-current opacity-60 hover:opacity-100 p-1 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
