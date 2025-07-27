'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ContentSectionProps {
  title: string;
  tagline: string;
  description: string;
  image: string;
  backContent: string;
  buttonText: string;
  buttonLink: string;
}

const ContentSection = ({
  title,
  tagline,
  description,
  image,
  backContent,
  buttonText,
  buttonLink,
}: ContentSectionProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  // Handle card flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Handle keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
  };

  // GSAP animation on mount
  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { 
        y: 50, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8,
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top bottom-=100',
          end: 'bottom center',
          toggleActions: 'play none none none'
        }
      }
    );
  }, []);

  return (
    <div 
      ref={cardRef}
      className="cosmic-card h-[500px] w-full"
      style={{ transformStyle: 'preserve-3d', transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
    >
      <div 
        className="relative w-full h-full"
        style={{ 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)', 
          transformStyle: 'preserve-3d',
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Front of card */}
        <div 
          ref={frontRef}
          className="absolute inset-0 p-6 flex flex-col justify-between backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
            <Image 
              src={image} 
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep to-transparent"></div>
          </div>
          
          <div className="flex-grow">
            <span className="text-spiritual-gold text-sm font-medium">{tagline}</span>
            <h3 className="text-2xl font-bold mb-2 text-3d">{title}</h3>
            <p className="text-cosmic-light/80">{description}</p>
          </div>
          
          <div className="text-center mt-4">
            <span className="text-sm text-spiritual-purple">Tap to learn more</span>
          </div>
        </div>
        
        {/* Back of card */}
        <div 
          ref={backRef}
          className="absolute inset-0 p-6 flex flex-col justify-between backface-hidden bg-cosmic-purple/30"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <h3 className="text-2xl font-bold mb-4 text-3d text-center">{title}</h3>
          
          <div className="flex-grow flex items-center">
            <p className="text-cosmic-light text-center">{backContent}</p>
          </div>
          
          <div className="text-center mt-4">
            <Link href={buttonLink}>
              <button className="cosmic-button">
                {buttonText}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;