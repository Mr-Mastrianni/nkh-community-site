'use client';

import { useEffect } from 'react';
import CosmicBackground from '@/components/CosmicBackground';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <CosmicBackground />
      
      <div className="text-center">
        <div className="cosmic-card p-12 max-w-md">
          <div className="text-6xl mb-6">
            <i className="fas fa-exclamation-triangle text-spiritual-gold"></i>
          </div>
          
          <h1 className="text-2xl font-bold text-3d mb-4">
            Cosmic Disturbance
          </h1>
          
          <p className="text-cosmic-light/80 mb-8">
            The cosmic energies seem disrupted. Let us realign and try again.
          </p>
          
          <button onClick={reset} className="cosmic-button">
            <i className="fas fa-redo mr-2"></i>
            Realign Energies
          </button>
        </div>
      </div>
    </div>
  );
}