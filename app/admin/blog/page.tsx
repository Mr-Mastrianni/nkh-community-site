'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { PostStatus } from '@/lib/types/blog';
import PostManager from '@/components/admin/PostManager';

const BlogManagementPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get initial status and search from URL params
  const initialStatus = searchParams.get('status') as PostStatus | 'all' || 'all';
  const initialSearch = searchParams.get('query') || '';

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="cosmic-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spiritual-gold mx-auto"></div>
          <p className="mt-4 text-cosmic-light">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user and not loading, don't render anything (will redirect)
  if (!user) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="cosmic-card p-6">
        <h1 className="text-2xl font-bold text-3d mb-2">Blog Posts</h1>
        <p className="text-cosmic-light/80">Manage your blog content</p>
      </div>
      
      <PostManager initialStatus={initialStatus} initialSearch={initialSearch} />
    </div>
  );
};

export default BlogManagementPage;