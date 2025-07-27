import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostManager from '../PostManager';
import { PostStatus } from '@/lib/types/blog';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('PostManager Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        posts: [
          {
            id: '1',
            title: 'Test Post 1',
            slug: 'test-post-1',
            excerpt: 'Test excerpt 1',
            content: '<p>Test content</p>',
            tags: ['test', 'cosmic'],
            status: PostStatus.PUBLISHED,
            publishedAt: new Date('2025-07-15T10:00:00Z'),
            createdAt: new Date('2025-07-10T08:30:00Z'),
            updatedAt: new Date('2025-07-15T09:45:00Z'),
            authorId: '1',
            metadata: {
              readingTime: 2,
              wordCount: 400,
            },
          },
          {
            id: '2',
            title: 'Test Post 2',
            slug: 'test-post-2',
            excerpt: 'Test excerpt 2',
            content: '<p>Test content 2</p>',
            tags: ['draft', 'spiritual'],
            status: PostStatus.DRAFT,
            createdAt: new Date('2025-07-18T14:20:00Z'),
            updatedAt: new Date('2025-07-19T11:15:00Z'),
            authorId: '1',
            metadata: {
              readingTime: 3,
              wordCount: 600,
            },
          },
        ],
        totalCount: 2,
        hasMore: false,
      }),
    });
  });

  it('renders the post manager with posts', async () => {
    render(<PostManager />);
    
    // Check loading state
    expect(screen.getByText('Loading posts...')).toBeInTheDocument();
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('filters posts by search term', async () => {
    render(<PostManager />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });
    
    // Mock new fetch for search
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        posts: [
          {
            id: '1',
            title: 'Test Post 1',
            slug: 'test-post-1',
            excerpt: 'Test excerpt 1',
            content: '<p>Test content</p>',
            tags: ['test', 'cosmic'],
            status: PostStatus.PUBLISHED,
            publishedAt: new Date('2025-07-15T10:00:00Z'),
            createdAt: new Date('2025-07-10T08:30:00Z'),
            updatedAt: new Date('2025-07-15T09:45:00Z'),
            authorId: '1',
            metadata: {
              readingTime: 2,
              wordCount: 400,
            },
          },
        ],
        totalCount: 1,
        hasMore: false,
      }),
    });
    
    // Search for "Post 1"
    const searchInput = screen.getByPlaceholderText('Search posts...');
    fireEvent.change(searchInput, { target: { value: 'Post 1' } });
    
    // Wait for filtered results
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('query=Post%201'));
    });
  });

  it('filters posts by status', async () => {
    render(<PostManager />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });
    
    // Mock new fetch for status filter
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        posts: [
          {
            id: '2',
            title: 'Test Post 2',
            slug: 'test-post-2',
            excerpt: 'Test excerpt 2',
            content: '<p>Test content 2</p>',
            tags: ['draft', 'spiritual'],
            status: PostStatus.DRAFT,
            createdAt: new Date('2025-07-18T14:20:00Z'),
            updatedAt: new Date('2025-07-19T11:15:00Z'),
            authorId: '1',
            metadata: {
              readingTime: 3,
              wordCount: 600,
            },
          },
        ],
        totalCount: 1,
        hasMore: false,
      }),
    });
    
    // Filter by draft status
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: PostStatus.DRAFT } });
    
    // Wait for filtered results
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('status=draft'));
    });
  });

  it('selects posts for bulk operations', async () => {
    render(<PostManager />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });
    
    // Select first post
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // First post checkbox (index 0 is select all)
    
    // Check if bulk actions appear
    expect(screen.getByText('1 post selected')).toBeInTheDocument();
    expect(screen.getByText('Set Status')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('shows empty state when no posts are found', async () => {
    // Mock empty response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        posts: [],
        totalCount: 0,
        hasMore: false,
      }),
    });
    
    render(<PostManager />);
    
    // Wait for empty state
    await waitFor(() => {
      expect(screen.getByText('No posts found')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Create New Post')).toBeInTheDocument();
  });
});