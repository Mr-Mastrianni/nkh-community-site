'use client';

import { useEffect } from 'react';

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
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-spiritual-purple via-cosmic-dark to-spiritual-navy">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="text-center relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-12 max-w-md">
          <div className="text-6xl mb-6">
            <i className="fas fa-exclamation-triangle text-spiritual-gold"></i>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            Cosmic Disturbance
          </h1>
          
          <p className="text-white/80 mb-8">
            The cosmic energies seem disrupted. Let us realign and try again.
          </p>
          
          <button 
            onClick={reset} 
            className="bg-spiritual-gold/80 hover:bg-spiritual-gold text-spiritual-navy font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <i className="fas fa-redo mr-2"></i>
            Realign Energies
          </button>
        </div>
      </div>
    </div>
  );
}