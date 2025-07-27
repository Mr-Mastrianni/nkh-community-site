/**
 * @jest-environment node
 */
import { GET } from '../route';
import { BlogService } from '@/lib/services/blogService';
import { PostStatus } from '@/lib/types/blog';

// Mock the BlogService
jest.mock('@/lib/services/blogService');
const mockBlogService = BlogService as jest.Mocked<typeof BlogService>;

describe('/api/blog/tags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPosts = [
    {
      id: '1',
      title: 'Cosmic Healing',
      slug: 'cosmic-healing',
      content: '<p>Content...</p>',
      excerpt: 'Excerpt...',
      tags: ['healing', 'cosmic', 'spiritual'],
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2025-07-15T10:00:00Z'),
      createdAt: new Date('2025-07-10T08:30:00Z'),
      updatedAt: new Date('2025-07-15T09:45:00Z'),
      authorId: '1',
      metadata: {
        readingTime: 5,
        wordCount: 1200,
      },
    },
    {
      id: '2',
      title: 'Meditation Guide',
      slug: 'meditation-guide',
      content: '<p>Content...</p>',
      excerpt: 'Excerpt...',
      tags: ['meditation', 'spiritual', 'mindfulness'],
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2025-07-16T10:00:00Z'),
      createdAt: new Date('2025-07-11T08:30:00Z'),
      updatedAt: new Date('2025-07-16T09:45:00Z'),
      authorId: '1',
      metadata: {
        readingTime: 7,
        wordCount: 1500,
      },
    },
    {
      id: '3',
      title: 'Draft Post',
      slug: 'draft-post',
      content: '<p>Content...</p>',
      excerpt: 'Excerpt...',
      tags: ['draft', 'unpublished'],
      status: PostStatus.DRAFT,
      createdAt: new Date('2025-07-12T08:30:00Z'),
      updatedAt: new Date('2025-07-17T09:45:00Z'),
      authorId: '1',
      metadata: {
        readingTime: 3,
        wordCount: 800,
      },
    }
  ];

  describe('GET /api/blog/tags', () => {
    it('returns unique tags from published posts only', async () => {
      mockBlogService.getAllPosts.mockResolvedValue(mockPosts);
      
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.tags).toEqual(['cosmic', 'healing', 'meditation', 'mindfulness', 'spiritual']);
      
      // Should not include tags from draft posts
      expect(data.tags).not.toContain('draft');
      expect(data.tags).not.toContain('unpublished');
    });

    it('returns sorted tags alphabetically', async () => {
      const postsWithUnsortedTags = [
        {
          ...mockPosts[0],
          tags: ['zebra', 'alpha', 'beta'],
          status: PostStatus.PUBLISHED
        },
        {
          ...mockPosts[1],
          tags: ['gamma', 'alpha', 'delta'],
          status: PostStatus.PUBLISHED
        }
      ];
      
      mockBlogService.getAllPosts.mockResolvedValue(postsWithUnsortedTags);
      
      const response = await GET();
      const data = await response.json();
      
      expect(data.tags).toEqual(['alpha', 'beta', 'delta', 'gamma', 'zebra']);
    });

    it('handles duplicate tags correctly', async () => {
      const postsWithDuplicateTags = [
        {
          ...mockPosts[0],
          tags: ['healing', 'cosmic', 'healing'], // Duplicate 'healing'
          status: PostStatus.PUBLISHED
        },
        {
          ...mockPosts[1],
          tags: ['cosmic', 'meditation', 'cosmic'], // Duplicate 'cosmic'
          status: PostStatus.PUBLISHED
        }
      ];
      
      mockBlogService.getAllPosts.mockResolvedValue(postsWithDuplicateTags);
      
      const response = await GET();
      const data = await response.json();
      
      expect(data.tags).toEqual(['cosmic', 'healing', 'meditation']);
      expect(data.tags.filter(tag => tag === 'healing')).toHaveLength(1);
      expect(data.tags.filter(tag => tag === 'cosmic')).toHaveLength(1);
    });

    it('returns empty array when no published posts exist', async () => {
      const draftOnlyPosts = [
        {
          ...mockPosts[0],
          status: PostStatus.DRAFT
        }
      ];
      
      mockBlogService.getAllPosts.mockResolvedValue(draftOnlyPosts);
      
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.tags).toEqual([]);
    });

    it('returns empty array when no posts exist', async () => {
      mockBlogService.getAllPosts.mockResolvedValue([]);
      
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.tags).toEqual([]);
    });

    it('handles posts with empty tags array', async () => {
      const postsWithEmptyTags = [
        {
          ...mockPosts[0],
          tags: [],
          status: PostStatus.PUBLISHED
        },
        {
          ...mockPosts[1],
          tags: ['meditation'],
          status: PostStatus.PUBLISHED
        }
      ];
      
      mockBlogService.getAllPosts.mockResolvedValue(postsWithEmptyTags);
      
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.tags).toEqual(['meditation']);
    });

    it('filters out scheduled and archived posts', async () => {
      const postsWithVariousStatuses = [
        {
          ...mockPosts[0],
          tags: ['published'],
          status: PostStatus.PUBLISHED
        },
        {
          ...mockPosts[1],
          tags: ['scheduled'],
          status: PostStatus.SCHEDULED
        },
        {
          ...mockPosts[2],
          tags: ['archived'],
          status: PostStatus.ARCHIVED
        }
      ];
      
      mockBlogService.getAllPosts.mockResolvedValue(postsWithVariousStatuses);
      
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.tags).toEqual(['published']);
      expect(data.tags).not.toContain('scheduled');
      expect(data.tags).not.toContain('archived');
    });

    it('handles service errors', async () => {
      mockBlogService.getAllPosts.mockRejectedValue(new Error('Database error'));
      
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch blog tags');
    });

    it('handles posts with special characters in tags', async () => {
      const postsWithSpecialTags = [
        {
          ...mockPosts[0],
          tags: ['tag-with-dash', 'tag_with_underscore', 'tag with space'],
          status: PostStatus.PUBLISHED
        }
      ];
      
      mockBlogService.getAllPosts.mockResolvedValue(postsWithSpecialTags);
      
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.tags).toEqual(['tag with space', 'tag-with-dash', 'tag_with_underscore']);
    });

    it('handles case sensitivity in tags', async () => {
      const postsWithCaseSensitiveTags = [
        {
          ...mockPosts[0],
          tags: ['Healing', 'COSMIC', 'spiritual'],
          status: PostStatus.PUBLISHED
        }
      ];
      
      mockBlogService.getAllPosts.mockResolvedValue(postsWithCaseSensitiveTags);
      
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.tags).toEqual(['COSMIC', 'Healing', 'spiritual']);
    });

    it('handles large number of tags', async () => {
      const manyTags = Array.from({ length: 100 }, (_, i) => `tag${i}`);
      const postWithManyTags = [
        {
          ...mockPosts[0],
          tags: manyTags,
          status: PostStatus.PUBLISHED
        }
      ];
      
      mockBlogService.getAllPosts.mockResolvedValue(postWithManyTags);
      
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.tags).toHaveLength(100);
      expect(data.tags[0]).toBe('tag0');
      expect(data.tags[99]).toBe('tag99');
    });
  });
});