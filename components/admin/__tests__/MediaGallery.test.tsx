import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MediaGallery from '../MediaGallery';
import { MediaService } from '@/lib/services/mediaService';

// Mock the MediaService
jest.mock('@/lib/services/mediaService', () => ({
  MediaService: {
    getMediaFiles: jest.fn()
  }
}));

describe('MediaGallery Component', () => {
  const mockOnSelect = jest.fn();
  const mockMediaFiles = [
    {
      id: 'media-1',
      filename: 'image-1.jpg',
      originalName: 'beautiful-image.jpg',
      mimeType: 'image/jpeg',
      size: 1024 * 1024, // 1MB
      url: '/api/media/image-1.jpg',
      thumbnailUrl: '/api/media/thumbnails/image-1.jpg',
      altText: 'A beautiful cosmic image',
      caption: 'Cosmic energy flowing',
      uploadedAt: new Date('2025-01-01'),
      metadata: {
        width: 1920,
        height: 1080,
        format: 'image/jpeg',
        optimized: true
      }
    },
    {
      id: 'media-2',
      filename: 'video-1.mp4',
      originalName: 'meditation-video.mp4',
      mimeType: 'video/mp4',
      size: 5 * 1024 * 1024, // 5MB
      url: '/api/media/video-1.mp4',
      thumbnailUrl: '/api/media/thumbnails/video-1.jpg',
      altText: 'Meditation guidance video',
      caption: 'Learn to meditate with cosmic energy',
      uploadedAt: new Date('2025-01-02'),
      metadata: {
        width: 1280,
        height: 720,
        duration: 120, // 2 minutes
        format: 'video/mp4',
        optimized: true
      }
    }
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock implementation for getMediaFiles
    (MediaService.getMediaFiles as jest.Mock).mockResolvedValue({
      files: mockMediaFiles,
      total: 2
    });
  });

  it('renders the gallery component and loads media files', async () => {
    render(<MediaGallery onSelect={mockOnSelect} />);
    
    // Should show loading state initially
    expect(screen.getByRole('presentation')).toHaveClass('animate-spin');
    
    // Wait for media files to load
    await waitFor(() => {
      expect(screen.getByText('beautiful-image.jpg')).toBeInTheDocument();
    });
    
    expect(screen.getByText('meditation-video.mp4')).toBeInTheDocument();
    expect(screen.getByText('Showing 2 of 2 media files')).toBeInTheDocument();
  });

  it('filters media files by type', async () => {
    // Mock different responses based on filter type
    (MediaService.getMediaFiles as jest.Mock).mockImplementation((type) => {
      if (type === 'image') {
        return Promise.resolve({
          files: [mockMediaFiles[0]],
          total: 1
        });
      } else if (type === 'video') {
        return Promise.resolve({
          files: [mockMediaFiles[1]],
          total: 1
        });
      } else {
        return Promise.resolve({
          files: mockMediaFiles,
          total: 2
        });
      }
    });
    
    render(<MediaGallery onSelect={mockOnSelect} />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('beautiful-image.jpg')).toBeInTheDocument();
    });
    
    // Click on Images filter
    fireEvent.click(screen.getByText('Images'));
    
    await waitFor(() => {
      expect(screen.getByText('beautiful-image.jpg')).toBeInTheDocument();
      expect(screen.queryByText('meditation-video.mp4')).not.toBeInTheDocument();
    });
    
    // Click on Videos filter
    fireEvent.click(screen.getByText('Videos'));
    
    await waitFor(() => {
      expect(screen.queryByText('beautiful-image.jpg')).not.toBeInTheDocument();
      expect(screen.getByText('meditation-video.mp4')).toBeInTheDocument();
    });
    
    // Click on All Media filter
    fireEvent.click(screen.getByText('All Media'));
    
    await waitFor(() => {
      expect(screen.getByText('beautiful-image.jpg')).toBeInTheDocument();
      expect(screen.getByText('meditation-video.mp4')).toBeInTheDocument();
    });
  });

  it('selects a media file when clicked', async () => {
    render(<MediaGallery onSelect={mockOnSelect} />);
    
    // Wait for media files to load
    await waitFor(() => {
      expect(screen.getByText('beautiful-image.jpg')).toBeInTheDocument();
    });
    
    // Click on the first media item
    const mediaItem = screen.getByText('beautiful-image.jpg').closest('div');
    expect(mediaItem).not.toBeNull();
    
    if (mediaItem) {
      fireEvent.click(mediaItem);
      
      expect(mockOnSelect).toHaveBeenCalledWith(mockMediaFiles[0]);
    }
  });

  it('handles load more functionality', async () => {
    // Mock implementation for getMediaFiles with pagination
    let callCount = 0;
    (MediaService.getMediaFiles as jest.Mock).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          files: mockMediaFiles,
          total: 4, // More files available
        });
      } else {
        return Promise.resolve({
          files: [
            {
              id: 'media-3',
              filename: 'image-2.jpg',
              originalName: 'another-image.jpg',
              mimeType: 'image/jpeg',
              size: 2 * 1024 * 1024,
              url: '/api/media/image-2.jpg',
              thumbnailUrl: '/api/media/thumbnails/image-2.jpg',
              uploadedAt: new Date('2025-01-03'),
              metadata: {
                width: 1600,
                height: 900,
                format: 'image/jpeg',
                optimized: true
              }
            },
            {
              id: 'media-4',
              filename: 'image-3.jpg',
              originalName: 'third-image.jpg',
              mimeType: 'image/jpeg',
              size: 3 * 1024 * 1024,
              url: '/api/media/image-3.jpg',
              thumbnailUrl: '/api/media/thumbnails/image-3.jpg',
              uploadedAt: new Date('2025-01-04'),
              metadata: {
                width: 1600,
                height: 900,
                format: 'image/jpeg',
                optimized: true
              }
            }
          ],
          total: 4
        });
      }
    });
    
    render(<MediaGallery onSelect={mockOnSelect} />);
    
    // Wait for initial media files to load
    await waitFor(() => {
      expect(screen.getByText('beautiful-image.jpg')).toBeInTheDocument();
    });
    
    // Should show load more button
    const loadMoreButton = screen.getByText('Load More');
    expect(loadMoreButton).toBeInTheDocument();
    
    // Click load more
    fireEvent.click(loadMoreButton);
    
    // Wait for additional files to load
    await waitFor(() => {
      expect(screen.getByText('another-image.jpg')).toBeInTheDocument();
    });
    
    expect(screen.getByText('third-image.jpg')).toBeInTheDocument();
    expect(screen.getByText('Showing 4 of 4 media files')).toBeInTheDocument();
    
    // Load more button should be gone since we've loaded all files
    expect(screen.queryByText('Load More')).not.toBeInTheDocument();
  });

  it('handles errors when loading media files', async () => {
    // Mock implementation for getMediaFiles that throws an error
    (MediaService.getMediaFiles as jest.Mock).mockRejectedValue(new Error('Failed to load media'));
    
    render(<MediaGallery onSelect={mockOnSelect} />);
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to load media files')).toBeInTheDocument();
    });
    
    // Should show empty state
    expect(screen.getByText('No media files found')).toBeInTheDocument();
  });
});