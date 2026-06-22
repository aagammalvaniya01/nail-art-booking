import React, { useState, useContext } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import GalleryCard from '../components/GalleryCard';
import VideoCard from '../components/VideoCard';
import { Sparkles, Camera, PlayCircle } from 'lucide-react';

const Gallery = () => {
  const { gallery, videos, dataLoading } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Classic', 'Gel', 'Acrylic', 'Bridal', 'Custom'];

  const filteredGallery = selectedCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <>
      <Head>
        <title>Nail Art Portfolio - Aura Nails Gallery</title>
        <meta name="description" content="Explore custom hand-painted nail designs, acrylic extensions, chrome styling, and step-by-step video tutorials." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Page Title Header */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/25 px-4 py-1.5 rounded-full text-gold text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Our Portfolio</span>
          </div>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-cream tracking-wide">
            Nail Art Gallery
          </h1>
          <p className="text-xs text-cream/70 font-light leading-relaxed">
            Browse through our collections of bespoke styles and watch video tutorials detailing the creative process.
          </p>
        </div>

        {/* Main Tab Triggers */}
        <div className="flex justify-center border-b border-gold/10 max-w-xs mx-auto pb-px">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center space-x-2 pb-3.5 px-4 text-xs font-semibold uppercase tracking-widest border-b-2 transition-all duration-300 cursor-pointer ${
              activeTab === 'photos'
                ? 'border-gold text-gold font-medium'
                : 'border-transparent text-cream/60 hover:text-cream'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Photos</span>
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center space-x-2 pb-3.5 px-4 text-xs font-semibold uppercase tracking-widest border-b-2 transition-all duration-300 cursor-pointer ${
              activeTab === 'videos'
                ? 'border-gold text-gold font-medium'
                : 'border-transparent text-cream/60 hover:text-cream'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Videos</span>
          </button>
        </div>

        {/* Dynamic Content Views */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: PHOTO GALLERY */}
          {activeTab === 'photos' && (
            <motion.div
              key="photos-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-10"
            >
              {/* Category Filter Pills */}
              <div className="flex flex-wrap justify-center gap-2.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-2xs uppercase tracking-widest font-semibold border rounded-full transition-all duration-300 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-gold text-onyx-dark border-gold font-bold shadow-gold-glow'
                        : 'border-gold/20 text-cream/70 hover:border-gold/50 hover:text-cream'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid display */}
              {dataLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="glass-card rounded-xl aspect-[4/3] animate-pulse bg-onyx-light/30" />
                  ))}
                </div>
              ) : filteredGallery.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredGallery.map((item) => (
                    <motion.div
                      layout
                      key={item._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <GalleryCard item={item} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center text-cream/40 py-16">
                  No nail art items found under this category.
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: VIDEO REELS */}
          {activeTab === 'videos' && (
            <motion.div
              key="videos-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {dataLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2].map((n) => (
                    <div key={n} className="glass-card rounded-xl aspect-video animate-pulse bg-onyx-light/30" />
                  ))}
                </div>
              ) : videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {videos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-cream/40 py-16">
                  No video showreels uploaded yet.
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </>
  );
};

export default Gallery;
