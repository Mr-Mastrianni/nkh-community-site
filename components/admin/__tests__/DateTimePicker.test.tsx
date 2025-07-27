import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DateTimePicker from '../DateTimePicker';
import '@testing-library/jest-dom';

describe('DateTimePicker Component', () => {
  const mockOnChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date.now to return a consistent date for testing
    jest.spyOn(Date, 'now').mockImplementation(() => new Date('2025-07-21T12:00:00Z').getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders with default values when no date is provided', () => {
    render(<DateTimePicker onChange={mockOnChange} />);
    
    // Check if date and time inputs are present
    expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument(); // Date input
    expect(screen.getAllByRole('textbox', { name: '' })[1]).toBeInTheDocument(); // Time input
    
    // Check if onChange was called with a default date (tomorrow at 9:00 AM)
    expect(mockOnChange).toHaveBeenCalled();
    const calledDate = mockOnChange.mock.calls[0][0];
    expect(calledDate).toBeInstanceOf(Date);
    
    // Should be tomorrow
    const tomorrow = new Date('2025-07-22T09:00:00');
    expect(calledDate.getDate()).toBe(tomorrow.getDate());
    expect(calledDate.getMonth()).toBe(tomorrow.getMonth());
    expect(calledDate.getFullYear()).toBe(tomorrow.getFullYear());
    expect(calledDate.getHours()).toBe(9);
    expect(calledDate.getMinutes()).toBe(0);
  });

  it('renders with provided date value', () => {
    const testDate = new Date('2025-08-15T14:30:00');
    
    render(<DateTimePicker value={testDate} onChange={mockOnChange} />);
    
    // Check if date input has the correct value
    const dateInput = screen.getByRole('textbox', { name: '' });
    expect(dateInput).toHaveValue('2025-08-15');
    
    // Check if time input has the correct value
    const timeInput = screen.getAllByRole('textbox', { name: '' })[1];
    expect(timeInput).toHaveValue('14:30');
  });

  it('calls onChange when date is changed', () => {
    render(<DateTimePicker onChange={mockOnChange} />);
    
    // Clear previous calls from initialization
    mockOnChange.mockClear();
    
    // Change the date
    const dateInput = screen.getByRole('textbox', { name: '' });
    fireEvent.change(dateInput, { target: { value: '2025-09-01' } });
    
    // Check if onChange was called with the updated date
    expect(mockOnChange).toHaveBeenCalled();
    const calledDate = mockOnChange.mock.calls[0][0];
    expect(calledDate.getFullYear()).toBe(2025);
    expect(calledDate.getMonth()).toBe(8); // September is 8 (0-indexed)
    expect(calledDate.getDate()).toBe(1);
  });

  it('calls onChange when time is changed', () => {
    render(<DateTimePicker onChange={mockOnChange} />);
    
    // Clear previous calls from initialization
    mockOnChange.mockClear();
    
    // Change the time
    const timeInput = screen.getAllByRole('textbox', { name: '' })[1];
    fireEvent.change(timeInput, { target: { value: '15:45' } });
    
    // Check if onChange was called with the updated time
    expect(mockOnChange).toHaveBeenCalled();
    const calledDate = mockOnChange.mock.calls[0][0];
    expect(calledDate.getHours()).toBe(15);
    expect(calledDate.getMinutes()).toBe(45);
  });

  it('displays error styling when error is provided', () => {
    const errorMessage = 'Scheduled date must be in the future';
    
    render(
      <DateTimePicker 
        onChange={mockOnChange} 
        error={errorMessage} 
      />
    );
    
    // Check if inputs have error border class
    const dateInput = screen.getByRole('textbox', { name: '' });
    const timeInput = screen.getAllByRole('textbox', { name: '' })[1];
    
    expect(dateInput.parentElement).toHaveClass('border-red-500');
    expect(timeInput.parentElement).toHaveClass('border-red-500');
  });

  it('respects minDate for date input', () => {
    const minDate = new Date('2025-07-25T00:00:00');
    
    render(
      <DateTimePicker 
        onChange={mockOnChange} 
        minDate={minDate}
      />
    );
    
    // Check if date input has the correct min attribute
    const dateInput = screen.getByRole('textbox', { name: '' });
    expect(dateInput).toHaveAttribute('min', '2025-07-25');
  });
});