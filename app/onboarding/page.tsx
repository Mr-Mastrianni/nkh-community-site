'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CosmicBackground from '@/components/CosmicBackground';
import JyotishOnboarding from '@/components/onboarding/JyotishOnboarding';
import AyurvedicOnboarding from '@/components/onboarding/AyurvedicOnboarding';

const OnboardingPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    jyotish: {},
    ayurvedic: {}
  });

  const steps = [
    {
      title: 'Welcome to Your Spiritual Journey',
      description: 'Let us guide you through a personalized experience based on ancient wisdom',
      component: 'welcome'
    },
    {
      title: 'Jyotish (Vedic Astrology) Profile',
      description: 'Share your birth details for personalized astrological insights',
      component: 'jyotish'
    },
    {
      title: 'Ayurvedic Constitution Assessment',
      description: 'Discover your unique mind-body type through Prakriti analysis',
      component: 'ayurvedic'
    },
    {
      title: 'Complete Your Profile',
      description: 'Finalize your spiritual profile and begin your journey',
      component: 'complete'
    }
  ];

  const handleNext = (data?: any) => {
    if (data) {
      setOnboardingData(prev => ({
        ...prev,
        [currentStep === 1 ? 'jyotish' : 'ayurvedic']: data
      }));
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.component) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-6">
              <i className="fas fa-spa text-spiritual-gold"></i>
            </div>
            <h2 className="text-3xl font-bold text-3d mb-4">
              Welcome to Your Spiritual Journey
            </h2>
            <p className="text-lg text-cosmic-light/80 max-w-2xl mx-auto">
              We'll guide you through a personalized onboarding experience that combines the ancient wisdom of Jyotish (Vedic Astrology) and Ayurveda to create your unique spiritual profile.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="cosmic-card p-6">
                <i className="fas fa-star text-3xl text-spiritual-purple mb-4"></i>
                <h3 className="text-xl font-bold mb-2">Jyotish Astrology</h3>
                <p className="text-cosmic-light/80">
                  Discover your life purpose, personality traits, and spiritual path through your birth chart analysis.
                </p>
              </div>
              <div className="cosmic-card p-6">
                <i className="fas fa-leaf text-3xl text-spiritual-sage mb-4"></i>
                <h3 className="text-xl font-bold mb-2">Ayurvedic Wisdom</h3>
                <p className="text-cosmic-light/80">
                  Learn your unique constitution and receive personalized lifestyle recommendations for optimal health.
                </p>
              </div>
            </div>
            <button onClick={() => handleNext()} className="cosmic-button mt-8">
              Begin Your Journey
            </button>
          </div>
        );
        
      case 'jyotish':
        return <JyotishOnboarding onNext={handleNext} onBack={handleBack} />;
        
      case 'ayurvedic':
        return <AyurvedicOnboarding onNext={handleNext} onBack={handleBack} />;
        
      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-6">
              <i className="fas fa-check-circle text-spiritual-sage"></i>
            </div>
            <h2 className="text-3xl font-bold text-3d mb-4">
              Your Spiritual Profile is Complete!
            </h2>
            <p className="text-lg text-cosmic-light/80 max-w-2xl mx-auto">
              Congratulations! Your personalized spiritual profile has been created. You can now access your birth chart analysis, Ayurvedic recommendations, and connect with our healing community.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="cosmic-card p-4">
                <i className="fas fa-chart-pie text-2xl text-spiritual-gold mb-2"></i>
                <h4 className="font-bold">Birth Chart</h4>
                <p className="text-sm text-cosmic-light/80">View your complete astrological analysis</p>
              </div>
              <div className="cosmic-card p-4">
                <i className="fas fa-heartbeat text-2xl text-spiritual-pink mb-2"></i>
                <h4 className="font-bold">Health Insights</h4>
                <p className="text-sm text-cosmic-light/80">Personalized Ayurvedic recommendations</p>
              </div>
              <div className="cosmic-card p-4">
                <i className="fas fa-users text-2xl text-spiritual-purple mb-2"></i>
                <h4 className="font-bold">Community</h4>
                <p className="text-sm text-cosmic-light/80">Connect with like-minded souls</p>
              </div>
            </div>
            <button onClick={() => handleNext()} className="cosmic-button mt-8">
              Enter Your Dashboard
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative">
      <CosmicBackground />
      
      <div className="container mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-3d">Spiritual Onboarding</h1>
            <span className="text-cosmic-light/60">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          
          <div className="w-full bg-cosmic-light/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-spiritual-purple to-spiritual-gold h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`text-xs ${index <= currentStep ? 'text-spiritual-gold' : 'text-cosmic-light/40'}`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="max-w-4xl mx-auto">
          <div className="cosmic-card p-8">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;