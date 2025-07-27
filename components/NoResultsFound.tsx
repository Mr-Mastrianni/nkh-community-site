'use client';

import React from 'react';

interface NoResultsFoundProps {
  searchQuery?: string;
  selectedTags?: string[];
  onClearFilters?: () => void;
  suggestions?: string[];
  className?: string;
}

const NoResultsFound: React.FC<NoResultsFoundProps> = ({
  searchQuery,
  selectedTags = [],
  onClearFilters,
  suggestions = [],
  className = ''
}) => {
  const hasFilters = searchQuery || selectedTags.length > 0;
  
  const defaultSuggestions = [
    'Try different keywords',
    'Check your spelling',
    'Use more general terms',
    'Remove some filters'
  ];

  const searchSuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions;

  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      {/* Cosmic Icon */}
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-cosmic-dark/30 rounded-full border border-spiritual-purple/30">
          <i className="fas fa-search text-3xl text-spiritual-purple/60"></i>
        </div>
      </div>

      {/* Main Message */}
      <h3 className="text-xl font-semibold text-cosmic-light mb-3">
        No posts found
      </h3>
      
      {hasFilters && (
        <p className="text-cosmic-light/70 mb-6">
          {searchQuery && selectedTags.length > 0 
            ? `No posts match "${searchQuery}" with the selected tags.`
            : searchQuery 
            ? `No posts match "${searchQuery}".`
            : 'No posts match the selected tags.'
          }
        </p>
      )}

      {!hasFilters && (
        <p className="text-cosmic-light/70 mb-6">
          There are no published posts available at the moment.
        </p>
      )}

      {/* Suggestions */}
      {hasFilters && (
        <div className="mb-8">
          <h4 className="text-lg font-medium text-cosmic-light mb-4">
            Try these suggestions:
          </h4>
          <ul className="space-y-2 text-cosmic-light/80">
            {searchSuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-center justify-center space-x-2">
                <i className="fas fa-lightbulb text-spiritual-purple/60 text-sm"></i>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Clear Filters Button */}
      {hasFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-spiritual-purple/20 hover:bg-spiritual-purple/30 text-cosmic-light rounded-xl transition-all duration-300 border border-spiritual-purple/30 hover:border-spiritual-purple/50"
        >
          <i className="fas fa-times"></i>
          <span>Clear all filters</span>
        </button>
      )}

      {/* Cosmic Animation */}
      <div className="mt-8 flex justify-center space-x-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-spiritual-purple/40 rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.5s'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default NoResultsFound;