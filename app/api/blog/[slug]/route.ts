import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/lib/services/blogService';
import { PostStatus } from '@/lib/types/blog';

interface Params {
  params: {
    slug: string;
  };
}

/**
 * Public API route for retrieving a specific published blog post by slug
 * GET /api/blog/[slug]
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Get post by slug
    const post = await BlogService.getPostBySlug(params.slug);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Only return published posts for public API
    if (post.status !== PostStatus.PUBLISHED) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Filter out sensitive information for public API
    const publicPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      tags: post.tags,
      publishedAt: post.publishedAt,
      metadata: {
        readingTime: post.metadata.readingTime,
        wordCount: post.metadata.wordCount
      }
    };
    
    return NextResponse.json(publicPost);
  } catch (error) {
    console.error(`Error fetching blog post ${params.slug}:`, error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}