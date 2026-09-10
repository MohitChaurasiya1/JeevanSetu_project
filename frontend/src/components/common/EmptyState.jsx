import React from 'react';
import Button from './Button';

const EmptyState = ({
  title = 'No items found',
  message = 'There is currently no data to display.',
  icon = null,
  action = null,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto ${className}`}
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-text-muted mb-4">
        {icon || (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>
      <h4 className="text-base font-semibold text-text mb-1">{title}</h4>
      <p className="text-sm text-text-secondary mb-5 leading-relaxed">{message}</p>
      {action && (
        <div>
          {typeof action === 'function' ? (
            <Button onClick={action} variant="primary">
              Take Action
            </Button>
          ) : (
            action
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
