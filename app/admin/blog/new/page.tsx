'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '../../../../components/admin/BlogEditor';
import { CreateBlogPostData, UpdateBlogPostData, PostStatus } from '../../../../lib/types/blog';
import { v4 as uuidv4 } from 'uuid';

const NewBlogPostPage: React.FC = () => {
  const router = useRouter();
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [postId, setPostId] = useState<string>('');

  // Fetch existing tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/admin/blog/tags');
        if (response.ok) {
          const tagsData = await response.json();
          setExistingTags(tagsData.map((tag: any) => tag.name));
        }
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    
    fetchTags();
  }, []);

  // Create initial draft post
  useEffect(() => {
    const createDraft = async () => {
      try {
        setLoading(true);
        
        const newPostId = uuidv4();
        const initialPost: CreateBlogPostData = {
          title: 'Untitled Post',
          content: '<p>Start writing your cosmic journey here...</p>',
          excerpt: '',
          tags: [],
          status: PostStatus.DRAFT
        };
        
        const response = await fetch('/api/admin/blog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: newPostId,
            ...initialPost
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create draft post');
        }
        
        const createdPost = await response.json();
        setPostId(createdPost.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    createDraft();
  }, []);

  // Save content changes
  const handleSaveContent = async (content: string) => {
    if (!postId) return;
    
    try {
      await fetch(`/api/admin/blog/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
    } catch (err) {
      console.error('Error saving content:', err);
    }
  };

  // Save metadata changes
  const handleSaveMetadata = async (metadata: Partial<CreateBlogPostData | UpdateBlogPostData>) => {
    if (!postId) return;
    
    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save metadata');
      }
      
      // If title was updated, update the page title
      if (metadata.title) {
        document.title = `Editing: ${metadata.title} | Admin`;
      }
      
      // If status changed to published, show success message
      if (metadata.status === PostStatus.PUBLISHED) {
        // Show success notification
      }
    } catch (err) {
      console.error('Error saving metadata:', err);
    }
  };

  // Handle preview
  const handlePreview = () => {
    if (!postId) return;
    
    // Open preview in new tab
    window.open(`/api/admin/blog/preview/${postId}`, '_blank');
  };

  // Loading state
  if (loading || !postId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-purple-200">Creating new post...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-purple-900 bg-opacity-50 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-white mb-6">{error}</p>
          <button
            onClick={() => router.push('/admin/blog')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
          >
            Return to Blog Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Create New Post</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin/blog')}
            className="px-4 py-2 bg-purple-800 hover:bg-purple-700 text-white rounded-md transition-colors"
          >
            Back to Posts
          </button>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-purple-900 bg-opacity-30 rounded-lg">
        <p className="text-purple-200">
          Start by adding content in the editor below. Don't forget to set your post metadata and publishing options in the "Metadata & Publishing" tab.
        </p>
      </div>
      
      <BlogEditor
        onSave={handleSaveContent}
        onSaveMetadata={handleSaveMetadata}
        onPreview={handlePreview}
        existingTags={existingTags}
      />
    </div>
  );
};

export default NewBlogPostPage;