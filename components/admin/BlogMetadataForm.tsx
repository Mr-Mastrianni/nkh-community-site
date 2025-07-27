'use client';

import React, { useState, useEffect } from 'react';
import { BlogPost, PostStatus, CreateBlogPostData, UpdateBlogPostData } from '../../lib/types/blog';
import TagAutocomplete from './TagAutocomplete';
import PublicationStatusSelector from './PublicationStatusSelector';
import DateTimePicker from './DateTimePicker';
import { BlogModel } from '../../lib/models/BlogModel';

interface BlogMetadataFormProps {
  post?: BlogPost;
  onSave: (metadata: Partial<CreateBlogPostData | UpdateBlogPostData>) => Promise<void>;
  existingTags?: string[];
}

const BlogMetadataForm: React.FC<BlogMetadataFormProps> = ({ post, onSave, existingTags = [] }) => {
  const [title, setTitle] = useState<string>(post?.title || '');
  const [excerpt, setExcept] = useState<string>(post?.excerpt || '');
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [status, setStatus] = useState<PostStatus>(post?.status || PostStatus.DRAFT);
  const [scheduledFor, setScheduledFor] = useState<Date | undefined>(post?.scheduledFor);
  const [seoTitle, setSeoTitle] = useState<string | undefined>(post?.metadata?.seoTitle);
  const [seoDescription, setSeoDescription] = useState<string | undefined>(post?.metadata?.seoDescription);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Reset form when post changes
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setExcept(post.excerpt);
      setTags(post.tags);
      setStatus(post.status);
      setScheduledFor(post.scheduledFor);
      setSeoTitle(post.metadata?.seoTitle);
      setSeoDescription(post.metadata?.seoDescription);
    }
  }, [post]);

  // Show scheduled date picker when status is scheduled
  useEffect(() => {
    if (status === PostStatus.SCHEDULED && !scheduledFor) {
      // Default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      setScheduledFor(tomorrow);
    }
  }, [status, scheduledFor]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }
    
    if (!excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if (excerpt.length > 500) {
      newErrors.excerpt = 'Excerpt must be less than 500 characters';
    }
    
    if (tags.length > 10) {
      newErrors.tags = 'Maximum 10 tags allowed';
    }
    
    if (status === PostStatus.SCHEDULED && !scheduledFor) {
      newErrors.scheduledFor = 'Scheduled date is required';
    }
    
    if (status === PostStatus.SCHEDULED && scheduledFor && scheduledFor <= new Date()) {
      newErrors.scheduledFor = 'Scheduled date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      const metadata = {
        title,
        excerpt,
        tags,
        status,
        scheduledFor: status === PostStatus.SCHEDULED ? scheduledFor : undefined,
        metadata: {
          seoTitle,
          seoDescription
        }
      };
      
      await onSave(metadata);
    } catch (error) {
      console.error('Error saving metadata:', error);
      setErrors({ submit: 'Failed to save metadata. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg border border-purple-200 border-opacity-20 shadow-xl p-5">
      <h2 className="text-xl font-bold mb-4 text-purple-100">Post Metadata</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-purple-200 mb-1">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 bg-purple-900 bg-opacity-50 border ${
              errors.title ? 'border-red-500' : 'border-purple-500'
            } rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="Enter post title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
          <p className="mt-1 text-xs text-purple-300">{title.length}/200 characters</p>
        </div>
        
        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-purple-200 mb-1">
            Excerpt <span className="text-red-400">*</span>
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcept(e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 bg-purple-900 bg-opacity-50 border ${
              errors.excerpt ? 'border-red-500' : 'border-purple-500'
            } rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="Brief summary of the post"
          />
          {errors.excerpt && <p className="mt-1 text-sm text-red-400">{errors.excerpt}</p>}
          <p className="mt-1 text-xs text-purple-300">{excerpt.length}/500 characters</p>
        </div>
        
        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-purple-200 mb-1">
            Tags
          </label>
          <TagAutocomplete
            selectedTags={tags}
            onChange={setTags}
            suggestions={existingTags}
            error={errors.tags}
          />
          {errors.tags && <p className="mt-1 text-sm text-red-400">{errors.tags}</p>}
          <p className="mt-1 text-xs text-purple-300">{tags.length}/10 tags</p>
        </div>
        
        {/* Publication Status */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-1">
            Publication Status
          </label>
          <PublicationStatusSelector
            status={status}
            onChange={setStatus}
          />
        </div>
        
        {/* Scheduled Date (shown only when status is SCHEDULED) */}
        {status === PostStatus.SCHEDULED && (
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-1">
              Scheduled Publication Date <span className="text-red-400">*</span>
            </label>
            <DateTimePicker
              value={scheduledFor}
              onChange={setScheduledFor}
              error={errors.scheduledFor}
            />
            {errors.scheduledFor && (
              <p className="mt-1 text-sm text-red-400">{errors.scheduledFor}</p>
            )}
          </div>
        )}
        
        {/* Advanced Options Toggle */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-purple-300 hover:text-purple-100 text-sm flex items-center"
          >
            <span>{showAdvanced ? '▼' : '►'}</span>
            <span className="ml-1">Advanced Options</span>
          </button>
        </div>
        
        {/* Advanced Options (SEO) */}
        {showAdvanced && (
          <div className="space-y-4 pt-2 border-t border-purple-700 border-opacity-50">
            <div>
              <label htmlFor="seoTitle" className="block text-sm font-medium text-purple-200 mb-1">
                SEO Title
              </label>
              <input
                type="text"
                id="seoTitle"
                value={seoTitle || ''}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-3 py-2 bg-purple-900 bg-opacity-50 border border-purple-500 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Custom SEO title (optional)"
              />
              <p className="mt-1 text-xs text-purple-300">
                Leave blank to use the post title
              </p>
            </div>
            
            <div>
              <label htmlFor="seoDescription" className="block text-sm font-medium text-purple-200 mb-1">
                SEO Description
              </label>
              <textarea
                id="seoDescription"
                value={seoDescription || ''}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-purple-900 bg-opacity-50 border border-purple-500 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Custom SEO description (optional)"
              />
              <p className="mt-1 text-xs text-purple-300">
                Leave blank to use the post excerpt
              </p>
            </div>
          </div>
        )}
        
        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isSaving
                ? 'bg-purple-700 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            } transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            {isSaving ? 'Saving...' : 'Save Metadata'}
          </button>
          {errors.submit && (
            <p className="mt-2 text-sm text-red-400 text-center">{errors.submit}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default BlogMetadataForm;