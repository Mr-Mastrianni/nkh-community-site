'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { 
  followUser, 
  unfollowUser, 
  checkIsFollowing 
} from '../../../lib/store/slices/followSlice';
import { motion } from 'framer-motion';

interface FollowButtonProps {
  currentUserId?: string;
  followingId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Follow button component with state handling and animations
 * Implements requirements 2.1, 2.2 from the requirements document
 */
const FollowButton: React.FC<FollowButtonProps> = ({ 
  currentUserId, 
  followingId,
  size = 'md',
  className = ''
}) => {
  const dispatch = useAppDispatch();
  const { isFollowingMap, loading } = useAppSelector((state) => state.follow);
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if the current user is following the target user
  const isFollowing = isFollowingMap[followingId] || false;
  
  useEffect(() => {
    // Check the follow status when the component mounts
    if (currentUserId) {
      dispatch(checkIsFollowing({ followerId: currentUserId, followingId }));
    }
  }, [dispatch, currentUserId, followingId]);

  const handleFollowToggle = () => {
    if (!currentUserId) return;
    
    if (isFollowing) {
      dispatch(unfollowUser({ followerId: currentUserId, followingId }));
    } else {
      dispatch(followUser({ followerId: currentUserId, followingId }));
    }
  };

  // Determine button size classes
  const sizeClasses = {
    sm: 'px-4 py-1 text-sm',
    md: 'px-6 py-2',
    lg: 'px-8 py-3 text-lg'
  };

  // Determine button appearance based on follow state
  const buttonClasses = isFollowing
    ? `bg-cosmic-purple/50 border border-spiritual-purple/50 text-cosmic-light hover:bg-cosmic-purple/70 ${sizeClasses[size]}`
    : `bg-gradient-to-r from-spiritual-purple to-cosmic-teal text-white hover:shadow-lg hover:shadow-spiritual-purple/25 ${sizeClasses[size]}`;

  return (
    <motion.button
      className={`rounded-full font-medium transition-all duration-300 ${buttonClasses} ${className}`}
      onClick={handleFollowToggle}
      disabled={loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {isFollowing ? 'Unfollowing...' : 'Following...'}
        </span>
      ) : (
        <>
          {isFollowing ? (
            isHovered ? 'Unfollow' : 'Following'
          ) : (
            'Follow'
          )}
        </>
      )}
    </motion.button>
  );
};

export default FollowButton;