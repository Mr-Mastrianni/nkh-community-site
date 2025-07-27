'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import Image from 'next/image';

const HeroSection = () => {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const handleBeginJourney = () => {
    router.push('/services');
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    // GSAP animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 }
    )
      .fromTo(
        descriptionRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        '-=0.8'
      )
      .fromTo(
        scrollIndicatorRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, repeat: -1, yoyo: true },
        '-=0.5'
      );

    // Parallax effect on scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (sectionRef.current) {
        sectionRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center pb-10 overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_spiritual_transformation.jpg"
          alt="Spiritual transformation"
          fill
          style={{ objectFit: 'cover' }}
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-cosmic-deep/60"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-cosmic-light">
            <h1 
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-3d"
            >
              Transform with...<br />
              <span className="text-spiritual-gold">Nefer Kali Healing</span> & Spiritual Education
            </h1>
            
            <p 
              ref={descriptionRef}
              className="text-lg md:text-xl opacity-90 mb-8 max-w-lg"
            >
              Embark on a mystical journey of self-discovery and healing through ancient wisdom and modern spiritual practices
            </p>
            
            <button className="cosmic-button" onClick={handleBeginJourney}>
              Begin Your Journey
            </button>
          </div>
          
          <div className="hidden lg:block">
            {/* This space is for the hero image which is set as background */}
          </div>
        </div>
      </div>
      
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-cosmic-light"
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">Explore</span>
          <i className="fas fa-chevron-down animate-bounce"></i>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;