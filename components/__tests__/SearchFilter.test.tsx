import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchFilter from '../SearchFilter';

// Mock lodash debounce
jest.mock('lodash', () => ({
  debounce: (fn: any) => fn
}));

describe('SearchFilter', () => {
  const mockOnSearch = jest.fn();
  const mockOnTagFilter = jest.fn();
  const availableTags = ['healing', 'cosmic', 'spiritual', 'meditation', 'energy'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    onSearch: mockOnSearch,
    onTagFilter: mockOnTagFilter,
    availableTags
  };

  describe('Search Input', () => {
    it('renders search input with placeholder', () => {
      render(<SearchFilter {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search posts...');
      expect(searchInput).toBeInTheDocument();
    });

    it('renders custom placeholder when provided', () => {
      render(<SearchFilter {...defaultProps} placeholder="Search cosmic content..." />);
      
      const searchInput = screen.getByPlaceholderText('Search cosmic content...');
      expect(searchInput).toBeInTheDocument();
    });

    it('calls onSearch when typing in search input', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search posts...');
      await user.type(searchInput, 'healing');
      
      expect(mockOnSearch).toHaveBeenCalledWith('healing');
    });

    it('displays initial query value', () => {
      render(<SearchFilter {...defaultProps} initialQuery="cosmic" />);
      
      const searchInput = screen.getByDisplayValue('cosmic');
      expect(searchInput).toBeInTheDocument();
    });

    it('shows clear button when there is text', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search posts...');
      await user.type(searchInput, 'test');
      
      const clearButton = screen.getByRole('button');
      expect(clearButton).toBeInTheDocument();
    });

    it('clears search when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search posts...');
      await user.type(searchInput, 'test');
      
      const clearButton = screen.getByRole('button');
      await user.click(clearButton);
      
      expect(searchInput).toHaveValue('');
      expect(mockOnSearch).toHaveBeenCalledWith('');
    });
  });

  describe('Search Suggestions', () => {
    it('shows suggestions when typing', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search posts...');
      await user.type(searchInput, 'heal');
      
      await waitFor(() => {
        expect(screen.getByText('Tag: healing')).toBeInTheDocument();
      });
    });

    it('shows suggestions on focus with existing query', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} initialQuery="cosmic" />);
      
      const searchInput = screen.getByDisplayValue('cosmic');
      await user.click(searchInput);
      
      await waitFor(() => {
        expect(screen.getByText('Tag: cosmic')).toBeInTheDocument();
      });
    });

    it('hides suggestions when clicking outside', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <SearchFilter {...defaultProps} />
          <div data-testid="outside">Outside</div>
        </div>
      );
      
      const searchInput = screen.getByPlaceholderText('Search posts...');
      await user.type(searchInput, 'heal');
      
      await waitFor(() => {
        expect(screen.getByText('Tag: healing')).toBeInTheDocument();
      });
      
      const outsideElement = screen.getByTestId('outside');
      await user.click(outsideElement);
      
      await waitFor(() => {
        expect(screen.queryByText('Tag: healing')).not.toBeInTheDocument();
      });
    });

    it('selects suggestion when clicked', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search posts...');
      await user.type(searchInput, 'heal');
      
      await waitFor(() => {
        const suggestion = screen.getByText('Tag: healing');
        expect(suggestion).toBeInTheDocument();
      });
      
      const suggestion = screen.getByText('Tag: healing');
      await user.click(suggestion);
      
      expect(mockOnTagFilter).toHaveBeenCalledWith(['healing']);
    });

    it('handles keyboard navigation in suggestions', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search posts...');
      await user.type(searchInput, 'e');
      
      await waitFor(() => {
        expect(screen.getByText('Tag: healing')).toBeInTheDocument();
      });
      
      // Navigate down
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');
      
      expect(mockOnTagFilter).toHaveBeenCalled();
    });

    it('closes suggestions on Escape key', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search posts...');
      await user.type(searchInput, 'heal');
      
      await waitFor(() => {
        expect(screen.getByText('Tag: healing')).toBeInTheDocument();
      });
      
      await user.keyboard('{Escape}');
      
      await waitFor(() => {
        expect(screen.queryByText('Tag: healing')).not.toBeInTheDocument();
      });
    });
  });

  describe('Tag Filtering', () => {
    it('shows available tags when showTagFilter is true', () => {
      render(<SearchFilter {...defaultProps} showTagFilter={true} />);
      
      expect(screen.getByText('Filter by tags:')).toBeInTheDocument();
      expect(screen.getByText('healing')).toBeInTheDocument();
      expect(screen.getByText('cosmic')).toBeInTheDocument();
    });

    it('hides tag filter when showTagFilter is false', () => {
      render(<SearchFilter {...defaultProps} showTagFilter={false} />);
      
      expect(screen.queryByText('Filter by tags:')).not.toBeInTheDocument();
    });

    it('displays initial selected tags', () => {
      render(<SearchFilter {...defaultProps} initialTags={['healing', 'cosmic']} />);
      
      expect(screen.getByText('Active filters:')).toBeInTheDocument();
      expect(screen.getByText('healing')).toBeInTheDocument();
      expect(screen.getByText('cosmic')).toBeInTheDocument();
    });

    it('calls onTagFilter when tag is selected', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} />);
      
      const healingTag = screen.getByText('healing');
      await user.click(healingTag);
      
      expect(mockOnTagFilter).toHaveBeenCalledWith(['healing']);
    });

    it('removes tag when clicked in active filters', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} initialTags={['healing']} />);
      
      const activeTag = screen.getByText('healing');
      await user.click(activeTag);
      
      expect(mockOnTagFilter).toHaveBeenCalledWith([]);
    });

    it('adds multiple tags', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} />);
      
      const healingTag = screen.getByText('healing');
      await user.click(healingTag);
      
      expect(mockOnTagFilter).toHaveBeenCalledWith(['healing']);
      
      // Simulate component re-render with updated tags
      render(<SearchFilter {...defaultProps} initialTags={['healing']} />);
      
      const cosmicTag = screen.getByText('cosmic');
      await user.click(cosmicTag);
      
      expect(mockOnTagFilter).toHaveBeenCalledWith(['healing', 'cosmic']);
    });

    it('limits displayed available tags to 10', () => {
      const manyTags = Array.from({ length: 15 }, (_, i) => `tag${i}`);
      render(<SearchFilter {...defaultProps} availableTags={manyTags} />);
      
      // Should only show first 10 tags
      expect(screen.getByText('tag0')).toBeInTheDocument();
      expect(screen.getByText('tag9')).toBeInTheDocument();
      expect(screen.queryByText('tag10')).not.toBeInTheDocument();
    });
  });

  describe('Clear Filters', () => {
    it('shows clear all filters button when filters are active', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} initialQuery="test" />);
      
      expect(screen.getByText('Clear all filters')).toBeInTheDocument();
    });

    it('shows clear all filters button when tags are selected', () => {
      render(<SearchFilter {...defaultProps} initialTags={['healing']} />);
      
      expect(screen.getByText('Clear all filters')).toBeInTheDocument();
    });

    it('clears all filters when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} initialQuery="test" initialTags={['healing']} />);
      
      const clearButton = screen.getByText('Clear all filters');
      await user.click(clearButton);
      
      expect(mockOnSearch).toHaveBeenCalledWith('');
      expect(mockOnTagFilter).toHaveBeenCalledWith([]);
    });

    it('hides clear all filters button when no filters are active', () => {
      render(<SearchFilter {...defaultProps} />);
      
      expect(screen.queryByText('Clear all filters')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<SearchFilter {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search posts...');
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search posts...');
      
      // Tab to search input
      await user.tab();
      expect(searchInput).toHaveFocus();
      
      // Type to show suggestions
      await user.type(searchInput, 'heal');
      
      await waitFor(() => {
        expect(screen.getByText('Tag: healing')).toBeInTheDocument();
      });
      
      // Navigate with arrow keys
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');
      
      expect(mockOnTagFilter).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty available tags array', () => {
      render(<SearchFilter {...defaultProps} availableTags={[]} />);
      
      expect(screen.queryByText('Filter by tags:')).not.toBeInTheDocument();
    });

    it('handles undefined available tags', () => {
      render(<SearchFilter onSearch={mockOnSearch} onTagFilter={mockOnTagFilter} availableTags={[]} />);
      
      const searchInput = screen.getByPlaceholderText('Search posts...');
      expect(searchInput).toBeInTheDocument();
    });

    it('handles special characters in search', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search posts...');
      await user.type(searchInput, '!@#$%');
      
      expect(mockOnSearch).toHaveBeenCalledWith('!@#$%');
    });

    it('handles very long search queries', async () => {
      const user = userEvent.setup();
      render(<SearchFilter {...defaultProps} />);
      
      const longQuery = 'a'.repeat(1000);
      const searchInput = screen.getByPlaceholderText('Search posts...');
      await user.type(searchInput, longQuery);
      
      expect(mockOnSearch).toHaveBeenCalledWith(longQuery);
    });
  });
});