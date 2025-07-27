import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/lib/services/blogService';
import { AuthService } from '@/lib/services/authService';
import { Permission, PostStatus } from '@/lib/types/blog';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Authenticate user
    const user = await AuthService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get post by ID
    const post = await BlogService.getPostById(params.id);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error(`Error fetching blog post ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
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

    // Get existing post
    const existingPost = await BlogService.getPostById(params.id);
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Parse request body
    const data = await request.json();
    
    // Check publishing permission
    if (data.status === PostStatus.PUBLISHED && 
        existingPost.status !== PostStatus.PUBLISHED && 
        !AuthService.hasPermission(user, Permission.PUBLISH_POST)) {
      return NextResponse.json({ error: 'Permission denied for publishing' }, { status: 403 });
    }
    
    // Update post
    const updatedPost = await BlogService.updatePost(params.id, { id: params.id, ...data });
    
    if (!updatedPost) {
      return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(`Error updating blog post ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Authenticate user
    const user = await AuthService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!AuthService.hasPermission(user, Permission.DELETE_POST)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Delete post
    const success = await BlogService.deletePost(params.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting blog post ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}