'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BlogStats from '@/components/admin/BlogStats';
import RecentPosts from '@/components/admin/RecentPosts';

const AdminDashboardPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

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
          <p className="mt-4 text-cosmic-light">Loading dashboard...</p>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-3d mb-1">Admin Dashboard</h1>
            <p className="text-cosmic-light/80">Welcome back, {user.name}!</p>
          </div>
          <div className="flex gap-2">
            <Link 
              href="/admin/blog/new" 
              className="cosmic-button flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              <span>New Post</span>
            </Link>
            <Link 
              href="/admin/media" 
              className="cosmic-button-outline flex items-center gap-2"
            >
              <i className="fas fa-images"></i>
              <span>Media</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Blog Statistics */}
      <BlogStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="lg:col-span-2">
          <RecentPosts />
        </div>

        {/* Quick Actions */}
        <div className="cosmic-card p-6">
          <h2 className="text-xl font-bold text-cosmic-light mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link 
              href="/admin/blog/new"
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-spiritual-purple/20 text-cosmic-light hover:bg-spiritual-purple/30 transition-colors"
            >
              <i className="fas fa-plus-circle w-5 text-center"></i>
              <span>New Blog Post</span>
            </Link>
            <Link 
              href="/admin/media"
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-spiritual-gold/20 text-cosmic-light hover:bg-spiritual-gold/30 transition-colors"
            >
              <i className="fas fa-upload w-5 text-center"></i>
              <span>Upload Media</span>
            </Link>
            <Link 
              href="/admin/blog"
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-cosmic-teal/20 text-cosmic-light hover:bg-cosmic-teal/30 transition-colors"
            >
              <i className="fas fa-list w-5 text-center"></i>
              <span>Manage Posts</span>
            </Link>
            <Link 
              href="/"
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-cosmic-deep/50 text-cosmic-light hover:bg-cosmic-deep/70 transition-colors"
            >
              <i className="fas fa-eye w-5 text-center"></i>
              <span>View Public Site</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;