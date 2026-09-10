import React, { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  id,
  name,
  options = [],
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  helperText,
  placeholder = 'Select an option',
  className = '',
  ...props
}, ref) => {
  const selectId = id || name;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
        }
        className={`form-input bg-white ${error ? 'has-error' : ''} ${disabled ? 'bg-slate-100 cursor-not-allowed' : ''}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => {
          const optValue = typeof option === 'object' ? option.value : option;
          const optLabel = typeof option === 'object' ? option.label : option;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
      {error ? (
        <p id={`${selectId}-error`} className="form-error" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${selectId}-helper`} className="form-helper">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
