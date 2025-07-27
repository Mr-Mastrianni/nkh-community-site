import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationDialog from '../ConfirmationDialog';

describe('ConfirmationDialog Component', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dialog when isOpen is true', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Dialog"
        message="This is a test message"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    
    // Check if dialog content is rendered
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('This is a test message')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('does not render the dialog when isOpen is false', () => {
    render(
      <ConfirmationDialog
        isOpen={false}
        title="Test Dialog"
        message="This is a test message"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    
    // Check that dialog content is not rendered
    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Dialog"
        message="This is a test message"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    
    // Click confirm button
    fireEvent.click(screen.getByText('Confirm'));
    
    // Check if onConfirm was called
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Dialog"
        message="This is a test message"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    
    // Click cancel button
    fireEvent.click(screen.getByText('Cancel'));
    
    // Check if onCancel was called
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('renders custom content when provided', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Dialog"
        message="This is a test message"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        customContent={<div data-testid="custom-content">Custom Content</div>}
      />
    );
    
    // Check if custom content is rendered
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  it('disables buttons when processing', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Dialog"
        message="This is a test message"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        isProcessing={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    
    // Check if buttons are disabled
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });
});