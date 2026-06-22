import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

const VideoCard = ({ video: videoData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { title, video, thumbnail } = videoData;

  return (
    <>
      {/* Video Preview Card container */}
      <div className="glass-card rounded-xl overflow-hidden group shadow-lg flex flex-col hover:border-gold/30 transition-all duration-500">
        <div className="relative overflow-hidden aspect-video bg-onyx-dark shrink-0">
          {/* Thumbnail */}
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
          />
          
          {/* Dark Overlay on Hover */}
          <div className="absolute inset-0 bg-onyx-dark/30 group-hover:bg-onyx-dark/50 transition-colors duration-300" />
          
          {/* Play Button Overlay */}
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center m-auto w-14 h-14 rounded-full bg-gold/90 text-onyx-dark hover:bg-gold-light hover:scale-110 active:scale-95 hover:shadow-gold-glow transition-all duration-300 z-10 cursor-pointer shadow-lg"
            aria-label="Play video"
          >
            <Play className="w-6 h-6 fill-onyx-dark stroke-none ml-1 animate-pulse" />
          </button>
        </div>

        {/* Video Card Title */}
        <div className="p-4 bg-onyx-light/40">
          <h3 className="font-serif font-semibold text-sm text-cream tracking-wide group-hover:text-gold transition-colors duration-300 line-clamp-1">
            {title}
          </h3>
        </div>
      </div>

      {/* Full-Screen Video Lightbox Modal */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-onyx-dark/95 p-4 animate-fade-in animate-duration-200">
          {/* Background Close Trigger */}
          <div className="absolute inset-0" onClick={() => setIsPlaying(false)} />
          
          {/* Close Button */}
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-6 right-6 text-cream/70 hover:text-cream bg-onyx border border-gold/20 p-2.5 rounded-full z-55 hover:border-gold transition-all duration-200 cursor-pointer"
            aria-label="Close video player"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Video Player Box */}
          <div className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden border border-gold/30 shadow-premium z-50 bg-black animate-scale-in">
            <iframe
              src={`${video}?autoplay=1`}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;
