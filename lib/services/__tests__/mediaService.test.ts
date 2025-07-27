import { MediaService } from '../mediaService';

// Mock global objects
global.URL = {
  createObjectURL: jest.fn(() => 'blob:mock-url'),
  revokeObjectURL: jest.fn()
};

global.Image = class {
  onload: () => void = () => {};
  onerror: () => void = () => {};
  src: string = '';
  width: number = 0;
  height: number = 0;
  
  constructor() {
    setTimeout(() => {
      this.width = 1920;
      this.height = 1080;
      this.onload();
    }, 0);
  }
};

global.HTMLVideoElement.prototype.onloadeddata = () => {};
global.HTMLVideoElement.prototype.onseeked = () => {};
global.HTMLVideoElement.prototype.onerror = () => {};

// Mock canvas and context
const mockContext = {
  drawImage: jest.fn()
};

const mockCanvas = {
  getContext: jest.fn(() => mockContext),
  width: 0,
  height: 0,
  toBlob: jest.fn((callback) => callback(new Blob(['mock-blob'], { type: 'image/jpeg' })))
};

global.document.createElement = jest.fn((tagName) => {
  if (tagName === 'canvas') {
    return mockCanvas as unknown as HTMLCanvasElement;
  }
  if (tagName === 'video') {
    const video = {
      onloadeddata: () => {},
      onseeked: () => {},
      onerror: () => {},
      src: '',
      currentTime: 0,
      duration: 60,
      videoWidth: 1280,
      videoHeight: 720
    };
    
    // Simulate video events
    setTimeout(() => {
      video.onloadeddata();
      setTimeout(() => {
        video.onseeked();
      }, 0);
    }, 0);
    
    return video as unknown as HTMLVideoElement;
  }
  return {} as any;
});

// Mock fetch
global.fetch = jest.fn();

describe('MediaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ files: [], total: 0 })
    });
  });

  describe('processMediaFile', () => {
    it('processes an image file correctly', async () => {
      const file = new File(['test image content'], 'test-image.jpg', { type: 'image/jpeg' });
      const metadata = {
        width: 1920,
        height: 1080,
        format: 'image/jpeg'
      };
      
      const result = await MediaService.processMediaFile(file, metadata);
      
      expect(result).toEqual(expect.objectContaining({
        filename: expect.stringMatching(/\.jpg$/),
        originalName: 'test-image.jpg',
        mimeType: 'image/jpeg',
        size: file.size,
        url: expect.stringMatching(/^\/api\/media\/.+\.jpg$/),
        metadata: expect.objectContaining({
          format: 'image/jpeg',
          optimized: false
        })
      }));
    });

    it('generates thumbnails when requested', async () => {
      const file = new File(['test image content'], 'test-image.jpg', { type: 'image/jpeg' });
      const metadata = {
        width: 1920,
        height: 1080,
        format: 'image/jpeg'
      };
      
      const result = await MediaService.processMediaFile(file, metadata, {
        generateThumbnail: true
      });
      
      expect(result.thumbnailUrl).toBeDefined();
      expect(result.thumbnailUrl).toMatch(/^\/api\/media\/thumbnails\/.+\.jpg$/);
    });

    it('processes a video file correctly', async () => {
      const file = new File(['test video content'], 'test-video.mp4', { type: 'video/mp4' });
      const metadata = {
        width: 1280,
        height: 720,
        duration: 60,
        format: 'video/mp4'
      };
      
      const result = await MediaService.processMediaFile(file, metadata);
      
      expect(result).toEqual(expect.objectContaining({
        filename: expect.stringMatching(/\.mp4$/),
        originalName: 'test-video.mp4',
        mimeType: 'video/mp4',
        size: file.size,
        url: expect.stringMatching(/^\/api\/media\/.+\.mp4$/),
        metadata: expect.objectContaining({
          format: 'video/mp4',
          optimized: false
        })
      }));
    });
  });

  describe('optimizeImage', () => {
    it('resizes an image while maintaining aspect ratio', async () => {
      const file = new File(['test image content'], 'test-image.jpg', { type: 'image/jpeg' });
      
      await MediaService.optimizeImage(file, 800, 600);
      
      // Check that canvas was created with correct dimensions
      expect(mockCanvas.width).toBe(800);
      expect(mockCanvas.height).toBe(450); // Maintains 16:9 aspect ratio
      
      // Check that image was drawn on canvas
      expect(mockContext.drawImage).toHaveBeenCalled();
      
      // Check that blob was created
      expect(mockCanvas.toBlob).toHaveBeenCalled();
    });
  });

  describe('generateThumbnail', () => {
    it('generates a thumbnail for an image', async () => {
      const file = new File(['test image content'], 'test-image.jpg', { type: 'image/jpeg' });
      
      const result = await MediaService.generateThumbnail(file, 300, 300);
      
      expect(result).toBeInstanceOf(Blob);
      expect(mockCanvas.toBlob).toHaveBeenCalled();
    });

    it('generates a thumbnail for a video', async () => {
      const file = new File(['test video content'], 'test-video.mp4', { type: 'video/mp4' });
      
      const result = await MediaService.generateThumbnail(file, 300, 300);
      
      expect(result).toBeInstanceOf(Blob);
      expect(mockCanvas.toBlob).toHaveBeenCalled();
    });

    it('throws an error for unsupported file types', async () => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      
      await expect(MediaService.generateThumbnail(file)).rejects.toThrow('Unsupported file type');
    });
  });

  describe('deleteMediaFile', () => {
    it('sends a DELETE request to the API', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true
      });
      
      const result = await MediaService.deleteMediaFile('test-id');
      
      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith('/api/admin/media/test-id', {
        method: 'DELETE'
      });
    });

    it('handles errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      
      const result = await MediaService.deleteMediaFile('test-id');
      
      expect(result).toBe(false);
    });
  });

  describe('getMediaFiles', () => {
    it('fetches media files with correct parameters', async () => {
      const mockFiles = [{ id: 'test-1' }, { id: 'test-2' }];
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ files: mockFiles, total: 2 })
      });
      
      const result = await MediaService.getMediaFiles('image', 10, 5);
      
      expect(result).toEqual({ files: mockFiles, total: 2 });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/^\/api\/admin\/media\?type=image&limit=10&offset=5$/)
      );
    });

    it('handles API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to fetch' })
      });
      
      const result = await MediaService.getMediaFiles();
      
      expect(result).toEqual({ files: [], total: 0 });
    });

    it('handles network errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      
      const result = await MediaService.getMediaFiles();
      
      expect(result).toEqual({ files: [], total: 0 });
    });
  });
});