'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '../../../../../components/admin/BlogEditor';
import { BlogPost, CreateBlogPostData, UpdateBlogPostData, PostStatus } from '../../../../../lib/types/blog';
import { BlogModel } from '../../../../../lib/models/BlogModel';

interface BlogEditPageProps {
  params: {
    id: string;
  };
}

const BlogEditPage: React.FC<BlogEditPageProps> = ({ params }) => {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [existingTags, setExistingTags] = useState<string[]>([]);

  // Fetch post data and existing tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch post by ID
        const response = await fetch(`/api/admin/blog/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        
        const postData = await response.json();
        setPost(postData);
        
        // Fetch existing tags
        const tagsResponse = await fetch('/api/admin/blog/tags');
        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json();
          setExistingTags(tagsData.map((tag: any) => tag.name));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params.id]);

  // Save content changes
  const handleSaveContent = async (content: string) => {
    if (!post) return;
    
    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save content');
      }
      
      // Update local post state
      setPost(prev => prev ? { ...prev, content } : null);
    } catch (err) {
      console.error('Error saving content:', err);
      // Show error notification (could use a toast library here)
    }
  };

  // Save metadata changes
  const handleSaveMetadata = async (metadata: Partial<CreateBlogPostData | UpdateBlogPostData>) => {
    if (!post) return;
    
    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save metadata');
      }
      
      const updatedPost = await response.json();
      setPost(updatedPost);
      
      // If status changed to published, show success message
      if (metadata.status === PostStatus.PUBLISHED && post.status !== PostStatus.PUBLISHED) {
        // Show success notification
      }
    } catch (err) {
      console.error('Error saving metadata:', err);
      // Show error notification
    }
  };

  // Handle preview
  const handlePreview = () => {
    if (!post) return;
    
    // Open preview in new tab
    window.open(`/api/admin/blog/preview/${post.id}`, '_blank');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-purple-200">Loading post...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-purple-900 bg-opacity-50 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-white mb-6">{error || 'Post not found'}</p>
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
        <h1 className="text-3xl font-bold text-white">
          {post.title || 'Untitled Post'}
        </h1>
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
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <span className="text-purple-300 mr-2">Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              post.status === PostStatus.PUBLISHED ? 'bg-green-600' :
              post.status === PostStatus.SCHEDULED ? 'bg-blue-600' :
              post.status === PostStatus.ARCHIVED ? 'bg-amber-700' :
              'bg-gray-600'
            }`}>
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-purple-300 mr-2">Created:</span>
            <span className="text-white">{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          
          <div className="flex items-center">
            <span className="text-purple-300 mr-2">Last Updated:</span>
            <span className="text-white">{new Date(post.updatedAt).toLocaleString()}</span>
          </div>
          
          {post.publishedAt && (
            <div className="flex items-center">
              <span className="text-purple-300 mr-2">Published:</span>
              <span className="text-white">{new Date(post.publishedAt).toLocaleString()}</span>
            </div>
          )}
          
          {post.scheduledFor && post.status === PostStatus.SCHEDULED && (
            <div className="flex items-center">
              <span className="text-purple-300 mr-2">Scheduled For:</span>
              <span className="text-white">{new Date(post.scheduledFor).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
      
      <BlogEditor
        post={post}
        onSave={handleSaveContent}
        onSaveMetadata={handleSaveMetadata}
        onPreview={handlePreview}
        existingTags={existingTags}
      />
    </div>
  );
};

export default BlogEditPage;