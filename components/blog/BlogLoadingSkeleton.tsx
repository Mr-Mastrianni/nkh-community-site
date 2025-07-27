'use client';

import React from 'react';

interface BlogLoadingSkeletonProps {
  type?: 'list' | 'post' | 'card' | 'minimal';
  count?: number;
}

export const BlogLoadingSkeleton: React.FC<BlogLoadingSkeletonProps> = ({
  type = 'list',
  count = 3,
}) => {
  if (type === 'post') {
    return (
      <div className="animate-pulse">
        <div className="max-w-4xl mx-auto">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-slate-700 rounded mb-4"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
              <div>
                <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-24"></div>
              </div>
            </div>
            <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-3/4"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
            <div className="h-64 bg-slate-700 rounded-lg"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-slate-800/50 rounded-xl overflow-hidden">
              <div className="h-48 bg-slate-700 rounded-t-xl"></div>
              <div className="p-6">
                <div className="h-4 bg-slate-600 rounded w-1/3 mb-2"></div>
                <div className="h-6 bg-slate-600 rounded w-full mb-3"></div>
                <div className="h-3 bg-slate-600 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-600 rounded w-4/5 mb-4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-slate-600 rounded w-24"></div>
                  <div className="h-8 bg-slate-600 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default list view
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-slate-800/50 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 bg-slate-700 rounded-lg flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-600 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-slate-600 rounded w-3/4 mb-3"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-slate-600 rounded w-full"></div>
                  <div className="h-3 bg-slate-600 rounded w-5/6"></div>
                  <div className="h-3 bg-slate-600 rounded w-4/6"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
                    <div>
                      <div className="h-3 bg-slate-600 rounded w-24"></div>
                      <div className="h-2 bg-slate-600 rounded w-20 mt-1"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-slate-600 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogLoadingSkeleton;