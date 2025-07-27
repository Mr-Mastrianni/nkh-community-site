'use client';

import React from 'react';
import ErrorMessage from './ErrorMessage';

interface FileUploadErrorProps {
  error: Error;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  onRetry?: () => void;
  onSelectDifferentFile?: () => void;
  onDismiss?: () => void;
}

const FileUploadError: React.FC<FileUploadErrorProps> = ({
  error,
  fileName,
  fileSize,
  fileType,
  onRetry,
  onSelectDifferentFile,
  onDismiss
}) => {
  const getErrorDetails = () => {
    const details = [];
    if (fileName) details.push(`File: ${fileName}`);
    if (fileSize) details.push(`Size: ${(fileSize / (1024 * 1024)).toFixed(2)} MB`);
    if (fileType) details.push(`Type: ${fileType}`);
    return details.join('\n');
  };

  const getErrorMessage = () => {
    const message = error.message.toLowerCase();
    
    if (message.includes('file too large') || message.includes('size')) {
      return {
        title: 'File Too Large',
        message: 'The selected file exceeds the maximum allowed size. Please choose a smaller file or compress the current one.',
        suggestions: [
          'Compress your image using online tools',
          'Reduce video quality or duration',
          'Choose a different file format'
        ]
      };
    }
    
    if (message.includes('invalid') || message.includes('format') || message.includes('type')) {
      return {
        title: 'Invalid File Format',
        message: 'The selected file format is not supported. Please choose a supported file type.',
        suggestions: [
          'Use JPG, PNG, WebP, or GIF for images',
          'Use MP4 or WebM for videos',
          'Convert your file to a supported format'
        ]
      };
    }
    
    if (message.includes('network') || message.includes('connection')) {
      return {
        title: 'Network Error',
        message: 'Upload failed due to a network issue. Please check your connection and try again.',
        suggestions: [
          'Check your internet connection',
          'Try uploading a smaller file first',
          'Wait a moment and retry'
        ]
      };
    }
    
    if (message.includes('server') || message.includes('500')) {
      return {
        title: 'Server Error',
        message: 'The server encountered an error while processing your upload. Please try again later.',
        suggestions: [
          'Wait a few minutes and try again',
          'Try uploading a different file',
          'Contact support if the issue persists'
        ]
      };
    }
    
    return {
      title: 'Upload Failed',
      message: 'An unexpected error occurred during file upload.',
      suggestions: [
        'Try uploading the file again',
        'Check if the file is corrupted',
        'Try a different file'
      ]
    };
  };

  const errorInfo = getErrorMessage();
  
  const actions = [
    ...(onRetry ? [{
      label: 'Retry Upload',
      onClick: onRetry,
      variant: 'primary' as const
    }] : []),
    ...(onSelectDifferentFile ? [{
      label: 'Choose Different File',
      onClick: onSelectDifferentFile,
      variant: 'secondary' as const
    }] : [])
  ];

  return (
    <div className="space-y-4">
      <ErrorMessage
        title={errorInfo.title}
        message={errorInfo.message}
        details={getErrorDetails()}
        onDismiss={onDismiss}
        variant="error"
        actions={actions}
      />
      
      {errorInfo.suggestions.length > 0 && (
        <div className="cosmic-card p-4 bg-cosmic-teal/10 border border-cosmic-teal/30">
          <h4 className="text-cosmic-teal font-semibold mb-2 flex items-center gap-2">
            <i className="fas fa-lightbulb"></i>
            Suggestions
          </h4>
          <ul className="text-cosmic-light/80 text-sm space-y-1">
            {errorInfo.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <i className="fas fa-arrow-right text-cosmic-teal text-xs mt-1 flex-shrink-0"></i>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploadError;