import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
  ...props
}, ref) => {
  const inputId = id || name;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
        }
        className={`form-input ${error ? 'has-error' : ''} ${disabled ? 'bg-slate-100 cursor-not-allowed' : ''}`}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="form-error" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="form-helper">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
