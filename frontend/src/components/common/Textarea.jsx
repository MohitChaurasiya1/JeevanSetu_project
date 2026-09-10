import React, { forwardRef } from 'react';

const Textarea = forwardRef(({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
  ...props
}, ref) => {
  const textareaId = id || name;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="form-label">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
        }
        className={`form-input resize-y ${error ? 'has-error' : ''} ${disabled ? 'bg-slate-100 cursor-not-allowed' : ''}`}
        {...props}
      />
      {error ? (
        <p id={`${textareaId}-error`} className="form-error" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${textareaId}-helper`} className="form-helper">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
