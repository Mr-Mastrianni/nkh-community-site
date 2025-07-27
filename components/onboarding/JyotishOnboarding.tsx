'use client';

import { useState } from 'react';

interface JyotishOnboardingProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const JyotishOnboarding = ({ onNext, onBack }: JyotishOnboardingProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    timeZone: 'auto'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.timeOfBirth) {
      newErrors.timeOfBirth = 'Time of birth is required for accurate chart calculation';
    }
    
    if (!formData.placeOfBirth.trim()) {
      newErrors.placeOfBirth = 'Place of birth is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate birth chart calculation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would call an API to calculate the birth chart
      const chartData = {
        ...formData,
        birthChart: {
          sunSign: 'Leo',
          moonSign: 'Scorpio',
          ascendant: 'Virgo',
          // This would be calculated using Swiss Ephemeris
        }
      };
      
      onNext(chartData);
    } catch (error) {
      console.error('Error calculating birth chart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">
          <i className="fas fa-star text-spiritual-purple"></i>
        </div>
        <h2 className="text-2xl font-bold text-3d mb-2">
          Jyotish (Vedic Astrology) Profile
        </h2>
        <p className="text-cosmic-light/80">
          Share your birth details for personalized astrological insights and spiritual guidance
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-cosmic-light mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg bg-cosmic-deep/50 border ${
              errors.fullName ? 'border-red-500' : 'border-cosmic-light/20'
            } text-cosmic-light focus:outline-none focus:border-spiritual-gold transition-colors`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-cosmic-light mb-2">
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg bg-cosmic-deep/50 border ${
              errors.gender ? 'border-red-500' : 'border-cosmic-light/20'
            } text-cosmic-light focus:outline-none focus:border-spiritual-gold transition-colors`}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-400">{errors.gender}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-cosmic-light mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-cosmic-deep/50 border ${
                errors.dateOfBirth ? 'border-red-500' : 'border-cosmic-light/20'
              } text-cosmic-light focus:outline-none focus:border-spiritual-gold transition-colors`}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-400">{errors.dateOfBirth}</p>
            )}
          </div>

          <div>
            <label htmlFor="timeOfBirth" className="block text-sm font-medium text-cosmic-light mb-2">
              Time of Birth *
            </label>
            <input
              type="time"
              id="timeOfBirth"
              name="timeOfBirth"
              value={formData.timeOfBirth}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-cosmic-deep/50 border ${
                errors.timeOfBirth ? 'border-red-500' : 'border-cosmic-light/20'
              } text-cosmic-light focus:outline-none focus:border-spiritual-gold transition-colors`}
            />
            {errors.timeOfBirth && (
              <p className="mt-1 text-sm text-red-400">{errors.timeOfBirth}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="placeOfBirth" className="block text-sm font-medium text-cosmic-light mb-2">
            Place of Birth *
          </label>
          <input
            type="text"
            id="placeOfBirth"
            name="placeOfBirth"
            value={formData.placeOfBirth}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg bg-cosmic-deep/50 border ${
              errors.placeOfBirth ? 'border-red-500' : 'border-cosmic-light/20'
            } text-cosmic-light focus:outline-none focus:border-spiritual-gold transition-colors`}
            placeholder="City, State/Province, Country"
          />
          {errors.placeOfBirth && (
            <p className="mt-1 text-sm text-red-400">{errors.placeOfBirth}</p>
          )}
          <p className="mt-1 text-xs text-cosmic-light/60">
            Be as specific as possible for accurate chart calculation
          </p>
        </div>

        <div>
          <label htmlFor="timeZone" className="block text-sm font-medium text-cosmic-light mb-2">
            Time Zone
          </label>
          <select
            id="timeZone"
            name="timeZone"
            value={formData.timeZone}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-cosmic-deep/50 border border-cosmic-light/20 text-cosmic-light focus:outline-none focus:border-spiritual-gold transition-colors"
          >
            <option value="auto">Auto-detect</option>
            <option value="UTC-12">UTC-12 (Baker Island)</option>
            <option value="UTC-11">UTC-11 (American Samoa)</option>
            <option value="UTC-10">UTC-10 (Hawaii)</option>
            <option value="UTC-9">UTC-9 (Alaska)</option>
            <option value="UTC-8">UTC-8 (Pacific Time)</option>
            <option value="UTC-7">UTC-7 (Mountain Time)</option>
            <option value="UTC-6">UTC-6 (Central Time)</option>
            <option value="UTC-5">UTC-5 (Eastern Time)</option>
            <option value="UTC+0">UTC+0 (GMT)</option>
            <option value="UTC+5:30">UTC+5:30 (India Standard Time)</option>
          </select>
        </div>

        <div className="bg-cosmic-purple/20 p-4 rounded-lg">
          <div className="flex items-start">
            <i className="fas fa-info-circle text-spiritual-gold mt-1 mr-3"></i>
            <div>
              <h4 className="font-medium text-cosmic-light mb-1">Why do we need this information?</h4>
              <p className="text-sm text-cosmic-light/80">
                Your birth details are essential for calculating an accurate Vedic birth chart (Kundali). 
                This information helps us provide personalized astrological insights, life guidance, 
                and spiritual recommendations based on planetary positions at your birth time.
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 px-4 border border-cosmic-light/20 rounded-lg text-cosmic-light hover:bg-cosmic-light/10 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 cosmic-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Calculating Chart...
              </span>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JyotishOnboarding;