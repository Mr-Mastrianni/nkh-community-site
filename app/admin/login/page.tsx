'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import CosmicBackground from '@/components/CosmicBackground';

const AdminLoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        // Check if user has admin role
        const session = await getSession();
        if (session?.user?.role && ['SUPER_ADMIN', 'EDITOR', 'AUTHOR'].includes(session.user.role)) {
          // Redirect to the original destination or dashboard
          const from = searchParams.get('from') || '/admin/dashboard';
          router.push(from);
        } else {
          setError('You do not have permission to access the admin panel');
        }
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <CosmicBackground />
      
      <div className="cosmic-card w-full max-w-md p-8 m-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-3d mb-2">Admin Portal</h1>
          <p className="text-cosmic-light/80">Sign in to manage your cosmic content</p>
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
              placeholder="admin@neferkali.com"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cosmic-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In to Admin'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-cosmic-light/80">
            Return to{' '}
            <a href="/" className="text-spiritual-gold hover:text-spiritual-purple transition-colors">
              Main Site
            </a>
          </p>
        </div>

        <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-300 text-sm">
          <strong>Development Login:</strong><br />
          Email: admin@neferkali.com<br />
          Password: admin123
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;