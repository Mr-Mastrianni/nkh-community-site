'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/Header';
import Footer from '@/components/Footer';
import CosmicBackground from '@/components/CosmicBackground';

interface StandardLayoutProps {
  children: ReactNode;
  includeFooter?: boolean;
  className?: string;
}

const StandardLayout = ({ 
  children, 
  includeFooter = true, 
  className = '' 
}: StandardLayoutProps) => {
  return (
    <div className={`min-h-screen relative ${className}`}>
      {/* Cosmic Background */}
      <CosmicBackground />
      
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content with sidebar offset */}
      <div className="md:ml-80 transition-all duration-300">
        {children}
        
        {/* Footer */}
        {includeFooter && <Footer />}
      </div>
    </div>
  );
};

export default StandardLayout;