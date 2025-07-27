// Blog model class for handling blog data operations
import { 
  BlogPost, 
  PostStatus, 
  PostMetadata, 
  MediaFile, 
  AdminUser, 
  AdminRole, 
  Permission,
  CreateBlogPostData,
  UpdateBlogPostData,
  BlogSearchParams 
} from '../types/blog';

export class BlogModel {
  /**
   * Generate a URL-friendly slug from a title
   */
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Calculate reading time based on word count (average 200 words per minute)
   */
  static calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = this.calculateWordCount(content);
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Calculate word count from HTML content
   */
  static calculateWordCount(content: string): number {
    // Strip HTML tags and count words
    const textContent = content.replace(/<[^>]*>/g, '');
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }

  /**
   * Generate post metadata from content
   */
  static generateMetadata(content: string, customMetadata?: Partial<PostMetadata>): PostMetadata {
    const wordCount = this.calculateWordCount(content);
    const readingTime = this.calculateReadingTime(content);

    return {
      wordCount,
      readingTime,
      seoTitle: customMetadata?.seoTitle,
      seoDescription: customMetadata?.seoDescription,
      canonicalUrl: customMetadata?.canonicalUrl
    };
  }

  /**
   * Create a new blog post with generated metadata
   */
  static createBlogPost(
    id: string,
    authorId: string,
    data: CreateBlogPostData
  ): BlogPost {
    const now = new Date();
    const slug = this.generateSlug(data.title);
    const metadata = this.generateMetadata(data.content, data.metadata);

    return {
      id,
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      tags: data.tags,
      status: data.status,
      publishedAt: data.status === PostStatus.PUBLISHED ? now : undefined,
      scheduledFor: data.scheduledFor,
      createdAt: now,
      updatedAt: now,
      authorId,
      metadata,
      featuredImage: undefined // Will be set separately after media upload
    };
  }

  /**
   * Update an existing blog post
   */
  static updateBlogPost(
    existingPost: BlogPost,
    updateData: UpdateBlogPostData
  ): BlogPost {
    const updatedPost = { ...existingPost };
    const now = new Date();

    // Update basic fields
    if (updateData.title) {
      updatedPost.title = updateData.title;
      updatedPost.slug = this.generateSlug(updateData.title);
    }
    if (updateData.content) {
      updatedPost.content = updateData.content;
      updatedPost.metadata = this.generateMetadata(updateData.content, updateData.metadata);
    }
    if (updateData.excerpt) updatedPost.excerpt = updateData.excerpt;
    if (updateData.tags) updatedPost.tags = updateData.tags;
    if (updateData.scheduledFor !== undefined) updatedPost.scheduledFor = updateData.scheduledFor;

    // Handle status changes
    if (updateData.status && updateData.status !== existingPost.status) {
      updatedPost.status = updateData.status;
      
      // Set publishedAt when publishing for the first time
      if (updateData.status === PostStatus.PUBLISHED && !existingPost.publishedAt) {
        updatedPost.publishedAt = now;
      }
    }

    updatedPost.updatedAt = now;
    return updatedPost;
  }

  /**
   * Validate blog post data
   */
  static validateBlogPost(data: CreateBlogPostData | UpdateBlogPostData): string[] {
    const errors: string[] = [];

    if ('title' in data && data.title) {
      if (data.title.length < 3) {
        errors.push('Title must be at least 3 characters long');
      }
      if (data.title.length > 200) {
        errors.push('Title must be less than 200 characters');
      }
    }

    if ('content' in data && data.content) {
      if (data.content.length < 10) {
        errors.push('Content must be at least 10 characters long');
      }
    }

    if ('excerpt' in data && data.excerpt) {
      if (data.excerpt.length > 500) {
        errors.push('Excerpt must be less than 500 characters');
      }
    }

    if ('tags' in data && data.tags) {
      if (data.tags.length > 10) {
        errors.push('Maximum 10 tags allowed');
      }
      data.tags.forEach(tag => {
        if (tag.length > 50) {
          errors.push(`Tag "${tag}" is too long (max 50 characters)`);
        }
      });
    }

    return errors;
  }

  /**
   * Check if a post can be published
   */
  static canPublish(post: BlogPost): boolean {
    return post.title.length > 0 && 
           post.content.length > 0 && 
           post.excerpt.length > 0;
  }

  /**
   * Check if a post is scheduled for future publication
   */
  static isScheduled(post: BlogPost): boolean {
    return post.status === PostStatus.SCHEDULED && 
           post.scheduledFor !== undefined && 
           post.scheduledFor > new Date();
  }

  /**
   * Get posts that should be published (scheduled posts past their date)
   */
  static getPostsToPublish(posts: BlogPost[]): BlogPost[] {
    const now = new Date();
    return posts.filter(post => 
      post.status === PostStatus.SCHEDULED && 
      post.scheduledFor && 
      post.scheduledFor <= now
    );
  }
}

export class MediaModel {
  /**
   * Validate media file upload
   */
  static validateMediaFile(file: File): string[] {
    const errors: string[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm'];
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not supported. Please use JPG, PNG, WebP, GIF, MP4, or WebM files.');
    }

    if (file.size > maxSize) {
      errors.push('File size too large. Maximum size is 10MB.');
    }

    return errors;
  }

  /**
   * Generate media file metadata
   */
  static async generateMediaMetadata(file: File): Promise<Partial<MediaFile>> {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          resolve({
            metadata: {
              width: img.width,
              height: img.height,
              format: file.type,
              optimized: false
            }
          });
        };
        img.onerror = () => resolve({ metadata: { format: file.type, optimized: false } });
        img.src = URL.createObjectURL(file);
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.onloadedmetadata = () => {
          resolve({
            metadata: {
              width: video.videoWidth,
              height: video.videoHeight,
              duration: video.duration,
              format: file.type,
              optimized: false
            }
          });
        };
        video.onerror = () => resolve({ metadata: { format: file.type, optimized: false } });
        video.src = URL.createObjectURL(file);
      } else {
        resolve({ metadata: { format: file.type, optimized: false } });
      }
    });
  }
}

export class AdminModel {
  /**
   * Check if admin user has specific permission
   */
  static hasPermission(admin: AdminUser, permission: Permission): boolean {
    return admin.permissions.includes(permission) || admin.role === AdminRole.SUPER_ADMIN;
  }

  /**
   * Get default permissions for admin role
   */
  static getDefaultPermissions(role: AdminRole): Permission[] {
    switch (role) {
      case AdminRole.SUPER_ADMIN:
        return Object.values(Permission);
      case AdminRole.EDITOR:
        return [
          Permission.CREATE_POST,
          Permission.EDIT_POST,
          Permission.DELETE_POST,
          Permission.PUBLISH_POST,
          Permission.MANAGE_MEDIA
        ];
      case AdminRole.AUTHOR:
        return [
          Permission.CREATE_POST,
          Permission.EDIT_POST,
          Permission.MANAGE_MEDIA
        ];
      default:
        return [];
    }
  }

  /**
   * Create admin user with default permissions
   */
  static createAdminUser(
    id: string,
    email: string,
    name: string,
    role: AdminRole
  ): AdminUser {
    return {
      id,
      email,
      name,
      role,
      permissions: this.getDefaultPermissions(role),
      lastLoginAt: new Date(),
      createdAt: new Date()
    };
  }
}