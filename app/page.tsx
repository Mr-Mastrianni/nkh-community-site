'use client';

import { useEffect, useState, useRef } from 'react';
import Sidebar from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ContentSection from '@/components/ContentSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import CosmicBackground from '@/components/CosmicBackground';
import GrahaMenu from '@/components/planetary-events/GrahaMenu';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const loadingSteps = useRef([
    "Initializing cosmic realm...",
    "Loading spiritual energies...",
    "Aligning celestial bodies...",
    "Preparing healing sanctuary...",
    "Channeling divine wisdom...",
    "Activating 3D dimensions...",
    "Synchronizing frequencies..."
  ]);
  const currentStep = useRef(0);

  // Simulate resource loading with progress tracking
  useEffect(() => {
    document.body.classList.add('loading-active');
    
    const loadResources = async () => {
      // Simulate loading different types of resources
      const steps = [
        { name: "Fonts", duration: 300 },
        { name: "Styles", duration: 200 },
        { name: "Scripts", duration: 500 },
        { name: "Images", duration: 800 },
        { name: "3D Assets", duration: 700 },
        { name: "Animations", duration: 400 },
        { name: "Finalizing", duration: 100 }
      ];

      for (const step of steps) {
        // Update progress and step
        currentStep.current = loadingSteps.current.findIndex(s => s.includes(step.name)) !== -1 
          ? loadingSteps.current.findIndex(s => s.includes(step.name)) 
          : currentStep.current;
        
        setProgress(prev => Math.min(prev + (100 / steps.length), 100));
        
        // Wait for this step to "load"
        await new Promise(resolve => setTimeout(resolve, step.duration));
      }

      // Add a small delay to ensure all animations complete
      setTimeout(() => {
        setLoading(false);
        document.body.classList.remove('loading-active');
      }, 300);
    };

    loadResources();

    // Cleanup function
    return () => {
      document.body.classList.remove('loading-active');
    };
  }, []);

  // Content sections data
  const contentSections = [
    {
      id: 'our-journey',
      title: 'OUR JOURNEY',
      tagline: 'Nonprofit',
      description: 'Discover our path of spiritual awakening and healing dedication',
      image: '/images/our_journey_spiritual.jpeg',
      backContent: 'Our sacred mission is to bring ancient wisdom to modern seekers, creating a space for transformation and healing.',
      buttonText: 'Learn More',
      buttonLink: '/about'
    },
    {
      id: 'support-mission',
      title: 'SUPPORT OUR MISSION',
      tagline: 'Your Gift Matters',
      description: 'Help us continue our healing work in the community',
      image: '/images/support_mission_hands.jpg',
      backContent: 'Your contributions enable us to provide healing services to those in need and expand our educational programs.',
      buttonText: 'Donate',
      buttonLink: '/donate'
    },
    {
      id: 'unity',
      title: 'UNITY',
      tagline: 'Community Gatherings',
      description: 'Join our circle of healing and spiritual connection',
      image: '/images/unity_community.png',
      backContent: 'Experience the power of community as we gather to meditate, learn, and grow together in spiritual harmony.',
      buttonText: 'Join the Circle',
      buttonLink: '/community'
    },
    {
      id: 'natural-wellness',
      title: 'NATURAL WELLNESS',
      tagline: 'Holistic Health',
      description: 'Discover nature\'s healing power through our curated products',
      image: '/images/natural_wellness_herbs.jpg',
      backContent: 'Our carefully selected herbs and wellness products support your journey to balance and vitality.',
      buttonText: 'Shop',
      buttonLink: '/shop'
    },
    {
      id: 'blog',
      title: 'BLOG',
      tagline: 'Stay Informed',
      description: 'Access ancient wisdom and modern healing insights',
      image: '/images/blog_ancient_wisdom.jpg',
      backContent: 'Explore our collection of articles on astrology, Ayurveda, meditation, and spiritual growth.',
      buttonText: 'Read More',
      buttonLink: '/blog'
    },
    {
      id: 'start-journey',
      title: 'START YOUR JOURNEY',
      tagline: 'Our Services',
      description: 'Begin your transformation with personalized healing sessions',
      image: '/images/healing_session.jpg',
      backContent: 'Experience personalized healing sessions tailored to your unique spiritual and wellness needs.',
      buttonText: 'Book Session',
      buttonLink: '/services'
    },
    {
      id: 'planetary-events',
      title: 'PLANETARY EVENTS',
      tagline: 'Stellar Forecasts',
      description: 'Align with the stars and cosmic energies',
      image: '/images/planetary_events_cosmic.jpg',
      backContent: 'Stay informed about upcoming planetary transits and cosmic events that influence your spiritual journey.',
      buttonText: 'View Events',
      buttonLink: '/planetary-events'
    }
  ];

  return (
    <main>
      {loading ? (
        <LoadingScreen progress={progress} currentStep={loadingSteps.current[currentStep.current]} />
      ) : (
        <>
          <CosmicBackground />
          <GrahaMenu />
          <Sidebar />
          {/* Main content with sidebar offset */}
          <div className="md:ml-80 transition-all duration-300">
            <HeroSection />
            <div className="content-sections py-16">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {contentSections.map((section) => (
                    <ContentSection 
                      key={section.id}
                      title={section.title}
                      tagline={section.tagline}
                      description={section.description}
                      image={section.image}
                      backContent={section.backContent}
                      buttonText={section.buttonText}
                      buttonLink={section.buttonLink}
                    />
                  ))}
                </div>
              </div>
            </div>
            <NewsletterSection />
            <Footer />
          </div>
        </>
      )}
    </main>
  );
}