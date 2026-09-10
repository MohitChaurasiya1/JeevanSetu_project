import React from 'react';
import Spinner from './Spinner';

const LoadingState = ({
  message = 'Loading...',
  size = 'lg',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
      {...props}
    >
      <Spinner size={size} />
      {message && (
        <p className="mt-3 text-sm font-medium text-text-secondary">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingState;
