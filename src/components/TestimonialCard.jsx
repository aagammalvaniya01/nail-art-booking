import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  const { name, review, rating, image } = testimonial;

  // Generate Star Icons Array
  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        className={`w-4 h-4 ${
          idx < rating ? 'text-gold fill-gold' : 'text-cream/10'
        }`}
      />
    ));
  };

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col justify-between hover:border-gold/20 hover:shadow-premium transition-all duration-300 relative h-full">
      {/* Decorative Quote Icon */}
      <Quote className="absolute top-6 right-6 w-8 h-8 text-gold/10 pointer-events-none" />

      <div className="space-y-4">
        {/* Star Rating */}
        <div className="flex space-x-1">
          {renderStars()}
        </div>

        {/* Testimonial Quote */}
        <p className="text-xs text-cream/80 font-light leading-relaxed italic">
          "{review}"
        </p>
      </div>

      {/* Customer Bio */}
      <div className="flex items-center space-x-3 pt-6 mt-4 border-t border-gold/5">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gold/30 shrink-0 bg-onyx-dark">
          <img
            src={image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-serif font-semibold text-sm text-cream">{name}</h4>
          <span className="text-[10px] text-gold uppercase tracking-widest">Verified Client</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
