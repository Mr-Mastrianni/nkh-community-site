import { NextRequest } from 'next/server';
import { POST } from '../upload/route';
import { AuthService } from '@/lib/services/authService';
import { MediaService } from '@/lib/services/mediaService';
import { MediaModel } from '@/lib/models/BlogModel';
import { Permission } from '@/lib/types/blog';

// Mock dependencies
jest.mock('@/lib/services/authService');
jest.mock('@/lib/services/mediaService');
jest.mock('@/lib/models/BlogModel');

describe('Media Upload API', () => {
  const mockUser = {
    id: 'user-1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'super_admin',
    permissions: [Permission.MANAGE_MEDIA],
    lastLoginAt: new Date(),
    createdAt: new Date()
  };
  
  const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock AuthService
    (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (AuthService.hasPermission as jest.Mock).mockReturnValue(true);
    
    // Mock MediaModel
    (MediaModel.validateMediaFile as jest.Mock).mockReturnValue([]);
    
    // Mock MediaService
    (MediaService.processMediaFile as jest.Mock).mockResolvedValue({
      id: 'media-1',
      filename: 'test.jpg',
      originalName: 'test.jpg',
      mimeType: 'image/jpeg',
      size: 1024,
      url: '/api/media/test.jpg',
      uploadedAt: new Date(),
      metadata: {
        format: 'image/jpeg',
        optimized: true
      }
    });
  });

  it('returns 401 when user is not authenticated', async () => {
    (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(null);
    
    const formData = new FormData();
    formData.append('file', mockFile);
    
    const request = new NextRequest('http://localhost/api/admin/media/upload', {
      method: 'POST',
      body: formData
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(401);
    expect(data.error).toBe('Authentication required');
  });

  it('returns 403 when user does not have permission', async () => {
    (AuthService.hasPermission as jest.Mock).mockReturnValue(false);
    
    const formData = new FormData();
    formData.append('file', mockFile);
    
    const request = new NextRequest('http://localhost/api/admin/media/upload', {
      method: 'POST',
      body: formData
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(403);
    expect(data.error).toBe('Permission denied');
  });

  it('returns 400 when no file is provided', async () => {
    const formData = new FormData();
    // No file added
    
    const request = new NextRequest('http://localhost/api/admin/media/upload', {
      method: 'POST',
      body: formData
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('No file provided');
  });

  it('returns 400 when file validation fails', async () => {
    (MediaModel.validateMediaFile as jest.Mock).mockReturnValue(['Invalid file type']);
    
    const formData = new FormData();
    formData.append('file', mockFile);
    
    const request = new NextRequest('http://localhost/api/admin/media/upload', {
      method: 'POST',
      body: formData
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid file type');
  });

  it('processes and returns the media file on successful upload', async () => {
    const formData = new FormData();
    formData.append('file', mockFile);
    formData.append('metadata', JSON.stringify({ width: 1920, height: 1080 }));
    
    const request = new NextRequest('http://localhost/api/admin/media/upload', {
      method: 'POST',
      body: formData
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data).toEqual(expect.objectContaining({
      id: 'media-1',
      filename: 'test.jpg'
    }));
    
    expect(MediaService.processMediaFile).toHaveBeenCalledWith(
      expect.any(File),
      expect.objectContaining({ width: 1920, height: 1080 }),
      expect.objectContaining({
        optimize: true,
        generateThumbnail: true
      })
    );
  });

  it('handles errors during processing', async () => {
    (MediaService.processMediaFile as jest.Mock).mockRejectedValue(new Error('Processing failed'));
    
    const formData = new FormData();
    formData.append('file', mockFile);
    
    const request = new NextRequest('http://localhost/api/admin/media/upload', {
      method: 'POST',
      body: formData
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to process media upload');
  });
});