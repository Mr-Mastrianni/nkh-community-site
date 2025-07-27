'use client';

import React, { useState, useEffect } from 'react';
import StandardLayout from '@/components/StandardLayout';
import SearchFilter from '@/components/SearchFilter';
import NoResultsFound from '@/components/NoResultsFound';
import { BlogPost } from '@/lib/types/blog';

interface BlogPageState {
  posts: BlogPost[];
  totalCount: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedTags: string[];
  availableTags: string[];
}

const BlogPage: React.FC = () => {
  const [state, setState] = useState<BlogPageState>({
    posts: [],
    totalCount: 0,
    hasMore: false,
    loading: true,
    error: null,
    searchQuery: '',
    selectedTags: [],
    availableTags: []
  });

  // Fetch available tags
  const fetchTags = async () => {
    try {
      const response = await fetch('/api/blog/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      setState(prev => ({ ...prev, availableTags: data.tags }));
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  // Fetch blog posts with search/filter parameters
  const fetchPosts = async (query: string = '', tags: string[] = [], offset: number = 0) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const params = new URLSearchParams();
      if (query) params.set('query', query);
      if (tags.length > 0) params.set('tags', tags.join(','));
      params.set('limit', '12');
      params.set('offset', offset.toString());

      const response = await fetch(`/api/blog/search?${params}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        posts: offset === 0 ? data.posts : [...prev.posts, ...data.posts],
        totalCount: data.totalCount,
        hasMore: data.hasMore,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load blog posts. Please try again.'
      }));
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
    fetchPosts(query, state.selectedTags, 0);
  };

  // Handle tag filtering
  const handleTagFilter = (tags: string[]) => {
    setState(prev => ({ ...prev, selectedTags: tags }));
    fetchPosts(state.searchQuery, tags, 0);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setState(prev => ({ 
      ...prev, 
      searchQuery: '', 
      selectedTags: [] 
    }));
    fetchPosts('', [], 0);
  };

  // Load more posts
  const loadMore = () => {
    if (!state.loading && state.hasMore) {
      fetchPosts(state.searchQuery, state.selectedTags, state.posts.length);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTags();
    fetchPosts();
  }, []);

  return (
    <StandardLayout className="bg-cosmic-dark">
      {/* Hero Section */}
      <div className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-cosmic-light mb-6 font-cinzel">
            Cosmic Wisdom
          </h1>
          <p className="text-xl text-cosmic-light/80 mb-8 max-w-2xl mx-auto">
            Explore ancient wisdom and modern healing insights through our collection of spiritual articles
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <SearchFilter
          onSearch={handleSearch}
          onTagFilter={handleTagFilter}
          availableTags={state.availableTags}
          initialQuery={state.searchQuery}
          initialTags={state.selectedTags}
          placeholder="Search cosmic wisdom..."
          showTagFilter={true}
        />
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {state.error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-8 text-center">
            <p className="text-cosmic-light">{state.error}</p>
            <button
              onClick={() => fetchPosts(state.searchQuery, state.selectedTags, 0)}
              className="mt-2 px-4 py-2 bg-spiritual-purple/30 hover:bg-spiritual-purple/40 text-cosmic-light rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {state.loading && state.posts.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cosmic-dark/30 rounded-full border border-spiritual-purple/30 mb-4">
              <div className="w-8 h-8 border-2 border-spiritual-purple/60 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-cosmic-light/70">Loading cosmic wisdom...</p>
          </div>
        )}

        {/* No Results */}
        {!state.loading && state.posts.length === 0 && !state.error && (
          <NoResultsFound
            searchQuery={state.searchQuery}
            selectedTags={state.selectedTags}
            onClearFilters={clearAllFilters}
            suggestions={[
              'Try searching for "healing" or "meditation"',
              'Browse posts by removing filters',
              'Check out our most popular tags',
              'Explore different spiritual topics'
            ]}
          />
        )}

        {/* Blog Posts Grid */}
        {state.posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {state.posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Load More Button */}
            {state.hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={state.loading}
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-spiritual-purple/20 hover:bg-spiritual-purple/30 disabled:opacity-50 disabled:cursor-not-allowed text-cosmic-light rounded-xl transition-all duration-300 border border-spiritual-purple/30 hover:border-spiritual-purple/50"
                >
                  {state.loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-cosmic-light/60 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More</span>
                      <i className="fas fa-arrow-down"></i>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Results Summary */}
            <div className="text-center mt-8 text-cosmic-light/60 text-sm">
              Showing {state.posts.length} of {state.totalCount} posts
              {(state.searchQuery || state.selectedTags.length > 0) && (
                <span> matching your search</span>
              )}
            </div>
          </>
        )}
      </div>
    </StandardLayout>
  );
};

// Blog Post Card Component
interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <article className="group bg-cosmic-dark/30 backdrop-blur-sm border border-spiritual-purple/20 rounded-xl overflow-hidden hover:border-spiritual-purple/40 transition-all duration-300 hover:transform hover:scale-105">
      {/* Featured Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-spiritual-purple/20 to-cosmic-dark/40 flex items-center justify-center">
        <i className="fas fa-star text-4xl text-spiritual-purple/40"></i>
      </div>

      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 bg-spiritual-purple/20 text-cosmic-light/80 rounded-full text-xs"
            >
              <i className="fas fa-tag text-xs mr-1"></i>
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-cosmic-light mb-3 group-hover:text-spiritual-purple transition-colors line-clamp-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-cosmic-light/70 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-cosmic-light/60">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <i className="fas fa-clock"></i>
              <span>{post.metadata.readingTime} min read</span>
            </span>
            <span className="flex items-center space-x-1">
              <i className="fas fa-calendar"></i>
              <span>{formatDate(post.publishedAt!)}</span>
            </span>
          </div>
        </div>

        {/* Read More Button */}
        <div className="mt-4 pt-4 border-t border-spiritual-purple/20">
          <button className="inline-flex items-center space-x-2 text-spiritual-purple hover:text-cosmic-light transition-colors">
            <span>Read More</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogPage;