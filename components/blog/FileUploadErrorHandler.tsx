'use client';

import React from 'react';
import { Upload, AlertCircle, RefreshCw, FileText } from 'lucide-react';

interface FileUploadErrorHandlerProps {
  error: string | null;
  onRetry?: () => void;
  fileName?: string;
  maxSize?: string;
  acceptedTypes?: string[];
}

export const FileUploadErrorHandler: React.FC<FileUploadErrorHandlerProps> = ({
  error,
  onRetry,
  fileName,
  maxSize = '10MB',
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx'],
}) => {
  if (!error) return null;

  const getErrorMessage = () => {
    const errorLower = error.toLowerCase();
    
    if (errorLower.includes('size')) {
      return {
        title: 'File Too Large',
        message: `The file "${fileName}" exceeds the maximum size limit of ${maxSize}. Please choose a smaller file.`,
        icon: 'size',
      };
    }
    
    if (errorLower.includes('type') || errorLower.includes('format')) {
      return {
        title: 'Invalid File Type',
        message: `The file type is not supported. Please upload one of these formats: ${acceptedTypes.join(', ')}.`,
        icon: 'type',
      };
    }
    
    if (errorLower.includes('network') || errorLower.includes('connection')) {
      return {
        title: 'Network Error',
        message: 'There was a problem uploading your file. Please check your connection and try again.',
        icon: 'network',
      };
    }
    
    if (errorLower.includes('server') || errorLower.includes('500')) {
      return {
        title: 'Server Error',
        message: 'Our servers are experiencing issues. Please try again in a few moments.',
        icon: 'server',
      };
    }
    
    return {
      title: 'Upload Failed',
      message: error,
      icon: 'generic',
    };
  };

  const { title, message, icon } = getErrorMessage();

  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-red-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-300 mb-1">{title}</h4>
          <p className="text-sm text-red-200">{message}</p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 inline-flex items-center gap-2 text-sm text-red-300 hover:text-red-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadErrorHandler;