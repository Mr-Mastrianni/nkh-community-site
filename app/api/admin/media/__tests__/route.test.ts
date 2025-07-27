import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import { AuthService } from '@/lib/services/authService';
import { Permission } from '@/lib/types/blog';

// Mock dependencies
jest.mock('@/lib/services/authService');

describe('Media API Routes', () => {
  const mockUser = {
    id: 'user-1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'super_admin',
    permissions: [Permission.MANAGE_MEDIA],
    lastLoginAt: new Date(),
    createdAt: new Date()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock AuthService
    (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (AuthService.hasPermission as jest.Mock).mockReturnValue(true);
  });

  describe('GET /api/admin/media', () => {
    it('returns 401 when user is not authenticated', async () => {
      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(null);
      
      const request = new NextRequest('http://localhost/api/admin/media');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('returns 403 when user does not have permission', async () => {
      (AuthService.hasPermission as jest.Mock).mockReturnValue(false);
      
      const request = new NextRequest('http://localhost/api/admin/media');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(403);
      expect(data.error).toBe('Permission denied');
    });

    it('returns media files with default parameters', async () => {
      const request = new NextRequest('http://localhost/api/admin/media');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('files');
      expect(data).toHaveProperty('total');
      expect(Array.isArray(data.files)).toBe(true);
    });

    it('filters media files by type', async () => {
      const request = new NextRequest('http://localhost/api/admin/media?type=image');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('files');
      
      // All files should be images
      data.files.forEach((file: any) => {
        expect(file.mimeType.startsWith('image/')).toBe(true);
      });
    });

    it('handles pagination parameters', async () => {
      const request = new NextRequest('http://localhost/api/admin/media?limit=5&offset=10');
      const response = await GET(request);
      
      expect(response.status).toBe(200);
    });

    it('handles errors gracefully', async () => {
      // Force an error by making getCurrentUser throw
      (AuthService.getCurrentUser as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      const request = new NextRequest('http://localhost/api/admin/media');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch media files');
    });
  });

  describe('POST /api/admin/media', () => {
    it('returns 401 when user is not authenticated', async () => {
      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(null);
      
      const request = new NextRequest('http://localhost/api/admin/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: '/api/media/test.jpg',
          filename: 'test.jpg',
          mimeType: 'image/jpeg'
        })
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('returns 403 when user does not have permission', async () => {
      (AuthService.hasPermission as jest.Mock).mockReturnValue(false);
      
      const request = new NextRequest('http://localhost/api/admin/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: '/api/media/test.jpg',
          filename: 'test.jpg',
          mimeType: 'image/jpeg'
        })
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(403);
      expect(data.error).toBe('Permission denied');
    });

    it('returns 400 when required fields are missing', async () => {
      const request = new NextRequest('http://localhost/api/admin/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Missing required fields
          originalName: 'test.jpg'
        })
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('creates a new media file record', async () => {
      const mediaData = {
        url: '/api/media/test.jpg',
        filename: 'test.jpg',
        mimeType: 'image/jpeg',
        originalName: 'original-test.jpg',
        size: 1024
      };
      
      const request = new NextRequest('http://localhost/api/admin/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mediaData)
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data).toEqual(expect.objectContaining({
        id: expect.any(String),
        ...mediaData,
        uploadedAt: expect.any(String)
      }));
    });

    it('handles errors gracefully', async () => {
      // Force an error by making the request body invalid JSON
      const request = new NextRequest('http://localhost/api/admin/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid-json'
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to create media file');
    });
  });
});