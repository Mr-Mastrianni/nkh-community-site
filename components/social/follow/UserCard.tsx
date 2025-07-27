'use client';

import React from 'react';
import Link from 'next/link';
import { UserProfile } from '../../../lib/types';
import { FollowButton } from './';
import { motion } from 'framer-motion';

interface UserCardProps {
  user: UserProfile;
  currentUserId?: string;
  showFollowButton?: boolean;
}

/**
 * User card component for displaying user information in lists
 * Used in followers and following lists
 */
const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  currentUserId,
  showFollowButton = true
}) => {
  return (
    <motion.div 
      className="bg-cosmic-purple/30 backdrop-blur-sm rounded-xl p-4 border border-spiritual-purple/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        {/* User Avatar */}
        <Link href={`/profile/${user.userId}`} className="flex-shrink-0">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-spiritual-purple to-cosmic-teal p-0.5">
              <div className="w-full h-full rounded-full bg-cosmic-deep flex items-center justify-center overflow-hidden">
                {user.cosmicAvatar ? (
                  <img 
                    src={user.cosmicAvatar} 
                    alt={`${user.displayName}'s cosmic avatar`}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="text-xl">🌟</div>
                )}
              </div>
            </div>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-spiritual-purple/30 to-cosmic-teal/30 animate-pulse -z-10 scale-110"></div>
          </div>
        </Link>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/profile/${user.userId}`} className="block">
            <h3 className="text-md font-medium text-cosmic-light truncate">
              {user.displayName}
            </h3>
          </Link>
          {user.astrologicalSummary && (
            <p className="text-xs text-cosmic-light/70">
              {user.astrologicalSummary.sunSign} Sun • {user.astrologicalSummary.moonSign} Moon
            </p>
          )}
        </div>

        {/* Follow Button */}
        {showFollowButton && currentUserId !== user.userId && (
          <FollowButton
            currentUserId={currentUserId}
            followingId={user.userId}
            size="sm"
          />
        )}
      </div>
    </motion.div>
  );
};

export default UserCard;