import { 
  BlogPost, 
  PostStatus, 
  CreateBlogPostData, 
  UpdateBlogPostData, 
  BlogSearchParams,
  BlogSearchResult
} from '../types/blog';
import { prisma } from '../db';
import { BlogModel } from '../models/BlogModel';

export class BlogService {
  /**
   * Get all blog posts
   */
  static async getAllPosts(): Promise<BlogPost[]> {
    const posts = await prisma.blogPost.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        featuredImage: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return posts.map((post: any) => this.transformPrismaPost(post));
  }

  /**
   * Get blog post by ID
   */
  static async getPostById(id: string): Promise<BlogPost | null> {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        featuredImage: true,
      }
    });

    return post ? this.transformPrismaPost(post) : null;
  }

  /**
   * Get blog post by slug
   */
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        featuredImage: true,
      }
    });

    return post ? this.transformPrismaPost(post) : null;
  }

  /**
   * Create new blog post
   */
  static async createPost(authorId: string, data: CreateBlogPostData): Promise<BlogPost> {
    // Generate slug from title if not provided
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Calculate reading time and word count
    const wordCount = data.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt,
        tags: JSON.stringify(data.tags),
        status: data.status,
        scheduledFor: data.scheduledFor,
        authorId,
        featuredImageId: data.featuredImage,
        seoTitle: data.metadata?.seoTitle,
        seoDescription: data.metadata?.seoDescription,
        canonicalUrl: data.metadata?.canonicalUrl,
        readingTime,
        wordCount,
        publishedAt: data.status === PostStatus.PUBLISHED ? new Date() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        featuredImage: true,
      }
    });

    return this.transformPrismaPost(post);
  }

  /**
   * Update existing blog post
   */
  static async updatePost(id: string, data: UpdateBlogPostData): Promise<BlogPost | null> {
    const existingPost = await prisma.blogPost.findUnique({ where: { id } });
    if (!existingPost) return null;

    // Calculate reading time and word count if content is being updated
    let updateData: any = { ...data };
    if (data.content) {
      const wordCount = data.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      updateData.readingTime = Math.ceil(wordCount / 200);
      updateData.wordCount = wordCount;
    }

    // Set publishedAt if status is being changed to published
    if (data.status === PostStatus.PUBLISHED && existingPost.status !== PostStatus.PUBLISHED) {
      updateData.publishedAt = new Date();
    }

    // Update slug if title is being changed
    if (data.title) {
      updateData.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...updateData,
        featuredImageId: data.featuredImage,
        seoTitle: data.metadata?.seoTitle,
        seoDescription: data.metadata?.seoDescription,
        canonicalUrl: data.metadata?.canonicalUrl,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        featuredImage: true,
      }
    });

    return this.transformPrismaPost(post);
  }

  /**
   * Delete blog post
   */
  static async deletePost(id: string): Promise<boolean> {
    try {
      await prisma.blogPost.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Delete multiple blog posts
   */
  static async deletePosts(ids: string[]): Promise<number> {
    const result = await prisma.blogPost.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });
    return result.count;
  }

  /**
   * Update status for multiple blog posts
   */
  static async updatePostsStatus(ids: string[], status: PostStatus): Promise<number> {
    const updateData: any = { status };
    
    // Set publishedAt if status is being changed to published
    if (status === PostStatus.PUBLISHED) {
      updateData.publishedAt = new Date();
    }

    const result = await prisma.blogPost.updateMany({
      where: {
        id: {
          in: ids
        }
      },
      data: updateData
    });
    
    return result.count;
  }

  /**
   * Search and filter blog posts
   */
  static async searchPosts(params: BlogSearchParams): Promise<BlogSearchResult> {
    const where: any = {};
    
    // Apply filters
    if (params.query) {
      const query = params.query.toLowerCase();
      where.OR = [
        { title: { contains: query } },
        { excerpt: { contains: query } },
        { content: { contains: query } },
        { tags: { contains: `"${query}"` } }
      ];
    }
    
    if (params.tags && params.tags.length > 0) {
      // For SQLite, we need to search within the JSON string
      where.OR = where.OR || [];
      params.tags.forEach(tag => {
        where.OR.push({
          tags: {
            contains: `"${tag}"`
          }
        });
      });
    }
    
    if (params.status) {
      where.status = params.status;
    }
    
    if (params.authorId) {
      where.authorId = params.authorId;
    }
    
    if (params.dateFrom) {
      where.createdAt = {
        ...where.createdAt,
        gte: params.dateFrom
      };
    }
    
    if (params.dateTo) {
      where.createdAt = {
        ...where.createdAt,
        lte: params.dateTo
      };
    }
    
    // Get total count
    const totalCount = await prisma.blogPost.count({ where });
    
    // Apply pagination
    const limit = params.limit || 10;
    const offset = params.offset || 0;
    
    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        featuredImage: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });
    
    return {
      posts: posts.map((post: any) => this.transformPrismaPost(post)),
      totalCount,
      hasMore: offset + posts.length < totalCount
    };
  }

  /**
   * Get blog statistics
   */
  static async getBlogStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    scheduled: number;
  }> {
    const [total, published, draft, scheduled] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: PostStatus.PUBLISHED } }),
      prisma.blogPost.count({ where: { status: PostStatus.DRAFT } }),
      prisma.blogPost.count({ where: { status: PostStatus.SCHEDULED } })
    ]);

    return {
      total,
      published,
      draft,
      scheduled
    };
  }

  /**
   * Get all unique tags from blog posts
   */
  static async getAllTags(): Promise<string[]> {
    const posts = await prisma.blogPost.findMany({
      select: {
        tags: true
      }
    });

    const tagSet = new Set<string>();
    posts.forEach((post: any) => {
      const tags = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags;
      if (Array.isArray(tags)) {
        tags.forEach((tag: string) => tagSet.add(tag));
      }
    });

    return Array.from(tagSet);
  }

  /**
   * Transform Prisma post to BlogPost type
   */
  private static transformPrismaPost(post: any): BlogPost {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags,
      status: post.status as PostStatus,
      publishedAt: post.publishedAt,
      scheduledFor: post.scheduledFor,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      authorId: post.authorId,
      featuredImage: post.featuredImage ? {
        id: post.featuredImage.id,
        filename: post.featuredImage.filename,
        originalName: post.featuredImage.originalName,
        mimeType: post.featuredImage.mimeType,
        size: post.featuredImage.size,
        url: post.featuredImage.url,
        thumbnailUrl: post.featuredImage.thumbnailUrl,
        altText: post.featuredImage.altText,
        caption: post.featuredImage.caption,
        uploadedAt: post.featuredImage.uploadedAt,
        metadata: {
          width: post.featuredImage.width,
          height: post.featuredImage.height,
          duration: post.featuredImage.duration,
          format: post.featuredImage.format,
          optimized: post.featuredImage.optimized
        }
      } : undefined,
      metadata: {
        readingTime: post.readingTime || 0,
        wordCount: post.wordCount || 0,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        canonicalUrl: post.canonicalUrl
      }
    };
  }
}