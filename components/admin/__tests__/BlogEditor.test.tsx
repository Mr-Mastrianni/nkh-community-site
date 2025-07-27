import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BlogEditor from '../BlogEditor';
import '@testing-library/jest-dom';
import { BlogPost, PostStatus } from '../../../lib/types/blog';

// Mock the TipTap editor
jest.mock('@tiptap/react', () => {
  return {
    useEditor: () => ({
      chain: () => ({
        focus: () => ({
          toggleHeading: () => ({
            run: jest.fn(),
          }),
          toggleBold: () => ({
            run: jest.fn(),
          }),
          toggleItalic: () => ({
            run: jest.fn(),
          }),
          toggleUnderline: () => ({
            run: jest.fn(),
          }),
          toggleBulletList: () => ({
            run: jest.fn(),
          }),
          toggleOrderedList: () => ({
            run: jest.fn(),
          }),
          setLink: () => ({
            run: jest.fn(),
          }),
          setImage: () => ({
            run: jest.fn(),
          }),
          insertContent: () => ({
            run: jest.fn(),
          }),
        }),
      }),
      isActive: () => false,
      getHTML: () => '<p>Test content</p>',
      on: jest.fn(),
      off: jest.fn(),
    }),
    EditorContent: ({ className }: { className: string }) => (
      <div data-testid="editor-content" className={className}>
        Editor Content
      </div>
    ),
    BubbleMenu: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="bubble-menu">{children}</div>
    ),
    FloatingMenu: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="floating-menu">{children}</div>
    ),
  };
});

// Mock MediaEmbedder component
jest.mock('../MediaEmbedder', () => {
  return function MockMediaEmbedder({ onSelectMedia, onClose }: any) {
    return (
      <div data-testid="media-embedder">
        <button 
          data-testid="select-media-button" 
          onClick={() => onSelectMedia({
            id: '1',
            filename: 'test-image.jpg',
            url: 'https://example.com/test-image.jpg',
            mimeType: 'image/jpeg',
          })}
        >
          Select Media
        </button>
        <button data-testid="close-media-button" onClick={onClose}>
          Close
        </button>
      </div>
    );
  };
});

// Mock BlogMetadataForm component
jest.mock('../BlogMetadataForm', () => {
  return function MockBlogMetadataForm({ post, onSave }: any) {
    return (
      <div data-testid="blog-metadata-form">
        <button 
          data-testid="save-metadata-button" 
          onClick={() => onSave({
            title: 'Updated Title',
            excerpt: 'Updated excerpt',
            tags: ['tag1', 'tag2'],
            status: PostStatus.PUBLISHED
          })}
        >
          Save Metadata
        </button>
      </div>
    );
  };
});

// Mock lodash debounce to execute immediately in tests
jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  debounce: (fn: Function) => fn,
}));

describe('BlogEditor Component', () => {
  const mockOnSave = jest.fn().mockResolvedValue(undefined);
  const mockOnSaveMetadata = jest.fn().mockResolvedValue(undefined);
  const mockOnPreview = jest.fn();
  const mockExistingTags = ['spiritual', 'healing', 'meditation', 'cosmic'];
  const mockPost: BlogPost = {
    id: '1',
    title: 'Test Post',
    slug: 'test-post',
    content: '<p>Test content</p>',
    excerpt: 'Test excerpt',
    tags: ['test'],
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: '1',
    metadata: {
      readingTime: 2,
      wordCount: 100,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the editor correctly', () => {
    render(<BlogEditor onSave={mockOnSave} onSaveMetadata={mockOnSaveMetadata} onPreview={mockOnPreview} existingTags={mockExistingTags} />);
    
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
    expect(screen.getByText('H1')).toBeInTheDocument();
    expect(screen.getByText('H2')).toBeInTheDocument();
    expect(screen.getByTitle('Bold')).toBeInTheDocument();
    expect(screen.getByTitle('Italic')).toBeInTheDocument();
    expect(screen.getByTitle('Bullet List')).toBeInTheDocument();
    expect(screen.getByTitle('Ordered List')).toBeInTheDocument();
    expect(screen.getByTitle('Link')).toBeInTheDocument();
    expect(screen.getByTitle('Insert Image')).toBeInTheDocument();
    expect(screen.getByTitle('Insert Video')).toBeInTheDocument();
  });

  it('toggles preview mode when preview button is clicked', () => {
    render(<BlogEditor onSave={mockOnSave} onSaveMetadata={mockOnSaveMetadata} onPreview={mockOnPreview} existingTags={mockExistingTags} />);
    
    const previewButton = screen.getByText('Preview');
    fireEvent.click(previewButton);
    
    expect(mockOnPreview).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Preview')).toBeInTheDocument();
  });

  it('opens media embedder when image button is clicked', () => {
    render(<BlogEditor onSave={mockOnSave} onSaveMetadata={mockOnSaveMetadata} onPreview={mockOnPreview} existingTags={mockExistingTags} />);
    
    const imageButton = screen.getByTitle('Insert Image');
    fireEvent.click(imageButton);
    
    expect(screen.getByTestId('media-embedder')).toBeInTheDocument();
  });

  it('opens media embedder when video button is clicked', () => {
    render(<BlogEditor onSave={mockOnSave} onSaveMetadata={mockOnSaveMetadata} onPreview={mockOnPreview} existingTags={mockExistingTags} />);
    
    const videoButton = screen.getByTitle('Insert Video');
    fireEvent.click(videoButton);
    
    expect(screen.getByTestId('media-embedder')).toBeInTheDocument();
  });

  it('closes media embedder when close button is clicked', () => {
    render(<BlogEditor onSave={mockOnSave} onSaveMetadata={mockOnSaveMetadata} onPreview={mockOnPreview} existingTags={mockExistingTags} />);
    
    // Open media embedder
    const imageButton = screen.getByTitle('Insert Image');
    fireEvent.click(imageButton);
    
    // Close media embedder
    const closeButton = screen.getByTestId('close-media-button');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('media-embedder')).not.toBeInTheDocument();
  });

  it('selects media from media embedder', () => {
    render(<BlogEditor onSave={mockOnSave} onSaveMetadata={mockOnSaveMetadata} onPreview={mockOnPreview} existingTags={mockExistingTags} />);
    
    // Open media embedder
    const imageButton = screen.getByTitle('Insert Image');
    fireEvent.click(imageButton);
    
    // Select media
    const selectButton = screen.getByTestId('select-media-button');
    fireEvent.click(selectButton);
    
    // Media embedder should be closed after selection
    expect(screen.queryByTestId('media-embedder')).not.toBeInTheDocument();
  });

  it('loads existing content when post is provided', () => {
    render(<BlogEditor post={mockPost} onSave={mockOnSave} onSaveMetadata={mockOnSaveMetadata} onPreview={mockOnPreview} existingTags={mockExistingTags} />);
    
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });
  
  it('switches between content and metadata tabs', () => {
    render(<BlogEditor onSave={mockOnSave} onSaveMetadata={mockOnSaveMetadata} onPreview={mockOnPreview} existingTags={mockExistingTags} />);
    
    // Content tab should be active by default
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
    expect(screen.queryByTestId('blog-metadata-form')).not.toBeInTheDocument();
    
    // Click on metadata tab
    fireEvent.click(screen.getByText('Metadata & Publishing'));
    
    // Metadata form should be visible now
    expect(screen.queryByTestId('editor-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('blog-metadata-form')).toBeInTheDocument();
    
    // Click back on content tab
    fireEvent.click(screen.getByText('Content'));
    
    // Content editor should be visible again
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
    expect(screen.queryByTestId('blog-metadata-form')).not.toBeInTheDocument();
  });
  
  it('saves metadata when save button is clicked', () => {
    render(<BlogEditor onSave={mockOnSave} onSaveMetadata={mockOnSaveMetadata} onPreview={mockOnPreview} existingTags={mockExistingTags} />);
    
    // Switch to metadata tab
    fireEvent.click(screen.getByText('Metadata & Publishing'));
    
    // Click save metadata button
    fireEvent.click(screen.getByTestId('save-metadata-button'));
    
    // Check if onSaveMetadata was called with correct data
    expect(mockOnSaveMetadata).toHaveBeenCalledWith({
      title: 'Updated Title',
      excerpt: 'Updated excerpt',
      tags: ['tag1', 'tag2'],
      status: PostStatus.PUBLISHED
    });
  });
});