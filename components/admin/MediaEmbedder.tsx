'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface MediaEmbedderProps {
  onSelectMedia: (media: MediaFile) => void;
  onClose: () => void;
}

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  altText?: string;
  caption?: string;
}

const MediaEmbedder: React.FC<MediaEmbedderProps> = ({ onSelectMedia, onClose }) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would fetch from your API
        const response = await axios.get('/api/admin/media');
        setMediaFiles(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load media files');
        console.error('Error fetching media:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const filteredMedia = mediaFiles.filter((media) => {
    const matchesSearch = media.filename.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (media.altText && media.altText.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || 
                       (selectedType === 'image' && media.mimeType.startsWith('image/')) ||
                       (selectedType === 'video' && media.mimeType.startsWith('video/'));
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-lg border border-purple-500 border-opacity-20 shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-purple-500 border-opacity-20 flex justify-between items-center">
          <h2 className="text-xl font-bold text-purple-300">Embed Media</h2>
          <button 
            onClick={onClose}
            className="text-purple-300 hover:text-purple-100"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 border-b border-purple-500 border-opacity-20 flex flex-wrap gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search media..."
              className="w-full p-2 bg-purple-900 bg-opacity-30 border border-purple-300 border-opacity-30 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="p-2 bg-purple-900 bg-opacity-30 border border-purple-300 border-opacity-30 rounded-md"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Media</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
            </select>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-140px)]">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="text-purple-300">Loading media files...</div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center p-4">{error}</div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-purple-300 text-center p-4">No media files found</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.map((media) => (
                <div 
                  key={media.id}
                  className="group cursor-pointer border border-purple-500 border-opacity-0 hover:border-opacity-50 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105"
                  onClick={() => onSelectMedia(media)}
                >
                  {media.mimeType.startsWith('image/') ? (
                    <div className="aspect-w-16 aspect-h-9 bg-purple-900 bg-opacity-30">
                      <img 
                        src={media.thumbnailUrl || media.url} 
                        alt={media.altText || media.filename}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : media.mimeType.startsWith('video/') ? (
                    <div className="aspect-w-16 aspect-h-9 bg-purple-900 bg-opacity-30 flex items-center justify-center">
                      <div className="text-purple-300 text-4xl">▶</div>
                    </div>
                  ) : (
                    <div className="aspect-w-16 aspect-h-9 bg-purple-900 bg-opacity-30 flex items-center justify-center">
                      <div className="text-purple-300">File</div>
                    </div>
                  )}
                  <div className="p-2 text-sm truncate text-purple-200">{media.filename}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-purple-500 border-opacity-20 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaEmbedder;