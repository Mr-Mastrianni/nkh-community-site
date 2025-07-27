'use client';

import React from 'react';

interface CosmicLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
  variant?: 'default' | 'minimal' | 'pulsing';
}

const CosmicLoadingSpinner: React.FC<CosmicLoadingSpinnerProps> = ({
  size = 'md',
  message,
  fullScreen = false,
  variant = 'default'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6';
      case 'md':
        return 'w-12 h-12';
      case 'lg':
        return 'w-16 h-16';
      case 'xl':
        return 'w-24 h-24';
      default:
        return 'w-12 h-12';
    }
  };

  const getMessageSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  const renderSpinner = () => {
    const sizeClasses = getSizeClasses();
    
    switch (variant) {
      case 'minimal':
        return (
          <div className={`${sizeClasses} animate-spin rounded-full border-2 border-cosmic-light/20 border-t-spiritual-gold`}></div>
        );
      
      case 'pulsing':
        return (
          <div className={`${sizeClasses} relative`}>
            <div className="absolute inset-0 rounded-full bg-spiritual-gold/30 animate-ping"></div>
            <div className="relative rounded-full bg-spiritual-gold/60 w-full h-full animate-pulse"></div>
          </div>
        );
      
      default:
        return (
          <div className={`${sizeClasses} relative`}>
            {/* Outer ring */}
            <div className="absolute inset-0 border-2 border-spiritual-purple/30 rounded-full animate-spin"></div>
            {/* Middle ring */}
            <div className="absolute inset-1 border-2 border-spiritual-gold/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            {/* Inner ring */}
            <div className="absolute inset-2 border-2 border-cosmic-teal/40 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-spiritual-gold rounded-full animate-pulse"></div>
            </div>
          </div>
        );
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {renderSpinner()}
      {message && (
        <p className={`text-cosmic-light/80 ${getMessageSize()} text-center animate-pulse`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center cosmic-gradient">
        {content}
      </div>
    );
  }

  return content;
};

export default CosmicLoadingSpinner;