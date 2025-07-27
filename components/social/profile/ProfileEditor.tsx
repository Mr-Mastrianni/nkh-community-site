// Profile editor component with form validation and cosmic avatar selection
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { updateProfile, generateAvatar } from '../../../lib/store/slices/profileSlice';
import { UserProfile } from '../../../lib/types';
import CosmicAvatarGenerator from './CosmicAvatarGenerator';
import InterestTags from './InterestTags';
import gsap from 'gsap';

interface ProfileEditorProps {
  userId: string;
  onSave?: () => void;
  onCancel?: () => void;
}

interface FormData {
  displayName: string;
  spiritualBio: string;
  astrologicalSummary: {
    sunSign: string;
    moonSign: string;
    ascendant: string;
  };
  ayurvedicType: {
    primaryDosha: string;
    secondaryDosha: string;
    balance: number[];
  };
  interests: string[];
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ userId, onSave, onCancel }) => {
  const dispatch = useAppDispatch();
  const { currentProfile, loading, error } = useAppSelector((state) => state.profile);
  
  const formRef = useRef<HTMLDivElement>(null);
  const [showAvatarGenerator, setShowAvatarGenerator] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    displayName: '',
    spiritualBio: '',
    astrologicalSummary: {
      sunSign: '',
      moonSign: '',
      ascendant: ''
    },
    ayurvedicType: {
      primaryDosha: '',
      secondaryDosha: '',
      balance: [33, 33, 34]
    },
    interests: []
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Zodiac signs for dropdown
  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  // Doshas for dropdown
  const doshas = ['Vata', 'Pitta', 'Kapha'];

  useEffect(() => {
    if (currentProfile) {
      setFormData({
        displayName: currentProfile.displayName,
        spiritualBio: currentProfile.spiritualBio,
        astrologicalSummary: currentProfile.astrologicalSummary,
        ayurvedicType: currentProfile.ayurvedicType,
        interests: currentProfile.interests
      });
    }
  }, [currentProfile]);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.displayName.trim()) {
      errors.displayName = 'Display name is required';
    } else if (formData.displayName.length < 2) {
      errors.displayName = 'Display name must be at least 2 characters';
    } else if (formData.displayName.length > 50) {
      errors.displayName = 'Display name must be less than 50 characters';
    }

    if (formData.spiritualBio.length > 500) {
      errors.spiritualBio = 'Bio must be less than 500 characters';
    }

    if (!formData.astrologicalSummary.sunSign) {
      errors.sunSign = 'Sun sign is required';
    }

    if (!formData.ayurvedicType.primaryDosha) {
      errors.primaryDosha = 'Primary dosha is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof FormData] as any,
        [field]: value
      }
    }));
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDoshaBalanceChange = (index: number, value: number) => {
    const newBalance = [...formData.ayurvedicType.balance];
    newBalance[index] = value;
    
    // Ensure total equals 100
    const total = newBalance.reduce((sum, val) => sum + val, 0);
    if (total !== 100) {
      const diff = 100 - total;
      const otherIndices = [0, 1, 2].filter(i => i !== index);
      const adjustment = diff / otherIndices.length;
      otherIndices.forEach(i => {
        newBalance[i] = Math.max(0, Math.min(100, newBalance[i] + adjustment));
      });
    }
    
    handleNestedInputChange('ayurvedicType', 'balance', newBalance);
  };

  const handleAddInterest = (interest: string) => {
    if (!formData.interests.includes(interest)) {
      handleInputChange('interests', [...formData.interests, interest]);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    handleInputChange('interests', formData.interests.filter(i => i !== interest));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(updateProfile({
        userId,
        updates: formData
      })).unwrap();
      
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleGenerateAvatar = async () => {
    try {
      await dispatch(generateAvatar({
        userId,
        birthChart: formData.astrologicalSummary
      })).unwrap();
    } catch (error) {
      console.error('Failed to generate avatar:', error);
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-deep text-cosmic-light">
      {/* Cosmic Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/20 via-transparent to-cosmic-blue/20 pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div ref={formRef} className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-cinzel font-bold mb-2 bg-gradient-to-r from-spiritual-gold to-cosmic-gold bg-clip-text text-transparent">
              Edit Your Cosmic Profile
            </h1>
            <p className="text-cosmic-light/80">
              Update your spiritual journey and cosmic identity
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-cosmic-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30">
              <h3 className="text-xl font-cinzel font-bold mb-6 text-spiritual-gold flex items-center gap-2">
                <span>✨</span> Basic Information
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Display Name */}
                <div>
                  <label className="block text-cosmic-light/80 text-sm font-medium mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    className={`w-full px-4 py-3 bg-cosmic-deep/50 border rounded-lg text-cosmic-light placeholder-cosmic-light/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      formErrors.displayName 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-spiritual-purple/30 focus:border-spiritual-purple focus:ring-spiritual-purple/50'
                    }`}
                    placeholder="Your cosmic name..."
                  />
                  {formErrors.displayName && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.displayName}</p>
                  )}
                </div>

                {/* Avatar Section */}
                <div>
                  <label className="block text-cosmic-light/80 text-sm font-medium mb-2">
                    Cosmic Avatar
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-spiritual-purple to-cosmic-teal p-1">
                      <div className="w-full h-full rounded-full bg-cosmic-deep flex items-center justify-center overflow-hidden">
                        {currentProfile?.cosmicAvatar ? (
                          <img 
                            src={currentProfile.cosmicAvatar} 
                            alt="Current avatar"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="text-2xl">🌟</div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAvatarGenerator(true)}
                      className="px-4 py-2 bg-gradient-to-r from-spiritual-purple to-cosmic-teal rounded-lg text-white font-medium hover:shadow-lg hover:shadow-spiritual-purple/25 transition-all duration-300"
                    >
                      Generate New Avatar
                    </button>
                  </div>
                </div>
              </div>

              {/* Spiritual Bio */}
              <div className="mt-6">
                <label className="block text-cosmic-light/80 text-sm font-medium mb-2">
                  Spiritual Bio
                  <span className="text-cosmic-light/60 text-xs ml-2">
                    ({formData.spiritualBio.length}/500)
                  </span>
                </label>
                <textarea
                  value={formData.spiritualBio}
                  onChange={(e) => handleInputChange('spiritualBio', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 bg-cosmic-deep/50 border rounded-lg text-cosmic-light placeholder-cosmic-light/50 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                    formErrors.spiritualBio 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-spiritual-purple/30 focus:border-spiritual-purple focus:ring-spiritual-purple/50'
                  }`}
                  placeholder="Share your spiritual journey and practices..."
                />
                {formErrors.spiritualBio && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.spiritualBio}</p>
                )}
              </div>
            </div>

            {/* Astrological Information */}
            <div className="bg-cosmic-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30">
              <h3 className="text-xl font-cinzel font-bold mb-6 text-spiritual-gold flex items-center gap-2">
                <span>🌙</span> Astrological Profile
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sun Sign */}
                <div>
                  <label className="block text-cosmic-light/80 text-sm font-medium mb-2">
                    Sun Sign *
                  </label>
                  <select
                    value={formData.astrologicalSummary.sunSign}
                    onChange={(e) => handleNestedInputChange('astrologicalSummary', 'sunSign', e.target.value)}
                    className={`w-full px-4 py-3 bg-cosmic-deep/50 border rounded-lg text-cosmic-light focus:outline-none focus:ring-2 transition-all duration-300 ${
                      formErrors.sunSign 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-spiritual-purple/30 focus:border-spiritual-purple focus:ring-spiritual-purple/50'
                    }`}
                  >
                    <option value="">Select Sun Sign</option>
                    {zodiacSigns.map(sign => (
                      <option key={sign} value={sign} className="bg-cosmic-deep">
                        {sign}
                      </option>
                    ))}
                  </select>
                  {formErrors.sunSign && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.sunSign}</p>
                  )}
                </div>

                {/* Moon Sign */}
                <div>
                  <label className="block text-cosmic-light/80 text-sm font-medium mb-2">
                    Moon Sign
                  </label>
                  <select
                    value={formData.astrologicalSummary.moonSign}
                    onChange={(e) => handleNestedInputChange('astrologicalSummary', 'moonSign', e.target.value)}
                    className="w-full px-4 py-3 bg-cosmic-deep/50 border border-spiritual-purple/30 rounded-lg text-cosmic-light focus:outline-none focus:border-spiritual-purple focus:ring-2 focus:ring-spiritual-purple/50 transition-all duration-300"
                  >
                    <option value="">Select Moon Sign</option>
                    {zodiacSigns.map(sign => (
                      <option key={sign} value={sign} className="bg-cosmic-deep">
                        {sign}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ascendant */}
                <div>
                  <label className="block text-cosmic-light/80 text-sm font-medium mb-2">
                    Ascendant
                  </label>
                  <select
                    value={formData.astrologicalSummary.ascendant}
                    onChange={(e) => handleNestedInputChange('astrologicalSummary', 'ascendant', e.target.value)}
                    className="w-full px-4 py-3 bg-cosmic-deep/50 border border-spiritual-purple/30 rounded-lg text-cosmic-light focus:outline-none focus:border-spiritual-purple focus:ring-2 focus:ring-spiritual-purple/50 transition-all duration-300"
                  >
                    <option value="">Select Ascendant</option>
                    {zodiacSigns.map(sign => (
                      <option key={sign} value={sign} className="bg-cosmic-deep">
                        {sign}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Ayurvedic Information */}
            <div className="bg-cosmic-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30">
              <h3 className="text-xl font-cinzel font-bold mb-6 text-spiritual-gold flex items-center gap-2">
                <span>🕉️</span> Ayurvedic Constitution
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Primary Dosha */}
                <div>
                  <label className="block text-cosmic-light/80 text-sm font-medium mb-2">
                    Primary Dosha *
                  </label>
                  <select
                    value={formData.ayurvedicType.primaryDosha}
                    onChange={(e) => handleNestedInputChange('ayurvedicType', 'primaryDosha', e.target.value)}
                    className={`w-full px-4 py-3 bg-cosmic-deep/50 border rounded-lg text-cosmic-light focus:outline-none focus:ring-2 transition-all duration-300 ${
                      formErrors.primaryDosha 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-spiritual-purple/30 focus:border-spiritual-purple focus:ring-spiritual-purple/50'
                    }`}
                  >
                    <option value="">Select Primary Dosha</option>
                    {doshas.map(dosha => (
                      <option key={dosha} value={dosha} className="bg-cosmic-deep">
                        {dosha}
                      </option>
                    ))}
                  </select>
                  {formErrors.primaryDosha && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.primaryDosha}</p>
                  )}
                </div>

                {/* Secondary Dosha */}
                <div>
                  <label className="block text-cosmic-light/80 text-sm font-medium mb-2">
                    Secondary Dosha
                  </label>
                  <select
                    value={formData.ayurvedicType.secondaryDosha}
                    onChange={(e) => handleNestedInputChange('ayurvedicType', 'secondaryDosha', e.target.value)}
                    className="w-full px-4 py-3 bg-cosmic-deep/50 border border-spiritual-purple/30 rounded-lg text-cosmic-light focus:outline-none focus:border-spiritual-purple focus:ring-2 focus:ring-spiritual-purple/50 transition-all duration-300"
                  >
                    <option value="">Select Secondary Dosha</option>
                    {doshas.map(dosha => (
                      <option key={dosha} value={dosha} className="bg-cosmic-deep">
                        {dosha}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dosha Balance Sliders */}
              <div>
                <label className="block text-cosmic-light/80 text-sm font-medium mb-4">
                  Dosha Balance (%)
                </label>
                <div className="space-y-4">
                  {['Vata', 'Pitta', 'Kapha'].map((dosha, index) => (
                    <div key={dosha} className="flex items-center gap-4">
                      <div className="w-16 text-cosmic-light/80 text-sm">{dosha}</div>
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.ayurvedicType.balance[index]}
                          onChange={(e) => handleDoshaBalanceChange(index, parseInt(e.target.value))}
                          className="w-full h-2 bg-cosmic-deep rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      <div className="w-12 text-cosmic-light text-sm text-right">
                        {Math.round(formData.ayurvedicType.balance[index])}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sacred Interests */}
            <div className="bg-cosmic-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30">
              <h3 className="text-xl font-cinzel font-bold mb-6 text-spiritual-gold flex items-center gap-2">
                <span>🌟</span> Sacred Interests
              </h3>
              <InterestTags
                interests={formData.interests}
                onAdd={handleAddInterest}
                onRemove={handleRemoveInterest}
                editable={true}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-8 py-3 bg-cosmic-purple/50 border border-spiritual-purple/50 rounded-lg text-cosmic-light font-medium hover:bg-cosmic-purple/70 transition-all duration-300"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-spiritual-purple to-cosmic-teal rounded-lg text-white font-medium hover:shadow-lg hover:shadow-spiritual-purple/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Generator Modal */}
      {showAvatarGenerator && (
        <div className="fixed inset-0 bg-cosmic-deep/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-cosmic-purple/90 backdrop-blur-sm rounded-2xl p-6 border border-spiritual-purple/30 max-w-md w-full">
            <CosmicAvatarGenerator
              userId={userId}
              birthChart={formData.astrologicalSummary}
              onGenerate={handleGenerateAvatar}
              onClose={() => setShowAvatarGenerator(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditor;