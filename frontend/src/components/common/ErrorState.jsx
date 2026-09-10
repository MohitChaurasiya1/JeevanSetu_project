import React from 'react';
import Button from './Button';

const ErrorState = ({
  title = 'Something went wrong',
  message = 'We encountered an error while processing your request.',
  onRetry = null,
  retryLabel = 'Try Again',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto ${className}`}
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-red-100 text-danger flex items-center justify-center mb-4">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h4 className="text-base font-semibold text-text mb-1">{title}</h4>
      <p className="text-sm text-text-secondary mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
