'use client';

import { PlanetaryEvent } from '@/lib/types/planetary-events';
import { format } from 'date-fns';

interface EventCardProps {
  event: PlanetaryEvent;
  isSelected: boolean;
  onClick: () => void;
}

export default function EventCard({ event, isSelected, onClick }: EventCardProps) {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'transit': 'from-blue-500 to-cyan-500',
      'alignment': 'from-purple-500 to-pink-500',
      'conjunction': 'from-green-500 to-emerald-500',
      'eclipse': 'from-orange-500 to-red-500',
      'station': 'from-yellow-500 to-amber-500',
      'ingress': 'from-indigo-500 to-purple-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  return (
    <div 
      className={`bg-gradient-to-br ${getTypeColor(event.type)} p-1 rounded-xl cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-2 ring-white scale-105' : 'hover:scale-102'
      }`}
      onClick={onClick}
    >
      <div className="bg-gray-900/90 rounded-lg p-4 h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-white text-lg">{event.title}</h3>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            {event.type}
          </span>
        </div>
        
        <p className="text-gray-300 text-sm mb-2 line-clamp-2">{event.description}</p>
        
        {/* Jyotish Significance */}
        <div className="mb-3 p-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg">
          <p className="text-xs text-spiritual-gold font-medium">{event.significance}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {format(new Date(event.date), 'MMM dd, yyyy')}
          </span>
          <div className="flex gap-1">
            {event.planets.slice(0, 3).map((planet, idx) => (
              <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded">
                {planet}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}