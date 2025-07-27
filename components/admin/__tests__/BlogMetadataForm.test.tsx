import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BlogMetadataForm from '../BlogMetadataForm';
import { BlogPost, PostStatus } from '../../../lib/types/blog';
import '@testing-library/jest-dom';

// Mock child components
jest.mock('../TagAutocomplete', () => {
  return function MockTagAutocomplete({ selectedTags, onChange, error }: any) {
    return (
      <div data-testid="tag-autocomplete">
        <input 
          data-testid="tag-input"
          type="text"
          onChange={(e) => onChange([...selectedTags, e.target.value])}
        />
        <div data-testid="selected-tags">
          {selectedTags.map((tag: string) => (
            <span key={tag} data-testid={`tag-${tag}`}>{tag}</span>
          ))}
        </div>
        {error && <span data-testid="tag-error">{error}</span>}
      </div>
    );
  };
});

jest.mock('../PublicationStatusSelector', () => {
  return function MockPublicationStatusSelector({ status, onChange }: any) {
    return (
      <div data-testid="publication-status-selector">
        <select 
          data-testid="status-select"
          value={status}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value={PostStatus.DRAFT}>Draft</option>
          <option value={PostStatus.PUBLISHED}>Published</option>
          <option value={PostStatus.SCHEDULED}>Scheduled</option>
          <option value={PostStatus.ARCHIVED}>Archived</option>
        </select>
      </div>
    );
  };
});

jest.mock('../DateTimePicker', () => {
  return function MockDateTimePicker({ value, onChange, error }: any) {
    return (
      <div data-testid="date-time-picker">
        <input 
          data-testid="date-input"
          type="datetime-local"
          value={value ? value.toISOString().slice(0, 16) : ''}
          onChange={(e) => onChange(new Date(e.target.value))}
        />
        {error && <span data-testid="date-error">{error}</span>}
      </div>
    );
  };
});

describe('BlogMetadataForm Component', () => {
  const mockOnSave = jest.fn().mockResolvedValue(undefined);
  const mockExistingTags = ['spiritual', 'healing', 'meditation', 'cosmic'];
  
  const mockPost: BlogPost = {
    id: '1',
    title: 'Test Post',
    slug: 'test-post',
    content: '<p>Test content</p>',
    excerpt: 'Test excerpt',
    tags: ['spiritual', 'healing'],
    status: PostStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: '1',
    metadata: {
      readingTime: 2,
      wordCount: 100,
      seoTitle: 'SEO Test Title',
      seoDescription: 'SEO Test Description'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with empty values when no post is provided', () => {
    render(<BlogMetadataForm onSave={mockOnSave} existingTags={mockExistingTags} />);
    
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/excerpt/i)).toHaveValue('');
    expect(screen.getByTestId('tag-autocomplete')).toBeInTheDocument();
    expect(screen.getByTestId('publication-status-selector')).toBeInTheDocument();
    expect(screen.queryByTestId('date-time-picker')).not.toBeInTheDocument();
  });

  it('renders the form with post values when a post is provided', () => {
    render(
      <BlogMetadataForm 
        post={mockPost} 
        onSave={mockOnSave} 
        existingTags={mockExistingTags} 
      />
    );
    
    expect(screen.getByLabelText(/title/i)).toHaveValue('Test Post');
    expect(screen.getByLabelText(/excerpt/i)).toHaveValue('Test excerpt');
    expect(screen.getByTestId('selected-tags')).toBeInTheDocument();
    expect(screen.getByTestId('status-select')).toHaveValue(PostStatus.DRAFT);
  });

  it('shows validation errors when submitting with empty required fields', async () => {
    render(<BlogMetadataForm onSave={mockOnSave} existingTags={mockExistingTags} />);
    
    // Clear the title field (it's empty by default but let's be explicit)
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: '' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/save metadata/i));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/excerpt is required/i)).toBeInTheDocument();
    });
    
    // Verify onSave was not called
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('shows the date picker when scheduled status is selected', async () => {
    render(<BlogMetadataForm onSave={mockOnSave} existingTags={mockExistingTags} />);
    
    // Change status to scheduled
    fireEvent.change(screen.getByTestId('status-select'), { 
      target: { value: PostStatus.SCHEDULED } 
    });
    
    // Check that date picker appears
    await waitFor(() => {
      expect(screen.getByTestId('date-time-picker')).toBeInTheDocument();
    });
  });

  it('shows advanced options when toggled', () => {
    render(
      <BlogMetadataForm 
        post={mockPost} 
        onSave={mockOnSave} 
        existingTags={mockExistingTags} 
      />
    );
    
    // Advanced options should be hidden initially
    expect(screen.queryByLabelText(/seo title/i)).not.toBeInTheDocument();
    
    // Click to show advanced options
    fireEvent.click(screen.getByText(/advanced options/i));
    
    // Advanced options should now be visible
    expect(screen.getByLabelText(/seo title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/seo description/i)).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    render(<BlogMetadataForm onSave={mockOnSave} existingTags={mockExistingTags} />);
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/title/i), { 
      target: { value: 'New Test Post' } 
    });
    
    fireEvent.change(screen.getByLabelText(/excerpt/i), { 
      target: { value: 'New test excerpt' } 
    });
    
    // Add a tag
    fireEvent.change(screen.getByTestId('tag-input'), { 
      target: { value: 'newtag' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText(/save metadata/i));
    
    // Verify onSave was called with correct data
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Test Post',
        excerpt: 'New test excerpt',
        tags: ['newtag'],
        status: PostStatus.DRAFT,
      }));
    });
  });
});