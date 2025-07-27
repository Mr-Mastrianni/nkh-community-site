'use client';

import { useState, useEffect, useCallback } from 'react';

const GrahaMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedPlanet, setFocusedPlanet] = useState<string | null>(null);
  
  const planets = [
    { name: 'Mercury', color: 'bg-gray-500', symbol: '☿' },
    { name: 'Venus', color: 'bg-yellow-400', symbol: '♀' },
    { name: 'Mars', color: 'bg-red-500', symbol: '♂' },
    { name: 'Jupiter', color: 'bg-yellow-200', symbol: '♃' },
    { name: 'Saturn', color: 'bg-orange-300', symbol: '♄' },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const focusPlanet = useCallback((planetName: string | null) => {
    setFocusedPlanet(planetName);
    if (typeof window !== 'undefined' && (window as any).focusOnPlanet) {
      (window as any).focusOnPlanet(planetName);
    }
  }, []);

  // Reset focus when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && (window as any).focusOnPlanet) {
        (window as any).focusOnPlanet(null);
      }
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleMenu}
        className="bg-indigo-900 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300"
        aria-label="Toggle Graha Menu"
      >
        <span className="text-xl">🪐</span>
      </button>

      {isOpen && (
        <div className="absolute top-16 right-0 bg-gray-900 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl p-4 w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-lg">Graha Menu</h3>
            <button 
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => focusPlanet(null)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                focusedPlanet === null 
                  ? 'bg-indigo-700 text-white' 
                  : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3 text-xl">🌌</span>
                <span>View All Planets</span>
              </div>
            </button>
            
            {planets.map((planet) => (
              <button
                key={planet.name}
                onClick={() => focusPlanet(planet.name)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                  focusedPlanet === planet.name 
                    ? 'bg-indigo-700 text-white' 
                    : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <span className={`w-4 h-4 rounded-full ${planet.color} mr-3`}></span>
                  <span className="mr-2 text-lg">{planet.symbol}</span>
                  <span>{planet.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GrahaMenu;