'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TagAutocompleteProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  suggestions: string[];
  error?: string;
}

const TagAutocomplete: React.FC<TagAutocompleteProps> = ({
  selectedTags,
  onChange,
  suggestions,
  error
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input value
  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = suggestions
      .filter(tag => 
        tag.toLowerCase().includes(inputValue.toLowerCase()) && 
        !selectedTags.includes(tag)
      )
      .slice(0, 5); // Limit to 5 suggestions
    
    setFilteredSuggestions(filtered);
  }, [inputValue, suggestions, selectedTags]);

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Add tag on Enter or comma
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } 
    // Remove last tag on Backspace if input is empty
    else if (e.key === 'Backspace' && inputValue === '' && selectedTags.length > 0) {
      const newTags = [...selectedTags];
      newTags.pop();
      onChange(newTags);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().replace(/,/g, '');
    
    if (trimmedTag && !selectedTags.includes(trimmedTag) && selectedTags.length < 10) {
      onChange([...selectedTags, trimmedTag]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const selectSuggestion = (suggestion: string) => {
    addTag(suggestion);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div 
        className={`flex flex-wrap gap-2 p-2 bg-purple-900 bg-opacity-50 border ${
          error ? 'border-red-500' : 'border-purple-500'
        } rounded-md focus-within:ring-2 focus-within:ring-purple-500`}
      >
        {/* Selected Tags */}
        {selectedTags.map(tag => (
          <div 
            key={tag}
            className="flex items-center bg-purple-700 text-white px-2 py-1 rounded-md text-sm"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-purple-200 hover:text-white focus:outline-none"
              aria-label={`Remove ${tag} tag`}
            >
              ×
            </button>
          </div>
        ))}
        
        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setShowSuggestions(true)}
          className="flex-grow min-w-[100px] bg-transparent text-white placeholder-purple-300 focus:outline-none"
          placeholder={selectedTags.length === 0 ? "Add tags..." : ""}
          disabled={selectedTags.length >= 10}
        />
      </div>
      
      {/* Tag Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-purple-900 border border-purple-500 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredSuggestions.map(suggestion => (
            <div
              key={suggestion}
              onClick={() => selectSuggestion(suggestion)}
              className="px-4 py-2 hover:bg-purple-700 cursor-pointer text-white"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      
      {/* Helper Text */}
      <p className="mt-1 text-xs text-purple-300">
        Press Enter or comma to add a tag
      </p>
    </div>
  );
};

export default TagAutocomplete;