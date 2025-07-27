// User suggestions component based on shared interests
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { fetchSuggestions } from '../../../lib/store/slices/profileSlice';
import { UserSuggestion } from '../../../lib/types';
import gsap from 'gsap';

interface UserSuggestionsProps {
  userId: string;
  maxSuggestions?: number;
}

const UserSuggestions: React.FC<UserSuggestionsProps> = ({ 
  userId, 
  maxSuggestions = 6 
}) => {
  const dispatch = useAppDispatch();
  const { suggestions, loading } = useAppSelector((state) => state.profile);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchSuggestions(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (suggestions.length > 0 && suggestionsRef.current) {
      const suggestionElements = suggestionsRef.current.querySelectorAll('.suggestion-card');
      gsap.fromTo(
        suggestionElements,
        { scale: 0, y: 30, opacity: 0 },
        { 
          scale: 1, 
          y: 0, 
          opacity: 1, 
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)'
        }
      );
    }
  }, [suggestions]);

  const handleFollow = (suggestedUserId: string) => {
    // In a real implementation, this would dispatch a follow action
    console.log('Following user:', suggestedUserId);
  };

  const handleViewProfile = (suggestedUserId: string) => {
    // Navigate to user's profile
    window.location.href = `/profile/${suggestedUserId}`;
  };

  const getInterestColor = (index: number) => {
    const colors = [
      'bg-spiritual-purple/20 text-spiritual-purple',
      'bg-cosmic-teal/20 text-cosmic-teal',
      'bg-spiritual-gold/20 text-spiritual-gold',
      'bg-spiritual-pink/20 text-spiritual-pink',
      'bg-spiritual-sage/20 text-spiritual-sage'
    ];
    return colors[index % colors.length];
  };

  const getRelevanceLabel = (score: number) => {
    if (score >= 50) return { label: 'Highly Compatible', color: 'text-spiritual-gold' };
    if (score >= 30) return { label: 'Very Compatible', color: 'text-cosmic-teal' };
    if (score >= 15) return { label: 'Compatible', color: 'text-spiritual-purple' };
    return { label: 'Potentially Compatible', color: 'text-cosmic-light/60' };
  };

  if (loading) {
    return (
      <div className="bg-cosmic-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30">
        <h3 className="text-xl font-cinzel font-bold mb-6 text-spiritual-gold flex items-center gap-2">
          <span>🌟</span> Kindred Souls
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-cosmic-deep/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-cosmic-purple/50 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-cosmic-purple/50 rounded mb-2"></div>
                    <div className="h-3 bg-cosmic-purple/30 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-cosmic-purple/30 rounded"></div>
                  <div className="h-3 bg-cosmic-purple/30 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-cosmic-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30">
        <h3 className="text-xl font-cinzel font-bold mb-6 text-spiritual-gold flex items-center gap-2">
          <span>🌟</span> Kindred Souls
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-3 opacity-50">🔮</div>
          <p className="text-cosmic-light/60 mb-2">No suggestions available yet</p>
          <p className="text-cosmic-light/40 text-sm">
            Add more interests to your profile to discover kindred souls
          </p>
        </div>
      </div>
    );
  }

  const displayedSuggestions = suggestions.slice(0, maxSuggestions);

  return (
    <div className="bg-cosmic-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-cinzel font-bold text-spiritual-gold flex items-center gap-2">
          <span>🌟</span> Kindred Souls
          <span className="text-sm font-normal text-cosmic-light/60 ml-2">
            ({suggestions.length})
          </span>
        </h3>
        
        {suggestions.length > maxSuggestions && (
          <button className="text-sm text-spiritual-purple hover:text-spiritual-gold transition-colors duration-200">
            View All
          </button>
        )}
      </div>

      <div ref={suggestionsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedSuggestions.map((suggestion) => {
          const relevance = getRelevanceLabel(suggestion.relevanceScore);
          const isExpanded = expandedUser === suggestion.userId;
          
          return (
            <div
              key={suggestion.userId}
              className="suggestion-card group relative bg-cosmic-deep/50 rounded-xl p-4 border border-spiritual-purple/20 hover:border-spiritual-purple/40 transition-all duration-300 hover:shadow-lg hover:shadow-spiritual-purple/10"
            >
              {/* User Info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-spiritual-purple to-cosmic-teal p-0.5">
                    <div className="w-full h-full rounded-full bg-cosmic-deep flex items-center justify-center overflow-hidden">
                      {suggestion.cosmicAvatar ? (
                        <img 
                          src={suggestion.cosmicAvatar} 
                          alt={`${suggestion.displayName}'s avatar`}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="text-lg">🌟</div>
                      )}
                    </div>
                  </div>
                  {/* Online indicator (mock) */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-spiritual-sage rounded-full border-2 border-cosmic-deep"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-cosmic-light truncate">
                    {suggestion.displayName}
                  </h4>
                  <p className={`text-xs ${relevance.color}`}>
                    {relevance.label}
                  </p>
                </div>
              </div>

              {/* Mutual Connections */}
              {suggestion.mutualConnections > 0 && (
                <div className="flex items-center gap-1 mb-3 text-xs text-cosmic-light/60">
                  <span>👥</span>
                  <span>{suggestion.mutualConnections} mutual connection{suggestion.mutualConnections !== 1 ? 's' : ''}</span>
                </div>
              )}

              {/* Shared Interests */}
              <div className="mb-4">
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-xs text-cosmic-light/60">Shared interests:</span>
                  <span className="text-xs text-spiritual-gold">
                    {suggestion.sharedInterests.length}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {suggestion.sharedInterests.slice(0, isExpanded ? undefined : 3).map((interest, index) => (
                    <span
                      key={interest}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getInterestColor(index)}`}
                    >
                      {interest}
                    </span>
                  ))}
                  
                  {!isExpanded && suggestion.sharedInterests.length > 3 && (
                    <button
                      onClick={() => setExpandedUser(suggestion.userId)}
                      className="px-2 py-1 rounded-full text-xs text-cosmic-light/60 hover:text-cosmic-light transition-colors duration-200"
                    >
                      +{suggestion.sharedInterests.length - 3} more
                    </button>
                  )}
                  
                  {isExpanded && suggestion.sharedInterests.length > 3 && (
                    <button
                      onClick={() => setExpandedUser(null)}
                      className="px-2 py-1 rounded-full text-xs text-cosmic-light/60 hover:text-cosmic-light transition-colors duration-200"
                    >
                      Show less
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleFollow(suggestion.userId)}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-spiritual-purple to-cosmic-teal rounded-lg text-white text-sm font-medium hover:shadow-lg hover:shadow-spiritual-purple/25 transition-all duration-300"
                >
                  Follow
                </button>
                <button
                  onClick={() => handleViewProfile(suggestion.userId)}
                  className="px-3 py-2 bg-cosmic-purple/50 border border-spiritual-purple/50 rounded-lg text-cosmic-light text-sm hover:bg-cosmic-purple/70 transition-all duration-300"
                >
                  View
                </button>
              </div>

              {/* Compatibility Score Indicator */}
              <div className="absolute top-2 right-2">
                <div className="w-8 h-8 rounded-full bg-cosmic-deep/80 flex items-center justify-center">
                  <span className="text-xs font-bold text-spiritual-gold">
                    {Math.round(suggestion.relevanceScore)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-spiritual-purple/20">
        <p className="text-cosmic-light/60 text-sm text-center">
          Suggestions based on shared interests and spiritual compatibility ✨
        </p>
      </div>
    </div>
  );
};

export default UserSuggestions;