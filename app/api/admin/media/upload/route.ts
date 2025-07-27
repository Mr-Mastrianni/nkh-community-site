import { NextRequest, NextResponse } from 'next/server';
import { MediaService } from '@/lib/services/mediaService';
import { AuthService } from '@/lib/services/authService';
import { Permission } from '@/lib/types/blog';
import { MediaModel } from '@/lib/models/BlogModel';

/**
 * API route for media file uploads
 * POST /api/admin/media/upload
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
    
    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate the file
    const validationErrors = MediaModel.validateMediaFile(file);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      );
    }
    
    // Parse metadata if provided
    let metadata = {};
    const metadataStr = formData.get('metadata');
    if (metadataStr && typeof metadataStr === 'string') {
      try {
        metadata = JSON.parse(metadataStr);
      } catch (error) {
        console.error('Invalid metadata JSON:', error);
      }
    }
    
    // Process the file
    const mediaFile = await MediaService.processMediaFile(file, metadata, {
      optimize: true,
      generateThumbnail: true,
      maxWidth: 1920,
      maxHeight: 1080
    });
    
    // Return the processed media file data
    return NextResponse.json(mediaFile, { status: 201 });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process media upload' },
      { status: 500 }
    );
  }
}