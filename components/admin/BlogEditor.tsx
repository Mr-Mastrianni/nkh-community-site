'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { debounce } from 'lodash';
import { BlogPost, CreateBlogPostData, UpdateBlogPostData } from '../../lib/types/blog';
import MediaEmbedder from './MediaEmbedder';
import BlogMetadataForm from './BlogMetadataForm';
import CosmicErrorBoundary from './CosmicErrorBoundary';
import CosmicLoadingSpinner from './CosmicLoadingSpinner';
import ErrorMessage from './ErrorMessage';
import NetworkErrorHandler from './NetworkErrorHandler';

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  altText?: string;
  caption?: string;
}

interface BlogEditorProps {
  post?: BlogPost;
  onSave: (content: string) => Promise<void>;
  onSaveMetadata: (metadata: Partial<CreateBlogPostData | UpdateBlogPostData>) => Promise<void>;
  onPreview: () => void;
  existingTags?: string[];
}

const BlogEditor: React.FC<BlogEditorProps> = ({ 
  post, 
  onSave, 
  onSaveMetadata, 
  onPreview,
  existingTags = [] 
}) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showMediaEmbedder, setShowMediaEmbedder] = useState<boolean>(false);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [activeTab, setActiveTab] = useState<'content' | 'metadata'>('content');
  const [saveError, setSaveError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize editor with existing content or empty
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Begin your cosmic journey here...',
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-500 underline hover:text-purple-700',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
    ],
    content: post?.content || '',
    autofocus: 'end',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] p-5',
      },
    },
  });

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (content: string) => {
      if (!content) return;
      
      setIsSaving(true);
      setSaveError(null);
      try {
        await onSave(content);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error saving content:', error);
        setSaveError(error instanceof Error ? error : new Error('Failed to save content'));
      } finally {
        setIsSaving(false);
      }
    }, 1500),
    [onSave]
  );

  // Auto-save when content changes
  useEffect(() => {
    if (!editor) return;
    
    const handleUpdate = () => {
      const content = editor.getHTML();
      debouncedSave(content);
    };

    editor.on('update', handleUpdate);
    
    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, debouncedSave]);

  // Handle preview toggle
  const handlePreviewToggle = () => {
    setShowPreview(!showPreview);
    if (!showPreview) {
      onPreview();
    }
  };

  // Handle media embedding
  const handleMediaSelect = (media: MediaFile) => {
    if (!editor) return;
    
    if (media.mimeType.startsWith('image/')) {
      editor.chain().focus().setImage({ 
        src: media.url,
        alt: media.altText || media.filename,
        title: media.caption || media.filename,
      }).run();
    } else if (media.mimeType.startsWith('video/')) {
      // Insert video HTML
      const videoHtml = `
        <div class="video-embed">
          <video 
            src="${media.url}" 
            controls
            class="w-full rounded-lg"
            title="${media.caption || media.filename}"
          ></video>
          ${media.caption ? `<p class="text-sm text-center mt-1">${media.caption}</p>` : ''}
        </div>
      `;
      editor.chain().focus().insertContent(videoHtml).run();
    }
    
    setShowMediaEmbedder(false);
  };

  // Open media embedder
  const openMediaEmbedder = (type: 'image' | 'video') => {
    setMediaType(type);
    setShowMediaEmbedder(true);
  };

  if (!editor) {
    return (
      <div className="cosmic-card p-8">
        <CosmicLoadingSpinner size="lg" message="Loading editor..." />
      </div>
    );
  }

  return (
    <CosmicErrorBoundary>
      <div className="space-y-4">
        {/* Save Error Display */}
        {saveError && (
          <NetworkErrorHandler
            error={saveError}
            onRetry={() => {
              const content = editor.getHTML();
              debouncedSave(content);
            }}
          />
        )}
        
        <div className="relative bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg border border-purple-200 border-opacity-20 shadow-xl">
      {/* Tab Navigation */}
      <div className="flex border-b border-purple-200 border-opacity-20">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-6 py-3 font-medium text-lg ${
            activeTab === 'content'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-purple-300 hover:text-white'
          }`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab('metadata')}
          className={`px-6 py-3 font-medium text-lg ${
            activeTab === 'metadata'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-purple-300 hover:text-white'
          }`}
        >
          Metadata & Publishing
        </button>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <>
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between p-3 border-b border-purple-200 border-opacity-20">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded ${
                  editor.isActive('heading', { level: 1 })
                    ? 'bg-purple-700 text-white'
                    : 'bg-purple-100 bg-opacity-20 hover:bg-purple-200 hover:bg-opacity-30'
                }`}
                title="Heading 1"
              >
                H1
              </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-purple-700 text-white'
                : 'bg-purple-100 bg-opacity-20 hover:bg-purple-200 hover:bg-opacity-30'
            }`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded ${
              editor.isActive('bold')
                ? 'bg-purple-700 text-white'
                : 'bg-purple-100 bg-opacity-20 hover:bg-purple-200 hover:bg-opacity-30'
            }`}
            title="Bold"
          >
            <span className="font-bold">B</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded ${
              editor.isActive('italic')
                ? 'bg-purple-700 text-white'
                : 'bg-purple-100 bg-opacity-20 hover:bg-purple-200 hover:bg-opacity-30'
            }`}
            title="Italic"
          >
            <span className="italic">I</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded ${
              editor.isActive('underline')
                ? 'bg-purple-700 text-white'
                : 'bg-purple-100 bg-opacity-20 hover:bg-purple-200 hover:bg-opacity-30'
            }`}
            title="Underline"
          >
            <span className="underline">U</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded ${
              editor.isActive('bulletList')
                ? 'bg-purple-700 text-white'
                : 'bg-purple-100 bg-opacity-20 hover:bg-purple-200 hover:bg-opacity-30'
            }`}
            title="Bullet List"
          >
            • List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded ${
              editor.isActive('orderedList')
                ? 'bg-purple-700 text-white'
                : 'bg-purple-100 bg-opacity-20 hover:bg-purple-200 hover:bg-opacity-30'
            }`}
            title="Ordered List"
          >
            1. List
          </button>
          <button
            onClick={() => {
              const url = window.prompt('URL');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={`p-2 rounded ${
              editor.isActive('link')
                ? 'bg-purple-700 text-white'
                : 'bg-purple-100 bg-opacity-20 hover:bg-purple-200 hover:bg-opacity-30'
            }`}
            title="Link"
          >
            Link
          </button>
          <button
            onClick={() => openMediaEmbedder('image')}
            className="p-2 rounded bg-purple-100 bg-opacity-20 hover:bg-purple-200 hover:bg-opacity-30"
            title="Insert Image"
          >
            Image
          </button>
          <button
            onClick={() => openMediaEmbedder('video')}
            className="p-2 rounded bg-purple-100 bg-opacity-20 hover:bg-purple-200 hover:bg-opacity-30"
            title="Insert Video"
          >
            Video
          </button>
        </div>
        <div className="flex items-center gap-2">
          {isSaving ? (
            <span className="text-sm text-purple-300 saving-indicator">Saving...</span>
          ) : lastSaved ? (
            <span className="text-sm text-purple-300">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          ) : null}
          <button
            onClick={handlePreviewToggle}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className={`${showPreview ? 'hidden' : 'block'}`}>
        <EditorContent editor={editor} className="cosmic-editor" />
      </div>

      {/* Preview Mode */}
      {showPreview && (
        <div className="p-5 prose prose-lg max-w-none cosmic-preview">
          <div dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
        </div>
      )}

      {/* Bubble Menu for selected text */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-purple-900 bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-md shadow-lg p-1 flex gap-1"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1 rounded ${editor.isActive('bold') ? 'bg-purple-700' : 'hover:bg-purple-800'}`}
          >
            <span className="font-bold text-white">B</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1 rounded ${editor.isActive('italic') ? 'bg-purple-700' : 'hover:bg-purple-800'}`}
          >
            <span className="italic text-white">I</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1 rounded ${editor.isActive('underline') ? 'bg-purple-700' : 'hover:bg-purple-800'}`}
          >
            <span className="underline text-white">U</span>
          </button>
          <button
            onClick={() => {
              const url = window.prompt('URL');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={`p-1 rounded ${editor.isActive('link') ? 'bg-purple-700' : 'hover:bg-purple-800'}`}
          >
            <span className="text-white">Link</span>
          </button>
        </BubbleMenu>
      )}
      
      {/* Metadata Tab */}
      {activeTab === 'metadata' && (
        <div className="p-5">
          <BlogMetadataForm
            post={post}
            onSave={onSaveMetadata}
            existingTags={existingTags}
          />
        </div>
      )}
      
      {/* Media Embedder Modal */}
      {showMediaEmbedder && (
        <MediaEmbedder 
          onSelectMedia={handleMediaSelect} 
          onClose={() => setShowMediaEmbedder(false)} 
        />
      )}
        </div>
      </div>
    </CosmicErrorBoundary>
  );
};

export default BlogEditor;