import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/authService';
import { Permission } from '@/lib/types/blog';

/**
 * API route for retrieving media files
 * GET /api/admin/media
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication and permissions
    const user = await AuthService.getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (!AuthService.hasPermission(user, Permission.MANAGE_MEDIA)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    // In a real implementation, this would fetch from a database
    // For now, we'll return mock data
    const mockMediaFiles = Array(10).fill(null).map((_, index) => {
      const id = `mock-${index + offset + 1}`;
      const isImage = index % 3 !== 2; // 2/3 images, 1/3 videos
      
      return {
        id,
        filename: isImage ? `${id}.jpg` : `${id}.mp4`,
        originalName: isImage ? `image-${index + offset + 1}.jpg` : `video-${index + offset + 1}.mp4`,
        mimeType: isImage ? 'image/jpeg' : 'video/mp4',
        size: isImage ? 500000 + Math.random() * 1000000 : 2000000 + Math.random() * 5000000,
        url: isImage ? `/api/media/${id}.jpg` : `/api/media/${id}.mp4`,
        thumbnailUrl: `/api/media/thumbnails/${id}.jpg`,
        altText: isImage ? `Sample image ${index + offset + 1}` : `Sample video ${index + offset + 1}`,
        caption: isImage ? `Beautiful cosmic image ${index + offset + 1}` : `Spiritual video ${index + offset + 1}`,
        uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        metadata: {
          width: isImage ? 1920 : 1280,
          height: isImage ? 1080 : 720,
          duration: isImage ? undefined : 30 + Math.random() * 60,
          format: isImage ? 'image/jpeg' : 'video/mp4',
          optimized: true
        }
      };
    });
    
    // Filter by type if specified
    let filteredFiles = mockMediaFiles;
    if (type === 'image') {
      filteredFiles = mockMediaFiles.filter(file => file.mimeType.startsWith('image/'));
    } else if (type === 'video') {
      filteredFiles = mockMediaFiles.filter(file => file.mimeType.startsWith('video/'));
    }
    
    return NextResponse.json({
      files: filteredFiles,
      total: 100, // Mock total count
    });
  } catch (error) {
    console.error('Media fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media files' },
      { status: 500 }
    );
  }
}

/**
 * API route for creating a new media file (used for direct uploads)
 * POST /api/admin/media
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication and permissions
    const user = await AuthService.getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (!AuthService.hasPermission(user, Permission.MANAGE_MEDIA)) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }
    
    // Parse the request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.url || !data.filename || !data.mimeType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would create a record in the database
    // For now, we'll just return the data with an ID
    const mediaFile = {
      id: `new-${Date.now()}`,
      ...data,
      uploadedAt: new Date()
    };
    
    return NextResponse.json(mediaFile, { status: 201 });
  } catch (error) {
    console.error('Media creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create media file' },
      { status: 500 }
    );
  }
}