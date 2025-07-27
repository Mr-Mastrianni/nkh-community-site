'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CosmicBackground from '@/components/CosmicBackground';

const DashboardPage = () => {
  const [user, setUser] = useState({
    name: 'Spiritual Seeker',
    avatar: '🧘‍♀️',
    joinDate: '2024-01-15',
    constitution: 'Vata-Pitta',
    sunSign: 'Leo',
    moonSign: 'Scorpio',
    ascendant: 'Virgo'
  });

  const [stats, setStats] = useState({
    posts: 12,
    followers: 48,
    following: 23,
    healingSessions: 5
  });

  const quickActions = [
    {
      title: 'View Birth Chart',
      description: 'Explore your complete astrological analysis',
      icon: 'fas fa-chart-pie',
      color: 'spiritual-purple',
      link: '/chart'
    },
    {
      title: 'Health Insights',
      description: 'Personalized Ayurvedic recommendations',
      icon: 'fas fa-heartbeat',
      color: 'spiritual-pink',
      link: '/health'
    },
    {
      title: 'Community Feed',
      description: 'Connect with like-minded souls',
      icon: 'fas fa-users',
      color: 'spiritual-sage',
      link: '/community'
    },
    {
      title: 'Book Session',
      description: 'Schedule a healing consultation',
      icon: 'fas fa-calendar-plus',
      color: 'cosmic-gold',
      link: '/book-session'
    }
  ];

  const recentActivity = [
    {
      type: 'post',
      content: 'Shared a meditation insight',
      time: '2 hours ago',
      icon: 'fas fa-pen'
    },
    {
      type: 'session',
      content: 'Completed Ayurvedic consultation',
      time: '1 day ago',
      icon: 'fas fa-leaf'
    },
    {
      type: 'community',
      content: 'Joined "Moon Cycle Meditation" circle',
      time: '3 days ago',
      icon: 'fas fa-moon'
    }
  ];

  return (
    <div className="min-h-screen relative">
      <CosmicBackground />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-3d">Welcome back, {user.name}</h1>
            <p className="text-cosmic-light/80">Your spiritual journey continues</p>
          </div>
          
          <Link href="/" className="cosmic-button">
            <i className="fas fa-home mr-2"></i>
            Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="cosmic-card p-6 text-center">
              <div className="text-6xl mb-4">{user.avatar}</div>
              <h2 className="text-xl font-bold mb-2">{user.name}</h2>
              <p className="text-cosmic-light/80 mb-4">
                Member since {new Date(user.joinDate).toLocaleDateString()}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-2xl font-bold text-spiritual-gold">{stats.posts}</div>
                  <div className="text-sm text-cosmic-light/80">Posts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-spiritual-purple">{stats.followers}</div>
                  <div className="text-sm text-cosmic-light/80">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-spiritual-sage">{stats.following}</div>
                  <div className="text-sm text-cosmic-light/80">Following</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cosmic-teal">{stats.healingSessions}</div>
                  <div className="text-sm text-cosmic-light/80">Sessions</div>
                </div>
              </div>
              
              <button className="cosmic-button w-full">
                Edit Profile
              </button>
            </div>

            {/* Spiritual Profile */}
            <div className="cosmic-card p-6 mt-6">
              <h3 className="text-lg font-bold mb-4">Spiritual Profile</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-cosmic-light/80">Constitution:</span>
                  <span className="text-spiritual-sage font-medium">{user.constitution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-light/80">Sun Sign:</span>
                  <span className="text-spiritual-gold font-medium">{user.sunSign}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-light/80">Moon Sign:</span>
                  <span className="text-spiritual-purple font-medium">{user.moonSign}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-light/80">Ascendant:</span>
                  <span className="text-cosmic-teal font-medium">{user.ascendant}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="cosmic-card p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.link}>
                    <div className="p-4 rounded-lg bg-cosmic-deep/30 hover:bg-cosmic-light/10 transition-colors cursor-pointer border border-cosmic-light/10">
                      <div className="flex items-center mb-2">
                        <i className={`${action.icon} text-${action.color} text-xl mr-3`}></i>
                        <h4 className="font-medium">{action.title}</h4>
                      </div>
                      <p className="text-sm text-cosmic-light/80">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="cosmic-card p-6">
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center p-3 rounded-lg bg-cosmic-deep/30">
                    <div className="w-10 h-10 rounded-full bg-spiritual-purple/20 flex items-center justify-center mr-4">
                      <i className={`${activity.icon} text-spiritual-purple`}></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-cosmic-light">{activity.content}</p>
                      <p className="text-sm text-cosmic-light/60">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Cosmic Insight */}
            <div className="cosmic-card p-6">
              <h3 className="text-xl font-bold mb-4">Today's Cosmic Insight</h3>
              
              <div className="bg-gradient-to-r from-spiritual-purple/20 to-cosmic-teal/20 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <i className="fas fa-star text-spiritual-gold mr-2"></i>
                  <span className="font-medium">Daily Guidance</span>
                </div>
                <p className="text-cosmic-light/90">
                  The Moon in Scorpio today encourages deep introspection and emotional healing. 
                  This is an excellent time for meditation and connecting with your inner wisdom. 
                  Consider journaling about your spiritual journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;