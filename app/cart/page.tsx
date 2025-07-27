'use client';

import Link from 'next/link';
import CosmicBackground from '@/components/CosmicBackground';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CartPage = () => {
  return (
    <div className="min-h-screen relative">
      <CosmicBackground />
      <Header />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="cosmic-card p-12">
            <div className="text-6xl mb-6">
              <i className="fas fa-shopping-cart text-spiritual-gold"></i>
            </div>
            
            <h1 className="text-3xl font-bold text-3d mb-4">
              Your Sacred Cart
            </h1>
            
            <p className="text-lg text-cosmic-light/80 mb-8">
              Your cart is currently empty. Explore our healing products and spiritual offerings.
            </p>
            
            <div className="space-y-4">
              <Link href="/shop" className="cosmic-button inline-block">
                <i className="fas fa-leaf mr-2"></i>
                Browse Healing Products
              </Link>
              
              <div className="text-cosmic-light/60">
                or
              </div>
              
              <Link href="/services" className="cosmic-button inline-block">
                <i className="fas fa-calendar-plus mr-2"></i>
                Book a Healing Session
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CartPage;