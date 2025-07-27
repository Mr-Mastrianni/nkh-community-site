'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import the 3D planet viewer to avoid SSR issues
const Planet3DViewer = dynamic(
  () => import('@/components/planetary-events/Planet3DViewer'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }
);

// Graha data with Sanskrit names and colors
const GRAHAS = [
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

export default function PlanetaryEventsPage() {
  const searchParams = useSearchParams();
  const selectedParam = searchParams.get('selected');
  
  const [selectedGraha, setSelectedGraha] = useState<typeof GRAHAS[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Set initial selected graha based on URL parameter
  useEffect(() => {
    if (selectedParam) {
      const graha = GRAHAS.find(g => g.id === selectedParam);
      if (graha) {
        setSelectedGraha(graha);
      }
    }
  }, [selectedParam]);

  const handleGrahaSelect = (graha: typeof GRAHAS[0]) => {
    setIsLoading(true);
    setSelectedGraha(graha);
    // Simulate loading time for smooth transition
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400">
            Vedic Grahas
          </h1>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Explore the nine celestial bodies of Jyotish (Vedic Astrology) in an immersive 3D experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Graha Selection Menu */}
          <motion.div 
            className="lg:col-span-1 bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-300">Celestial Bodies</h2>
            <div className="space-y-4">
              {GRAHAS.map((graha, index) => (
                <motion.button
                  key={graha.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGrahaSelect(graha)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    selectedGraha?.id === graha.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/30'
                      : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: graha.color }}
                    >
                      {graha.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{graha.name}</h3>
                      <p className="text-sm text-gray-300">{graha.sanskrit}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* 3D Visualization */}
          <motion.div 
            className="lg:col-span-2 bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-300">
              {selectedGraha ? `${selectedGraha.name} (${selectedGraha.sanskrit})` : 'Select a Graha'}
            </h2>
            
            <div className="flex-grow flex items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                  <p>Loading cosmic visualization...</p>
                </div>
              ) : selectedGraha ? (
                <Planet3DViewer graha={selectedGraha} />
              ) : (
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🌌</div>
                  <p className="text-xl text-purple-200">Select a graha to explore its 3D visualization</p>
                </div>
              )}
            </div>
            
            {selectedGraha && (
              <motion.div 
                className="mt-6 p-4 bg-gray-900/50 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-300">{selectedGraha.description}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}