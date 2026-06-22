import React from 'react';
import { useRouter } from 'next/router';
import { Calendar } from 'lucide-react';

const GalleryCard = ({ item }) => {
  const router = useRouter();
  const { title, description, price, image, category } = item;

  return (
    <div className="glass-card rounded-xl overflow-hidden group shadow-lg flex flex-col hover:border-gold/30 hover:shadow-gold-glow transition-all duration-500 h-full">
      {/* Card Image Wrapper */}
      <div className="relative overflow-hidden aspect-[4/3] bg-onyx-dark shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Category Tag overlay */}
        <span className="absolute top-3 right-3 z-10 bg-onyx/85 border border-gold/30 text-gold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-medium">
          {category}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-serif font-semibold text-lg text-cream tracking-wide group-hover:text-gold transition-colors duration-300">
              {title}
            </h3>
            <span className="font-serif font-bold text-gold text-lg shrink-0">
              ₹{price}
            </span>
          </div>
          <p className="text-xs text-cream/70 leading-relaxed font-light line-clamp-2">
            {description}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => router.push({ pathname: '/booking', query: { service: title } })}
          className="w-full flex items-center justify-center space-x-2 py-2.5 rounded bg-gold/10 border border-gold/25 text-gold text-xs uppercase tracking-widest font-semibold hover:bg-gold hover:text-onyx-dark transition-all duration-300 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Now</span>
        </button>
      </div>
    </div>
  );
};

export default GalleryCard;
