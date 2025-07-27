'use client';

import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  details?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'error' | 'warning' | 'info';
  showIcon?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  details,
  onRetry,
  onDismiss,
  variant = 'error',
  showIcon = true,
  actions
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          container: 'bg-yellow-500/10 border-yellow-500/30',
          icon: 'fas fa-exclamation-triangle text-yellow-400',
          title: 'text-yellow-400',
          message: 'text-yellow-300'
        };
      case 'info':
        return {
          container: 'bg-blue-500/10 border-blue-500/30',
          icon: 'fas fa-info-circle text-blue-400',
          title: 'text-blue-400',
          message: 'text-blue-300'
        };
      default:
        return {
          container: 'bg-red-500/10 border-red-500/30',
          icon: 'fas fa-exclamation-circle text-red-400',
          title: 'text-red-400',
          message: 'text-red-300'
        };
    }
  };

  const getButtonStyles = (buttonVariant: string = 'primary') => {
    switch (buttonVariant) {
      case 'secondary':
        return 'px-4 py-2 bg-cosmic-light/10 hover:bg-cosmic-light/20 text-cosmic-light rounded-md transition-colors';
      case 'danger':
        return 'px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-cosmic-light rounded-md transition-colors';
      default:
        return 'cosmic-button';
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`cosmic-card p-6 border ${styles.container} rounded-lg`}>
      <div className="flex items-start space-x-4">
        {showIcon && (
          <div className="flex-shrink-0">
            <i className={`${styles.icon} text-xl`}></i>
          </div>
        )}
        
        <div className="flex-grow">
          {title && (
            <h3 className={`text-lg font-semibold ${styles.title} mb-2`}>
              {title}
            </h3>
          )}
          
          <p className={`${styles.message} mb-3`}>
            {message}
          </p>
          
          {details && (
            <details className="mb-4">
              <summary className="cursor-pointer text-cosmic-light/70 hover:text-cosmic-light text-sm mb-2">
                Show technical details
              </summary>
              <div className="bg-cosmic-deep/50 rounded-md p-3 text-sm font-mono text-cosmic-light/80 break-all">
                {details}
              </div>
            </details>
          )}
          
          <div className="flex flex-wrap gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="cosmic-button flex items-center gap-2"
              >
                <i className="fas fa-redo text-sm"></i>
                Try Again
              </button>
            )}
            
            {actions?.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={getButtonStyles(action.variant)}
              >
                {action.label}
              </button>
            ))}
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="px-4 py-2 bg-cosmic-light/10 hover:bg-cosmic-light/20 text-cosmic-light rounded-md transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-cosmic-light/50 hover:text-cosmic-light transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;