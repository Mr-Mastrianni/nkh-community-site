import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PublicationStatusSelector from '../PublicationStatusSelector';
import { PostStatus } from '../../../lib/types/blog';
import '@testing-library/jest-dom';

describe('PublicationStatusSelector Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all status options', () => {
    render(
      <PublicationStatusSelector
        status={PostStatus.DRAFT}
        onChange={mockOnChange}
      />
    );

    // Check if all status options are displayed
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByText('Scheduled')).toBeInTheDocument();
    expect(screen.getByText('Archived')).toBeInTheDocument();
  });

  it('highlights the selected status', () => {
    render(
      <PublicationStatusSelector
        status={PostStatus.PUBLISHED}
        onChange={mockOnChange}
      />
    );

    // Get all status option elements
    const draftOption = screen.getByText('Draft').closest('div');
    const publishedOption = screen.getByText('Published').closest('div');
    const scheduledOption = screen.getByText('Scheduled').closest('div');
    const archivedOption = screen.getByText('Archived').closest('div');

    // Check if the selected option has the highlight class
    expect(draftOption).not.toHaveClass('border-2 border-purple-400');
    expect(publishedOption).toHaveClass('border-2 border-purple-400');
    expect(scheduledOption).not.toHaveClass('border-2 border-purple-400');
    expect(archivedOption).not.toHaveClass('border-2 border-purple-400');
  });

  it('calls onChange when a status option is clicked', () => {
    render(
      <PublicationStatusSelector
        status={PostStatus.DRAFT}
        onChange={mockOnChange}
      />
    );

    // Click on the Published option
    fireEvent.click(screen.getByText('Published'));

    // Check if onChange was called with the correct status
    expect(mockOnChange).toHaveBeenCalledWith(PostStatus.PUBLISHED);
  });

  it('displays status descriptions', () => {
    render(
      <PublicationStatusSelector
        status={PostStatus.DRAFT}
        onChange={mockOnChange}
      />
    );

    // Check if descriptions are displayed
    expect(screen.getByText('Save as a draft, not visible to the public')).toBeInTheDocument();
    expect(screen.getByText('Publish immediately, visible to the public')).toBeInTheDocument();
    expect(screen.getByText('Schedule for future publication')).toBeInTheDocument();
    expect(screen.getByText('Archive and hide from the public')).toBeInTheDocument();
  });

  it('displays status icons', () => {
    render(
      <PublicationStatusSelector
        status={PostStatus.DRAFT}
        onChange={mockOnChange}
      />
    );

    // Check if icons are displayed
    expect(screen.getByText('📝')).toBeInTheDocument();
    expect(screen.getByText('🌟')).toBeInTheDocument();
    expect(screen.getByText('🕒')).toBeInTheDocument();
    expect(screen.getByText('🗄️')).toBeInTheDocument();
  });
});