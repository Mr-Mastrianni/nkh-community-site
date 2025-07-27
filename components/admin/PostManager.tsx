'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BlogPost, PostStatus } from '@/lib/types/blog';
import ConfirmationDialog from './ConfirmationDialog';
import CosmicErrorBoundary from './CosmicErrorBoundary';
import CosmicLoadingSpinner from './CosmicLoadingSpinner';
import ErrorMessage from './ErrorMessage';
import NetworkErrorHandler from './NetworkErrorHandler';

interface PostManagerProps {
  initialStatus?: PostStatus | 'all';
  initialSearch?: string;
}

const PostManager: React.FC<PostManagerProps> = ({ 
  initialStatus = 'all', 
  initialSearch = '' 
}) => {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showStatusDialog, setShowStatusDialog] = useState<boolean>(false);
  const [bulkStatus, setBulkStatus] = useState<PostStatus>(PostStatus.PUBLISHED);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [operationError, setOperationError] = useState<Error | null>(null);
  
  // Fetch posts based on filters
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (searchTerm) params.append('query', searchTerm);
        if (selectedStatus !== 'all') params.append('status', selectedStatus);
        
        const response = await fetch(`/api/admin/blog?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        setPosts(data.posts);
        setTotalPosts(data.totalCount);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setFetchError(error instanceof Error ? error : new Error('Failed to fetch posts'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm, selectedStatus]);
  
  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setSelectedPosts([]);
  };
  
  // Handle post selection
  const handleSelectPost = (id: string) => {
    setSelectedPosts(prev => {
      if (prev.includes(id)) {
        return prev.filter(postId => postId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Handle select all posts
  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(post => post.id));
    }
  };
  
  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return;
    
    setShowDeleteDialog(true);
  };
  
  // Confirm bulk delete
  const confirmBulkDelete = async () => {
    try {
      setIsProcessing(true);
      
      const response = await fetch('/api/admin/blog', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'delete',
          ids: selectedPosts
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete posts');
      }
      
      // Refresh posts
      const updatedResponse = await fetch(`/api/admin/blog?${selectedStatus !== 'all' ? `status=${selectedStatus}` : ''}`);
      const data = await updatedResponse.json();
      
      setPosts(data.posts);
      setTotalPosts(data.totalCount);
      setSelectedPosts([]);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting posts:', error);
      setOperationError(error instanceof Error ? error : new Error('Failed to delete posts'));
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle bulk status change
  const handleBulkStatusChange = () => {
    if (selectedPosts.length === 0) return;
    
    setShowStatusDialog(true);
  };
  
  // Confirm bulk status change
  const confirmBulkStatusChange = async () => {
    try {
      setIsProcessing(true);
      
      const response = await fetch('/api/admin/blog', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'status',
          ids: selectedPosts,
          data: {
            status: bulkStatus
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update post status');
      }
      
      // Refresh posts
      const updatedResponse = await fetch(`/api/admin/blog?${selectedStatus !== 'all' ? `status=${selectedStatus}` : ''}`);
      const data = await updatedResponse.json();
      
      setPosts(data.posts);
      setTotalPosts(data.totalCount);
      setSelectedPosts([]);
      setShowStatusDialog(false);
    } catch (error) {
      console.error('Error updating post status:', error);
      setOperationError(error instanceof Error ? error : new Error('Failed to update post status'));
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle single post delete
  const handleDeletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      
      // Remove post from list
      setPosts(posts.filter(post => post.id !== id));
      setTotalPosts(prev => prev - 1);
    } catch (error) {
      console.error('Error deleting post:', error);
      setOperationError(error instanceof Error ? error : new Error('Failed to delete post'));
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };
  
  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case PostStatus.PUBLISHED:
        return 'bg-spiritual-sage/20 text-spiritual-sage';
      case PostStatus.DRAFT:
        return 'bg-cosmic-teal/20 text-cosmic-teal';
      case PostStatus.SCHEDULED:
        return 'bg-spiritual-gold/20 text-spiritual-gold';
      case PostStatus.ARCHIVED:
        return 'bg-cosmic-light/20 text-cosmic-light/70';
      default:
        return 'bg-cosmic-light/20 text-cosmic-light/70';
    }
  };
  
  return (
    <CosmicErrorBoundary>
      {/* Fetch Error Display */}
      {fetchError && (
        <div className="mb-6">
          <NetworkErrorHandler
            error={fetchError}
            onRetry={() => {
              setFetchError(null);
              setIsLoading(true);
              // Trigger refetch by updating a dependency
              const fetchPosts = async () => {
                try {
                  const params = new URLSearchParams();
                  if (searchTerm) params.append('query', searchTerm);
                  if (selectedStatus !== 'all') params.append('status', selectedStatus);
                  
                  const response = await fetch(`/api/admin/blog?${params.toString()}`);
                  
                  if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                  }
                  
                  const data = await response.json();
                  setPosts(data.posts);
                  setTotalPosts(data.totalCount);
                  setFetchError(null);
                } catch (error) {
                  console.error('Error fetching posts:', error);
                  setFetchError(error instanceof Error ? error : new Error('Failed to fetch posts'));
                } finally {
                  setIsLoading(false);
                }
              };
              fetchPosts();
            }}
          />
        </div>
      )}

      {/* Operation Error Display */}
      {operationError && (
        <div className="mb-6">
          <ErrorMessage
            title="Operation Failed"
            message={operationError.message}
            variant="error"
            onDismiss={() => setOperationError(null)}
            onRetry={() => {
              setOperationError(null);
              // The user can retry the operation manually
            }}
          />
        </div>
      )}

      <div className="cosmic-card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full p-3 bg-cosmic-deep/50 border border-cosmic-light/20 rounded-md focus:ring-2 focus:ring-spiritual-purple focus:border-transparent"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <select
              className="p-3 bg-cosmic-deep/50 border border-cosmic-light/20 rounded-md focus:ring-2 focus:ring-spiritual-purple focus:border-transparent"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="all">All Status</option>
              <option value={PostStatus.PUBLISHED}>Published</option>
              <option value={PostStatus.DRAFT}>Draft</option>
              <option value={PostStatus.SCHEDULED}>Scheduled</option>
              <option value={PostStatus.ARCHIVED}>Archived</option>
            </select>
            <Link
              href="/admin/blog/new"
              className="cosmic-button flex items-center justify-center gap-2"
            >
              <i className="fas fa-plus"></i>
              <span>New Post</span>
            </Link>
          </div>
        </div>
        
        {selectedPosts.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center p-3 bg-cosmic-deep/30 rounded-md mb-4">
            <span className="text-cosmic-light/80">
              {selectedPosts.length} {selectedPosts.length === 1 ? 'post' : 'posts'} selected
            </span>
            <div className="flex-grow"></div>
            <button
              onClick={handleBulkStatusChange}
              className="px-3 py-1 bg-spiritual-purple/30 hover:bg-spiritual-purple/50 text-cosmic-light rounded-md transition-colors text-sm flex items-center gap-1"
            >
              <i className="fas fa-tag"></i>
              <span>Set Status</span>
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-600/30 hover:bg-red-600/50 text-cosmic-light rounded-md transition-colors text-sm flex items-center gap-1"
            >
              <i className="fas fa-trash-alt"></i>
              <span>Delete</span>
            </button>
          </div>
        )}
        
        {isLoading ? (
          <div className="bg-cosmic-deep/30 rounded-lg p-8 text-center">
            <CosmicLoadingSpinner size="lg" message="Loading posts..." />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-cosmic-deep/30 rounded-lg p-8 text-center">
            <i className="fas fa-file-alt text-4xl text-cosmic-light/30 mb-4"></i>
            <p className="text-cosmic-light/80 mb-2">No posts found</p>
            <p className="text-cosmic-light/60 text-sm mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first blog post to get started'}
            </p>
            <Link href="/admin/blog/new" className="cosmic-button">
              Create New Post
            </Link>
          </div>
        ) : (
          <div className="bg-cosmic-deep/30 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cosmic-light/10">
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-spiritual-purple rounded border-cosmic-light/30 bg-cosmic-deep/50 focus:ring-spiritual-purple"
                          checked={selectedPosts.length === posts.length && posts.length > 0}
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-cosmic-light/70 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-cosmic-light/70 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-cosmic-light/70 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-cosmic-light/70 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cosmic-light/10">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-cosmic-deep/50 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-spiritual-purple rounded border-cosmic-light/30 bg-cosmic-deep/50 focus:ring-spiritual-purple"
                          checked={selectedPosts.includes(post.id)}
                          onChange={() => handleSelectPost(post.id)}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-cosmic-light">{post.title}</span>
                          <span className="text-sm text-cosmic-light/70 truncate max-w-xs">{post.excerpt}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.tags.map((tag) => (
                              <span 
                                key={tag} 
                                className="px-2 py-0.5 bg-spiritual-purple/20 text-spiritual-purple/90 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(post.status)}`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-cosmic-light/90">
                            {post.status === PostStatus.PUBLISHED && post.publishedAt
                              ? `Published: ${formatDate(post.publishedAt)}`
                              : post.status === PostStatus.SCHEDULED && post.scheduledFor
                              ? `Scheduled: ${formatDate(post.scheduledFor)}`
                              : `Updated: ${formatDate(post.updatedAt)}`}
                          </span>
                          <span className="text-xs text-cosmic-light/70">
                            Created: {formatDate(post.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/blog/edit/${post.id}`}
                            className="px-3 py-1 bg-spiritual-purple/30 hover:bg-spiritual-purple/50 text-cosmic-light rounded-md transition-colors text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            className="px-3 py-1 bg-red-600/30 hover:bg-red-600/50 text-cosmic-light rounded-md transition-colors text-sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this post?')) {
                                handleDeletePost(post.id);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPosts > posts.length && (
              <div className="p-4 border-t border-cosmic-light/10 text-center text-cosmic-light/70">
                Showing {posts.length} of {totalPosts} posts
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title="Delete Posts"
        message={`Are you sure you want to delete ${selectedPosts.length} ${selectedPosts.length === 1 ? 'post' : 'posts'}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        cancelLabel="Cancel"
        isProcessing={isProcessing}
        onConfirm={confirmBulkDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
      
      {/* Status Change Dialog */}
      <ConfirmationDialog
        isOpen={showStatusDialog}
        title="Change Post Status"
        message={`Change status for ${selectedPosts.length} ${selectedPosts.length === 1 ? 'post' : 'posts'} to:`}
        confirmLabel="Update Status"
        cancelLabel="Cancel"
        isProcessing={isProcessing}
        onConfirm={confirmBulkStatusChange}
        onCancel={() => setShowStatusDialog(false)}
        customContent={
          <div className="mb-4">
            <select
              className="w-full p-3 bg-cosmic-deep/50 border border-cosmic-light/20 rounded-md focus:ring-2 focus:ring-spiritual-purple focus:border-transparent"
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as PostStatus)}
            >
              <option value={PostStatus.PUBLISHED}>Published</option>
              <option value={PostStatus.DRAFT}>Draft</option>
              <option value={PostStatus.SCHEDULED}>Scheduled</option>
              <option value={PostStatus.ARCHIVED}>Archived</option>
            </select>
          </div>
        }
      />
    </CosmicErrorBoundary>
  );
};

export default PostManager;