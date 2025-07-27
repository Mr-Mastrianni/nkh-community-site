'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/types/blog';

const RecentPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/blog?limit=5');
        
        if (!response.ok) {
          throw new Error('Failed to fetch recent posts');
        }
        
        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError('Failed to load recent posts');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div className="cosmic-card p-6">
        <h2 className="text-xl font-bold text-cosmic-light mb-4">Recent Posts</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center p-3 rounded-lg bg-cosmic-deep/30">
              <div className="flex-1">
                <div className="h-4 bg-cosmic-light/20 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-cosmic-light/10 rounded w-1/2"></div>
              </div>
              <div className="h-8 w-16 bg-cosmic-light/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cosmic-card p-6">
        <h2 className="text-xl font-bold text-cosmic-light mb-4">Recent Posts</h2>
        <div className="bg-cosmic-deep/30 rounded-lg p-4 text-center">
          <p className="text-cosmic-light/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cosmic-card p-6">
      <h2 className="text-xl font-bold text-cosmic-light mb-4">Recent Posts</h2>
      
      {posts.length === 0 ? (
        <div className="bg-cosmic-deep/30 rounded-lg p-8 text-center">
          <i className="fas fa-file-alt text-4xl text-cosmic-light/30 mb-4"></i>
          <p className="text-cosmic-light/70">No posts yet</p>
          <Link href="/admin/blog/new" className="mt-4 cosmic-button text-sm inline-block">
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/admin/blog/edit/${post.id}`}
              className="flex items-center justify-between p-3 rounded-lg bg-cosmic-deep/30 hover:bg-cosmic-deep/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-cosmic-light font-medium truncate">{post.title}</h3>
                <p className="text-cosmic-light/70 text-sm">{formatDate(post.updatedAt)}</p>
              </div>
              <span className={`ml-4 px-2 py-1 text-xs rounded-full ${
                post.status === 'published' ? 'bg-spiritual-sage/20 text-spiritual-sage' :
                post.status === 'draft' ? 'bg-cosmic-teal/20 text-cosmic-teal' :
                'bg-spiritual-gold/20 text-spiritual-gold'
              }`}>
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </span>
            </Link>
          ))}
          
          <Link 
            href="/admin/blog" 
            className="block text-center p-2 text-spiritual-purple hover:text-spiritual-gold transition-colors text-sm"
          >
            View All Posts
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentPosts;