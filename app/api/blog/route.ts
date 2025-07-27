import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/lib/services/blogService';
import { PostStatus } from '@/lib/types/blog';

/**
 * Public API route for retrieving published blog posts
 * GET /api/blog
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    const tag = searchParams.get('tag') || undefined;
    
    // Get published posts only for public API
    const result = await BlogService.searchPosts({
      status: PostStatus.PUBLISHED,
      tags: tag ? [tag] : undefined,
      limit,
      offset
    });

    // Filter out sensitive information for public API
    const publicPosts = result.posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      tags: post.tags,
      publishedAt: post.publishedAt,
      metadata: {
        readingTime: post.metadata.readingTime,
        wordCount: post.metadata.wordCount
      }
    }));

    return NextResponse.json({
      posts: publicPosts,
      totalCount: result.totalCount,
      hasMore: result.hasMore
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}