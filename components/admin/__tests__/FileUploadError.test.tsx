import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUploadError from '../FileUploadError';

describe('FileUploadError', () => {
  const defaultProps = {
    error: new Error('Upload failed'),
    fileName: 'test-image.jpg',
    fileSize: 5 * 1024 * 1024, // 5MB
    fileType: 'image/jpeg'
  };

  it('renders basic file upload error', () => {
    render(<FileUploadError {...defaultProps} />);
    
    expect(screen.getByText('Upload Failed')).toBeInTheDocument();
    expect(screen.getByText(/An unexpected error occurred during file upload/)).toBeInTheDocument();
  });

  it('detects file size errors and shows appropriate message', () => {
    const error = new Error('File too large');
    render(<FileUploadError {...defaultProps} error={error} />);
    
    expect(screen.getByText('File Too Large')).toBeInTheDocument();
    expect(screen.getByText(/exceeds the maximum allowed size/)).toBeInTheDocument();
  });

  it('detects invalid format errors and shows appropriate message', () => {
    const error = new Error('Invalid file format');
    render(<FileUploadError {...defaultProps} error={error} />);
    
    expect(screen.getByText('Invalid File Format')).toBeInTheDocument();
    expect(screen.getByText(/file format is not supported/)).toBeInTheDocument();
  });

  it('detects network errors and shows appropriate message', () => {
    const error = new Error('Network connection failed');
    render(<FileUploadError {...defaultProps} error={error} />);
    
    expect(screen.getByText('Network Error')).toBeInTheDocument();
    expect(screen.getByText(/network issue/)).toBeInTheDocument();
  });

  it('detects server errors and shows appropriate message', () => {
    const error = new Error('Server error 500');
    render(<FileUploadError {...defaultProps} error={error} />);
    
    expect(screen.getByText('Server Error')).toBeInTheDocument();
    expect(screen.getByText(/server encountered an error/)).toBeInTheDocument();
  });

  it('displays file details when provided', () => {
    render(<FileUploadError {...defaultProps} />);
    
    // Click to expand technical details
    const detailsButton = screen.getByText('Show technical details');
    fireEvent.click(detailsButton);
    
    expect(screen.getByText(/File: test-image.jpg/)).toBeInTheDocument();
    expect(screen.getByText(/Size: 5.00 MB/)).toBeInTheDocument();
    expect(screen.getByText(/Type: image\/jpeg/)).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    render(<FileUploadError {...defaultProps} onRetry={onRetry} />);
    
    const retryButton = screen.getByText('Retry Upload');
    fireEvent.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('calls onSelectDifferentFile when choose different file button is clicked', () => {
    const onSelectDifferentFile = jest.fn();
    render(<FileUploadError {...defaultProps} onSelectDifferentFile={onSelectDifferentFile} />);
    
    const selectButton = screen.getByText('Choose Different File');
    fireEvent.click(selectButton);
    
    expect(onSelectDifferentFile).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = jest.fn();
    render(<FileUploadError {...defaultProps} onDismiss={onDismiss} />);
    
    const dismissButton = screen.getByText('Dismiss');
    fireEvent.click(dismissButton);
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('shows suggestions for file size errors', () => {
    const error = new Error('File too large');
    render(<FileUploadError {...defaultProps} error={error} />);
    
    expect(screen.getByText('Suggestions')).toBeInTheDocument();
    expect(screen.getByText(/Compress your image using online tools/)).toBeInTheDocument();
    expect(screen.getByText(/Reduce video quality or duration/)).toBeInTheDocument();
  });

  it('shows suggestions for format errors', () => {
    const error = new Error('Invalid format');
    render(<FileUploadError {...defaultProps} error={error} />);
    
    expect(screen.getByText('Suggestions')).toBeInTheDocument();
    expect(screen.getByText(/Use JPG, PNG, WebP, or GIF for images/)).toBeInTheDocument();
    expect(screen.getByText(/Use MP4 or WebM for videos/)).toBeInTheDocument();
  });

  it('shows suggestions for network errors', () => {
    const error = new Error('Network failed');
    render(<FileUploadError {...defaultProps} error={error} />);
    
    expect(screen.getByText('Suggestions')).toBeInTheDocument();
    expect(screen.getByText(/Check your internet connection/)).toBeInTheDocument();
    expect(screen.getByText(/Try uploading a smaller file first/)).toBeInTheDocument();
  });

  it('shows suggestions for server errors', () => {
    const error = new Error('Server error');
    render(<FileUploadError {...defaultProps} error={error} />);
    
    expect(screen.getByText('Suggestions')).toBeInTheDocument();
    expect(screen.getByText(/Wait a few minutes and try again/)).toBeInTheDocument();
    expect(screen.getByText(/Contact support if the issue persists/)).toBeInTheDocument();
  });

  it('renders without optional props', () => {
    const minimalProps = {
      error: new Error('Test error')
    };
    
    render(<FileUploadError {...minimalProps} />);
    
    expect(screen.getByText('Upload Failed')).toBeInTheDocument();
    expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
  });
});