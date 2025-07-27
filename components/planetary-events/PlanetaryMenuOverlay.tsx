'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Graha {
  id: string;
  name: string;
  sanskrit: string;
  color: string;
  description: string;
}

const GRAHAS: Graha[] = [
  { 
    id: 'sun', 
    name: 'Surya', 
    sanskrit: 'सूर्य', 
    color: '#FFA500',
    description: 'The soul of the solar system, representing vitality and self'
  },
  { 
    id: 'moon', 
    name: 'Chandra', 
    sanskrit: 'चन्द्र', 
    color: '#C0C0C0',
    description: 'Represents mind, emotions, and intuition'
  },
  { 
    id: 'mars', 
    name: 'Mangala', 
    sanskrit: 'मंगल', 
    color: '#FF4500',
    description: 'Energy, courage, and protective force'
  },
  { 
    id: 'mercury', 
    name: 'Budha', 
    sanskrit: 'बुध', 
    color: '#87CEEB',
    description: 'Communication, intellect, and analytical abilities'
  },
  { 
    id: 'jupiter', 
    name: 'Guru', 
    sanskrit: 'गुरु', 
    color: '#FFD700',
    description: 'Wisdom, knowledge, and expansion'
  },
  { 
    id: 'venus', 
    name: 'Shukra', 
    sanskrit: 'शुक्र', 
    color: '#FFC0CB',
    description: 'Love, beauty, and material comforts'
  },
  { 
    id: 'saturn', 
    name: 'Shani', 
    sanskrit: 'शनि', 
    color: '#4169E1',
    description: 'Discipline, responsibility, and karmic lessons'
  },
  { 
    id: 'rahu', 
    name: 'Rahu', 
    sanskrit: 'राहु', 
    color: '#800080',
    description: 'Illusion, material desires, and karmic challenges'
  },
  { 
    id: 'ketu', 
    name: 'Ketu', 
    sanskrit: 'केतु', 
    color: '#8B4513',
    description: 'Spiritual liberation, detachment, and mystical experiences'
  }
];

interface PlanetaryMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanetaryMenuOverlay = ({ isOpen, onClose }: PlanetaryMenuOverlayProps) => {
  const router = useRouter();
  const [selectedGraha, setSelectedGraha] = useState<Graha | null>(null);

  // Close menu when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleGrahaClick = (graha: Graha) => {
    setSelectedGraha(graha);
    // Navigate to the planetary events page with the selected graha
    router.push(`/planetary-events?selected=${graha.id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-indigo-900/90 to-purple-900/90 rounded-2xl border border-purple-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="p-6 text-center border-b border-purple-500/30">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Vedic Grahas
              </motion.h2>
              <motion.p 
                className="mt-2 text-purple-200"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Select a celestial body to explore its cosmic significance
              </motion.p>
            </div>

            {/* Graha Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {GRAHAS.map((graha, index) => (
                  <motion.div
                    key={graha.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedGraha?.id === graha.id
                        ? 'ring-2 ring-purple-400 bg-gradient-to-br from-purple-700/50 to-indigo-700/50'
                        : 'bg-gray-800/50 hover:bg-gray-700/50'
                    }`}
                    onClick={() => handleGrahaClick(graha)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4"
                        style={{ backgroundColor: graha.color }}
                      >
                        {graha.name.charAt(0)}
                      </div>
                      <h3 className="text-xl font-bold text-white">{graha.name}</h3>
                      <p className="text-lg text-purple-300 mb-2">{graha.sanskrit}</p>
                      <p className="text-sm text-gray-300">{graha.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 text-center border-t border-purple-500/30">
              <p className="text-gray-400 text-sm">
                Click on any graha to explore its 3D visualization and cosmic significance
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlanetaryMenuOverlay;