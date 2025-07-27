'use client';

import { useState } from 'react';
import { PlanetaryEvent } from '@/lib/types/planetary-events';
import { format } from 'date-fns';

interface InteractiveTimelineProps {
  events: PlanetaryEvent[];
  selectedEvent: PlanetaryEvent | null;
  onEventSelect: (event: PlanetaryEvent) => void;
}

export default function InteractiveTimeline({ 
  events, 
  selectedEvent, 
  onEventSelect 
}: InteractiveTimelineProps) {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  return (
    <div className="relative">
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full" />
      
      <div className="space-y-8">
        {events.map((event, index) => (
          <div key={event.id} className="relative flex items-center">
            <div className={`flex-1 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
              <div 
                className={`inline-block p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedEvent?.id === event.id 
                    ? 'bg-purple-600/30 border-purple-400' 
                    : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                } border`}
                onClick={() => onEventSelect(event)}
                onMouseEnter={() => setHoveredEvent(event.id)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                <h4 className="font-bold text-white mb-1">{event.title}</h4>
                <p className="text-sm text-gray-300 mb-2">{event.description}</p>
                <p className="text-xs text-purple-400">{format(new Date(event.date), 'MMM dd, yyyy HH:mm')}</p>
              </div>
            </div>
            
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full border-2 border-black z-10" />
            
            <div className={`flex-1 ${index % 2 === 0 ? 'pl-8' : 'pr-8 text-right'}`}>
              <div className="text-sm text-gray-400">
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}