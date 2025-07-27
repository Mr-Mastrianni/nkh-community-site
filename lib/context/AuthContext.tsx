'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser, AdminRole, Permission } from '../types/blog';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/admin/auth/me');
        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        // User is not authenticated, that's okay
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/admin/auth/login', { email, password });
      
      if (response.data.success) {
        setUser(response.data.user);
        return true;
      } else {
        setError(response.data.message || 'Authentication failed');
        return false;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/api/admin/auth/logout');
      setUser(null);
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Check if user has permission
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission) || user.role === AdminRole.SUPER_ADMIN;
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}