'use client';

import React from 'react';

interface FeatureUnavailableProps {
  feature: string;
  reason?: 'browser' | 'network' | 'permission' | 'maintenance' | 'custom';
  customReason?: string;
  fallbackContent?: React.ReactNode;
  onTryAlternative?: () => void;
  alternativeLabel?: string;
  showTechnicalDetails?: boolean;
}

const FeatureUnavailable: React.FC<FeatureUnavailableProps> = ({
  feature,
  reason = 'browser',
  customReason,
  fallbackContent,
  onTryAlternative,
  alternativeLabel = 'Try Alternative',
  showTechnicalDetails = false
}) => {
  const getReasonInfo = () => {
    switch (reason) {
      case 'browser':
        return {
          icon: 'fas fa-browser',
          title: 'Browser Not Supported',
          message: `Your browser doesn't support ${feature}. Please use a modern browser like Chrome, Firefox, or Safari.`,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10 border-yellow-500/30'
        };
      case 'network':
        return {
          icon: 'fas fa-wifi-slash',
          title: 'Network Required',
          message: `${feature} requires an internet connection. Please check your connection and try again.`,
          color: 'text-red-400',
          bgColor: 'bg-red-500/10 border-red-500/30'
        };
      case 'permission':
        return {
          icon: 'fas fa-lock',
          title: 'Permission Required',
          message: `${feature} requires additional permissions. Please grant the necessary permissions and try again.`,
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/10 border-orange-500/30'
        };
      case 'maintenance':
        return {
          icon: 'fas fa-tools',
          title: 'Temporarily Unavailable',
          message: `${feature} is temporarily unavailable due to maintenance. Please try again later.`,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10 border-blue-500/30'
        };
      case 'custom':
        return {
          icon: 'fas fa-info-circle',
          title: 'Feature Unavailable',
          message: customReason || `${feature} is currently unavailable.`,
          color: 'text-cosmic-teal',
          bgColor: 'bg-cosmic-teal/10 border-cosmic-teal/30'
        };
      default:
        return {
          icon: 'fas fa-exclamation-triangle',
          title: 'Feature Unavailable',
          message: `${feature} is not available at the moment.`,
          color: 'text-cosmic-light/70',
          bgColor: 'bg-cosmic-light/10 border-cosmic-light/30'
        };
    }
  };

  const reasonInfo = getReasonInfo();

  const getTechnicalDetails = () => {
    const details = [];
    details.push(`Feature: ${feature}`);
    details.push(`Reason: ${reason}`);
    details.push(`User Agent: ${navigator.userAgent}`);
    details.push(`Online: ${navigator.onLine}`);
    
    if (reason === 'browser') {
      details.push(`WebGL Support: ${!!window.WebGLRenderingContext}`);
      details.push(`Local Storage: ${!!window.localStorage}`);
      details.push(`Service Worker: ${!!navigator.serviceWorker}`);
    }
    
    return details.join('\n');
  };

  return (
    <div className={`cosmic-card p-6 border ${reasonInfo.bgColor} rounded-lg`}>
      <div className="text-center">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-cosmic-deep/50 flex items-center justify-center">
            <i className={`${reasonInfo.icon} text-2xl ${reasonInfo.color}`}></i>
          </div>
        </div>
        
        <h3 className={`text-xl font-bold ${reasonInfo.color} mb-2`}>
          {reasonInfo.title}
        </h3>
        
        <p className="text-cosmic-light/80 mb-4">
          {reasonInfo.message}
        </p>
        
        {showTechnicalDetails && (
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-cosmic-light/70 hover:text-cosmic-light text-sm mb-2">
              Technical Details
            </summary>
            <div className="bg-cosmic-deep/50 rounded-md p-3 text-xs font-mono text-cosmic-light/70 break-all">
              {getTechnicalDetails()}
            </div>
          </details>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onTryAlternative && (
            <button
              onClick={onTryAlternative}
              className="cosmic-button flex items-center justify-center gap-2"
            >
              <i className="fas fa-exchange-alt"></i>
              {alternativeLabel}
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cosmic-light/10 hover:bg-cosmic-light/20 text-cosmic-light rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-refresh"></i>
            Refresh Page
          </button>
        </div>
      </div>
      
      {fallbackContent && (
        <div className="mt-6 pt-6 border-t border-cosmic-light/20">
          <h4 className="text-cosmic-light font-semibold mb-3">Alternative Options:</h4>
          {fallbackContent}
        </div>
      )}
    </div>
  );
};

export default FeatureUnavailable;