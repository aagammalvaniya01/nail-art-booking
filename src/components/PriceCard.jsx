import React from 'react';
import { useRouter } from 'next/router';
import { Check, Star } from 'lucide-react';

const PriceCard = ({ pkg }) => {
  const router = useRouter();
  const { serviceName, price, features, description, category } = pkg;

  const isPopular = category === 'Premium' || category === 'Bridal';

  return (
    <div
      className={`glass-card rounded-xl overflow-hidden shadow-lg p-6 flex flex-col justify-between transition-all duration-500 hover:scale-102 hover:shadow-premium relative ${
        isPopular ? 'border-rosegold/50 shadow-rosegold/5 hover:border-rosegold' : 'hover:border-gold/30'
      }`}
    >
      {/* Featured Highlight Tag */}
      {isPopular && (
        <span className="absolute top-4 right-4 bg-rosegold text-cream text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 border border-rosegold-light/20">
          <Star className="w-3 h-3 fill-cream" />
          Popular
        </span>
      )}

      {/* Package Header */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] text-gold uppercase tracking-widest font-semibold">{category} Package</span>
          <h3 className="font-serif font-semibold text-2xl text-cream tracking-wide mt-1 group-hover:text-gold transition-colors duration-300">
            {serviceName}
          </h3>
        </div>

        {/* Pricing tag */}
        <div className="flex items-baseline">
          <span className="font-serif font-semibold text-3xl text-cream">₹</span>
          <span className="font-serif font-bold text-5xl text-cream tracking-tight">{price}</span>
          <span className="text-cream/50 text-xs ml-2">/ service</span>
        </div>

        <p className="text-xs text-cream/70 leading-relaxed font-light">
          {description}
        </p>

        <hr className="border-gold/10" />

        {/* Feature Checkmarks */}
        <ul className="space-y-3 pt-2">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start space-x-3 text-xs text-cream/80">
              <div className="w-4 h-4 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 text-gold" />
              </div>
              <span className="leading-tight">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Booking Trigger */}
      <div className="pt-8">
        <button
          onClick={() => router.push({ pathname: '/booking', query: { service: serviceName } })}
          className={`w-full py-3.5 rounded-md text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md cursor-pointer ${
            isPopular
              ? 'bg-rosegold text-cream hover:bg-rosegold-dark border border-rosegold-light/20 hover:shadow-lg'
              : 'bg-gold text-onyx-dark hover:bg-gold-light hover:shadow-gold-glow'
          }`}
        >
          Book Package
        </button>
      </div>
    </div>
  );
};

export default PriceCard;
