import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Coffee,
  Sparkles,
  Flame,
  Wine,
  Croissant,
  Pizza,
  Fish,
  Soup,
  ShieldCheck,
  CameraOff,
} from 'lucide-react';
import { Restaurant } from '../../types/restaurant';

interface RestaurantImageProps {
  restaurant: Restaurant;
  className?: string;
  variant?: 'card' | 'hero' | 'gallery' | 'thumb';
  showAttribution?: boolean;
}

/**
 * Returns an appropriate Lucide icon component based on cuisine and category
 */
function getCuisineIcon(cuisine: string[] = [], category?: string) {
  const cList = cuisine.map((c) => c.toLowerCase()).join(' ');
  const cat = (category || '').toLowerCase();

  if (cat === 'cafe' || cList.includes('cafe') || cList.includes('coffee') || cList.includes('tea')) {
    return Coffee;
  }
  if (cat === 'bakery' || cList.includes('bakery') || cList.includes('pastry') || cList.includes('dessert')) {
    return Croissant;
  }
  if (cat === 'bar' || cList.includes('lounge') || cList.includes('cocktail')) {
    return Wine;
  }
  if (cList.includes('seafood') || cList.includes('fish') || cList.includes('oyster')) {
    return Fish;
  }
  if (cList.includes('pizza') || cList.includes('italian')) {
    return Pizza;
  }
  if (cList.includes('ramen') || cList.includes('soup') || cList.includes('noodles') || cList.includes('hotpot')) {
    return Soup;
  }
  if (cList.includes('grill') || cList.includes('bbq') || cList.includes('steak') || cList.includes('kabab')) {
    return Flame;
  }
  if (cList.includes('fine dining') || cList.includes('tasting') || cList.includes('omakase')) {
    return Sparkles;
  }
  return UtensilsCrossed;
}

/**
 * Deterministic color palette for placeholder card accents based on neighbourhood
 */
function getDistrictAccentColor(neighborhood: string = '') {
  const norm = neighborhood.toLowerCase();
  if (norm.includes('downtown')) return 'from-stone-900 via-stone-850 to-amber-950/40 border-amber-900/30';
  if (norm.includes('marina') || norm.includes('jbr') || norm.includes('palm'))
    return 'from-stone-900 via-slate-900 to-cyan-950/40 border-cyan-900/30';
  if (norm.includes('difc')) return 'from-stone-900 via-neutral-900 to-amber-950/40 border-amber-800/30';
  if (norm.includes('deira') || norm.includes('bur dubai'))
    return 'from-stone-900 via-stone-900 to-orange-950/40 border-orange-900/30';
  return 'from-stone-900 via-stone-900 to-stone-800 border-stone-800';
}

export const RestaurantImage: React.FC<RestaurantImageProps> = ({
  restaurant,
  className = '',
  variant = 'card',
  showAttribution = false,
}) => {
  const [imgFailed, setImgFailed] = useState<boolean>(false);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  const IconComponent = getCuisineIcon(restaurant.cuisine, restaurant.category);
  const districtGradient = getDistrictAccentColor(restaurant.neighborhood);

  // Check if restaurant has a valid, verified restaurant-specific image URL
  const hasValidImage =
    Boolean(restaurant.image_url) &&
    restaurant.image_status === 'verified' &&
    !imgFailed;

  const altText =
    restaurant.image_alt ||
    `${restaurant.name} dining listing in ${restaurant.neighborhood}, Dubai`;

  // Render verified image
  if (hasValidImage && restaurant.image_url) {
    return (
      <div className={`relative overflow-hidden bg-stone-900 ${className}`}>
        <img
          src={restaurant.image_url}
          alt={altText}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            console.warn(`Image failed to load for ${restaurant.name}, falling back to neutral placeholder.`);
            setImgFailed(true);
          }}
          className={`w-full h-full object-cover object-center transition-all duration-500 ${
            imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />

        {/* Loading skeleton placeholder while image decodes */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-stone-900 animate-pulse flex items-center justify-center">
            <span className="text-stone-600 font-serif-display text-sm">{restaurant.name}</span>
          </div>
        )}

        {/* Source attribution pill if verified */}
        {showAttribution && restaurant.image_source_name && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[10px] text-stone-300 font-mono-data">
            Photo: {restaurant.image_source_name}
          </div>
        )}
      </div>
    );
  }

  // Professional Neutral Branded Placeholder with Restaurant Name
  return (
    <div
      role="img"
      aria-label={altText}
      className={`relative w-full h-full bg-gradient-to-br ${districtGradient} text-stone-100 flex flex-col justify-between p-4 sm:p-5 select-none overflow-hidden border ${className}`}
    >
      {/* Subtle fine geometric corner accents */}
      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-amber-500/5 blur-xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-stone-700/10 blur-lg pointer-events-none" />

      {/* Top Bar: Icon + Category Tag */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="w-8 h-8 rounded-lg bg-stone-800/90 border border-stone-700/60 flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
          <IconComponent className="w-4 h-4" />
        </div>

        <span className="text-[10px] uppercase font-mono-data tracking-wider px-2 py-0.5 rounded bg-stone-800/80 border border-stone-700/40 text-stone-400">
          {restaurant.category || 'Restaurant'}
        </span>
      </div>

      {/* Middle / Bottom: Prominent Restaurant Name & Location */}
      <div className="relative z-10 space-y-1 mt-auto">
        {restaurant.arabicName && (
          <p className="text-[11px] font-serif text-amber-400/80 truncate leading-none" dir="rtl">
            {restaurant.arabicName}
          </p>
        )}

        <h4 className="font-serif-display font-bold text-white text-base sm:text-lg leading-snug tracking-tight line-clamp-2">
          {restaurant.name}
        </h4>

        <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-medium truncate pt-0.5">
          <span className="text-stone-300 truncate">{restaurant.neighborhood}</span>
          <span className="text-stone-600 font-bold">·</span>
          <span className="truncate text-stone-400">{restaurant.cuisine.slice(0, 2).join(', ')}</span>
        </div>
      </div>

      {/* Bottom Subtle Status Stamp */}
      <div className="relative z-10 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-500">
        <span className="font-mono-data tracking-wider">
          {restaurant.priceTier}
        </span>
        <span className="italic text-stone-500">
          DineDubai Official Profile
        </span>
      </div>
    </div>
  );
};
