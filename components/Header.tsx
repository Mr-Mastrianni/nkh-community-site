'use client';

import { useState } from 'react';
import Link from 'next/link';
import PlanetaryMenuOverlay from './planetary-events/PlanetaryMenuOverlay';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlanetaryMenuOpen, setIsPlanetaryMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const openPlanetaryMenu = () => {
    setIsPlanetaryMenuOpen(true);
    // Close the main sidebar when opening planetary menu
    setIsOpen(false);
  };

  const closePlanetaryMenu = () => {
    setIsPlanetaryMenuOpen(false);
  };

  const navigationItems = [
    { href: '/', icon: 'fas fa-home', label: 'Home' },
    { href: '/about', icon: 'fas fa-heart', label: 'Our Journey' },
    { href: '/services', icon: 'fas fa-spa', label: 'Services' },
    { href: '/community', icon: 'fas fa-users', label: 'Unity' },
    { href: '/shop', icon: 'fas fa-leaf', label: 'Wellness' },
    { href: '/blog', icon: 'fas fa-book-open', label: 'Blog' },
    { 
      href: '#', 
      icon: 'fas fa-star', 
      label: 'Planetary Events',
      action: openPlanetaryMenu
    },
    { href: '/donate', icon: 'fas fa-hands-helping', label: 'Support' },
  ];

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
        className={`fixed left-0 top-0 h-full w-80 glassmorphism z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo/Brand */}
          <Link href="/" className="mb-8" onClick={() => setIsOpen(false)}>
            <div className="text-3d text-center">
              <h1 className="text-2xl font-bold text-cosmic-light mb-1">
                Nefer Kali
              </h1>
              <p className="text-sm text-cosmic-light/80">
                Healing & Spiritual Education
              </p>
              <div className="w-16 h-0.5 bg-spiritual-gold mx-auto mt-2"></div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  {item.action ? (
                    <button
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center space-x-4 p-3 rounded-lg text-cosmic-light hover:bg-cosmic-purple/30 hover:text-spiritual-gold transition-all duration-200 group text-left"
                    >
                      <i className={`${item.icon} w-5 text-center group-hover:scale-110 transition-transform`}></i>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-4 p-3 rounded-lg text-cosmic-light hover:bg-cosmic-purple/30 hover:text-spiritual-gold transition-all duration-200 group"
                    >
                      <i className={`${item.icon} w-5 text-center group-hover:scale-110 transition-transform`}></i>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User Actions */}
          <div className="border-t border-cosmic-light/20 pt-6 space-y-3">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-4 p-3 rounded-lg text-cosmic-light hover:bg-cosmic-purple/30 hover:text-spiritual-gold transition-all duration-200 group"
            >
              <i className="fas fa-user w-5 text-center group-hover:scale-110 transition-transform"></i>
              <span className="font-medium">Login</span>
            </Link>
            
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-4 p-3 rounded-lg text-cosmic-light hover:bg-cosmic-purple/30 hover:text-spiritual-gold transition-all duration-200 group"
            >
              <div className="relative w-5 text-center">
                <i className="fas fa-shopping-cart group-hover:scale-110 transition-transform"></i>
                <span className="absolute -top-2 -right-1 bg-spiritual-purple text-cosmic-light text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </div>
              <span className="font-medium">Cart</span>
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-cosmic-light/60 mt-6">
            <p>© 2025 Nefer Kali Healing</p>
            <p>Spiritual Transformation</p>
          </div>
        </div>
      </aside>

      {/* Planetary Menu Overlay */}
      <PlanetaryMenuOverlay 
        isOpen={isPlanetaryMenuOpen} 
        onClose={closePlanetaryMenu} 
      />
    </>
  );
};

export default Sidebar;