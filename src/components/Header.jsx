import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Sparkles } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { setIsQuoteModalOpen, user, logout } = useContext(AppContext);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Booking', path: '/booking' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    return router.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 glass-header transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Left Side: Brand Logo & Optional Left-aligned Dashboard Link */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-full bg-luxury-gradient flex items-center justify-center border border-gold/40 shadow-gold-glow group-hover:border-gold transition-all duration-300">
                <Sparkles className="w-5 h-5 text-gold group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="font-serif text-2xl tracking-widest bg-gradient-to-r from-cream via-gold to-rosegold bg-clip-text text-transparent uppercase font-semibold">
                Aura Nails
              </span>
            </Link>
            {user && (
              <Link
                href="/admin"
                className={`text-sm tracking-widest uppercase font-medium transition-all duration-300 hover:text-rosegold ${
                  isActive('/admin') ? 'text-rosegold' : 'text-rosegold-light'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Center Navigation: Desktop Menu (Only when NOT logged in) */}
          <nav className="hidden md:flex space-x-8">
            {!user && navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`relative text-sm tracking-widest uppercase font-medium transition-all duration-300 hover:text-gold ${
                  isActive(link.path) ? 'text-gold' : 'text-cream/80'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-[-6px] left-0 w-full h-[1.5px] bg-gold" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side: CTA button or Logout */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <button 
                onClick={logout}
                className="text-xs uppercase tracking-widest text-cream/60 hover:text-cream transition-colors duration-200 cursor-pointer font-semibold"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="gold-btn text-xs uppercase tracking-widest py-2.5 px-5 hover:scale-105 active:scale-95 duration-300"
              >
                Get Quote
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-cream hover:text-gold focus:outline-none transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden glass-modal border-t border-gold/10 animate-fade-in absolute w-full left-0 shadow-premium">
          <div className="px-4 pt-4 pb-6 space-y-3 flex flex-col items-center">
            {user ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className={`text-base tracking-widest uppercase py-2 w-full text-center transition-all duration-300 hover:text-rosegold ${
                    isActive('/admin') ? 'text-gold font-medium' : 'text-cream/80'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="text-xs uppercase tracking-widest text-cream/50 pt-2 cursor-pointer"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-base tracking-widest uppercase py-2 w-full text-center transition-all duration-300 hover:text-gold ${
                      isActive(link.path) ? 'text-gold font-medium' : 'text-cream/80'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 w-full flex flex-col items-center space-y-3">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsQuoteModalOpen(true);
                    }}
                    className="gold-btn w-full max-w-xs text-xs uppercase tracking-widest py-3 text-center cursor-pointer"
                  >
                    Get Quote
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
