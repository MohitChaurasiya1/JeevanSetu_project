import React, { useState } from 'react';

const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  icon = null,
  className = '',
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState([]);

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  };

  const selectedVariant = variantClasses[variant] || variantClasses.primary;

  const handleClick = (e) => {
    if (disabled || loading) return;

    try {
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const id = Date.now() + Math.random();

      setRipples((prev) => [...prev.slice(-2), { x, y, size, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    } catch {
      // Fallback gracefully
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`btn-ripple-container ${selectedVariant} ${className}`}
      {...props}
    >
      {/* Ripple Animation Spans */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="btn-ripple-effect"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
          }}
          aria-hidden="true"
        />
      ))}

      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="mr-2 inline-flex items-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
