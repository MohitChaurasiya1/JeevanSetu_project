import React, { forwardRef } from 'react';

const Radio = forwardRef(({
  label,
  id,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  error,
  helperText,
  className = '',
  ...props
}, ref) => {
  const radioId = id || `${name}-${value}`;

  return (
    <div className={`${className}`}>
      <label htmlFor={radioId} className="inline-flex items-start gap-2.5 cursor-pointer select-none">
        <input
          ref={ref}
          id={radioId}
          name={name}
          type="radio"
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="form-radio mt-1 h-4 w-4 text-primary border-border focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
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

Radio.displayName = 'Radio';

export default Radio;
