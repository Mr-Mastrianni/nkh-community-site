import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
  const defaultProps = {
    message: 'Test error message'
  };

  it('renders basic error message', () => {
    render(<ErrorMessage {...defaultProps} />);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<ErrorMessage {...defaultProps} title="Custom Error Title" />);
    
    expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders error variant with correct styling', () => {
    render(<ErrorMessage {...defaultProps} variant="error" />);
    
    const container = screen.getByRole('generic');
    expect(container).toHaveClass('bg-red-500/10', 'border-red-500/30');
  });

  it('renders warning variant with correct styling', () => {
    render(<ErrorMessage {...defaultProps} variant="warning" />);
    
    const container = screen.getByRole('generic');
    expect(container).toHaveClass('bg-yellow-500/10', 'border-yellow-500/30');
  });

  it('renders info variant with correct styling', () => {
    render(<ErrorMessage {...defaultProps} variant="info" />);
    
    const container = screen.getByRole('generic');
    expect(container).toHaveClass('bg-blue-500/10', 'border-blue-500/30');
  });

  it('shows icon by default', () => {
    render(<ErrorMessage {...defaultProps} />);
    
    const icon = screen.getByRole('generic').querySelector('i');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('fas', 'fa-exclamation-circle');
  });

  it('hides icon when showIcon is false', () => {
    render(<ErrorMessage {...defaultProps} showIcon={false} />);
    
    const icon = screen.getByRole('generic').querySelector('i.fas.fa-exclamation-circle');
    expect(icon).not.toBeInTheDocument();
  });

  it('renders technical details in expandable section', () => {
    const details = 'Technical error details here';
    render(<ErrorMessage {...defaultProps} details={details} />);
    
    expect(screen.getByText('Show technical details')).toBeInTheDocument();
    
    // Click to expand details
    fireEvent.click(screen.getByText('Show technical details'));
    expect(screen.getByText(details)).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    render(<ErrorMessage {...defaultProps} onRetry={onRetry} />);
    
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = jest.fn();
    render(<ErrorMessage {...defaultProps} onDismiss={onDismiss} />);
    
    const dismissButton = screen.getByText('Dismiss');
    fireEvent.click(dismissButton);
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when X button is clicked', () => {
    const onDismiss = jest.fn();
    render(<ErrorMessage {...defaultProps} onDismiss={onDismiss} />);
    
    const xButton = screen.getByRole('generic').querySelector('i.fa-times')?.parentElement;
    expect(xButton).toBeInTheDocument();
    
    fireEvent.click(xButton!);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders custom actions', () => {
    const action1 = jest.fn();
    const action2 = jest.fn();
    
    const actions = [
      { label: 'Action 1', onClick: action1, variant: 'primary' as const },
      { label: 'Action 2', onClick: action2, variant: 'secondary' as const }
    ];
    
    render(<ErrorMessage {...defaultProps} actions={actions} />);
    
    const button1 = screen.getByText('Action 1');
    const button2 = screen.getByText('Action 2');
    
    expect(button1).toBeInTheDocument();
    expect(button2).toBeInTheDocument();
    
    fireEvent.click(button1);
    fireEvent.click(button2);
    
    expect(action1).toHaveBeenCalledTimes(1);
    expect(action2).toHaveBeenCalledTimes(1);
  });

  it('applies correct button styles for different variants', () => {
    const actions = [
      { label: 'Primary', onClick: jest.fn(), variant: 'primary' as const },
      { label: 'Secondary', onClick: jest.fn(), variant: 'secondary' as const },
      { label: 'Danger', onClick: jest.fn(), variant: 'danger' as const }
    ];
    
    render(<ErrorMessage {...defaultProps} actions={actions} />);
    
    const primaryButton = screen.getByText('Primary');
    const secondaryButton = screen.getByText('Secondary');
    const dangerButton = screen.getByText('Danger');
    
    expect(primaryButton).toHaveClass('cosmic-button');
    expect(secondaryButton).toHaveClass('bg-cosmic-light/10');
    expect(dangerButton).toHaveClass('bg-red-600/30');
  });
});