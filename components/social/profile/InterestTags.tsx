// Interest tags component with cosmic styling
'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface InterestTagsProps {
  interests: string[];
  onAdd?: (interest: string) => void;
  onRemove?: (interest: string) => void;
  editable?: boolean;
}

const InterestTags: React.FC<InterestTagsProps> = ({ 
  interests, 
  onAdd, 
  onRemove, 
  editable = false 
}) => {
  const tagsRef = useRef<HTMLDivElement>(null);
  const [newInterest, setNewInterest] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (interests.length > 0 && tagsRef.current) {
      const tagElements = tagsRef.current.querySelectorAll('.interest-tag');
      gsap.fromTo(
        tagElements,
        { scale: 0, y: 20, opacity: 0 },
        { 
          scale: 1, 
          y: 0, 
          opacity: 1, 
          duration: 0.5,
          stagger: 0.05,
          ease: 'back.out(1.7)'
        }
      );
    }
  }, [interests]);

  const handleAddInterest = () => {
    if (newInterest.trim() && onAdd) {
      onAdd(newInterest.trim());
      setNewInterest('');
      setShowAddForm(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddInterest();
    } else if (e.key === 'Escape') {
      setShowAddForm(false);
      setNewInterest('');
    }
  };

  const getTagColor = (index: number) => {
    const colors = [
      'from-spiritual-purple to-cosmic-teal',
      'from-cosmic-gold to-spiritual-gold',
      'from-spiritual-pink to-cosmic-purple',
      'from-cosmic-teal to-spiritual-sage',
      'from-spiritual-gold to-spiritual-pink',
      'from-cosmic-blue to-spiritual-purple'
    ];
    return colors[index % colors.length];
  };

  const getInterestEmoji = (interest: string) => {
    const emojiMap: { [key: string]: string } = {
      'meditation': '🧘',
      'yoga': '🕉️',
      'astrology': '⭐',
      'tarot': '🔮',
      'crystals': '💎',
      'chakras': '🌈',
      'reiki': '✋',
      'ayurveda': '🌿',
      'mindfulness': '🌸',
      'spirituality': '✨',
      'healing': '💫',
      'energy': '⚡',
      'manifestation': '🌟',
      'divination': '🎴',
      'numerology': '🔢',
      'palmistry': '👋',
      'dreams': '💭',
      'intuition': '👁️',
      'sacred geometry': '🔺',
      'sound healing': '🎵'
    };
    
    const lowerInterest = interest.toLowerCase();
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (lowerInterest.includes(key)) {
        return emoji;
      }
    }
    return '🌟';
  };

  if (interests.length === 0 && !editable) {
    return (
      <div className="bg-cosmic-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30">
        <h3 className="text-xl font-cinzel font-bold mb-4 text-spiritual-gold flex items-center gap-2">
          <span>🌟</span> Sacred Interests
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-3 opacity-50">🔮</div>
          <p className="text-cosmic-light/60">No interests shared yet</p>
          <p className="text-cosmic-light/40 text-sm mt-1">Spiritual interests help connect like-minded souls</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cosmic-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-cinzel font-bold text-spiritual-gold flex items-center gap-2">
          <span>🌟</span> Sacred Interests
          {interests.length > 0 && (
            <span className="text-sm font-normal text-cosmic-light/60 ml-2">({interests.length})</span>
          )}
        </h3>
        
        {editable && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="text-sm px-3 py-1 bg-spiritual-purple/50 hover:bg-spiritual-purple/70 rounded-full text-cosmic-light transition-all duration-300 flex items-center gap-1"
          >
            <span>+</span> Add Interest
          </button>
        )}
      </div>

      {/* Add Interest Form */}
      {editable && showAddForm && (
        <div className="mb-4 p-4 bg-cosmic-deep/50 rounded-xl border border-spiritual-purple/20">
          <div className="flex gap-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter a sacred interest..."
              className="flex-1 px-3 py-2 bg-cosmic-purple/30 border border-spiritual-purple/30 rounded-lg text-cosmic-light placeholder-cosmic-light/50 focus:outline-none focus:border-spiritual-purple focus:ring-1 focus:ring-spiritual-purple"
              autoFocus
            />
            <button
              onClick={handleAddInterest}
              disabled={!newInterest.trim()}
              className="px-4 py-2 bg-gradient-to-r from-spiritual-purple to-cosmic-teal rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-spiritual-purple/25 transition-all duration-300"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewInterest('');
              }}
              className="px-4 py-2 bg-cosmic-purple/50 border border-spiritual-purple/50 rounded-lg text-cosmic-light hover:bg-cosmic-purple/70 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-cosmic-light/60 mt-2">
            Press Enter to add, Escape to cancel
          </p>
        </div>
      )}

      {/* Interest Tags */}
      {interests.length > 0 ? (
        <div ref={tagsRef} className="flex flex-wrap gap-3">
          {interests.map((interest, index) => (
            <div
              key={`${interest}-${index}`}
              className="interest-tag group relative"
            >
              <div className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full 
                bg-gradient-to-r ${getTagColor(index)} 
                text-white font-medium text-sm
                shadow-lg hover:shadow-xl hover:shadow-spiritual-purple/25
                transition-all duration-300 hover:scale-105
              `}>
                <span className="text-base">{getInterestEmoji(interest)}</span>
                <span>{interest}</span>
                
                {editable && onRemove && (
                  <button
                    onClick={() => onRemove(interest)}
                    className="ml-1 w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
                    title={`Remove ${interest}`}
                  >
                    <span className="text-xs">×</span>
                  </button>
                )}
              </div>

              {/* Glow Effect */}
              <div className={`
                absolute inset-0 rounded-full bg-gradient-to-r ${getTagColor(index)} 
                opacity-0 group-hover:opacity-30 transition-opacity duration-300 
                scale-110 blur-md -z-10
              `}></div>
            </div>
          ))}
        </div>
      ) : editable ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3 opacity-50">🔮</div>
          <p className="text-cosmic-light/60 mb-2">No interests added yet</p>
          <p className="text-cosmic-light/40 text-sm">Click "Add Interest" to share your spiritual passions</p>
        </div>
      ) : null}

      {/* Interest Suggestions */}
      {editable && interests.length > 0 && (
        <div className="mt-6 pt-4 border-t border-spiritual-purple/20">
          <p className="text-cosmic-light/60 text-sm text-center">
            Share your spiritual interests to connect with kindred souls ✨
          </p>
        </div>
      )}
    </div>
  );
};

export default InterestTags;