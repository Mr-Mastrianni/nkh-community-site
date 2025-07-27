import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NetworkErrorHandler from '../NetworkErrorHandler';

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true
});

describe('NetworkErrorHandler', () => {
  const defaultProps = {
    error: new Error('Network request failed')
  };

  beforeEach(() => {
    // Reset navigator.onLine to true before each test
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });
  });

  it('renders basic network error', () => {
    render(<NetworkErrorHandler {...defaultProps} />);
    
    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    expect(screen.getByText(/Unable to complete the request/)).toBeInTheDocument();
  });

  it('detects offline state and shows appropriate message', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });

    render(<NetworkErrorHandler {...defaultProps} />);
    
    expect(screen.getByText('No Internet Connection')).toBeInTheDocument();
    expect(screen.getByText(/You appear to be offline/)).toBeInTheDocument();
  });

  it('detects timeout errors and shows appropriate message', () => {
    const error = new Error('Request timed out');
    render(<NetworkErrorHandler {...defaultProps} error={error} />);
    
    expect(screen.getByText('Request Timeout')).toBeInTheDocument();
    expect(screen.getByText(/took too long to complete/)).toBeInTheDocument();
  });

  it('detects server errors and shows appropriate message', () => {
    const error = new Error('Server error 500');
    render(<NetworkErrorHandler {...defaultProps} error={error} />);
    
    expect(screen.getByText('Server Error')).toBeInTheDocument();
    expect(screen.getByText(/server is experiencing issues/)).toBeInTheDocument();
  });

  it('detects authorization errors and shows appropriate message', () => {
    const error = new Error('403 Unauthorized');
    render(<NetworkErrorHandler {...defaultProps} error={error} />);
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText(/do not have permission/)).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const onRetry = jest.fn().mockResolvedValue(undefined);
    render(<NetworkErrorHandler {...defaultProps} onRetry={onRetry} />);
    
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
    
    // Wait for async operation to complete
    await waitFor(() => {
      expect(screen.getByText('Retry (1)')).toBeInTheDocument();
    });
  });

  it('shows retry count after multiple retries', async () => {
    const onRetry = jest.fn().mockResolvedValue(undefined);
    render(<NetworkErrorHandler {...defaultProps} onRetry={onRetry} />);
    
    const retryButton = screen.getByText('Retry');
    
    // Click retry multiple times
    fireEvent.click(retryButton);
    await waitFor(() => expect(screen.getByText('Retry (1)')).toBeInTheDocument());
    
    fireEvent.click(screen.getByText('Retry (1)'));
    await waitFor(() => expect(screen.getByText('Retry (2)')).toBeInTheDocument());
  });

  it('shows "Retrying..." text while retry is in progress', async () => {
    let resolveRetry: () => void;
    const onRetry = jest.fn(() => new Promise<void>(resolve => {
      resolveRetry = resolve;
    }));
    
    render(<NetworkErrorHandler {...defaultProps} onRetry={onRetry} />);
    
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);
    
    expect(screen.getByText('Retrying...')).toBeInTheDocument();
    
    // Resolve the promise
    resolveRetry!();
    await waitFor(() => {
      expect(screen.queryByText('Retrying...')).not.toBeInTheDocument();
    });
  });

  it('calls onOfflineMode when work offline button is clicked', () => {
    const onOfflineMode = jest.fn();
    render(
      <NetworkErrorHandler 
        {...defaultProps} 
        onOfflineMode={onOfflineMode} 
        showOfflineOption={true} 
      />
    );
    
    const offlineButton = screen.getByText('Work Offline');
    fireEvent.click(offlineButton);
    
    expect(onOfflineMode).toHaveBeenCalledTimes(1);
  });

  it('shows offline mode indicator when offline', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });

    render(<NetworkErrorHandler {...defaultProps} />);
    
    expect(screen.getByText('Offline Mode')).toBeInTheDocument();
    expect(screen.getByText(/You're currently offline/)).toBeInTheDocument();
  });

  it('shows troubleshooting tips after multiple retries', async () => {
    const onRetry = jest.fn().mockResolvedValue(undefined);
    render(<NetworkErrorHandler {...defaultProps} onRetry={onRetry} />);
    
    const retryButton = screen.getByText('Retry');
    
    // Click retry 3 times to trigger troubleshooting tips
    for (let i = 0; i < 3; i++) {
      fireEvent.click(retryButton);
      await waitFor(() => {
        expect(screen.getByText(`Retry (${i + 1})`)).toBeInTheDocument();
      });
    }
    
    expect(screen.getByText('Still having trouble?')).toBeInTheDocument();
    expect(screen.getByText(/Try refreshing the page/)).toBeInTheDocument();
    expect(screen.getByText(/Check if other websites are working/)).toBeInTheDocument();
  });

  it('responds to online/offline events', () => {
    render(<NetworkErrorHandler {...defaultProps} />);
    
    // Simulate going offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });
    
    fireEvent(window, new Event('offline'));
    
    expect(screen.getByText('Offline Mode')).toBeInTheDocument();
    
    // Simulate going back online
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });
    
    fireEvent(window, new Event('online'));
    
    expect(screen.queryByText('Offline Mode')).not.toBeInTheDocument();
  });

  it('handles retry failures gracefully', async () => {
    const onRetry = jest.fn().mockRejectedValue(new Error('Retry failed'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    render(<NetworkErrorHandler {...defaultProps} onRetry={onRetry} />);
    
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Retry failed:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });
});