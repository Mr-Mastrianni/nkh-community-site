'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class CosmicErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CosmicErrorBoundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      // Default cosmic-themed error display
      return (
        <div className="cosmic-card p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-3xl text-red-400"></i>
            </div>
            <h2 className="text-2xl font-bold text-cosmic-light mb-2">
              Something went wrong
            </h2>
            <p className="text-cosmic-light/70 mb-4">
              An unexpected error occurred while loading this component.
            </p>
          </div>
          
          <div className="bg-cosmic-deep/50 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Error Details:</h3>
            <p className="text-cosmic-light/80 text-sm font-mono break-all">
              {this.state.error.message}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={this.resetError}
              className="cosmic-button flex items-center justify-center gap-2"
            >
              <i className="fas fa-redo"></i>
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-cosmic-light/10 hover:bg-cosmic-light/20 text-cosmic-light rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-refresh"></i>
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default CosmicErrorBoundary;