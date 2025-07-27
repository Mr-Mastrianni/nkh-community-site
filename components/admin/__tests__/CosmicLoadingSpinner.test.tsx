import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CosmicLoadingSpinner from '../CosmicLoadingSpinner';

describe('CosmicLoadingSpinner', () => {
  it('renders with default props', () => {
    render(<CosmicLoadingSpinner />);
    
    // Should render the spinner container
    const spinner = screen.getByRole('generic');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    const message = 'Loading cosmic data...';
    render(<CosmicLoadingSpinner message={message} />);
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(<CosmicLoadingSpinner size="sm" />);
    let container = screen.getByRole('generic').firstChild as HTMLElement;
    expect(container).toHaveClass('w-6', 'h-6');

    rerender(<CosmicLoadingSpinner size="md" />);
    container = screen.getByRole('generic').firstChild as HTMLElement;
    expect(container).toHaveClass('w-12', 'h-12');

    rerender(<CosmicLoadingSpinner size="lg" />);
    container = screen.getByRole('generic').firstChild as HTMLElement;
    expect(container).toHaveClass('w-16', 'h-16');

    rerender(<CosmicLoadingSpinner size="xl" />);
    container = screen.getByRole('generic').firstChild as HTMLElement;
    expect(container).toHaveClass('w-24', 'h-24');
  });

  it('renders fullScreen variant correctly', () => {
    render(<CosmicLoadingSpinner fullScreen={true} />);
    
    const container = screen.getByRole('generic');
    expect(container).toHaveClass('fixed', 'inset-0', 'z-50');
  });

  it('renders minimal variant correctly', () => {
    render(<CosmicLoadingSpinner variant="minimal" />);
    
    const spinner = screen.getByRole('generic').firstChild as HTMLElement;
    expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'border-2');
  });

  it('renders pulsing variant correctly', () => {
    render(<CosmicLoadingSpinner variant="pulsing" />);
    
    const container = screen.getByRole('generic').firstChild as HTMLElement;
    expect(container).toHaveClass('relative');
    
    // Should have pulsing elements
    const pulsingElement = container.querySelector('.animate-ping');
    expect(pulsingElement).toBeInTheDocument();
  });

  it('renders default variant with multiple rings', () => {
    render(<CosmicLoadingSpinner variant="default" />);
    
    const container = screen.getByRole('generic').firstChild as HTMLElement;
    expect(container).toHaveClass('relative');
    
    // Should have multiple spinning rings
    const spinningElements = container.querySelectorAll('.animate-spin');
    expect(spinningElements.length).toBeGreaterThan(1);
  });

  it('applies correct message size based on spinner size', () => {
    const message = 'Test message';
    
    const { rerender } = render(<CosmicLoadingSpinner size="sm" message={message} />);
    expect(screen.getByText(message)).toHaveClass('text-sm');

    rerender(<CosmicLoadingSpinner size="lg" message={message} />);
    expect(screen.getByText(message)).toHaveClass('text-lg');

    rerender(<CosmicLoadingSpinner size="xl" message={message} />);
    expect(screen.getByText(message)).toHaveClass('text-xl');
  });

  it('has proper accessibility attributes', () => {
    render(<CosmicLoadingSpinner message="Loading..." />);
    
    const message = screen.getByText('Loading...');
    expect(message).toHaveClass('animate-pulse');
  });
});