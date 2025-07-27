import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import NewBlogPostPage from '../page';
import '@testing-library/jest-dom';
import { v4 as uuidv4 } from 'uuid';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid'),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock BlogEditor component
jest.mock('../../../../components/admin/BlogEditor', () => {
  return function MockBlogEditor({ onSave, onSaveMetadata, onPreview }: any) {
    return (
      <div data-testid="blog-editor">
        <button onClick={() => onSave('New content')}>Save Content</button>
        <button onClick={() => onSaveMetadata({ title: 'New Title' })}>Save Metadata</button>
        <button onClick={onPreview}>Preview</button>
      </div>
    );
  };
});

// Mock fetch API
global.fetch = jest.fn();

describe('NewBlogPostPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (url === '/api/admin/blog/tags') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ name: 'spiritual' }, { name: 'healing' }]),
        });
      }
      if (url === '/api/admin/blog' && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'mock-uuid' }),
        });
      }
      if (url.includes('/api/admin/blog/mock-uuid') && options?.method === 'PATCH') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'mock-uuid' }),
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('renders loading state initially', () => {
    render(<NewBlogPostPage />);
    
    expect(screen.getByText('Creating new post...')).toBeInTheDocument();
  });

  it('creates a draft post on initial load', async () => {
    render(<NewBlogPostPage />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/blog',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Untitled Post'),
        })
      );
    });
  });

  it('renders the blog editor after creating draft post', async () => {
    render(<NewBlogPostPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('blog-editor')).toBeInTheDocument();
    });
  });

  it('calls API to save content when save content is triggered', async () => {
    render(<NewBlogPostPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('blog-editor')).toBeInTheDocument();
    });
    
    screen.getByText('Save Content').click();
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/blog/mock-uuid',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ content: 'New content' }),
        })
      );
    });
  });

  it('calls API to save metadata when save metadata is triggered', async () => {
    render(<NewBlogPostPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('blog-editor')).toBeInTheDocument();
    });
    
    screen.getByText('Save Metadata').click();
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/blog/mock-uuid',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ title: 'New Title' }),
        })
      );
    });
  });

  it('opens preview in new tab when preview is triggered', async () => {
    // Mock window.open
    const mockOpen = jest.fn();
    window.open = mockOpen;
    
    render(<NewBlogPostPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('blog-editor')).toBeInTheDocument();
    });
    
    screen.getByText('Preview').click();
    
    expect(mockOpen).toHaveBeenCalledWith('/api/admin/blog/preview/mock-uuid', '_blank');
  });

  it('renders error state when post creation fails', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 500,
      });
    });
    
    render(<NewBlogPostPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to create draft post')).toBeInTheDocument();
    });
  });
});