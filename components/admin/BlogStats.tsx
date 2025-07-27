'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface BlogStats {
  total: number;
  published: number;
  draft: number;
  scheduled: number;
}

const BlogStats = () => {
  const [stats, setStats] = useState<BlogStats>({
    total: 0,
    published: 0,
    draft: 0,
    scheduled: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/blog/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog statistics');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError('Failed to load blog statistics');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="cosmic-card p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 w-24 bg-cosmic-light/20 rounded mb-2"></div>
                <div className="h-8 w-12 bg-cosmic-light/30 rounded"></div>
              </div>
              <div className="w-12 h-12 rounded-full bg-cosmic-light/10"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="cosmic-card p-6 text-center">
        <p className="text-cosmic-light/80">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-spiritual-purple/30 hover:bg-spiritual-purple/50 rounded-md transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.total,
      icon: 'fas fa-file-alt',
      color: 'spiritual-purple',
      onClick: () => router.push('/admin/blog')
    },
    {
      title: 'Published',
      value: stats.published,
      icon: 'fas fa-check-circle',
      color: 'spiritual-sage',
      onClick: () => router.push('/admin/blog?status=published')
    },
    {
      title: 'Drafts',
      value: stats.draft,
      icon: 'fas fa-edit',
      color: 'cosmic-teal',
      onClick: () => router.push('/admin/blog?status=draft')
    },
    {
      title: 'Scheduled',
      value: stats.scheduled,
      icon: 'fas fa-clock',
      color: 'spiritual-gold',
      onClick: () => router.push('/admin/blog?status=scheduled')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div 
          key={index} 
          className="cosmic-card p-6 cursor-pointer hover:bg-cosmic-deep/50 transition-colors"
          onClick={card.onClick}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cosmic-light/70 text-sm">{card.title}</p>
              <h3 className="text-2xl font-bold text-cosmic-light">{card.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full bg-${card.color}/20 flex items-center justify-center`}>
              <i className={`${card.icon} text-${card.color}`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogStats;