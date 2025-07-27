'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, Globe, AlertTriangle } from 'lucide-react';

interface NetworkErrorHandlerProps {
  error: string | null;
  onRetry?: () => void;
  isOnline?: boolean;
  children: React.ReactNode;
}

export const NetworkErrorHandler: React.FC<NetworkErrorHandlerProps> = ({
  error,
  onRetry,
  isOnline = true,
  children,
}) => {
  const [isOnlineState, setIsOnlineState] = useState(isOnline);

  useEffect(() => {
    const handleOnline = () => setIsOnlineState(true);
    const handleOffline = () => setIsOnlineState(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnlineState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-orange-500/20 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <WifiOff className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">You're Offline</h3>
            <p className="text-orange-200 mb-6">
              It looks like you've lost your connection to the cosmic network. 
              Please check your internet connection and try again.
            </p>
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-red-500/20 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Network Error</h3>
            <p className="text-red-200 mb-6">{error}</p>
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default NetworkErrorHandler;