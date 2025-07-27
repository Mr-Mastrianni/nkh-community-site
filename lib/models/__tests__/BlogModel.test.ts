// Unit tests for BlogModel
import { BlogModel, MediaModel, AdminModel } from '../BlogModel';
import { PostStatus, AdminRole, Permission, CreateBlogPostData } from '../../types/blog';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { describe } from 'node:test';

describe('BlogModel', () => {
  describe('generateSlug', () => {
    it('should generate URL-friendly slugs', () => {
      expect(BlogModel.generateSlug('Hello World')).toBe('hello-world');
      expect(BlogModel.generateSlug('Spiritual Journey & Healing')).toBe('spiritual-journey-healing');
      expect(BlogModel.generateSlug('  Multiple   Spaces  ')).toBe('multiple-spaces');
      expect(BlogModel.generateSlug('Special!@#$%Characters')).toBe('specialcharacters');
    });

    it('should handle empty or invalid input', () => {
      expect(BlogModel.generateSlug('')).toBe('');
      expect(BlogModel.generateSlug('   ')).toBe('');
      expect(BlogModel.generateSlug('!@#$%')).toBe('');
    });
  });

  describe('calculateWordCount', () => {
    it('should count words correctly', () => {
      expect(BlogModel.calculateWordCount('Hello world')).toBe(2);
      expect(BlogModel.calculateWordCount('<p>Hello <strong>world</strong></p>')).toBe(2);
      expect(BlogModel.calculateWordCount('')).toBe(0);
      expect(BlogModel.calculateWordCount('   ')).toBe(0);
    });

    it('should handle HTML content', () => {
      const htmlContent = '<h1>Title</h1><p>This is a <em>test</em> paragraph with <a href="#">links</a>.</p>';
      expect(BlogModel.calculateWordCount(htmlContent)).toBe(7);
    });
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time correctly', () => {
      const shortContent = 'Hello world';
      expect(BlogModel.calculateReadingTime(shortContent)).toBe(1); // Minimum 1 minute

      const longContent = Array(400).fill('word').join(' '); // 400 words
      expect(BlogModel.calculateReadingTime(longContent)).toBe(2); // 400/200 = 2 minutes
    });
  });

  describe('createBlogPost', () => {
    const mockData: CreateBlogPostData = {
      title: 'Test Blog Post',
      content: '<p>This is test content for the blog post.</p>',
      excerpt: 'Test excerpt',
      tags: ['spiritual', 'healing'],
      status: PostStatus.DRAFT
    };

    it('should create a blog post with correct structure', () => {
      const post = BlogModel.createBlogPost('test-id', 'author-id', mockData);

      expect(post.id).toBe('test-id');
      expect(post.authorId).toBe('author-id');
      expect(post.title).toBe(mockData.title);
      expect(post.slug).toBe('test-blog-post');
      expect(post.content).toBe(mockData.content);
      expect(post.status).toBe(PostStatus.DRAFT);
      expect(post.publishedAt).toBeUndefined();
      expect(post.createdAt).toBeInstanceOf(Date);
      expect(post.updatedAt).toBeInstanceOf(Date);
    });

    it('should set publishedAt when status is PUBLISHED', () => {
      const publishedData = { ...mockData, status: PostStatus.PUBLISHED };
      const post = BlogModel.createBlogPost('test-id', 'author-id', publishedData);

      expect(post.publishedAt).toBeInstanceOf(Date);
    });

    it('should generate metadata correctly', () => {
      const post = BlogModel.createBlogPost('test-id', 'author-id', mockData);

      expect(post.metadata.wordCount).toBeGreaterThan(0);
      expect(post.metadata.readingTime).toBeGreaterThan(0);
    });
  });

  describe('validateBlogPost', () => {
    it('should validate title length', () => {
      const shortTitle = { title: 'Hi' };
      const longTitle = { title: 'A'.repeat(201) };
      const validTitle = { title: 'Valid Title' };

      expect(BlogModel.validateBlogPost(shortTitle)).toContain('Title must be at least 3 characters long');
      expect(BlogModel.validateBlogPost(longTitle)).toContain('Title must be less than 200 characters');
      expect(BlogModel.validateBlogPost(validTitle)).toEqual([]);
    });

    it('should validate content length', () => {
      const shortContent = { content: 'Hi' };
      const validContent = { content: 'This is valid content for testing.' };

      expect(BlogModel.validateBlogPost(shortContent)).toContain('Content must be at least 10 characters long');
      expect(BlogModel.validateBlogPost(validContent)).toEqual([]);
    });

    it('should validate tags', () => {
      const tooManyTags = { tags: Array(11).fill('tag') };
      const longTag = { tags: ['a'.repeat(51)] };
      const validTags = { tags: ['spiritual', 'healing'] };

      expect(BlogModel.validateBlogPost(tooManyTags)).toContain('Maximum 10 tags allowed');
      expect(BlogModel.validateBlogPost(longTag)).toContain('Tag "' + 'a'.repeat(51) + '" is too long (max 50 characters)');
      expect(BlogModel.validateBlogPost(validTags)).toEqual([]);
    });
  });

  describe('canPublish', () => {
    it('should return true for complete posts', () => {
      const completePost = BlogModel.createBlogPost('id', 'author', {
        title: 'Complete Post',
        content: 'This post has all required fields.',
        excerpt: 'Complete excerpt',
        tags: [],
        status: PostStatus.DRAFT
      });

      expect(BlogModel.canPublish(completePost)).toBe(true);
    });

    it('should return false for incomplete posts', () => {
      const incompletePost = BlogModel.createBlogPost('id', 'author', {
        title: '',
        content: 'Content without title',
        excerpt: 'Excerpt',
        tags: [],
        status: PostStatus.DRAFT
      });

      expect(BlogModel.canPublish(incompletePost)).toBe(false);
    });
  });
});

describe('MediaModel', () => {
  describe('validateMediaFile', () => {
    it('should validate file types', () => {
      const validImageFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const validVideoFile = new File([''], 'test.mp4', { type: 'video/mp4' });
      const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });

      expect(MediaModel.validateMediaFile(validImageFile)).toEqual([]);
      expect(MediaModel.validateMediaFile(validVideoFile)).toEqual([]);
      expect(MediaModel.validateMediaFile(invalidFile)[0]).toContain('File type not supported');
    });

    it('should validate file size', () => {
      const smallFile = new File(['x'.repeat(1000)], 'small.jpg', { type: 'image/jpeg' });
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });

      expect(MediaModel.validateMediaFile(smallFile)).toEqual([]);
      expect(MediaModel.validateMediaFile(largeFile)[0]).toContain('File size too large');
    });
  });
});

describe('AdminModel', () => {
  describe('hasPermission', () => {
    it('should grant all permissions to super admin', () => {
      const superAdmin = AdminModel.createAdminUser('id', 'admin@test.com', 'Super Admin', AdminRole.SUPER_ADMIN);
      
      expect(AdminModel.hasPermission(superAdmin, Permission.CREATE_POST)).toBe(true);
      expect(AdminModel.hasPermission(superAdmin, Permission.DELETE_POST)).toBe(true);
    });

    it('should respect role-based permissions', () => {
      const author = AdminModel.createAdminUser('id', 'author@test.com', 'Author', AdminRole.AUTHOR);
      
      expect(AdminModel.hasPermission(author, Permission.CREATE_POST)).toBe(true);
      expect(AdminModel.hasPermission(author, Permission.DELETE_POST)).toBe(false);
    });
  });

  describe('getDefaultPermissions', () => {
    it('should return correct permissions for each role', () => {
      const superAdminPerms = AdminModel.getDefaultPermissions(AdminRole.SUPER_ADMIN);
      const editorPerms = AdminModel.getDefaultPermissions(AdminRole.EDITOR);
      const authorPerms = AdminModel.getDefaultPermissions(AdminRole.AUTHOR);

      expect(superAdminPerms).toEqual(Object.values(Permission));
      expect(editorPerms).toContain(Permission.DELETE_POST);
      expect(authorPerms).not.toContain(Permission.DELETE_POST);
      expect(authorPerms).toContain(Permission.CREATE_POST);
    });
  });
});