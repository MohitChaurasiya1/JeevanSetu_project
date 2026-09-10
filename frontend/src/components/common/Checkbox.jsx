import React, { forwardRef } from 'react';

const Checkbox = forwardRef(({
  label,
  id,
  name,
  checked,
  onChange,
  disabled = false,
  error,
  helperText,
  className = '',
  ...props
}, ref) => {
  const checkboxId = id || name;

  return (
    <div className={`${className}`}>
      <label htmlFor={checkboxId} className="inline-flex items-start gap-2.5 cursor-pointer select-none">
        <input
          ref={ref}
          id={checkboxId}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="form-checkbox mt-1 h-4 w-4 text-primary rounded border-border focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          {...props}
        />
        {label && (
          <span className={`text-sm text-text ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {label}
          </span>
        )}
      </label>
      {error ? (
        <p className="form-error ml-6.5" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p className="form-helper ml-6.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
