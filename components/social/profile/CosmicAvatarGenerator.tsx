// Cosmic avatar generator component with AI-based spiritual avatar generation
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../lib/store/hooks';
import { generateAvatar } from '../../../lib/store/slices/profileSlice';
import gsap from 'gsap';

interface CosmicAvatarGeneratorProps {
  userId: string;
  birthChart?: {
    sunSign: string;
    moonSign: string;
    ascendant: string;
  };
  onGenerate?: () => void;
  onClose?: () => void;
}

const CosmicAvatarGenerator: React.FC<CosmicAvatarGeneratorProps> = ({ 
  userId, 
  birthChart, 
  onGenerate,
  onClose
}) => {
  const dispatch = useAppDispatch();
  const [generating, setGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('cosmic');
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [previewAvatars, setPreviewAvatars] = useState<string[]>([]);
  
  const modalRef = useRef<HTMLDivElement>(null);

  const avatarStyles = [
    { id: 'cosmic', name: 'Cosmic', description: 'Starfield and galaxy themes' },
    { id: 'mystical', name: 'Mystical', description: 'Magical and ethereal elements' },
    { id: 'spiritual', name: 'Spiritual', description: 'Sacred geometry and symbols' },
    { id: 'elemental', name: 'Elemental', description: 'Based on your astrological elements' }
  ];

  const cosmicElements = [
    { id: 'stars', name: 'Stars', emoji: '⭐' },
    { id: 'moon', name: 'Moon Phases', emoji: '🌙' },
    { id: 'crystals', name: 'Crystals', emoji: '💎' },
    { id: 'chakras', name: 'Chakras', emoji: '🌈' },
    { id: 'mandala', name: 'Mandala', emoji: '🔮' },
    { id: 'lotus', name: 'Lotus', emoji: '🪷' },
    { id: 'sacred-geometry', name: 'Sacred Geometry', emoji: '🔺' },
    { id: 'aura', name: 'Aura', emoji: '✨' }
  ];

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, []);

  const handleElementToggle = (elementId: string) => {
    setSelectedElements(prev => 
      prev.includes(elementId) 
        ? prev.filter(id => id !== elementId)
        : [...prev, elementId]
    );
  };

  const generatePreviewAvatars = () => {
    // In a real implementation, this would call an AI service
    // For now, we'll simulate with placeholder avatars
    const mockAvatars = [
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}-cosmic-1`,
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}-cosmic-2`,
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}-cosmic-3`,
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}-cosmic-4`
    ];
    setPreviewAvatars(mockAvatars);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    
    try {
      // Generate preview avatars first
      generatePreviewAvatars();
      
      // In a real implementation, this would call the AI avatar generation service
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onGenerate) {
        onGenerate();
      }
    } catch (error) {
      console.error('Failed to generate avatar:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectAvatar = async (avatarUrl: string) => {
    try {
      await dispatch(generateAvatar({
        userId,
        birthChart: birthChart || {}
      })).unwrap();
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to set avatar:', error);
    }
  };

  const getAstrologyInfluence = () => {
    if (!birthChart?.sunSign) return '';
    
    const influences = {
      'Aries': 'fiery and dynamic energy',
      'Taurus': 'earthy and grounded essence',
      'Gemini': 'airy and communicative spirit',
      'Cancer': 'watery and intuitive nature',
      'Leo': 'radiant and confident aura',
      'Virgo': 'precise and healing energy',
      'Libra': 'harmonious and balanced essence',
      'Scorpio': 'mysterious and transformative power',
      'Sagittarius': 'adventurous and philosophical spirit',
      'Capricorn': 'structured and ambitious energy',
      'Aquarius': 'innovative and humanitarian essence',
      'Pisces': 'dreamy and compassionate nature'
    };
    
    return influences[birthChart.sunSign as keyof typeof influences] || 'cosmic energy';
  };

  return (
    <div ref={modalRef} className="cosmic-avatar-generator">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-cinzel font-bold text-spiritual-gold">
          Generate Cosmic Avatar
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cosmic-purple/50 hover:bg-cosmic-purple/70 flex items-center justify-center text-cosmic-light transition-colors duration-200"
          >
            ×
          </button>
        )}
      </div>

      {/* Astrological Influence */}
      {birthChart?.sunSign && (
        <div className="mb-6 p-4 bg-cosmic-deep/50 rounded-lg border border-spiritual-purple/20">
          <p className="text-cosmic-light/80 text-sm">
            <span className="text-spiritual-gold">✨ Astrological Influence:</span> Your avatar will be infused with {getAstrologyInfluence()} from your {birthChart.sunSign} sun sign.
          </p>
        </div>
      )}

      {/* Avatar Style Selection */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-cosmic-light mb-3">Choose Avatar Style</h4>
        <div className="grid grid-cols-2 gap-3">
          {avatarStyles.map(style => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`p-3 rounded-lg border text-left transition-all duration-300 ${
                selectedStyle === style.id
                  ? 'bg-spiritual-purple/50 border-spiritual-purple text-cosmic-light'
                  : 'bg-cosmic-deep/30 border-spiritual-purple/20 text-cosmic-light/80 hover:bg-cosmic-deep/50'
              }`}
            >
              <div className="font-medium">{style.name}</div>
              <div className="text-xs opacity-80">{style.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cosmic Elements */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-cosmic-light mb-3">
          Select Cosmic Elements (optional)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {cosmicElements.map(element => (
            <button
              key={element.id}
              onClick={() => handleElementToggle(element.id)}
              className={`p-2 rounded-lg border text-left transition-all duration-300 flex items-center gap-2 ${
                selectedElements.includes(element.id)
                  ? 'bg-spiritual-purple/50 border-spiritual-purple text-cosmic-light'
                  : 'bg-cosmic-deep/30 border-spiritual-purple/20 text-cosmic-light/80 hover:bg-cosmic-deep/50'
              }`}
            >
              <span className="text-lg">{element.emoji}</span>
              <span className="text-sm">{element.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Avatars */}
      {previewAvatars.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-cosmic-light mb-3">
            Choose Your Avatar
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {previewAvatars.map((avatar, index) => (
              <button
                key={index}
                onClick={() => handleSelectAvatar(avatar)}
                className="group relative aspect-square rounded-lg overflow-hidden border-2 border-spiritual-purple/30 hover:border-spiritual-purple transition-all duration-300"
              >
                <img
                  src={avatar}
                  alt={`Avatar option ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
                  <span className="text-white text-sm font-medium">Select</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="flex gap-3">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-spiritual-purple to-cosmic-teal rounded-lg text-white font-medium hover:shadow-lg hover:shadow-spiritual-purple/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              Generating...
            </div>
          ) : (
            'Generate Avatars'
          )}
        </button>
        
        {onClose && (
          <button
            onClick={onClose}
            className="px-6 py-3 bg-cosmic-purple/50 border border-spiritual-purple/50 rounded-lg text-cosmic-light hover:bg-cosmic-purple/70 transition-all duration-300"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Info Text */}
      <p className="text-cosmic-light/60 text-xs mt-4 text-center">
        Your cosmic avatar will be generated based on your astrological profile and selected elements
      </p>
    </div>
  );
};

export default CosmicAvatarGenerator;