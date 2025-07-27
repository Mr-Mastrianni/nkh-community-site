'use client';

import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-cosmic-deep py-12 border-t border-cosmic-light/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation Column */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-spiritual-gold">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-cosmic-light hover:text-spiritual-purple transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-cosmic-light hover:text-spiritual-purple transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-cosmic-light hover:text-spiritual-purple transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-cosmic-light hover:text-spiritual-purple transition-colors">
                  Healing Sessions
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-cosmic-light hover:text-spiritual-purple transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-cosmic-light hover:text-spiritual-purple transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services Column */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-spiritual-gold">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/planetary-events" className="text-cosmic-light hover:text-spiritual-purple transition-colors">
                  Planetary Events
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-cosmic-light hover:text-spiritual-purple transition-colors">
                  Healing Guides
                </Link>
              </li>
              <li>
                <Link href="/loyalty" className="text-cosmic-light hover:text-spiritual-purple transition-colors">
                  Loyalty Program
                </Link>
              </li>
              <li>
                <Link href="/womens-corner" className="text-cosmic-light hover:text-spiritual-purple transition-colors">
                  Women's Corner
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Connect Column */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-spiritual-gold">Connect</h3>
            
            <div className="flex space-x-4 mb-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cosmic-light hover:text-spiritual-purple transition-colors text-xl"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cosmic-light hover:text-spiritual-purple transition-colors text-xl"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cosmic-light hover:text-spiritual-purple transition-colors text-xl"
                aria-label="Pinterest"
              >
                <i className="fab fa-pinterest"></i>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cosmic-light hover:text-spiritual-purple transition-colors text-xl"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
            
            <address className="not-italic text-cosmic-light/80 mb-4">
              <p>PO BOX 322, McCordsville IN</p>
              <p className="mt-2">
                <a 
                  href="mailto:INFO@NEFERKALIHEALING.ORG"
                  className="text-spiritual-gold hover:text-spiritual-purple transition-colors"
                >
                  INFO@NEFERKALIHEALING.ORG
                </a>
              </p>
            </address>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-cosmic-light/10 text-center text-cosmic-light/60">
          <p>© {currentYear} Nefer Kali Healing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;