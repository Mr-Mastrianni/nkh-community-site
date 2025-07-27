import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MediaUploader from '../MediaUploader';
import { MediaModel } from '@/lib/models/BlogModel';

// Mock the MediaModel
jest.mock('@/lib/models/BlogModel', () => ({
  MediaModel: {
    validateMediaFile: jest.fn(),
    generateMediaMetadata: jest.fn()
  }
}));

// Mock fetch
global.fetch = jest.fn();

describe('MediaUploader Component', () => {
  const mockOnUpload = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock implementation for validateMediaFile
    (MediaModel.validateMediaFile as jest.Mock).mockImplementation((file) => {
      if (file.type === 'invalid/type') {
        return ['File type not supported'];
      }
      if (file.size > 10 * 1024 * 1024) {
        return ['File size too large'];
      }
      return [];
    });
    
    // Mock implementation for generateMediaMetadata
    (MediaModel.generateMediaMetadata as jest.Mock).mockResolvedValue({
      metadata: {
        width: 1920,
        height: 1080,
        format: 'image/jpeg',
        optimized: false
      }
    });
    
    // Mock fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        id: 'test-id',
        filename: 'test-file.jpg',
        originalName: 'test-file.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        url: '/api/media/test-file.jpg',
        uploadedAt: new Date(),
        metadata: {
          width: 1920,
          height: 1080,
          format: 'image/jpeg',
          optimized: true
        }
      })
    });
  });

  it('renders the uploader component correctly', () => {
    render(<MediaUploader onUpload={mockOnUpload} />);
    
    expect(screen.getByText('Upload Media Files')).toBeInTheDocument();
    expect(screen.getByText(/Drag and drop files here/i)).toBeInTheDocument();
  });

  it('shows drag active state when dragging over', () => {
    render(<MediaUploader onUpload={mockOnUpload} />);
    
    const dropzone = screen.getByText(/Upload Media Files/i).closest('div');
    expect(dropzone).not.toBeNull();
    
    if (dropzone) {
      fireEvent.dragEnter(dropzone);
      expect(screen.getByText('Drop files here')).toBeInTheDocument();
      
      fireEvent.dragLeave(dropzone);
      expect(screen.getByText('Upload Media Files')).toBeInTheDocument();
    }
  });

  it('validates files and shows errors for invalid files', async () => {
    render(<MediaUploader onUpload={mockOnUpload} />);
    
    const file = new File(['test content'], 'test.xyz', { type: 'invalid/type' });
    const dataTransfer = {
      files: [file],
      items: [{ kind: 'file', type: file.type, getAsFile: () => file }],
      types: ['Files']
    };
    
    const dropzone = screen.getByText(/Upload Media Files/i).closest('div');
    expect(dropzone).not.toBeNull();
    
    if (dropzone) {
      fireEvent.drop(dropzone, { dataTransfer });
      
      await waitFor(() => {
        expect(screen.getByText(/File type not supported/i)).toBeInTheDocument();
      });
      
      expect(mockOnUpload).not.toHaveBeenCalled();
    }
  });

  it('uploads valid files and calls onUpload callback', async () => {
    render(<MediaUploader onUpload={mockOnUpload} />);
    
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const dataTransfer = {
      files: [file],
      items: [{ kind: 'file', type: file.type, getAsFile: () => file }],
      types: ['Files']
    };
    
    const dropzone = screen.getByText(/Upload Media Files/i).closest('div');
    expect(dropzone).not.toBeNull();
    
    if (dropzone) {
      fireEvent.drop(dropzone, { dataTransfer });
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/admin/media/upload', expect.any(Object));
      });
      
      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalledWith(expect.objectContaining({
          id: 'test-id',
          filename: 'test-file.jpg'
        }));
      });
    }
  });

  it('handles file input change', async () => {
    render(<MediaUploader onUpload={mockOnUpload} />);
    
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]');
    expect(input).not.toBeNull();
    
    if (input) {
      Object.defineProperty(input, 'files', {
        value: [file]
      });
      
      fireEvent.change(input);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/admin/media/upload', expect.any(Object));
      });
      
      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalledWith(expect.objectContaining({
          id: 'test-id',
          filename: 'test-file.jpg'
        }));
      });
    }
  });

  it('handles upload failure gracefully', async () => {
    // Mock fetch to return an error
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'Upload failed' })
    });
    
    render(<MediaUploader onUpload={mockOnUpload} />);
    
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const dataTransfer = {
      files: [file],
      items: [{ kind: 'file', type: file.type, getAsFile: () => file }],
      types: ['Files']
    };
    
    const dropzone = screen.getByText(/Upload Media Files/i).closest('div');
    expect(dropzone).not.toBeNull();
    
    if (dropzone) {
      fireEvent.drop(dropzone, { dataTransfer });
      
      await waitFor(() => {
        expect(screen.getByText(/Upload failed/i)).toBeInTheDocument();
      });
      
      expect(mockOnUpload).not.toHaveBeenCalled();
    }
  });
});