import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import RecentPosts from '../RecentPosts';
import { PostStatus } from '@/lib/types/blog';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('RecentPosts Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<RecentPosts />);
    
    // Check for loading state
    expect(screen.getByText('Recent Posts')).toBeInTheDocument();
    // Look for loading animation
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders recent posts after loading', async () => {
    // Mock successful fetch response
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
    
    render(<RecentPosts />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('View All Posts')).toBeInTheDocument();
  });

  it('renders empty state when no posts are found', async () => {
    // Mock empty response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        posts: [],
        totalCount: 0,
        hasMore: false,
      }),
    });
    
    render(<RecentPosts />);
    
    // Wait for empty state
    await waitFor(() => {
      expect(screen.getByText('No posts yet')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Create Your First Post')).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    // Mock failed fetch
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));
    
    render(<RecentPosts />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Failed to load recent posts')).toBeInTheDocument();
    });
  });
});