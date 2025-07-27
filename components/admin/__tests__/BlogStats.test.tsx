import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BlogStats from '../BlogStats';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('BlogStats Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<BlogStats />);
    
    // Check for loading state
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders blog statistics after loading', async () => {
    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        total: 10,
        published: 5,
        draft: 3,
        scheduled: 2,
      }),
    });
    
    render(<BlogStats />);
    
    // Wait for stats to load
    await waitFor(() => {
      expect(screen.getByText('Total Posts')).toBeInTheDocument();
    });
    
    // Check if stats are displayed
    expect(screen.getByText('10')).toBeInTheDocument(); // Total
    expect(screen.getByText('5')).toBeInTheDocument(); // Published
    expect(screen.getByText('3')).toBeInTheDocument(); // Drafts
    expect(screen.getByText('2')).toBeInTheDocument(); // Scheduled
  });

  it('renders error state when fetch fails', async () => {
    // Mock failed fetch
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));
    
    render(<BlogStats />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Failed to load blog statistics')).toBeInTheDocument();
    });
    
    // Check for retry button
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });
});