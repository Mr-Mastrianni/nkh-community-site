import { NextResponse } from 'next/server';
import { BlogService } from '@/lib/services/blogService';
import { PostStatus } from '@/lib/types/blog';

export async function GET() {
  try {
    // Get all posts to extract tags from published posts only
    const allPosts = await BlogService.getAllPosts();
    const publishedPosts = allPosts.filter(post => post.status === PostStatus.PUBLISHED);
    
    // Extract unique tags from published posts
    const tagSet = new Set<string>();
    publishedPosts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    
    const tags = Array.from(tagSet).sort();
    
    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    return NextResponse.json({ error: 'Failed to fetch blog tags' }, { status: 500 });
  }
}