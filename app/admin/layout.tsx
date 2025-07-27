'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/context/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <AuthProvider>
      <div className="min-h-screen bg-cosmic-deep">
        {!isLoginPage && <AdminSidebar />}
        <main className={!isLoginPage ? 'ml-0 md:ml-64 p-6' : ''}>
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}