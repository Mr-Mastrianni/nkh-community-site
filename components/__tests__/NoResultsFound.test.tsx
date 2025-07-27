import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoResultsFound from '../NoResultsFound';

describe('NoResultsFound', () => {
  const mockOnClearFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the component with default message', () => {
      render(<NoResultsFound />);
      
      expect(screen.getByText('No posts found')).toBeInTheDocument();
      expect(screen.getByText('There are no published posts available at the moment.')).toBeInTheDocument();
    });

    it('renders cosmic icon', () => {
      render(<NoResultsFound />);
      
      const icon = screen.getByRole('generic', { hidden: true });
      expect(icon).toHaveClass('fas', 'fa-search');
    });

    it('applies custom className', () => {
      render(<NoResultsFound className="custom-class" />);
      
      const container = screen.getByText('No posts found').closest('div');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Search Query Messages', () => {
    it('shows search query specific message', () => {
      render(<NoResultsFound searchQuery="cosmic healing" />);
      
      expect(screen.getByText('No posts match "cosmic healing".')).toBeInTheDocument();
    });

    it('shows tag filter specific message', () => {
      render(<NoResultsFound selectedTags={['healing', 'meditation']} />);
      
      expect(screen.getByText('No posts match the selected tags.')).toBeInTheDocument();
    });

    it('shows combined search and tag message', () => {
      render(<NoResultsFound searchQuery="cosmic" selectedTags={['healing']} />);
      
      expect(screen.getByText('No posts match "cosmic" with the selected tags.')).toBeInTheDocument();
    });
  });

  describe('Suggestions', () => {
    it('shows default suggestions when filters are active', () => {
      render(<NoResultsFound searchQuery="test" />);
      
      expect(screen.getByText('Try these suggestions:')).toBeInTheDocument();
      expect(screen.getByText('Try different keywords')).toBeInTheDocument();
      expect(screen.getByText('Check your spelling')).toBeInTheDocument();
      expect(screen.getByText('Use more general terms')).toBeInTheDocument();
      expect(screen.getByText('Remove some filters')).toBeInTheDocument();
    });

    it('shows custom suggestions when provided', () => {
      const customSuggestions = ['Try "meditation"', 'Browse all posts', 'Check recent posts'];
      render(<NoResultsFound searchQuery="test" suggestions={customSuggestions} />);
      
      expect(screen.getByText('Try "meditation"')).toBeInTheDocument();
      expect(screen.getByText('Browse all posts')).toBeInTheDocument();
      expect(screen.getByText('Check recent posts')).toBeInTheDocument();
      
      // Should not show default suggestions
      expect(screen.queryByText('Try different keywords')).not.toBeInTheDocument();
    });

    it('does not show suggestions when no filters are active', () => {
      render(<NoResultsFound />);
      
      expect(screen.queryByText('Try these suggestions:')).not.toBeInTheDocument();
    });

    it('shows suggestion icons', () => {
      render(<NoResultsFound searchQuery="test" />);
      
      const icons = screen.getAllByRole('generic', { hidden: true }).filter(el => 
        el.classList.contains('fa-lightbulb')
      );
      expect(icons).toHaveLength(4); // One for each default suggestion
    });
  });

  describe('Clear Filters Button', () => {
    it('shows clear filters button when search query exists', () => {
      render(<NoResultsFound searchQuery="test" onClearFilters={mockOnClearFilters} />);
      
      const clearButton = screen.getByRole('button', { name: /clear all filters/i });
      expect(clearButton).toBeInTheDocument();
    });

    it('shows clear filters button when tags are selected', () => {
      render(<NoResultsFound selectedTags={['healing']} onClearFilters={mockOnClearFilters} />);
      
      const clearButton = screen.getByRole('button', { name: /clear all filters/i });
      expect(clearButton).toBeInTheDocument();
    });

    it('does not show clear filters button when no filters are active', () => {
      render(<NoResultsFound onClearFilters={mockOnClearFilters} />);
      
      const clearButton = screen.queryByRole('button', { name: /clear all filters/i });
      expect(clearButton).not.toBeInTheDocument();
    });

    it('does not show clear filters button when onClearFilters is not provided', () => {
      render(<NoResultsFound searchQuery="test" />);
      
      const clearButton = screen.queryByRole('button', { name: /clear all filters/i });
      expect(clearButton).not.toBeInTheDocument();
    });

    it('calls onClearFilters when button is clicked', async () => {
      const user = userEvent.setup();
      render(<NoResultsFound searchQuery="test" onClearFilters={mockOnClearFilters} />);
      
      const clearButton = screen.getByRole('button', { name: /clear all filters/i });
      await user.click(clearButton);
      
      expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
    });

    it('has proper button styling and icons', () => {
      render(<NoResultsFound searchQuery="test" onClearFilters={mockOnClearFilters} />);
      
      const clearButton = screen.getByRole('button', { name: /clear all filters/i });
      expect(clearButton).toHaveClass('inline-flex', 'items-center', 'space-x-2');
      
      const icon = clearButton.querySelector('.fa-times');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Cosmic Animation', () => {
    it('renders animated dots', () => {
      render(<NoResultsFound />);
      
      const dots = screen.getAllByRole('generic', { hidden: true }).filter(el => 
        el.classList.contains('animate-pulse') && el.classList.contains('w-2')
      );
      expect(dots).toHaveLength(3);
    });

    it('applies staggered animation delays', () => {
      render(<NoResultsFound />);
      
      const dots = screen.getAllByRole('generic', { hidden: true }).filter(el => 
        el.classList.contains('animate-pulse') && el.classList.contains('w-2')
      );
      
      expect(dots[0]).toHaveStyle('animation-delay: 0s');
      expect(dots[1]).toHaveStyle('animation-delay: 0.2s');
      expect(dots[2]).toHaveStyle('animation-delay: 0.4s');
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<NoResultsFound />);
      
      const mainHeading = screen.getByRole('heading', { level: 3 });
      expect(mainHeading).toHaveTextContent('No posts found');
    });

    it('has proper heading for suggestions', () => {
      render(<NoResultsFound searchQuery="test" />);
      
      const suggestionsHeading = screen.getByRole('heading', { level: 4 });
      expect(suggestionsHeading).toHaveTextContent('Try these suggestions:');
    });

    it('clear button is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<NoResultsFound searchQuery="test" onClearFilters={mockOnClearFilters} />);
      
      const clearButton = screen.getByRole('button', { name: /clear all filters/i });
      
      // Tab to button and press Enter
      await user.tab();
      expect(clearButton).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
    });

    it('has proper semantic structure', () => {
      render(<NoResultsFound searchQuery="test" />);
      
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(4); // Default suggestions
    });
  });

  describe('Edge Cases', () => {
    it('handles empty selectedTags array', () => {
      render(<NoResultsFound selectedTags={[]} searchQuery="test" />);
      
      expect(screen.getByText('No posts match "test".')).toBeInTheDocument();
    });

    it('handles empty suggestions array', () => {
      render(<NoResultsFound searchQuery="test" suggestions={[]} />);
      
      // Should fall back to default suggestions
      expect(screen.getByText('Try different keywords')).toBeInTheDocument();
    });

    it('handles very long search queries', () => {
      const longQuery = 'a'.repeat(100);
      render(<NoResultsFound searchQuery={longQuery} />);
      
      expect(screen.getByText(`No posts match "${longQuery}".`)).toBeInTheDocument();
    });

    it('handles special characters in search query', () => {
      render(<NoResultsFound searchQuery="!@#$%^&*()" />);
      
      expect(screen.getByText('No posts match "!@#$%^&*()".'));
    });

    it('handles many selected tags', () => {
      const manyTags = Array.from({ length: 10 }, (_, i) => `tag${i}`);
      render(<NoResultsFound selectedTags={manyTags} />);
      
      expect(screen.getByText('No posts match the selected tags.')).toBeInTheDocument();
    });
  });
});