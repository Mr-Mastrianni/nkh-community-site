'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { fetchFollowers } from '../../../lib/store/slices/followSlice';
import UserCard from './UserCard';
import { motion } from 'framer-motion';

interface FollowersListProps {
  userId: string;
  currentUserId?: string;
  maxDisplayed?: number;
}

/**
 * Component for displaying a user's followers
 * Implements requirements 2.3, 2.4 from the requirements document
 */
const FollowersList: React.FC<FollowersListProps> = ({ 
  userId, 
  currentUserId,
  maxDisplayed = 10
}) => {
  const dispatch = useAppDispatch();
  const { followers, loading } = useAppSelector((state) => state.follow);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    dispatch(fetchFollowers({ userId, page: 1 }));
  }, [dispatch, userId]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    
    const nextPage = page + 1;
    dispatch(fetchFollowers({ userId, page: nextPage }))
      .then((action) => {
        if (action.payload && Array.isArray(action.payload.followers)) {
          // If we got fewer results than expected, there are no more to load
          if (action.payload.followers.length < 20) {
            setHasMore(false);
          }
          setPage(nextPage);
        }
      });
  };

  // Display a limited number of followers if maxDisplayed is provided
  const displayedFollowers = maxDisplayed ? followers.slice(0, maxDisplayed) : followers;
  const hasMoreToShow = maxDisplayed && followers.length > maxDisplayed;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-cinzel font-bold text-spiritual-gold flex items-center gap-2">
        <span>✨</span> Followers
      </h3>

      {loading && followers.length === 0 ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-spiritual-purple"></div>
        </div>
      ) : followers.length === 0 ? (
        <div className="bg-cosmic-purple/20 backdrop-blur-sm rounded-xl p-6 text-center">
          <p className="text-cosmic-light/70">No followers yet</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3">
            {displayedFollowers.map((follower) => (
              <UserCard 
                key={follower.userId} 
                user={follower} 
                currentUserId={currentUserId}
              />
            ))}
          </div>

          {/* Show "View All" button if there are more followers than maxDisplayed */}
          {hasMoreToShow && (
            <div className="text-center mt-4">
              <button 
                onClick={() => setHasMore(true)} 
                className="text-spiritual-gold hover:text-spiritual-purple transition-colors"
              >
                View All Followers
              </button>
            </div>
          )}

          {/* Load More button for pagination */}
          {!maxDisplayed && hasMore && (
            <div className="text-center mt-4">
              <motion.button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 bg-cosmic-purple/50 border border-spiritual-purple/50 rounded-full text-cosmic-light font-medium hover:bg-cosmic-purple/70 transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? 'Loading...' : 'Load More'}
              </motion.button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FollowersList;