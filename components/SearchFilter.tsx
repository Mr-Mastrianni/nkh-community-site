'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onTagFilter: (tags: string[]) => void;
  availableTags: string[];
  initialQuery?: string;
  initialTags?: string[];
  placeholder?: string;
  showTagFilter?: boolean;
}

interface SearchSuggestion {
  type: 'query' | 'tag';
  value: string;
  label: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onTagFilter,
  availableTags,
  initialQuery = '',
  initialTags = [],
  placeholder = 'Search posts...',
  showTagFilter = true
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch(searchQuery);
    }, 300),
    [onSearch]
  );

  // Generate search suggestions
  const generateSuggestions = useCallback((searchQuery: string): SearchSuggestion[] => {
    if (!searchQuery.trim()) return [];

    const queryLower = searchQuery.toLowerCase();
    const suggestions: SearchSuggestion[] = [];

    // Add matching tags as suggestions
    availableTags
      .filter(tag => 
        tag.toLowerCase().includes(queryLower) && 
        !selectedTags.includes(tag)
      )
      .slice(0, 5)
      .forEach(tag => {
        suggestions.push({
          type: 'tag',
          value: tag,
          label: `Tag: ${tag}`
        });
      });

    // Add query suggestions (common search terms)
    const commonSearchTerms = [
      'healing', 'meditation', 'spiritual', 'cosmic', 'energy', 
      'chakra', 'mindfulness', 'transformation', 'wellness', 'growth'
    ];
    
    commonSearchTerms
      .filter(term => 
        term.toLowerCase().includes(queryLower) && 
        term.toLowerCase() !== queryLower
      )
      .slice(0, 3)
      .forEach(term => {
        suggestions.push({
          type: 'query',
          value: term,
          label: `Search: ${term}`
        });
      });

    return suggestions.slice(0, 8);
  }, [availableTags, selectedTags]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Generate and show suggestions
    const newSuggestions = generateSuggestions(newQuery);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);
    setActiveSuggestionIndex(-1);
    
    // Trigger search
    debouncedSearch(newQuery);
  };

  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    onTagFilter(newTags);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'tag') {
      handleTagSelect(suggestion.value);
    } else {
      setQuery(suggestion.value);
      onSearch(suggestion.value);
    }
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0) {
          handleSuggestionSelect(suggestions[activeSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search
  const clearSearch = () => {
    setQuery('');
    onSearch('');
    setShowSuggestions(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setQuery('');
    setSelectedTags([]);
    onSearch('');
    onTagFilter([]);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              const newSuggestions = generateSuggestions(query);
              setSuggestions(newSuggestions);
              setShowSuggestions(newSuggestions.length > 0);
            }}
            placeholder={placeholder}
            className="w-full px-4 py-3 pl-12 pr-10 bg-cosmic-dark/20 backdrop-blur-sm border border-spiritual-purple/30 rounded-xl text-cosmic-light placeholder-cosmic-light/60 focus:outline-none focus:ring-2 focus:ring-spiritual-purple/50 focus:border-spiritual-purple/50 transition-all duration-300"
          />
          <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-cosmic-light/60"></i>
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cosmic-light/60 hover:text-cosmic-light transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-cosmic-dark/90 backdrop-blur-sm border border-spiritual-purple/30 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.value}`}
                onClick={() => handleSuggestionSelect(suggestion)}
                className={`w-full px-4 py-3 text-left hover:bg-spiritual-purple/20 transition-colors flex items-center space-x-3 ${
                  index === activeSuggestionIndex ? 'bg-spiritual-purple/20' : ''
                }`}
              >
                <i className={`fas ${suggestion.type === 'tag' ? 'fa-tag' : 'fa-search'} text-cosmic-light/60`}></i>
                <span className="text-cosmic-light">{suggestion.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tag Filter */}
      {showTagFilter && (
        <div className="space-y-3">
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-cosmic-light/80 font-medium">Active filters:</span>
              {selectedTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className="inline-flex items-center space-x-2 px-3 py-1 bg-spiritual-purple/30 text-cosmic-light rounded-full text-sm hover:bg-spiritual-purple/40 transition-colors"
                >
                  <span>{tag}</span>
                  <i className="fas fa-times text-xs"></i>
                </button>
              ))}
            </div>
          )}

          {/* Available Tags */}
          {availableTags.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-cosmic-light/80 font-medium">Filter by tags:</span>
              <div className="flex flex-wrap gap-2">
                {availableTags
                  .filter(tag => !selectedTags.includes(tag))
                  .slice(0, 10)
                  .map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagSelect(tag)}
                      className="inline-flex items-center space-x-2 px-3 py-1 bg-cosmic-dark/30 text-cosmic-light/80 rounded-full text-sm hover:bg-spiritual-purple/20 hover:text-cosmic-light transition-colors border border-spiritual-purple/20"
                    >
                      <i className="fas fa-tag text-xs"></i>
                      <span>{tag}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {(query || selectedTags.length > 0) && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-cosmic-light/60 hover:text-cosmic-light transition-colors flex items-center space-x-2"
            >
              <i className="fas fa-times"></i>
              <span>Clear all filters</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;