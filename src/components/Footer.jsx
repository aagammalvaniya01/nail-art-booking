import React, { useContext } from 'react';
import Link from 'next/link';
import { Sparkles, Phone, Mail, MapPin, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Footer = () => {
  const { about } = useContext(AppContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-onyx-dark border-t border-gold/10 text-cream/70 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Foot Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand Intro & Social */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-luxury-gradient flex items-center justify-center border border-gold/40">
                <Sparkles className="w-4 h-4 text-gold" />
              </div>
              <span className="font-serif text-xl tracking-widest text-cream uppercase font-semibold">
                Aura Nails
              </span>
            </Link>
            <p className="text-sm leading-relaxed pr-4">
              Premium nail care and bespoke hand-painted artistry designed to highlight your individuality. Experience luxury nails in our calming studio.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-onyx border border-gold/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-onyx border border-gold/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-onyx border border-gold/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 className="font-serif text-cream font-semibold text-lg tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-gold transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors duration-200">About Us</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold transition-colors duration-200">Nail Art Gallery</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-gold transition-colors duration-200">Pricing Packages</Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-gold transition-colors duration-200">Reviews & Testimonials</Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-gold transition-colors duration-200">Book Appointment</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-gold transition-colors duration-200 text-xs opacity-60">Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Typical Services */}
          <div>
            <h4 className="font-serif text-cream font-semibold text-lg tracking-wider mb-5">Our Offerings</h4>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-gold transition-colors duration-200">Classic Gel Polish</li>
              <li className="hover:text-gold transition-colors duration-200">Builder Gel Overlays</li>
              <li className="hover:text-gold transition-colors duration-200">Hand-painted Custom Art</li>
              <li className="hover:text-gold transition-colors duration-200">Reflective Metallic Chrome</li>
              <li className="hover:text-gold transition-colors duration-200">Luxury Swarovski Accents</li>
              <li className="hover:text-gold transition-colors duration-200">Bridal Nail Extensions</li>
            </ul>
          </div>

          {/* Column 4: Contact & Hours */}
          <div className="space-y-4">
            <h4 className="font-serif text-cream font-semibold text-lg tracking-wider mb-1">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span>{about?.address || 'Pushkar valley, NewIndia Colony, Nikol'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4.5 h-4.5 text-gold shrink-0" />
                <span>{about?.phone || '8141464492'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4.5 h-4.5 text-gold shrink-0" />
                <span>{about?.email || 'rutvivasani26@gmail.com'}</span>
              </li>
              <li className="flex items-start space-x-3 pt-1">
                <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-cream text-xs uppercase tracking-wider mb-1">Studio Hours</p>
                  <p className="text-xs">{about?.hours || '9AM to 9PM all days'}</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gold/5 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-cream/40">
          <p>&copy; {currentYear} Aura Nails Inc. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="/privacy" className="hover:text-cream transition-colors duration-200">Privacy Policy</a>
            <a href="/terms" className="hover:text-cream transition-colors duration-200">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
