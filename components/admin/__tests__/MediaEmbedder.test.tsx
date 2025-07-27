import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MediaEmbedder from '../MediaEmbedder';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MediaEmbedder Component', () => {
  const mockOnSelectMedia = jest.fn();
  const mockOnClose = jest.fn();
  
  const mockMediaFiles = [
    {
      id: '1',
      filename: 'cosmic-image.jpg',
      originalName: 'cosmic-image.jpg',
      url: 'https://example.com/cosmic-image.jpg',
      thumbnailUrl: 'https://example.com/cosmic-image-thumb.jpg',
      mimeType: 'image/jpeg',
      size: 1024,
      altText: 'A cosmic image',
      caption: 'Beautiful cosmic scene',
      uploadedAt: new Date().toISOString(),
      metadata: {
        width: 800,
        height: 600,
        format: 'jpeg',
        optimized: true,
      },
    },
    {
      id: '2',
      filename: 'cosmic-video.mp4',
      originalName: 'cosmic-video.mp4',
      url: 'https://example.com/cosmic-video.mp4',
      mimeType: 'video/mp4',
      size: 5120,
      uploadedAt: new Date().toISOString(),
      metadata: {
        width: 1280,
        height: 720,
        duration: 30,
        format: 'mp4',
        optimized: true,
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: mockMediaFiles });
  });

  it('renders the media embedder correctly', async () => {
    render(<MediaEmbedder onSelectMedia={mockOnSelectMedia} onClose={mockOnClose} />);
    
    // Check loading state
    expect(screen.getByText('Loading media files...')).toBeInTheDocument();
    
    // Wait for media files to load
    await waitFor(() => {
      expect(screen.getByText('Embed Media')).toBeInTheDocument();
    });
    
    // Check if media files are displayed
    expect(screen.getByText('cosmic-image.jpg')).toBeInTheDocument();
    expect(screen.getByText('cosmic-video.mp4')).toBeInTheDocument();
  });

  it('closes when the close button is clicked', async () => {
    render(<MediaEmbedder onSelectMedia={mockOnSelectMedia} onClose={mockOnClose} />);
    
    // Wait for media files to load
    await waitFor(() => {
      expect(screen.getByText('Embed Media')).toBeInTheDocument();
    });
    
    // Click close button
    fireEvent.click(screen.getByText('✕'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    
    // Click cancel button
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  it('selects a media file when clicked', async () => {
    render(<MediaEmbedder onSelectMedia={mockOnSelectMedia} onClose={mockOnClose} />);
    
    // Wait for media files to load
    await waitFor(() => {
      expect(screen.getByText('cosmic-image.jpg')).toBeInTheDocument();
    });
    
    // Click on a media file
    fireEvent.click(screen.getByText('cosmic-image.jpg'));
    
    expect(mockOnSelectMedia).toHaveBeenCalledWith(mockMediaFiles[0]);
  });

  it('filters media files by search term', async () => {
    render(<MediaEmbedder onSelectMedia={mockOnSelectMedia} onClose={mockOnClose} />);
    
    // Wait for media files to load
    await waitFor(() => {
      expect(screen.getByText('cosmic-image.jpg')).toBeInTheDocument();
    });
    
    // Enter search term
    const searchInput = screen.getByPlaceholderText('Search media...');
    fireEvent.change(searchInput, { target: { value: 'video' } });
    
    // Check if only video is displayed
    expect(screen.queryByText('cosmic-image.jpg')).not.toBeInTheDocument();
    expect(screen.getByText('cosmic-video.mp4')).toBeInTheDocument();
  });

  it('filters media files by type', async () => {
    render(<MediaEmbedder onSelectMedia={mockOnSelectMedia} onClose={mockOnClose} />);
    
    // Wait for media files to load
    await waitFor(() => {
      expect(screen.getByText('cosmic-image.jpg')).toBeInTheDocument();
    });
    
    // Select image type
    const typeSelect = screen.getByRole('combobox');
    fireEvent.change(typeSelect, { target: { value: 'image' } });
    
    // Check if only image is displayed
    expect(screen.getByText('cosmic-image.jpg')).toBeInTheDocument();
    expect(screen.queryByText('cosmic-video.mp4')).not.toBeInTheDocument();
    
    // Select video type
    fireEvent.change(typeSelect, { target: { value: 'video' } });
    
    // Check if only video is displayed
    expect(screen.queryByText('cosmic-image.jpg')).not.toBeInTheDocument();
    expect(screen.getByText('cosmic-video.mp4')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));
    
    render(<MediaEmbedder onSelectMedia={mockOnSelectMedia} onClose={mockOnClose} />);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to load media files')).toBeInTheDocument();
    });
  });

  it('displays no media found message when search has no results', async () => {
    render(<MediaEmbedder onSelectMedia={mockOnSelectMedia} onClose={mockOnClose} />);
    
    // Wait for media files to load
    await waitFor(() => {
      expect(screen.getByText('cosmic-image.jpg')).toBeInTheDocument();
    });
    
    // Enter search term with no matches
    const searchInput = screen.getByPlaceholderText('Search media...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    // Check if no media found message is displayed
    expect(screen.getByText('No media files found')).toBeInTheDocument();
  });
});