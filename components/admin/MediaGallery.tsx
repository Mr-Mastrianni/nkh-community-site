'use client';

import { useState, useEffect, useCallback } from 'react';
import { MediaFile } from '@/lib/types/blog';
import { MediaService } from '@/lib/services/mediaService';

interface MediaGalleryProps {
  onSelect?: (media: MediaFile) => void;
  selectedId?: string;
  type?: 'image' | 'video' | 'all';
  maxItems?: number;
  selectable?: boolean;
}

const MediaGallery = ({
  onSelect,
  selectedId,
  type = 'all',
  maxItems = 50,
  selectable = true
}: MediaGalleryProps) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<string | undefined>(selectedId);
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video'>(type);

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Load media files
  const loadMediaFiles = useCallback(async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const newOffset = reset ? 0 : offset;
      const result = await MediaService.getMediaFiles(
        activeFilter,
        20,
        newOffset
      );
      
      setMediaFiles(prev => reset ? result.files : [...prev, ...result.files]);
      setTotalCount(result.total);
      setHasMore(newOffset + result.files.length < result.total);
      setOffset(newOffset + result.files.length);
    } catch (err) {
      setError('Failed to load media files');
      console.error('Media gallery error:', err);
    } finally {
      setLoading(false);
    }
  }, [offset, activeFilter]);

  // Initial load
  useEffect(() => {
    loadMediaFiles(true);
  }, [activeFilter]);

  // Handle media selection
  const handleSelect = (media: MediaFile) => {
    if (!selectable) return;
    
    setSelectedMedia(media.id);
    if (onSelect) {
      onSelect(media);
    }
  };

  // Handle filter change
  const handleFilterChange = (filter: 'all' | 'image' | 'video') => {
    setActiveFilter(filter);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadMediaFiles();
    }
  };

  return (
    <div className="w-full">
      {/* Filter tabs */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === 'all'
              ? 'bg-spiritual-purple text-cosmic-light'
              : 'bg-cosmic-deep/50 text-cosmic-light/70 hover:bg-cosmic-deep/70'
          }`}
        >
          All Media
        </button>
        <button
          onClick={() => handleFilterChange('image')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === 'image'
              ? 'bg-spiritual-purple text-cosmic-light'
              : 'bg-cosmic-deep/50 text-cosmic-light/70 hover:bg-cosmic-deep/70'
          }`}
        >
          Images
        </button>
        <button
          onClick={() => handleFilterChange('video')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === 'video'
              ? 'bg-spiritual-purple text-cosmic-light'
              : 'bg-cosmic-deep/50 text-cosmic-light/70 hover:bg-cosmic-deep/70'
          }`}
        >
          Videos
        </button>
      </div>

      {/* Media grid */}
      {mediaFiles.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaFiles.map((media) => (
            <div
              key={media.id}
              onClick={() => handleSelect(media)}
              className={`cosmic-card p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedMedia === media.id
                  ? 'ring-2 ring-spiritual-gold scale-[1.02]'
                  : 'hover:scale-[1.01]'
              }`}
            >
              {/* Thumbnail */}
              <div className="aspect-square relative overflow-hidden rounded-md bg-cosmic-deep/50">
                {media.mimeType.startsWith('image/') ? (
                  <img
                    src={media.thumbnailUrl || media.url}
                    alt={media.altText || media.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full relative">
                    <img
                      src={media.thumbnailUrl || '/images/video-placeholder.jpg'}
                      alt={media.altText || media.originalName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-cosmic-deep/70 flex items-center justify-center">
                        <i className="fas fa-play text-spiritual-gold"></i>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* File type indicator */}
                <div className="absolute top-2 right-2 bg-cosmic-deep/70 text-cosmic-light text-xs px-2 py-1 rounded">
                  {media.mimeType.split('/')[1].toUpperCase()}
                </div>
              </div>
              
              {/* File info */}
              <div className="mt-2 px-1">
                <p className="text-cosmic-light text-sm truncate" title={media.originalName}>
                  {media.originalName}
                </p>
                <div className="flex justify-between items-center mt-1 text-xs text-cosmic-light/70">
                  <span>{formatFileSize(media.size)}</span>
                  <span>{formatDate(media.uploadedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="cosmic-card p-8 text-center">
          {loading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spiritual-gold mx-auto"></div>
          ) : (
            <>
              <i className="fas fa-photo-video text-4xl text-cosmic-light/30 mb-4"></i>
              <p className="text-cosmic-light/70">No media files found</p>
            </>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </p>
        </div>
      )}

      {/* Load more button */}
      {hasMore && mediaFiles.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="cosmic-button px-6 py-2"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Loading...
              </>
            ) : (
              <>
                <i className="fas fa-plus-circle mr-2"></i>
                Load More
              </>
            )}
          </button>
        </div>
      )}

      {/* Total count */}
      {mediaFiles.length > 0 && (
        <div className="mt-4 text-center text-sm text-cosmic-light/70">
          Showing {mediaFiles.length} of {totalCount} media files
        </div>
      )}
    </div>
  );
};

export default MediaGallery;