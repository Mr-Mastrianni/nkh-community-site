import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminLoginPage from '../login/page';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock the dependencies
jest.mock('@/lib/context/AuthContext');
jest.mock('next/navigation');
jest.mock('@/components/CosmicBackground', () => {
  return function MockCosmicBackground() {
    return <div data-testid="cosmic-background" />;
  };
});

describe('AdminLoginPage', () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock useAuth hook
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: null,
      loading: false
    });
    
    // Mock useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
    
    // Mock useSearchParams
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockImplementation((param) => {
        if (param === 'from') return '/admin/dashboard';
        return null;
      })
    });
  });

  it('renders the login form correctly', () => {
    render(<AdminLoginPage />);
    
    expect(screen.getByText('Admin Portal')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Admin/i })).toBeInTheDocument();
  });

  it('handles form submission with valid credentials', async () => {
    mockLogin.mockResolvedValueOnce(true);
    
    render(<AdminLoginPage />);
    
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'admin@neferkali.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'admin123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In to Admin/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@neferkali.com', 'admin123');
      expect(mockPush).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  it('displays an error message on failed login', async () => {
    mockLogin.mockResolvedValueOnce(false);
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: 'Invalid email or password',
      loading: false
    });
    
    render(<AdminLoginPage />);
    
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'wrong@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In to Admin/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword');
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('shows loading state during authentication', () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: null,
      loading: true
    });
    
    render(<AdminLoginPage />);
    
    expect(screen.getByRole('button', { name: /Signing in.../i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Signing in.../i })).toBeDisabled();
  });
});