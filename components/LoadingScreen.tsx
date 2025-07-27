'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  progress?: number;
  currentStep?: string;
}

const LoadingScreen = ({ progress = 0, currentStep = "Initializing cosmic realm..." }: LoadingScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);
  const lotusRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Animate rings
    gsap.to(ring1Ref.current, {
      rotation: 360,
      duration: 8,
      repeat: -1,
      ease: "linear"
    });
    
    gsap.to(ring2Ref.current, {
      rotation: -360,
      duration: 12,
      repeat: -1,
      ease: "linear"
    });
    
    gsap.to(ring3Ref.current, {
      rotation: 360,
      duration: 16,
      repeat: -1,
      ease: "linear"
    });
    
    // Animate lotus
    gsap.to(lotusRef.current, {
      scale: 1.05,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    // Update progress bar
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        duration: 0.3,
        ease: "power1.out"
      });
    }
    
    // Particle burst effect on step change
    if (containerRef.current && progress % 15 === 0) { // Trigger effect at intervals
      const particles = 12;
      for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 bg-spiritual-gold rounded-full';
        containerRef.current.appendChild(particle);
        
        const angle = (i / particles) * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        const duration = 0.5 + Math.random() * 0.5;
        
        gsap.fromTo(
          particle,
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1
          },
          {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            opacity: 0,
            scale: 0,
            duration: duration,
            onComplete: () => {
              if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
              }
            }
          }
        );
      }
    }
  }, [progress]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cosmic-gradient"
    >
      <div className="relative w-40 h-40 mb-8">
        {/* Rotating rings */}
        <div 
          ref={ring1Ref}
          className="absolute inset-0 border-2 border-spiritual-purple rounded-full"
        ></div>
        <div 
          ref={ring2Ref}
          className="absolute inset-2 border-2 border-spiritual-gold rounded-full"
        ></div>
        <div 
          ref={ring3Ref}
          className="absolute inset-4 border-2 border-cosmic-teal rounded-full"
        ></div>
        
        {/* Lotus icon */}
        <div 
          ref={lotusRef}
          className="absolute inset-0 flex items-center justify-center text-4xl text-spiritual-gold"
        >
          <i className="fas fa-spa"></i>
        </div>
      </div>
      
      {/* Loading text */}
      <div 
        ref={progressTextRef}
        className="h-8 mb-4 text-cosmic-light text-center"
      >
        {currentStep}
      </div>
      
      {/* Progress bar */}
      <div className="w-64 h-1 bg-cosmic-light/20 rounded-full overflow-hidden">
        <div 
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingScreen;