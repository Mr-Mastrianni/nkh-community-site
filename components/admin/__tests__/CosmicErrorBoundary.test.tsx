import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CosmicErrorBoundary from '../CosmicErrorBoundary';

// Mock component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

// Custom fallback component for testing
const CustomFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => (
  <div>
    <h1>Custom Error</h1>
    <p>{error.message}</p>
    <button onClick={resetError}>Custom Reset</button>
  </div>
);

describe('CosmicErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <CosmicErrorBoundary>
        <ThrowError shouldThrow={false} />
      </CosmicErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders default error UI when an error occurs', () => {
    render(
      <CosmicErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CosmicErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <CosmicErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </CosmicErrorBoundary>
    );

    expect(screen.getByText('Custom Error')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Custom Reset')).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = jest.fn();
    
    render(
      <CosmicErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </CosmicErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  it('resets error state when Try Again is clicked', () => {
    const { rerender } = render(
      <CosmicErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CosmicErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Try Again'));

    // Re-render with no error
    rerender(
      <CosmicErrorBoundary>
        <ThrowError shouldThrow={false} />
      </CosmicErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('reloads page when Reload Page is clicked', () => {
    // Mock window.location.reload
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });

    render(
      <CosmicErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CosmicErrorBoundary>
    );

    fireEvent.click(screen.getByText('Reload Page'));

    expect(mockReload).toHaveBeenCalled();
  });

  it('displays error details in expandable section', () => {
    render(
      <CosmicErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CosmicErrorBoundary>
    );

    expect(screen.getByText('Error Details:')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });
});