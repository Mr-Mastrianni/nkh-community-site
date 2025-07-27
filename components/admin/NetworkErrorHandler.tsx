'use client';

import React, { useState, useEffect } from 'react';
import ErrorMessage from './ErrorMessage';

interface NetworkErrorHandlerProps {
  error: Error;
  onRetry?: () => void;
  onOfflineMode?: () => void;
  showOfflineOption?: boolean;
}

const NetworkErrorHandler: React.FC<NetworkErrorHandlerProps> = ({
  error,
  onRetry,
  onOfflineMode,
  showOfflineOption = false
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      await onRetry();
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const getErrorMessage = () => {
    if (!isOnline) {
      return {
        title: 'No Internet Connection',
        message: 'You appear to be offline. Please check your internet connection and try again.',
        variant: 'warning' as const
      };
    }

    const message = error.message.toLowerCase();
    
    if (message.includes('timeout') || message.includes('timed out')) {
      return {
        title: 'Request Timeout',
        message: 'The request took too long to complete. This might be due to a slow connection or server issues.',
        variant: 'warning' as const
      };
    }
    
    if (message.includes('fetch') || message.includes('network')) {
      return {
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
        variant: 'error' as const
      };
    }
    
    if (message.includes('500') || message.includes('server error')) {
      return {
        title: 'Server Error',
        message: 'The server is experiencing issues. Please try again in a few moments.',
        variant: 'error' as const
      };
    }
    
    if (message.includes('403') || message.includes('unauthorized')) {
      return {
        title: 'Access Denied',
        message: 'You do not have permission to perform this action. Please log in again.',
        variant: 'warning' as const
      };
    }
    
    return {
      title: 'Connection Error',
      message: 'Unable to complete the request. Please try again.',
      variant: 'error' as const
    };
  };

  const errorInfo = getErrorMessage();
  
  const actions = [
    ...(onRetry ? [{
      label: isRetrying ? 'Retrying...' : `Retry${retryCount > 0 ? ` (${retryCount})` : ''}`,
      onClick: handleRetry,
      variant: 'primary' as const
    }] : []),
    ...(showOfflineOption && onOfflineMode ? [{
      label: 'Work Offline',
      onClick: onOfflineMode,
      variant: 'secondary' as const
    }] : [])
  ];

  return (
    <div className="space-y-4">
      <ErrorMessage
        title={errorInfo.title}
        message={errorInfo.message}
        details={error.message}
        variant={errorInfo.variant}
        actions={actions}
      />
      
      {!isOnline && (
        <div className="cosmic-card p-4 bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-center gap-3">
            <i className="fas fa-wifi-slash text-yellow-400 text-lg"></i>
            <div>
              <h4 className="text-yellow-400 font-semibold">Offline Mode</h4>
              <p className="text-yellow-300 text-sm">
                You're currently offline. Some features may not be available.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {retryCount > 2 && (
        <div className="cosmic-card p-4 bg-cosmic-teal/10 border border-cosmic-teal/30">
          <h4 className="text-cosmic-teal font-semibold mb-2 flex items-center gap-2">
            <i className="fas fa-info-circle"></i>
            Still having trouble?
          </h4>
          <ul className="text-cosmic-light/80 text-sm space-y-1">
            <li className="flex items-start gap-2">
              <i className="fas fa-arrow-right text-cosmic-teal text-xs mt-1 flex-shrink-0"></i>
              Try refreshing the page
            </li>
            <li className="flex items-start gap-2">
              <i className="fas fa-arrow-right text-cosmic-teal text-xs mt-1 flex-shrink-0"></i>
              Check if other websites are working
            </li>
            <li className="flex items-start gap-2">
              <i className="fas fa-arrow-right text-cosmic-teal text-xs mt-1 flex-shrink-0"></i>
              Contact support if the issue persists
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NetworkErrorHandler;