'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FollowersList from './FollowersList';
import FollowingList from './FollowingList';

interface FollowModalProps {
  userId: string;
  currentUserId?: string;
  initialTab?: 'followers' | 'following';
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal component for displaying followers and following lists
 * Implements requirements 2.3, 2.4 from the requirements document
 */
const FollowModal: React.FC<FollowModalProps> = ({
  userId,
  currentUserId,
  initialTab = 'followers',
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-cosmic-deep/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-cosmic-deep border border-spiritual-purple/30 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with tabs */}
              <div className="flex border-b border-spiritual-purple/30">
                <button
                  className={`flex-1 py-4 text-center font-medium transition-colors ${
                    activeTab === 'followers'
                      ? 'text-spiritual-gold border-b-2 border-spiritual-gold'
                      : 'text-cosmic-light/70 hover:text-cosmic-light'
                  }`}
                  onClick={() => setActiveTab('followers')}
                >
                  Followers
                </button>
                <button
                  className={`flex-1 py-4 text-center font-medium transition-colors ${
                    activeTab === 'following'
                      ? 'text-spiritual-gold border-b-2 border-spiritual-gold'
                      : 'text-cosmic-light/70 hover:text-cosmic-light'
                  }`}
                  onClick={() => setActiveTab('following')}
                >
                  Following
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)]">
                {activeTab === 'followers' ? (
                  <FollowersList userId={userId} currentUserId={currentUserId} />
                ) : (
                  <FollowingList userId={userId} currentUserId={currentUserId} />
                )}
              </div>

              {/* Close button */}
              <button
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-cosmic-purple/50 text-cosmic-light hover:bg-cosmic-purple/70 transition-colors"
                onClick={onClose}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FollowModal;