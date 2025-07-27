import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TagAutocomplete from '../TagAutocomplete';
import '@testing-library/jest-dom';

describe('TagAutocomplete Component', () => {
  const mockOnChange = jest.fn();
  const mockSelectedTags = ['spiritual', 'healing'];
  const mockSuggestions = ['spiritual', 'healing', 'meditation', 'cosmic', 'energy', 'chakra'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with selected tags', () => {
    render(
      <TagAutocomplete
        selectedTags={mockSelectedTags}
        onChange={mockOnChange}
        suggestions={mockSuggestions}
      />
    );

    // Check if selected tags are displayed
    expect(screen.getByText('spiritual')).toBeInTheDocument();
    expect(screen.getByText('healing')).toBeInTheDocument();
    
    // Check if input is present
    expect(screen.getByPlaceholderText('')).toBeInTheDocument();
  });

  it('renders with placeholder when no tags are selected', () => {
    render(
      <TagAutocomplete
        selectedTags={[]}
        onChange={mockOnChange}
        suggestions={mockSuggestions}
      />
    );

    // Check if placeholder is displayed
    expect(screen.getByPlaceholderText('Add tags...')).toBeInTheDocument();
  });

  it('adds a tag when pressing Enter', () => {
    render(
      <TagAutocomplete
        selectedTags={mockSelectedTags}
        onChange={mockOnChange}
        suggestions={mockSuggestions}
      />
    );

    const input = screen.getByRole('textbox');
    
    // Type a new tag
    fireEvent.change(input, { target: { value: 'newtag' } });
    
    // Press Enter to add the tag
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    // Check if onChange was called with the new tag added
    expect(mockOnChange).toHaveBeenCalledWith([...mockSelectedTags, 'newtag']);
  });

  it('adds a tag when pressing comma', () => {
    render(
      <TagAutocomplete
        selectedTags={mockSelectedTags}
        onChange={mockOnChange}
        suggestions={mockSuggestions}
      />
    );

    const input = screen.getByRole('textbox');
    
    // Type a new tag
    fireEvent.change(input, { target: { value: 'newtag' } });
    
    // Press comma to add the tag
    fireEvent.keyDown(input, { key: ',', code: 'Comma' });
    
    // Check if onChange was called with the new tag added
    expect(mockOnChange).toHaveBeenCalledWith([...mockSelectedTags, 'newtag']);
  });

  it('removes a tag when clicking the remove button', () => {
    render(
      <TagAutocomplete
        selectedTags={mockSelectedTags}
        onChange={mockOnChange}
        suggestions={mockSuggestions}
      />
    );

    // Click the remove button for the first tag
    const removeButtons = screen.getAllByRole('button', { name: /Remove/i });
    fireEvent.click(removeButtons[0]);
    
    // Check if onChange was called with the tag removed
    expect(mockOnChange).toHaveBeenCalledWith(['healing']);
  });

  it('removes the last tag when pressing Backspace with empty input', () => {
    render(
      <TagAutocomplete
        selectedTags={mockSelectedTags}
        onChange={mockOnChange}
        suggestions={mockSuggestions}
      />
    );

    const input = screen.getByRole('textbox');
    
    // Press Backspace with empty input
    fireEvent.keyDown(input, { key: 'Backspace', code: 'Backspace' });
    
    // Check if onChange was called with the last tag removed
    expect(mockOnChange).toHaveBeenCalledWith(['spiritual']);
  });

  it('shows suggestions when typing', async () => {
    render(
      <TagAutocomplete
        selectedTags={mockSelectedTags}
        onChange={mockOnChange}
        suggestions={mockSuggestions}
      />
    );

    const input = screen.getByRole('textbox');
    
    // Type to filter suggestions
    fireEvent.change(input, { target: { value: 'med' } });
    fireEvent.focus(input);
    
    // Check if filtered suggestions are displayed
    await waitFor(() => {
      expect(screen.getByText('meditation')).toBeInTheDocument();
    });
  });

  it('selects a suggestion when clicked', async () => {
    render(
      <TagAutocomplete
        selectedTags={mockSelectedTags}
        onChange={mockOnChange}
        suggestions={mockSuggestions}
      />
    );

    const input = screen.getByRole('textbox');
    
    // Type to filter suggestions
    fireEvent.change(input, { target: { value: 'med' } });
    fireEvent.focus(input);
    
    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText('meditation')).toBeInTheDocument();
    });
    
    // Click on a suggestion
    fireEvent.click(screen.getByText('meditation'));
    
    // Check if onChange was called with the suggestion added
    expect(mockOnChange).toHaveBeenCalledWith([...mockSelectedTags, 'meditation']);
  });

  it('disables input when max tags are reached', () => {
    const maxTags = Array(10).fill(0).map((_, i) => `tag${i}`);
    
    render(
      <TagAutocomplete
        selectedTags={maxTags}
        onChange={mockOnChange}
        suggestions={mockSuggestions}
      />
    );

    const input = screen.getByRole('textbox');
    
    // Check if input is disabled
    expect(input).toBeDisabled();
  });

  it('displays error message when provided', () => {
    const errorMessage = 'Maximum 10 tags allowed';
    
    render(
      <TagAutocomplete
        selectedTags={mockSelectedTags}
        onChange={mockOnChange}
        suggestions={mockSuggestions}
        error={errorMessage}
      />
    );
    
    // Check if the container has the error border class
    const container = screen.getByRole('textbox').parentElement;
    expect(container).toHaveClass('border-red-500');
  });
});