'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Permission } from '@/lib/types/blog';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigationItems = [
    { 
      href: '/admin/dashboard', 
      icon: 'fas fa-tachometer-alt', 
      label: 'Dashboard',
      permission: null // Everyone can access
    },
    { 
      href: '/admin/blog', 
      icon: 'fas fa-file-alt', 
      label: 'Blog Posts',
      permission: Permission.CREATE_POST
    },
    {
      href: '/admin/blog/new',
      icon: 'fas fa-plus',
      label: 'New Post',
      permission: Permission.CREATE_POST
    },
    { 
      href: '/admin/media', 
      icon: 'fas fa-images', 
      label: 'Media Library',
      permission: Permission.MANAGE_MEDIA
    },
    { 
      href: '/admin/settings', 
      icon: 'fas fa-cog', 
      label: 'Settings',
      permission: null // Will check for SUPER_ADMIN role
    },
  ];

  // Filter navigation items based on user permissions
  const authorizedItems = navigationItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden glassmorphism p-3 rounded-lg text-cosmic-light hover:text-spiritual-gold transition-colors"
        aria-label="Toggle navigation menu"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 glassmorphism z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-cosmic-light/10">
            <Link href="/admin/dashboard" className="flex items-center" onClick={() => setIsOpen(false)}>
              <div className="text-3d">
                <h1 className="text-xl font-bold text-cosmic-light">
                  Admin Portal
                </h1>
                <p className="text-xs text-cosmic-light/80">
                  Nefer Kali Healing
                </p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-cosmic-light/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-spiritual-purple flex items-center justify-center">
                  <span className="text-cosmic-light font-medium">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-cosmic-light">{user.name}</p>
                  <p className="text-xs text-cosmic-light/70 capitalize">{user.role.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {authorizedItems.map((item) => {
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group
                        ${isActive 
                          ? 'bg-spiritual-purple/30 text-spiritual-gold' 
                          : 'text-cosmic-light hover:bg-cosmic-purple/30 hover:text-spiritual-gold'
                        }`}
                    >
                      <i className={`${item.icon} w-5 text-center group-hover:scale-110 transition-transform`}></i>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-cosmic-light/10">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="flex items-center space-x-3 p-3 rounded-lg text-cosmic-light hover:bg-cosmic-purple/30 hover:text-spiritual-gold transition-all duration-200 group"
                >
                  <i className="fas fa-home w-5 text-center group-hover:scale-110 transition-transform"></i>
                  <span className="font-medium">View Site</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-cosmic-light hover:bg-cosmic-purple/30 hover:text-spiritual-gold transition-all duration-200 group"
                >
                  <i className="fas fa-sign-out-alt w-5 text-center group-hover:scale-110 transition-transform"></i>
                  <span className="font-medium">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;