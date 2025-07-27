/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET } from '../route';
import { BlogService } from '@/lib/services/blogService';
import { PostStatus } from '@/lib/types/blog';

// Mock the BlogService
jest.mock('@/lib/services/blogService');
const mockBlogService = BlogService as jest.Mocked<typeof BlogService>;

describe('/api/blog/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (searchParams: Record<string, string> = {}) => {
    const url = new URL('http://localhost:3000/api/blog/search');
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    
    return new NextRequest(url);
  };

  const mockSearchResult = {
    posts: [
      {
        id: '1',
        title: 'Cosmic Healing',
        slug: 'cosmic-healing',
        content: '<p>Content about cosmic healing...</p>',
        excerpt: 'Learn about cosmic healing practices.',
        tags: ['healing', 'cosmic'],
        status: PostStatus.PUBLISHED,
        publishedAt: new Date('2025-07-15T10:00:00Z'),
        createdAt: new Date('2025-07-10T08:30:00Z'),
        updatedAt: new Date('2025-07-15T09:45:00Z'),
        authorId: '1',
        metadata: {
          readingTime: 5,
          wordCount: 1200,
        },
      }
    ],
    totalCount: 1,
    hasMore: false
  };

  describe('GET /api/blog/search', () => {
    it('returns published posts with default parameters', async () => {
      mockBlogService.searchPosts.mockResolvedValue(mockSearchResult);
      
      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();
      
      expect(mockBlogService.searchPosts).toHaveBeenCalledWith({
        query: undefined,
        tags: undefined,
        status: PostStatus.PUBLISHED,
        limit: 10,
        offset: 0
      });
      
      expect(response.status).toBe(200);
      expect(data.posts).toHaveLength(1);
      expect(data.posts[0]).toEqual({
        id: '1',
        title: 'Cosmic Healing',
        slug: 'cosmic-healing',
        excerpt: 'Learn about cosmic healing practices.',
        tags: ['healing', 'cosmic'],
        publishedAt: mockSearchResult.posts[0].publishedAt,
        metadata: {
          readingTime: 5,
          wordCount: 1200
        }
      });
      expect(data.totalCount).toBe(1);
      expect(data.hasMore).toBe(false);
    });

    it('handles search query parameter', async () => {
      mockBlogService.searchPosts.mockResolvedValue(mockSearchResult);
      
      const request = createMockRequest({ query: 'cosmic healing' });
      const response = await GET(request);
      
      expect(mockBlogService.searchPosts).toHaveBeenCalledWith({
        query: 'cosmic healing',
        tags: undefined,
        status: PostStatus.PUBLISHED,
        limit: 10,
        offset: 0
      });
      
      expect(response.status).toBe(200);
    });

    it('handles tags parameter', async () => {
      mockBlogService.searchPosts.mockResolvedValue(mockSearchResult);
      
      const request = createMockRequest({ tags: 'healing,cosmic,meditation' });
      const response = await GET(request);
      
      expect(mockBlogService.searchPosts).toHaveBeenCalledWith({
        query: undefined,
        tags: ['healing', 'cosmic', 'meditation'],
        status: PostStatus.PUBLISHED,
        limit: 10,
        offset: 0
      });
      
      expect(response.status).toBe(200);
    });

    it('handles empty tags parameter', async () => {
      mockBlogService.searchPosts.mockResolvedValue(mockSearchResult);
      
      const request = createMockRequest({ tags: '' });
      const response = await GET(request);
      
      expect(mockBlogService.searchPosts).toHaveBeenCalledWith({
        query: undefined,
        tags: undefined,
        status: PostStatus.PUBLISHED,
        limit: 10,
        offset: 0
      });
      
      expect(response.status).toBe(200);
    });

    it('handles tags with whitespace', async () => {
      mockBlogService.searchPosts.mockResolvedValue(mockSearchResult);
      
      const request = createMockRequest({ tags: ' healing , cosmic , ' });
      const response = await GET(request);
      
      expect(mockBlogService.searchPosts).toHaveBeenCalledWith({
        query: undefined,
        tags: ['healing', 'cosmic'],
        status: PostStatus.PUBLISHED,
        limit: 10,
        offset: 0
      });
      
      expect(response.status).toBe(200);
    });

    it('handles pagination parameters', async () => {
      mockBlogService.searchPosts.mockResolvedValue(mockSearchResult);
      
      const request = createMockRequest({ limit: '20', offset: '10' });
      const response = await GET(request);
      
      expect(mockBlogService.searchPosts).toHaveBeenCalledWith({
        query: undefined,
        tags: undefined,
        status: PostStatus.PUBLISHED,
        limit: 20,
        offset: 10
      });
      
      expect(response.status).toBe(200);
    });

    it('handles invalid pagination parameters', async () => {
      mockBlogService.searchPosts.mockResolvedValue(mockSearchResult);
      
      const request = createMockRequest({ limit: 'invalid', offset: 'invalid' });
      const response = await GET(request);
      
      expect(mockBlogService.searchPosts).toHaveBeenCalledWith({
        query: undefined,
        tags: undefined,
        status: PostStatus.PUBLISHED,
        limit: 10, // Default value
        offset: 0  // Default value
      });
      
      expect(response.status).toBe(200);
    });

    it('filters out sensitive information from posts', async () => {
      const mockResultWithSensitiveData = {
        posts: [{
          ...mockSearchResult.posts[0],
          content: '<p>Full content that should not be exposed</p>',
          authorId: 'sensitive-author-id',
          createdAt: new Date('2025-07-10T08:30:00Z'),
          updatedAt: new Date('2025-07-15T09:45:00Z'),
          metadata: {
            readingTime: 5,
            wordCount: 1200,
            seoTitle: 'SEO title',
            seoDescription: 'SEO description'
          }
        }],
        totalCount: 1,
        hasMore: false
      };
      
      mockBlogService.searchPosts.mockResolvedValue(mockResultWithSensitiveData);
      
      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();
      
      expect(data.posts[0]).not.toHaveProperty('content');
      expect(data.posts[0]).not.toHaveProperty('authorId');
      expect(data.posts[0]).not.toHaveProperty('createdAt');
      expect(data.posts[0]).not.toHaveProperty('updatedAt');
      expect(data.posts[0].metadata).not.toHaveProperty('seoTitle');
      expect(data.posts[0].metadata).not.toHaveProperty('seoDescription');
      
      expect(data.posts[0]).toHaveProperty('id');
      expect(data.posts[0]).toHaveProperty('title');
      expect(data.posts[0]).toHaveProperty('slug');
      expect(data.posts[0]).toHaveProperty('excerpt');
      expect(data.posts[0]).toHaveProperty('tags');
      expect(data.posts[0]).toHaveProperty('publishedAt');
      expect(data.posts[0].metadata).toHaveProperty('readingTime');
      expect(data.posts[0].metadata).toHaveProperty('wordCount');
    });

    it('only returns published posts', async () => {
      mockBlogService.searchPosts.mockResolvedValue(mockSearchResult);
      
      const request = createMockRequest();
      await GET(request);
      
      expect(mockBlogService.searchPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          status: PostStatus.PUBLISHED
        })
      );
    });

    it('handles empty search results', async () => {
      mockBlogService.searchPosts.mockResolvedValue({
        posts: [],
        totalCount: 0,
        hasMore: false
      });
      
      const request = createMockRequest({ query: 'nonexistent' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.posts).toHaveLength(0);
      expect(data.totalCount).toBe(0);
      expect(data.hasMore).toBe(false);
    });

    it('handles service errors', async () => {
      mockBlogService.searchPosts.mockRejectedValue(new Error('Database error'));
      
      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to search blog posts');
    });

    it('handles all parameters together', async () => {
      mockBlogService.searchPosts.mockResolvedValue(mockSearchResult);
      
      const request = createMockRequest({
        query: 'cosmic healing',
        tags: 'healing,meditation',
        limit: '5',
        offset: '15'
      });
      
      const response = await GET(request);
      
      expect(mockBlogService.searchPosts).toHaveBeenCalledWith({
        query: 'cosmic healing',
        tags: ['healing', 'meditation'],
        status: PostStatus.PUBLISHED,
        limit: 5,
        offset: 15
      });
      
      expect(response.status).toBe(200);
    });
  });
});