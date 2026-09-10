import React from 'react';

export const CardHeader = ({ title, description, action, className = '', children }) => (
  <div className={`flex items-start justify-between pb-4 border-b border-border mb-4 ${className}`}>
    <div>
      {title && <h3 className="text-lg font-bold text-text">{title}</h3>}
      {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
      {children}
    </div>
    {action && <div className="ml-4 flex-shrink-0">{action}</div>}
  </div>
);

export const CardContent = ({ className = '', children }) => (
  <div className={`${className}`}>{children}</div>
);

export const CardFooter = ({ className = '', children }) => (
  <div className={`pt-4 border-t border-border mt-4 flex items-center justify-end gap-3 ${className}`}>
    {children}
  </div>
);

const Card = ({
  title,
  description,
  action,
  elevated = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`${elevated ? 'card-elevated' : 'card-base'} ${className}`}
      {...props}
    >
      {(title || description || action) && (
        <CardHeader title={title} description={description} action={action} />
      )}
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
