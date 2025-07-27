import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/lib/services/blogService';
import { PostStatus } from '@/lib/types/blog';

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || undefined;
    const tagsParam = searchParams.get('tags');
    const tags = tagsParam ? tagsParam.split(',').filter(tag => tag.trim()) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    
    // Only return published posts for public API
    const result = await BlogService.searchPosts({
      query,
      tags,
      status: PostStatus.PUBLISHED,
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
    console.error('Error searching blog posts:', error);
    return NextResponse.json({ error: 'Failed to search blog posts' }, { status: 500 });
  }
}