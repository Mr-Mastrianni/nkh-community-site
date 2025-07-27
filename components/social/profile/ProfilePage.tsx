// Profile page component with cosmic styling
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { fetchProfile } from '../../../lib/store/slices/profileSlice';
import { fetchFollowStats } from '../../../lib/store/slices/followSlice';
import { UserProfile } from '../../../lib/types';
import SpiritualBadges from './SpiritualBadges';
import InterestTags from './InterestTags';
import UserSuggestions from './UserSuggestions';
import { FollowButton, FollowModal } from '../follow';
import gsap from 'gsap';

interface ProfilePageProps {
  userId: string;
  isOwnProfile?: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId, isOwnProfile = false }) => {
  const dispatch = useAppDispatch();
  const { currentProfile, loading, error } = useAppSelector((state) => state.profile);
  const { followStats } = useAppSelector((state) => state.follow);
  
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  
  const profileRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(userId));
      dispatch(fetchFollowStats(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (currentProfile && profileRef.current) {
      // GSAP animations for profile page entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      tl.fromTo(
        avatarRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1.2 }
      )
      .fromTo(
        infoRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        '-=0.8'
      )
      .fromTo(
        statsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.6'
      );
    }
  }, [currentProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic-deep">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-spiritual-purple mx-auto mb-4"></div>
          <p className="text-cosmic-light">Loading cosmic profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic-deep">
        <div className="text-center">
          <div className="text-spiritual-pink text-6xl mb-4">✨</div>
          <p className="text-cosmic-light mb-2">Unable to load profile</p>
          <p className="text-cosmic-light/70 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic-deep">
        <div className="text-center">
          <div className="text-spiritual-gold text-6xl mb-4">🌟</div>
          <p className="text-cosmic-light">Profile not found</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDoshaColor = (dosha: string) => {
    switch (dosha.toLowerCase()) {
      case 'vata': return 'text-cosmic-teal';
      case 'pitta': return 'text-spiritual-pink';
      case 'kapha': return 'text-spiritual-sage';
      default: return 'text-cosmic-light';
    }
  };

  const getSignEmoji = (sign: string) => {
    const signEmojis: { [key: string]: string } = {
      'aries': '♈', 'taurus': '♉', 'gemini': '♊', 'cancer': '♋',
      'leo': '♌', 'virgo': '♍', 'libra': '♎', 'scorpio': '♏',
      'sagittarius': '♐', 'capricorn': '♑', 'aquarius': '♒', 'pisces': '♓'
    };
    return signEmojis[sign.toLowerCase()] || '✨';
  };

  return (
    <div ref={profileRef} className="min-h-screen bg-cosmic-deep text-cosmic-light">
      {/* Cosmic Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/20 via-transparent to-cosmic-blue/20 pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-cosmic-purple/30 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-spiritual-purple/30">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Cosmic Avatar */}
              <div ref={avatarRef} className="flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-spiritual-purple to-cosmic-teal p-1">
                    <div className="w-full h-full rounded-full bg-cosmic-deep flex items-center justify-center overflow-hidden">
                      {currentProfile.cosmicAvatar ? (
                        <img 
                          src={currentProfile.cosmicAvatar} 
                          alt={`${currentProfile.displayName}'s cosmic avatar`}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="text-4xl lg:text-5xl">🌟</div>
                      )}
                    </div>
                  </div>
                  {/* Cosmic Aura Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-spiritual-purple/50 to-cosmic-teal/50 animate-pulse -z-10 scale-110"></div>
                </div>
              </div>

              {/* Profile Info */}
              <div ref={infoRef} className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-cinzel font-bold mb-2 bg-gradient-to-r from-spiritual-gold to-cosmic-gold bg-clip-text text-transparent">
                  {currentProfile.displayName}
                </h1>
                
                <p className="text-cosmic-light/80 mb-4">
                  Joined {formatDate(currentProfile.joinDate)}
                </p>

                {currentProfile.spiritualBio && (
                  <p className="text-cosmic-light/90 mb-6 max-w-2xl leading-relaxed">
                    {currentProfile.spiritualBio}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {isOwnProfile ? (
                    <a 
                      href="/profile/edit"
                      className="px-6 py-2 bg-gradient-to-r from-spiritual-purple to-cosmic-teal rounded-full text-white font-medium hover:shadow-lg hover:shadow-spiritual-purple/25 transition-all duration-300 inline-block"
                    >
                      Edit Profile
                    </a>
                  ) : (
                    <>
                      <FollowButton 
                        currentUserId="current-user-id" // This would be replaced with actual user ID from auth system
                        followingId={userId}
                      />
                      <button className="px-6 py-2 bg-cosmic-purple/50 border border-spiritual-purple/50 rounded-full text-cosmic-light font-medium hover:bg-cosmic-purple/70 transition-all duration-300">
                        Message
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button 
              onClick={() => {
                setActiveTab('followers');
                setFollowModalOpen(true);
              }}
              className="bg-cosmic-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30 text-center hover:bg-cosmic-purple/40 transition-colors cursor-pointer"
            >
              <div className="text-2xl font-bold text-spiritual-gold mb-1">
                {followStats?.followerCount || 0}
              </div>
              <div className="text-cosmic-light/80">Followers</div>
            </button>
            <button 
              onClick={() => {
                setActiveTab('following');
                setFollowModalOpen(true);
              }}
              className="bg-cosmic-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30 text-center hover:bg-cosmic-purple/40 transition-colors cursor-pointer"
            >
              <div className="text-2xl font-bold text-spiritual-gold mb-1">
                {followStats?.followingCount || 0}
              </div>
              <div className="text-cosmic-light/80">Following</div>
            </button>
            <div className="bg-cosmic-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30 text-center">
              <div className="text-2xl font-bold text-spiritual-gold mb-1">{currentProfile.badges.length}</div>
              <div className="text-cosmic-light/80">Badges</div>
            </div>
          </div>

          {/* Spiritual Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Astrological Summary */}
            <div className="bg-cosmic-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30">
              <h3 className="text-xl font-cinzel font-bold mb-4 text-spiritual-gold flex items-center gap-2">
                <span>🌙</span> Astrological Profile
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-light/80">Sun Sign</span>
                  <span className="text-cosmic-light font-medium">
                    {getSignEmoji(currentProfile.astrologicalSummary.sunSign)} {currentProfile.astrologicalSummary.sunSign}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-light/80">Moon Sign</span>
                  <span className="text-cosmic-light font-medium">
                    {getSignEmoji(currentProfile.astrologicalSummary.moonSign)} {currentProfile.astrologicalSummary.moonSign}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-light/80">Ascendant</span>
                  <span className="text-cosmic-light font-medium">
                    {getSignEmoji(currentProfile.astrologicalSummary.ascendant)} {currentProfile.astrologicalSummary.ascendant}
                  </span>
                </div>
              </div>
            </div>

            {/* Ayurvedic Type */}
            <div className="bg-cosmic-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30">
              <h3 className="text-xl font-cinzel font-bold mb-4 text-spiritual-gold flex items-center gap-2">
                <span>🕉️</span> Ayurvedic Constitution
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-light/80">Primary Dosha</span>
                  <span className={`font-medium ${getDoshaColor(currentProfile.ayurvedicType.primaryDosha)}`}>
                    {currentProfile.ayurvedicType.primaryDosha}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-light/80">Secondary Dosha</span>
                  <span className={`font-medium ${getDoshaColor(currentProfile.ayurvedicType.secondaryDosha)}`}>
                    {currentProfile.ayurvedicType.secondaryDosha}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-cosmic-light/80 text-sm block mb-2">Dosha Balance</span>
                  <div className="flex gap-2">
                    {currentProfile.ayurvedicType.balance.map((value, index) => (
                      <div key={index} className="flex-1">
                        <div className="h-2 bg-cosmic-deep rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              index === 0 ? 'bg-cosmic-teal' : 
                              index === 1 ? 'bg-spiritual-pink' : 'bg-spiritual-sage'
                            }`}
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-cosmic-light/60 mt-1 text-center">
                          {['Vata', 'Pitta', 'Kapha'][index]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spiritual Badges */}
          {currentProfile.badges.length > 0 && (
            <div className="mb-8">
              <SpiritualBadges badges={currentProfile.badges} />
            </div>
          )}

          {/* Sacred Interests */}
          {currentProfile.interests.length > 0 && (
            <div className="mb-8">
              <InterestTags interests={currentProfile.interests} />
            </div>
          )}

          {/* User Suggestions - Only show on own profile */}
          {isOwnProfile && (
            <div className="mb-8">
              <UserSuggestions userId={userId} maxSuggestions={6} />
            </div>
          )}
        </div>
      </div>
      
      {/* Follow Modal */}
      <FollowModal
        userId={userId}
        currentUserId="current-user-id" // This would be replaced with actual user ID from auth system
        initialTab={activeTab}
        isOpen={followModalOpen}
        onClose={() => setFollowModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;