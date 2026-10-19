import React from 'react';
import { ExternalLink, Navigation, MapPin, AlertCircle } from 'lucide-react';
import { Restaurant } from '../../types/restaurant';
import { buildGoogleMapsDirectionsUrl, buildGoogleMapsViewUrl } from '../../utils/googleMapsUrl';

interface GoogleMapsButtonsProps {
  restaurant: Pick<Restaurant, 'name' | 'address' | 'coordinates' | 'googleMaps' | 'verification'>;
  variant?: 'compact' | 'expanded';
  className?: string;
}

export const GoogleMapsButtons: React.FC<GoogleMapsButtonsProps> = ({
  restaurant,
  variant = 'compact',
  className = '',
}) => {
  const viewResult = buildGoogleMapsViewUrl(restaurant);
  const directionsResult = buildGoogleMapsDirectionsUrl(restaurant);

  const isVerified = restaurant.verification.status === 'verified' && restaurant.coordinates.isExact;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <a
          href={viewResult.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors whitespace-nowrap"
          title="Open exact location on Google Maps"
        >
          <MapPin className="w-3.5 h-3.5 text-stone-700" />
          <span>View on Google Maps</span>
          <ExternalLink className="w-3 h-3 text-stone-400" />
        </a>

        <a
          href={directionsResult.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          title="Get navigation directions on Google Maps"
        >
          <Navigation className="w-3.5 h-3.5 text-amber-300" />
          <span>Get Directions</span>
        </a>
      </div>
    );
  }

  // Expanded variant for detail page
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href={viewResult.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-stone-900 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-all shadow-xs hover:border-stone-400"
        >
          <MapPin className="w-4 h-4 text-stone-700" />
          <span>View on Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 text-stone-400 ml-1" />
        </a>

        <a
          href={directionsResult.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-xs"
        >
          <Navigation className="w-4 h-4 text-amber-300" />
          <span>Get Turn-by-Turn Directions</span>
        </a>
      </div>

      {!isVerified && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Note on unconfirmed coordinates:</strong> This venue's physical coordinates have not completed full on-site municipal verification. Google Maps links search for the approximate registered district rather than claiming an exact pinpoint.
          </p>
        </div>
      )}

      {isVerified && (
        <div className="flex items-center justify-between text-xs text-stone-500 px-1 font-mono-data">
          <span>Lat: {restaurant.coordinates.lat.toFixed(5)}° N · Lng: {restaurant.coordinates.lng.toFixed(5)}° E</span>
          <span className="text-emerald-700 font-sans font-medium">✓ Verified Coordinates</span>
        </div>
      )}
    </div>
  );
};
