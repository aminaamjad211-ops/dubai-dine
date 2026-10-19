import React from 'react';
import { Award, CheckCircle2, ShieldAlert, Globe2 } from 'lucide-react';
import { Restaurant } from '../../types/restaurant';
import { calculateDubaiLiveStatus } from '../../utils/dubaiTime';
import { GoogleMapsButtons } from '../common/GoogleMapsButtons';
import { RestaurantImage } from '../common/RestaurantImage';

interface RestaurantCardProps {
  restaurant: Restaurant;
  isSelected?: boolean;
  onSelect: (restaurant: Restaurant) => void;
  onViewDetails: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  isSelected = false,
  onSelect,
  onViewDetails,
}) => {
  const liveStatus = calculateDubaiLiveStatus(restaurant);
  const primaryAccolade = restaurant.accolades[0];
  const isVerified = restaurant.verification.status === 'verified';
  const isOsm = restaurant.sourceType === 'openstreetmap';
  const hasHours = restaurant.operatingHours.schedule && restaurant.operatingHours.schedule.length > 0;

  return (
    <article
      onClick={() => onSelect(restaurant)}
      className={`group relative bg-white border rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-amber-600 ring-2 ring-amber-600/20 shadow-md'
          : 'border-stone-200/90 hover:border-stone-400/80 hover:shadow-md'
      }`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail Image Container */}
        <div className="relative w-full sm:w-56 h-48 sm:h-auto shrink-0 overflow-hidden">
          <RestaurantImage
            restaurant={restaurant}
            className="w-full h-full min-h-[12rem] group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            variant="card"
          />

          {/* Verification Badge */}
          <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-stone-100 px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 shadow-xs">
            {isVerified ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Editorial Verified</span>
              </>
            ) : isOsm ? (
              <>
                <Globe2 className="w-3.5 h-3.5 text-amber-300" />
                <span>OpenStreetMap (ODbL)</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Verification Pending</span>
              </>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
            <div className="flex flex-wrap items-center gap-x-2 text-xs text-stone-500 mb-1.5 font-medium">
              <span className="text-stone-800 font-semibold">{restaurant.neighborhood}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{restaurant.category || 'Restaurant'}</span>
              <span aria-hidden="true">·</span>
              <span>{restaurant.cuisine.slice(0, 2).join(', ')}</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-900 font-mono-data font-semibold">{restaurant.priceTier}</span>
            </div>

            {/* Title & Arabic Subtitle */}
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <h3
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(restaurant);
                }}
                className="font-serif-display text-xl font-bold text-stone-900 group-hover:text-amber-900 transition-colors hover:underline decoration-stone-300 underline-offset-4"
              >
                {restaurant.name}
              </h3>
              {restaurant.arabicName && (
                <span className="text-xs text-stone-400 font-serif" dir="rtl">
                  {restaurant.arabicName}
                </span>
              )}
            </div>

            {/* Short Tagline */}
            <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-relaxed">
              {restaurant.tagline}
            </p>

            {/* Accolade if present */}
            {primaryAccolade && (
              <div className="flex items-center gap-1.5 text-xs text-amber-900/90 font-medium mb-3">
                <Award className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="truncate">{primaryAccolade.title} · {primaryAccolade.source}</span>
              </div>
            )}
          </div>

          {/* Footer Area: Live Dubai Status + Google Maps Action Buttons */}
          <div className="pt-3 border-t border-stone-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Live Status text with strict unverified hours handling */}
            <div className="flex items-center gap-1.5 text-xs">
              {!hasHours || !liveStatus.isVerifiedHours ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-stone-400" />
                  <span className="text-stone-500 italic">Hours unverified · Call venue</span>
                </>
              ) : (
                <>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      liveStatus.isOpen ? 'bg-emerald-600' : 'bg-stone-400'
                    }`}
                  />
                  <span className={liveStatus.isOpen ? 'text-emerald-900 font-semibold' : 'text-stone-600'}>
                    {liveStatus.statusText}
                  </span>
                </>
              )}
            </div>

            {/* Google Maps View and Directions Links */}
            <div onClick={(e) => e.stopPropagation()}>
              <GoogleMapsButtons restaurant={restaurant} variant="compact" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
