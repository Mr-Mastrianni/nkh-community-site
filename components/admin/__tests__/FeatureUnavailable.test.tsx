import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeatureUnavailable from '../FeatureUnavailable';

// Mock navigator properties
Object.defineProperty(navigator, 'userAgent', {
  writable: true,
  value: 'Mozilla/5.0 (Test Browser)'
});

Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true
});

describe('FeatureUnavailable', () => {
  const defaultProps = {
    feature: 'Advanced Editor'
  };

  it('renders basic feature unavailable message', () => {
    render(<FeatureUnavailable {...defaultProps} />);
    
    expect(screen.getByText('Browser Not Supported')).toBeInTheDocument();
    expect(screen.getByText(/Your browser doesn't support Advanced Editor/)).toBeInTheDocument();
  });

  it('renders browser not supported reason', () => {
    render(<FeatureUnavailable {...defaultProps} reason="browser" />);
    
    expect(screen.getByText('Browser Not Supported')).toBeInTheDocument();
    expect(screen.getByText(/use a modern browser like Chrome, Firefox, or Safari/)).toBeInTheDocument();
  });

  it('renders network required reason', () => {
    render(<FeatureUnavailable {...defaultProps} reason="network" />);
    
    expect(screen.getByText('Network Required')).toBeInTheDocument();
    expect(screen.getByText(/requires an internet connection/)).toBeInTheDocument();
  });

  it('renders permission required reason', () => {
    render(<FeatureUnavailable {...defaultProps} reason="permission" />);
    
    expect(screen.getByText('Permission Required')).toBeInTheDocument();
    expect(screen.getByText(/requires additional permissions/)).toBeInTheDocument();
  });

  it('renders maintenance reason', () => {
    render(<FeatureUnavailable {...defaultProps} reason="maintenance" />);
    
    expect(screen.getByText('Temporarily Unavailable')).toBeInTheDocument();
    expect(screen.getByText(/temporarily unavailable due to maintenance/)).toBeInTheDocument();
  });

  it('renders custom reason', () => {
    const customReason = 'This feature is disabled for your account type';
    render(
      <FeatureUnavailable 
        {...defaultProps} 
        reason="custom" 
        customReason={customReason} 
      />
    );
    
    expect(screen.getByText('Feature Unavailable')).toBeInTheDocument();
    expect(screen.getByText(customReason)).toBeInTheDocument();
  });

  it('calls onTryAlternative when alternative button is clicked', () => {
    const onTryAlternative = jest.fn();
    render(
      <FeatureUnavailable 
        {...defaultProps} 
        onTryAlternative={onTryAlternative}
        alternativeLabel="Use Basic Editor"
      />
    );
    
    const alternativeButton = screen.getByText('Use Basic Editor');
    fireEvent.click(alternativeButton);
    
    expect(onTryAlternative).toHaveBeenCalledTimes(1);
  });

  it('shows refresh page button', () => {
    // Mock window.location.reload
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });

    render(<FeatureUnavailable {...defaultProps} />);
    
    const refreshButton = screen.getByText('Refresh Page');
    fireEvent.click(refreshButton);
    
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('shows technical details when enabled', () => {
    render(<FeatureUnavailable {...defaultProps} showTechnicalDetails={true} />);
    
    const detailsButton = screen.getByText('Technical Details');
    fireEvent.click(detailsButton);
    
    expect(screen.getByText(/Feature: Advanced Editor/)).toBeInTheDocument();
    expect(screen.getByText(/Reason: browser/)).toBeInTheDocument();
    expect(screen.getByText(/User Agent:/)).toBeInTheDocument();
  });

  it('hides technical details by default', () => {
    render(<FeatureUnavailable {...defaultProps} />);
    
    expect(screen.queryByText('Technical Details')).not.toBeInTheDocument();
  });

  it('renders fallback content when provided', () => {
    const fallbackContent = (
      <div>
        <p>You can try these alternatives:</p>
        <button>Basic Mode</button>
        <button>Text Only</button>
      </div>
    );
    
    render(
      <FeatureUnavailable 
        {...defaultProps} 
        fallbackContent={fallbackContent}
      />
    );
    
    expect(screen.getByText('Alternative Options:')).toBeInTheDocument();
    expect(screen.getByText('You can try these alternatives:')).toBeInTheDocument();
    expect(screen.getByText('Basic Mode')).toBeInTheDocument();
    expect(screen.getByText('Text Only')).toBeInTheDocument();
  });

  it('applies correct styling for different reasons', () => {
    const { rerender } = render(<FeatureUnavailable {...defaultProps} reason="browser" />);
    let container = screen.getByRole('generic');
    expect(container).toHaveClass('bg-yellow-500/10', 'border-yellow-500/30');

    rerender(<FeatureUnavailable {...defaultProps} reason="network" />);
    container = screen.getByRole('generic');
    expect(container).toHaveClass('bg-red-500/10', 'border-red-500/30');

    rerender(<FeatureUnavailable {...defaultProps} reason="permission" />);
    container = screen.getByRole('generic');
    expect(container).toHaveClass('bg-orange-500/10', 'border-orange-500/30');

    rerender(<FeatureUnavailable {...defaultProps} reason="maintenance" />);
    container = screen.getByRole('generic');
    expect(container).toHaveClass('bg-blue-500/10', 'border-blue-500/30');
  });

  it('shows correct icons for different reasons', () => {
    const { rerender } = render(<FeatureUnavailable {...defaultProps} reason="browser" />);
    let icon = screen.getByRole('generic').querySelector('i');
    expect(icon).toHaveClass('fas', 'fa-browser');

    rerender(<FeatureUnavailable {...defaultProps} reason="network" />);
    icon = screen.getByRole('generic').querySelector('i');
    expect(icon).toHaveClass('fas', 'fa-wifi-slash');

    rerender(<FeatureUnavailable {...defaultProps} reason="permission" />);
    icon = screen.getByRole('generic').querySelector('i');
    expect(icon).toHaveClass('fas', 'fa-lock');

    rerender(<FeatureUnavailable {...defaultProps} reason="maintenance" />);
    icon = screen.getByRole('generic').querySelector('i');
    expect(icon).toHaveClass('fas', 'fa-tools');
  });

  it('includes browser capability detection in technical details', () => {
    // Mock WebGL support
    Object.defineProperty(window, 'WebGLRenderingContext', {
      value: function() {},
      writable: true
    });

    render(
      <FeatureUnavailable 
        {...defaultProps} 
        reason="browser" 
        showTechnicalDetails={true} 
      />
    );
    
    const detailsButton = screen.getByText('Technical Details');
    fireEvent.click(detailsButton);
    
    expect(screen.getByText(/WebGL Support: true/)).toBeInTheDocument();
    expect(screen.getByText(/Local Storage: true/)).toBeInTheDocument();
  });
});