// Spiritual badges component with cosmic styling
'use client';

import React, { useEffect, useRef } from 'react';
import { Badge } from '../../../lib/types';
import gsap from 'gsap';

interface SpiritualBadgesProps {
  badges: Badge[];
}

const SpiritualBadges: React.FC<SpiritualBadgesProps> = ({ badges }) => {
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (badges.length > 0 && badgesRef.current) {
      const badgeElements = badgesRef.current.querySelectorAll('.badge-item');
      gsap.fromTo(
        badgeElements,
        { scale: 0, rotation: -180, opacity: 0 },
        { 
          scale: 1, 
          rotation: 0, 
          opacity: 1, 
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)'
        }
      );
    }
  }, [badges]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getBadgeGradient = (index: number) => {
    const gradients = [
      'from-spiritual-purple to-cosmic-teal',
      'from-cosmic-gold to-spiritual-gold',
      'from-spiritual-pink to-cosmic-purple',
      'from-cosmic-teal to-spiritual-sage',
      'from-spiritual-gold to-spiritual-pink'
    ];
    return gradients[index % gradients.length];
  };

  if (badges.length === 0) {
    return (
      <div className="bg-cosmic-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30">
        <h3 className="text-xl font-cinzel font-bold mb-4 text-spiritual-gold flex items-center gap-2">
          <span>✨</span> Spiritual Badges
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-3 opacity-50">🏆</div>
          <p className="text-cosmic-light/60">No badges earned yet</p>
          <p className="text-cosmic-light/40 text-sm mt-1">Participate in the community to earn spiritual badges</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cosmic-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30">
      <h3 className="text-xl font-cinzel font-bold mb-6 text-spiritual-gold flex items-center gap-2">
        <span>✨</span> Spiritual Badges
        <span className="text-sm font-normal text-cosmic-light/60 ml-2">({badges.length})</span>
      </h3>
      
      <div ref={badgesRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {badges.map((badge, index) => (
          <div
            key={badge.id}
            className="badge-item group relative"
          >
            <div className="relative">
              {/* Badge Container */}
              <div className={`
                w-16 h-16 rounded-full bg-gradient-to-br ${getBadgeGradient(index)} 
                p-0.5 group-hover:scale-110 transition-all duration-300
                shadow-lg group-hover:shadow-xl group-hover:shadow-spiritual-purple/25
              `}>
                <div className="w-full h-full rounded-full bg-cosmic-deep flex items-center justify-center">
                  {badge.iconUrl ? (
                    <img 
                      src={badge.iconUrl} 
                      alt={badge.name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <span className="text-2xl">🏆</span>
                  )}
                </div>
              </div>

              {/* Glow Effect */}
              <div className={`
                absolute inset-0 rounded-full bg-gradient-to-br ${getBadgeGradient(index)} 
                opacity-0 group-hover:opacity-30 transition-opacity duration-300 
                scale-125 blur-md -z-10
              `}></div>
            </div>

            {/* Badge Name */}
            <div className="text-center mt-2">
              <p className="text-xs font-medium text-cosmic-light truncate">
                {badge.name}
              </p>
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
              <div className="bg-cosmic-deep/95 backdrop-blur-sm border border-spiritual-purple/30 rounded-lg p-3 text-center min-w-48 shadow-xl">
                <h4 className="font-medium text-spiritual-gold text-sm mb-1">
                  {badge.name}
                </h4>
                <p className="text-cosmic-light/80 text-xs mb-2">
                  {badge.description}
                </p>
                <p className="text-cosmic-light/60 text-xs">
                  Earned {formatDate(badge.dateEarned)}
                </p>
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cosmic-deep/95"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievement Progress Hint */}
      <div className="mt-6 pt-4 border-t border-spiritual-purple/20">
        <p className="text-cosmic-light/60 text-sm text-center">
          Continue your spiritual journey to unlock more badges ✨
        </p>
      </div>
    </div>
  );
};

export default SpiritualBadges;