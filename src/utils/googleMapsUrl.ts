import { Restaurant } from '../types/restaurant';

/**
 * Builds standard, compliant Google Maps URLs for viewing places and getting turn-by-turn directions.
 * Adheres strictly to the Google Maps URL Scheme specification:
 * https://developers.google.com/maps/documentation/urls/get-started
 */

export interface GoogleMapsLinkResult {
  url: string;
  isExactLocation: boolean;
  warningNote?: string;
}

/**
 * Generates a "View on Google Maps" URL.
 * Adheres strictly to the Google Maps URL Scheme specification:
 * https://www.google.com/maps/search/?api=1&query=RESTAURANT_NAME_AND_ADDRESS
 */
export function buildGoogleMapsViewUrl(
  restaurant: Pick<Restaurant, 'name' | 'address' | 'coordinates' | 'googleMaps' | 'verification'>
): GoogleMapsLinkResult {
  const hasValidCoordinates =
    restaurant.coordinates &&
    typeof restaurant.coordinates.lat === 'number' &&
    typeof restaurant.coordinates.lng === 'number' &&
    restaurant.coordinates.lat > 24.5 &&
    restaurant.coordinates.lat < 26.0 &&
    restaurant.coordinates.lng > 54.5 &&
    restaurant.coordinates.lng < 56.0;

  const hasSpecificAddress =
    Boolean(restaurant.address?.formattedAddress) &&
    restaurant.address.formattedAddress !== 'Dubai' &&
    restaurant.address.formattedAddress !== 'Dubai, United Arab Emirates';

  // If both coordinates and specific address are completely missing, warn and search district
  if (!hasValidCoordinates && !hasSpecificAddress) {
    const fallbackDistrict = restaurant.address?.district || 'Dubai';
    const fallbackQuery = `${restaurant.name}, ${fallbackDistrict}, United Arab Emirates`;
    return {
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackQuery)}`,
      isExactLocation: false,
      warningNote: 'Exact venue location is unverified; searching by restaurant name and district.',
    };
  }

  const placeId = restaurant.googleMaps?.placeId;
  const addressPart = restaurant.address?.formattedAddress || `${restaurant.address?.street || ''}, ${restaurant.address?.district || 'Dubai'}, United Arab Emirates`;
  const nameAndAddress = `${restaurant.name}, ${addressPart}`.trim();

  // If placeId is available, Google Maps can resolve the canonical place directly
  if (placeId) {
    return {
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nameAndAddress)}&query_place_id=${encodeURIComponent(placeId)}`,
      isExactLocation: true,
    };
  }

  // If exact coordinates are available and verified
  const isExactLocation = Boolean(
    restaurant.coordinates?.isExact &&
    (restaurant.verification?.status === 'verified' || restaurant.googleMaps?.verifiedLocation)
  );

  if (hasValidCoordinates) {
    return {
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nameAndAddress)}`,
      isExactLocation,
      warningNote: isExactLocation
        ? undefined
        : 'Venue coordinates are approximate or pending verification.',
    };
  }

  // Address-based query
  return {
    url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nameAndAddress)}`,
    isExactLocation: false,
    warningNote: 'Venue location is unverified; searching by registered street address.',
  };
}

/**
 * Generates a "Get Directions" URL with the restaurant as the destination.
 * Adheres strictly to the Google Maps URL Scheme specification:
 * https://www.google.com/maps/dir/?api=1&destination=RESTAURANT_ADDRESS
 */
export function buildGoogleMapsDirectionsUrl(
  restaurant: Pick<Restaurant, 'name' | 'address' | 'coordinates' | 'googleMaps' | 'verification'>,
  originCoordinates?: { lat: number; lng: number }
): GoogleMapsLinkResult {
  const hasValidCoordinates =
    restaurant.coordinates &&
    typeof restaurant.coordinates.lat === 'number' &&
    typeof restaurant.coordinates.lng === 'number' &&
    restaurant.coordinates.lat > 24.5 &&
    restaurant.coordinates.lat < 26.0 &&
    restaurant.coordinates.lng > 54.5 &&
    restaurant.coordinates.lng < 56.0;

  const hasSpecificAddress =
    Boolean(restaurant.address?.formattedAddress) &&
    restaurant.address.formattedAddress !== 'Dubai' &&
    restaurant.address.formattedAddress !== 'Dubai, United Arab Emirates';

  if (!hasValidCoordinates && !hasSpecificAddress) {
    const fallbackDistrict = restaurant.address?.district || 'Dubai';
    const fallbackDest = `${restaurant.name}, ${fallbackDistrict}, United Arab Emirates`;
    return {
      url: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fallbackDest)}`,
      isExactLocation: false,
      warningNote: 'Destination pin is approximate because location verification is pending.',
    };
  }

  const placeId = restaurant.googleMaps?.placeId;
  const addressPart = restaurant.address?.formattedAddress || `${restaurant.address?.street || ''}, ${restaurant.address?.district || 'Dubai'}, United Arab Emirates`;
  const destinationQuery = `${restaurant.name}, ${addressPart}`.trim();

  let url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationQuery)}`;

  if (placeId) {
    url += `&destination_place_id=${encodeURIComponent(placeId)}`;
  }

  if (originCoordinates) {
    url += `&origin=${originCoordinates.lat.toFixed(6)},${originCoordinates.lng.toFixed(6)}`;
  }

  const isExactLocation = Boolean(
    restaurant.coordinates?.isExact &&
    (restaurant.verification?.status === 'verified' || restaurant.googleMaps?.verifiedLocation)
  );

  return {
    url,
    isExactLocation,
    warningNote: isExactLocation
      ? undefined
      : 'Destination pin is approximate because location verification is pending.',
  };
}

/**
 * Validates that a Google Maps URL is well-formed, uses https, and is properly encoded.
 */
export function isValidGoogleMapsUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'https:') return false;
    if (parsed.hostname !== 'www.google.com' && parsed.hostname !== 'google.com' && parsed.hostname !== 'maps.google.com') return false;
    if (!parsed.pathname.startsWith('/maps/')) return false;
    return true;
  } catch {
    return false;
  }
}
