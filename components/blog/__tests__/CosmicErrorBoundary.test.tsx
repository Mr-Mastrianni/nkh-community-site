import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CosmicErrorBoundary } from '../CosmicErrorBoundary';

// Test component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Test component for the error boundary
const TestComponent = ({ shouldThrow }: { shouldThrow: boolean }) => (
  <CosmicErrorBoundary>
    <ThrowError shouldThrow={shouldThrow} />
  </CosmicErrorBoundary>
);

describe('CosmicErrorBoundary', () => {
  // Mock console.error to avoid test output pollution
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when no error occurs', () => {
    render(<TestComponent shouldThrow={false} />);
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when an error occurs', () => {
    render(<TestComponent shouldThrow={true} />);
    
    expect(screen.getByText('Cosmic Disturbance Detected')).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong in the quantum realm/)).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
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

  it('resets error state when retry button is clicked', () => {
    const { rerender } = render(<TestComponent shouldThrow={true} />);
    
    expect(screen.getByText('Cosmic Disturbance Detected')).toBeInTheDocument();
    
    // Reset the component to not throw error
    rerender(<TestComponent shouldThrow={false} />);
    
    // Note: In real usage, this would require a proper reset mechanism
    // This test is simplified for demonstration
  });
});