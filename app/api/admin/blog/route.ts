import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/lib/services/blogService';
import { AuthService } from '@/lib/services/authService';
import { Permission, PostStatus } from '@/lib/types/blog';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await AuthService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || undefined;
    const status = searchParams.get('status') as PostStatus | undefined;
    const tagsParam = searchParams.get('tags');
    const tags = tagsParam ? tagsParam.split(',') : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;
    
    // Get posts with search parameters
    const result = await BlogService.searchPosts({
      query,
      status,
      tags,
      limit,
      offset
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await AuthService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!AuthService.hasPermission(user, Permission.CREATE_POST)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Parse request body
    const data = await request.json();
    
    // Create post
    const post = await BlogService.createPost(user.id, data);
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

// Handle bulk operations
export async function PATCH(request: NextRequest) {
  try {
    // Authenticate user
    const user = await AuthService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!AuthService.hasPermission(user, Permission.EDIT_POST)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Parse request body
    const { operation, ids, data } = await request.json();
    
    if (!operation || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    
    let result;
    
    // Handle different bulk operations
    switch (operation) {
      case 'delete':
        if (!AuthService.hasPermission(user, Permission.DELETE_POST)) {
          return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
        }
        result = await BlogService.deletePosts(ids);
        return NextResponse.json({ deleted: result });
        
      case 'status':
        if (!data.status || !Object.values(PostStatus).includes(data.status)) {
          return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }
        
        if (data.status === PostStatus.PUBLISHED && 
            !AuthService.hasPermission(user, Permission.PUBLISH_POST)) {
          return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
        }
        
        result = await BlogService.updatePostsStatus(ids, data.status);
        return NextResponse.json({ updated: result });
        
      default:
        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error performing bulk operation:', error);
    return NextResponse.json({ error: 'Failed to perform operation' }, { status: 500 });
  }
}