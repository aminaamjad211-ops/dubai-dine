import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Restaurant } from '../../types/restaurant';

// Fix default Leaflet icon paths in Vite
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const activeIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [28, 45],
  iconAnchor: [14, 45],
  popupAnchor: [1, -36],
  shadowSize: [41, 41],
});

interface RestaurantMapProps {
  restaurants: Restaurant[];
  selectedRestaurantId?: string | null;
  onSelectRestaurant?: (restaurant: Restaurant) => void;
  className?: string;
  singleRestaurantMode?: boolean;
}

export const RestaurantMap: React.FC<RestaurantMapProps> = ({
  restaurants,
  selectedRestaurantId,
  onSelectRestaurant,
  className = 'h-96 w-full',
  singleRestaurantMode = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Dubai central coordinates default (25.2048° N, 55.2708° E)
    const initialLat = restaurants.length > 0 ? restaurants[0].coordinates.lat : 25.2048;
    const initialLng = restaurants.length > 0 ? restaurants[0].coordinates.lng : 55.2708;
    const initialZoom = singleRestaurantMode ? 15 : 12;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: initialZoom,
      scrollWheelZoom: !singleRestaurantMode,
    });

    // Clean, high-legibility cartographic tile layer (OpenStreetMap Humanitarian / Standard)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    const bounds = L.latLngBounds([]);

    restaurants.forEach((restaurant) => {
      const { lat, lng, isExact } = restaurant.coordinates;
      if (!lat || !lng) return;

      const isSelected = restaurant.id === selectedRestaurantId;
      const marker = L.marker([lat, lng], {
        icon: isSelected ? activeIcon : defaultIcon,
        title: restaurant.name,
      });

      // Rich Popup with verified details and Google Maps links
      const isVerified = restaurant.verification.status === 'verified';
      const popupHtml = `
        <div style="min-width: 240px; padding: 12px; font-family: 'Plus Jakarta Sans', sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: 600; color: #78716c; text-transform: uppercase;">
              ${restaurant.neighborhood}
            </span>
            ${
              isVerified
                ? `<span style="font-size: 10px; color: #047857; font-weight: 600;">✓ Verified</span>`
                : `<span style="font-size: 10px; color: #b45309; font-weight: 600;">Pending Check</span>`
            }
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: #1c1917; font-family: 'Fraunces', serif;">
            ${restaurant.name}
          </h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #57534e;">
            ${restaurant.cuisine.join(' · ')} · <strong style="color: #292524;">${restaurant.priceTier}</strong>
          </p>
          <div style="font-size: 11px; color: #44403c; margin-bottom: 10px; line-height: 1.3;">
            ${restaurant.address.formattedAddress}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding-top: 6px; border-top: 1px solid #f5f5f4;">
            <a href="${restaurant.googleMaps.viewUrl}" target="_blank" rel="noopener noreferrer" 
               style="text-align: center; background: #292524; color: #ffffff; padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">
              Google Maps ↗
            </a>
            <a href="${restaurant.googleMaps.directionsUrl}" target="_blank" rel="noopener noreferrer"
               style="text-align: center; background: #f5f5f4; color: #1c1917; border: 1px solid #d6d3d1; padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">
              Directions ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        if (onSelectRestaurant) {
          onSelectRestaurant(restaurant);
        }
      });

      marker.addTo(map);
      markersRef.current.set(restaurant.id, marker);
      bounds.extend([lat, lng]);
    });

    // Auto-fit bounds if multiple restaurants and not single restaurant mode
    if (!singleRestaurantMode && restaurants.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    } else if (singleRestaurantMode && restaurants.length === 1) {
      map.setView([restaurants[0].coordinates.lat, restaurants[0].coordinates.lng], 15);
    }
  }, [restaurants, selectedRestaurantId, singleRestaurantMode]);

  // Pan to selected restaurant when selected externally
  useEffect(() => {
    if (!selectedRestaurantId || !mapInstanceRef.current) return;
    const target = restaurants.find((r) => r.id === selectedRestaurantId);
    if (target && target.coordinates.lat && target.coordinates.lng) {
      mapInstanceRef.current.setView([target.coordinates.lat, target.coordinates.lng], 15, {
        animate: true,
      });
      const marker = markersRef.current.get(selectedRestaurantId);
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedRestaurantId, restaurants]);

  return (
    <div className={`relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100 ${className}`}>
      <div ref={mapContainerRef} className="h-full w-full" />
      <div className="absolute top-3 right-3 z-20 pointer-events-none">
        <div className="bg-stone-900/90 backdrop-blur-xs text-stone-100 px-3 py-1.5 rounded-md text-xs font-medium shadow-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Verified Dubai Coordinates</span>
        </div>
      </div>
    </div>
  );
};
