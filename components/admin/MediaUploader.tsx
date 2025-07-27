'use client';

import { useState, useRef, useCallback } from 'react';
import { MediaFile } from '@/lib/types/blog';
import { MediaModel } from '@/lib/models/BlogModel';
import CosmicLoadingSpinner from './CosmicLoadingSpinner';
import FileUploadError from './FileUploadError';
import NetworkErrorHandler from './NetworkErrorHandler';

interface MediaUploaderProps {
  onUpload: (media: MediaFile) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  multiple?: boolean;
}

const MediaUploader = ({
  onUpload,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'],
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false
}: MediaUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  // Process files for upload
  const processFiles = useCallback(async (files: FileList) => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    // Convert FileList to array for easier processing
    const fileArray = Array.from(files);
    
    // Validate files
    for (const file of fileArray) {
      const errors = MediaModel.validateMediaFile(file);
      
      if (errors.length > 0) {
        setError(new Error(errors.join(', ')));
        setCurrentFile(file);
        setIsUploading(false);
        return;
      }
    }

    // Process files one by one
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      
      try {
        // Generate metadata for the file
        const mediaMetadata = await MediaModel.generateMediaMetadata(file);
        
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const newProgress = prev + 5;
            if (newProgress >= 90) {
              clearInterval(progressInterval);
            }
            return Math.min(newProgress, 90);
          });
        }, 100);

        // Upload file to server
        const formData = new FormData();
        formData.append('file', file);
        formData.append('metadata', JSON.stringify(mediaMetadata));

        const response = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Upload failed');
        }

        const mediaFile: MediaFile = await response.json();
        
        // Set progress to 100% when complete
        setUploadProgress(100);
        
        // Call the onUpload callback with the uploaded file
        onUpload(mediaFile);
        
        // Reset progress after a short delay
        setTimeout(() => {
          setUploadProgress(0);
          setIsUploading(false);
        }, 1000);
      } catch (err) {
        console.error('Upload error:', err);
        setError(err instanceof Error ? err : new Error('Upload failed'));
        setCurrentFile(file);
        setIsUploading(false);
      }
    }
  }, [onUpload]);

  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = e.dataTransfer.files;
      if (!multiple && files.length > 1) {
        setError(new Error('Only one file can be uploaded at a time'));
        return;
      }
      processFiles(files);
    }
  }, [multiple, processFiles]);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      if (!multiple && files.length > 1) {
        setError(new Error('Only one file can be uploaded at a time'));
        return;
      }
      processFiles(files);
    }
  }, [multiple, processFiles]);

  // Trigger file input click
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptedTypes.join(',')}
        multiple={multiple}
        onChange={handleFileInputChange}
      />

      {/* Drag and drop area */}
      <div
        className={`cosmic-card p-8 border-2 border-dashed transition-all duration-300 ${
          isDragging 
            ? 'border-spiritual-gold bg-cosmic-deep/70' 
            : 'border-cosmic-light/30 hover:border-cosmic-light/50'
        } rounded-lg cursor-pointer text-center`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spiritual-gold"></div>
            </div>
            <p className="text-cosmic-light">Uploading...</p>
            <div className="w-full bg-cosmic-deep/50 rounded-full h-2.5">
              <div 
                className="bg-spiritual-gold h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-cosmic-light/70 text-sm">{uploadProgress}%</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-cosmic-deep/70 flex items-center justify-center">
                <i className="fas fa-cloud-upload-alt text-3xl text-spiritual-gold"></i>
              </div>
            </div>
            <h3 className="text-xl font-bold text-cosmic-light mb-2">
              {isDragging ? 'Drop files here' : 'Upload Media Files'}
            </h3>
            <p className="text-cosmic-light/70 mb-4">
              Drag and drop files here, or click to select files
            </p>
            <p className="text-cosmic-light/50 text-sm">
              Accepted formats: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
            </p>
            <p className="text-cosmic-light/50 text-sm">
              Maximum size: {maxSize / (1024 * 1024)}MB
            </p>
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4">
          <FileUploadError
            error={error}
            fileName={currentFile?.name}
            fileSize={currentFile?.size}
            fileType={currentFile?.type}
            onRetry={() => {
              if (currentFile) {
                const fileList = new DataTransfer();
                fileList.items.add(currentFile);
                processFiles(fileList.files);
              }
            }}
            onSelectDifferentFile={() => {
              setError(null);
              setCurrentFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
            onDismiss={() => {
              setError(null);
              setCurrentFile(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MediaUploader;