import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BlogEditPage from '../[id]/page';
import '@testing-library/jest-dom';
import { PostStatus } from '../../../../../lib/types/blog';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock BlogEditor component
jest.mock('../../../../../components/admin/BlogEditor', () => {
  return function MockBlogEditor({ post, onSave, onSaveMetadata, onPreview }: any) {
    return (
      <div data-testid="blog-editor">
        <div>Post Title: {post?.title}</div>
        <button onClick={() => onSave('Updated content')}>Save Content</button>
        <button onClick={() => onSaveMetadata({ title: 'Updated Title' })}>Save Metadata</button>
        <button onClick={onPreview}>Preview</button>
      </div>
    );
  };
});

// Mock fetch API
global.fetch = jest.fn();

describe('BlogEditPage Component', () => {
  const mockPost = {
    id: 'test-id',
    title: 'Test Post',
    slug: 'test-post',
    content: '<p>Test content</p>',
    excerpt: 'Test excerpt',
    tags: ['test'],
    status: PostStatus.DRAFT,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: '1',
    metadata: {
      readingTime: 2,
      wordCount: 100,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/admin/blog/test-id')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPost),
        });
      }
      if (url.includes('/api/admin/blog/tags')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ name: 'test' }, { name: 'spiritual' }]),
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('renders loading state initially', () => {
    render(<BlogEditPage params={{ id: 'test-id' }} />);
    
    expect(screen.getByText('Loading post...')).toBeInTheDocument();
  });

  it('renders the blog editor with post data after loading', async () => {
    render(<BlogEditPage params={{ id: 'test-id' }} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('blog-editor')).toBeInTheDocument();
      expect(screen.getByText(`Post Title: ${mockPost.title}`)).toBeInTheDocument();
    });
  });

  it('renders error state when fetch fails', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 404,
      });
    });
    
    render(<BlogEditPage params={{ id: 'not-found' }} />);
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch post')).toBeInTheDocument();
    });
  });

  it('calls API to save content when save content is triggered', async () => {
    render(<BlogEditPage params={{ id: 'test-id' }} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('blog-editor')).toBeInTheDocument();
    });
    
    screen.getByText('Save Content').click();
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/blog/test-id',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ content: 'Updated content' }),
        })
      );
    });
  });

  it('calls API to save metadata when save metadata is triggered', async () => {
    render(<BlogEditPage params={{ id: 'test-id' }} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('blog-editor')).toBeInTheDocument();
    });
    
    screen.getByText('Save Metadata').click();
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/blog/test-id',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ title: 'Updated Title' }),
        })
      );
    });
  });

  it('opens preview in new tab when preview is triggered', async () => {
    // Mock window.open
    const mockOpen = jest.fn();
    window.open = mockOpen;
    
    render(<BlogEditPage params={{ id: 'test-id' }} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('blog-editor')).toBeInTheDocument();
    });
    
    screen.getByText('Preview').click();
    
    expect(mockOpen).toHaveBeenCalledWith('/api/admin/blog/preview/test-id', '_blank');
  });
});