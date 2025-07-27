import { MediaFile, MediaMetadata } from '../types/blog';
import { v4 as uuidv4 } from 'uuid';

export interface MediaUploadOptions {
  optimize?: boolean;
  generateThumbnail?: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

export class MediaService {
  /**
   * Process and optimize uploaded media file
   */
  static async processMediaFile(
    file: File,
    metadata: Partial<MediaMetadata>,
    options: MediaUploadOptions = {}
  ): Promise<MediaFile> {
    const id = uuidv4();
    const now = new Date();
    const fileExtension = file.name.split('.').pop() || '';
    const filename = `${id}.${fileExtension}`;
    
    // In a real implementation, this would upload to cloud storage
    // For now, we'll create a mock URL
    const url = `/api/media/${filename}`;
    
    // Generate thumbnail for images and video previews
    let thumbnailUrl: string | undefined;
    if (options.generateThumbnail) {
      if (file.type.startsWith('image/')) {
        thumbnailUrl = `/api/media/thumbnails/${filename}`;
      } else if (file.type.startsWith('video/')) {
        thumbnailUrl = `/api/media/thumbnails/${id}.jpg`;
      }
    }

    // Create the media file object
    const mediaFile: MediaFile = {
      id,
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url,
      thumbnailUrl,
      uploadedAt: now,
      metadata: {
        format: file.type,
        optimized: !!options.optimize,
        ...metadata
      }
    };

    return mediaFile;
  }

  /**
   * Optimize image for web delivery
   * In a real implementation, this would use image processing libraries
   */
  static async optimizeImage(
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1080
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
          
          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          // Draw and resize image on canvas
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with quality setting
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to create blob'));
              }
            },
            file.type,
            0.85 // 85% quality
          );
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate thumbnail for media file
   */
  static async generateThumbnail(
    file: File,
    maxWidth: number = 300,
    maxHeight: number = 300
  ): Promise<Blob> {
    if (file.type.startsWith('image/')) {
      // For images, just resize
      return this.optimizeImage(file, maxWidth, maxHeight);
    } else if (file.type.startsWith('video/')) {
      // For videos, extract a frame
      return new Promise((resolve, reject) => {
        try {
          const video = document.createElement('video');
          video.onloadeddata = () => {
            // Seek to 1 second or video duration midpoint
            video.currentTime = Math.min(1, video.duration / 2);
          };
          
          video.onseeked = () => {
            // Create canvas and draw video frame
            const canvas = document.createElement('canvas');
            canvas.width = Math.min(video.videoWidth, maxWidth);
            canvas.height = Math.min(video.videoHeight, maxHeight);
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Could not get canvas context'));
              return;
            }
            
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert to blob
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Failed to create thumbnail'));
                }
              },
              'image/jpeg',
              0.85
            );
          };
          
          video.onerror = () => reject(new Error('Failed to load video'));
          video.src = URL.createObjectURL(file);
        } catch (error) {
          reject(error);
        }
      });
    }
    
    throw new Error('Unsupported file type for thumbnail generation');
  }

  /**
   * Delete media file
   */
  static async deleteMediaFile(mediaId: string): Promise<boolean> {
    try {
      // In a real implementation, this would delete from cloud storage
      const response = await fetch(`/api/admin/media/${mediaId}`, {
        method: 'DELETE',
      });
      
      return response.ok;
    } catch (error) {
      console.error('Delete media error:', error);
      return false;
    }
  }

  /**
   * Get all media files with optional filtering
   */
  static async getMediaFiles(
    type?: 'image' | 'video' | 'all',
    limit: number = 20,
    offset: number = 0
  ): Promise<{ files: MediaFile[], total: number }> {
    try {
      // In a real implementation, this would fetch from an API
      const queryParams = new URLSearchParams({
        type: type || 'all',
        limit: limit.toString(),
        offset: offset.toString(),
      });
      
      const response = await fetch(`/api/admin/media?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch media files');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get media files error:', error);
      return { files: [], total: 0 };
    }
  }
}