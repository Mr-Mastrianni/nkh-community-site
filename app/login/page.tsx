'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CosmicBackground from '@/components/CosmicBackground';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just redirect to home
      router.push('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <CosmicBackground />
      
      <div className="cosmic-card w-full max-w-md p-8 m-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-3d mb-2">Welcome Back</h1>
          <p className="text-cosmic-light/80">Sign in to your spiritual journey</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-cosmic-light mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-cosmic-deep/50 border border-cosmic-light/20 text-cosmic-light focus:outline-none focus:border-spiritual-gold transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-cosmic-light mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-cosmic-deep/50 border border-cosmic-light/20 text-cosmic-light focus:outline-none focus:border-spiritual-gold transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-spiritual-purple focus:ring-spiritual-purple border-cosmic-light/30 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-cosmic-light">
                Remember me
              </label>
            </div>
            
            <Link href="/forgot-password" className="text-sm text-spiritual-gold hover:text-spiritual-purple transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cosmic-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-cosmic-light/80">
            Don't have an account?{' '}
            <Link href="/signup" className="text-spiritual-gold hover:text-spiritual-purple transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cosmic-light/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-cosmic-deep text-cosmic-light/60">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center py-2 px-4 border border-cosmic-light/20 rounded-md shadow-sm bg-cosmic-deep/50 text-sm font-medium text-cosmic-light hover:bg-cosmic-light/10 transition-colors">
              <i className="fab fa-google mr-2"></i>
              Google
            </button>
            <button className="w-full inline-flex justify-center py-2 px-4 border border-cosmic-light/20 rounded-md shadow-sm bg-cosmic-deep/50 text-sm font-medium text-cosmic-light hover:bg-cosmic-light/10 transition-colors">
              <i className="fab fa-facebook mr-2"></i>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;