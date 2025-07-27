'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { MediaFile } from '@/lib/types/blog';
import { Permission } from '@/lib/types/blog';
import MediaUploader from '@/components/admin/MediaUploader';
import MediaGallery from '@/components/admin/MediaGallery';
import { MediaService } from '@/lib/services/mediaService';

const MediaManagerPage = () => {
  const { user, loading, hasPermission } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push('/admin/login');
    }
    
    // If user doesn't have permission, redirect to dashboard
    if (!loading && user && !hasPermission(Permission.MANAGE_MEDIA)) {
      router.push('/admin/dashboard');
    }
  }, [user, loading, router, hasPermission]);

  // Reset form when selected media changes
  useEffect(() => {
    if (selectedMedia) {
      setAltText(selectedMedia.altText || '');
      setCaption(selectedMedia.caption || '');
      setIsEditing(false);
      setUpdateSuccess(false);
      setUpdateError(null);
      setDeleteConfirm(false);
    }
  }, [selectedMedia]);

  // Handle media selection
  const handleMediaSelect = (media: MediaFile) => {
    setSelectedMedia(media);
  };

  // Handle media upload
  const handleMediaUpload = (media: MediaFile) => {
    // Switch to gallery tab after upload
    setActiveTab('gallery');
    // Select the newly uploaded media
    setSelectedMedia(media);
  };

  // Handle media update
  const handleUpdateMedia = async () => {
    if (!selectedMedia) return;
    
    try {
      setUpdateError(null);
      setUpdateSuccess(false);
      
      // In a real implementation, this would call the API
      const response = await fetch(`/api/admin/media/${selectedMedia.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          altText,
          caption,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update media');
      }
      
      const updatedMedia = await response.json();
      setSelectedMedia(updatedMedia);
      setIsEditing(false);
      setUpdateSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Media update error:', error);
      setUpdateError('Failed to update media details');
    }
  };

  // Handle media delete
  const handleDeleteMedia = async () => {
    if (!selectedMedia) return;
    
    try {
      setUpdateError(null);
      
      const success = await MediaService.deleteMediaFile(selectedMedia.id);
      
      if (!success) {
        throw new Error('Failed to delete media');
      }
      
      // Reset selected media and refresh gallery
      setSelectedMedia(null);
      setDeleteConfirm(false);
      
      // Force gallery refresh by changing the key
      setActiveTab('gallery');
    } catch (error) {
      console.error('Media delete error:', error);
      setUpdateError('Failed to delete media file');
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="cosmic-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spiritual-gold mx-auto"></div>
          <p className="mt-4 text-cosmic-light">Loading media manager...</p>
        </div>
      </div>
    );
  }

  // If no user and not loading, don't render anything (will redirect)
  if (!user || !hasPermission(Permission.MANAGE_MEDIA)) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="cosmic-card p-6">
        <h1 className="text-2xl font-bold text-3d mb-4">Media Library</h1>
        <p className="text-cosmic-light/80">Manage your images and videos for blog posts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2 cosmic-card p-6">
          {/* Tabs */}
          <div className="flex border-b border-cosmic-light/20 mb-6">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 -mb-px ${
                activeTab === 'gallery'
                  ? 'border-b-2 border-spiritual-gold text-spiritual-gold'
                  : 'text-cosmic-light/70 hover:text-cosmic-light'
              }`}
            >
              <i className="fas fa-images mr-2"></i>
              Media Gallery
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 -mb-px ${
                activeTab === 'upload'
                  ? 'border-b-2 border-spiritual-gold text-spiritual-gold'
                  : 'text-cosmic-light/70 hover:text-cosmic-light'
              }`}
            >
              <i className="fas fa-cloud-upload-alt mr-2"></i>
              Upload Media
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'gallery' ? (
            <MediaGallery
              onSelect={handleMediaSelect}
              selectedId={selectedMedia?.id}
              type="all"
            />
          ) : (
            <MediaUploader onUpload={handleMediaUpload} multiple={true} />
          )}
        </div>

        {/* Sidebar - Media details */}
        <div className="cosmic-card p-6">
          {selectedMedia ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-cosmic-light">Media Details</h2>
              
              {/* Preview */}
              <div className="aspect-video bg-cosmic-deep/50 rounded-lg overflow-hidden">
                {selectedMedia.mimeType.startsWith('image/') ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.altText || selectedMedia.originalName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video
                    src={selectedMedia.url}
                    controls
                    className="w-full h-full"
                    poster={selectedMedia.thumbnailUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              
              {/* File info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-cosmic-light/70">Filename:</span>
                  <span className="text-cosmic-light">{selectedMedia.originalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-light/70">Type:</span>
                  <span className="text-cosmic-light">{selectedMedia.mimeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-light/70">Size:</span>
                  <span className="text-cosmic-light">{formatFileSize(selectedMedia.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-light/70">Dimensions:</span>
                  <span className="text-cosmic-light">
                    {selectedMedia.metadata.width} × {selectedMedia.metadata.height}
                    {selectedMedia.metadata.duration ? ` (${Math.floor(selectedMedia.metadata.duration)}s)` : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-light/70">Uploaded:</span>
                  <span className="text-cosmic-light">
                    {new Date(selectedMedia.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {/* Editable fields */}
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="altText" className="block text-sm text-cosmic-light/70 mb-1">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      id="altText"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      className="w-full bg-cosmic-deep/50 border border-cosmic-light/20 rounded-lg px-3 py-2 text-cosmic-light focus:outline-none focus:border-spiritual-gold"
                      placeholder="Describe the image for accessibility"
                    />
                  </div>
                  <div>
                    <label htmlFor="caption" className="block text-sm text-cosmic-light/70 mb-1">
                      Caption
                    </label>
                    <textarea
                      id="caption"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full bg-cosmic-deep/50 border border-cosmic-light/20 rounded-lg px-3 py-2 text-cosmic-light focus:outline-none focus:border-spiritual-gold"
                      placeholder="Add a caption for this media"
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUpdateMedia}
                      className="cosmic-button flex-1"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setAltText(selectedMedia.altText || '');
                        setCaption(selectedMedia.caption || '');
                      }}
                      className="px-4 py-2 bg-cosmic-deep/50 text-cosmic-light rounded-lg hover:bg-cosmic-deep/70 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm text-cosmic-light/70">Alt Text</h3>
                    <p className="text-cosmic-light">
                      {selectedMedia.altText || <span className="text-cosmic-light/50 italic">No alt text</span>}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-cosmic-light/70">Caption</h3>
                    <p className="text-cosmic-light">
                      {selectedMedia.caption || <span className="text-cosmic-light/50 italic">No caption</span>}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Success/Error messages */}
              {updateSuccess && (
                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 text-sm">
                    <i className="fas fa-check-circle mr-2"></i>
                    Media details updated successfully
                  </p>
                </div>
              )}
              
              {updateError && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {updateError}
                  </p>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex space-x-2 pt-2">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="cosmic-button flex-1"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Edit Details
                  </button>
                )}
                
                {!isEditing && !deleteConfirm && (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <i className="fas fa-trash-alt mr-2"></i>
                    Delete
                  </button>
                )}
                
                {deleteConfirm && (
                  <div className="flex space-x-2 w-full">
                    <button
                      onClick={handleDeleteMedia}
                      className="px-4 py-2 bg-red-500/50 text-cosmic-light rounded-lg hover:bg-red-500/70 transition-colors"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(false)}
                      className="px-4 py-2 bg-cosmic-deep/50 text-cosmic-light rounded-lg hover:bg-cosmic-deep/70 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              
              {/* Copy URL button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedMedia.url);
                    // Show a temporary tooltip or notification
                    alert('URL copied to clipboard');
                  }}
                  className="w-full px-4 py-2 bg-cosmic-deep/50 text-cosmic-light rounded-lg hover:bg-cosmic-deep/70 transition-colors"
                >
                  <i className="fas fa-link mr-2"></i>
                  Copy Media URL
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-photo-video text-4xl text-cosmic-light/30 mb-4"></i>
              <p className="text-cosmic-light/70">Select a media file to view details</p>
              <button
                onClick={() => setActiveTab('upload')}
                className="mt-4 cosmic-button text-sm"
              >
                <i className="fas fa-cloud-upload-alt mr-2"></i>
                Upload New Media
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaManagerPage;