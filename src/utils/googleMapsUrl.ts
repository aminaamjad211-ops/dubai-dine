import { Restaurant } from '../types/restaurant';

export interface GoogleMapsLinkResult {
  url: string;
  isExactLocation: boolean;
  warningNote?: string;
}

type MapsRestaurant = Pick<
  Restaurant,
  'name' | 'address' | 'coordinates' | 'googleMaps' | 'verification'
>;

function hasValidDubaiCoordinates(restaurant: MapsRestaurant): boolean {
  const { lat, lng } = restaurant.coordinates;
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat > 24.5 &&
    lat < 26.0 &&
    lng > 54.5 &&
    lng < 56.0
  );
}

function getNameAndAddress(restaurant: MapsRestaurant): string {
  const address =
    restaurant.address?.formattedAddress ||
    [
      restaurant.address?.street,
      restaurant.address?.district,
      'Dubai',
      'United Arab Emirates',
    ]
      .filter(Boolean)
      .join(', ');

  return `${restaurant.name}, ${address}`;
}

function isVerifiedLocation(restaurant: MapsRestaurant): boolean {
  return Boolean(
    restaurant.coordinates?.isExact &&
      (restaurant.verification?.status === 'verified' ||
        restaurant.googleMaps?.verifiedLocation)
  );
}

export function buildGoogleMapsViewUrl(
  restaurant: MapsRestaurant
): GoogleMapsLinkResult {
  const query = getNameAndAddress(restaurant);
  const placeId = restaurant.googleMaps?.placeId;

  let url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  if (placeId) {
    url += `&query_place_id=${encodeURIComponent(placeId)}`;
  }

  return {
    url,
    isExactLocation: isVerifiedLocation(restaurant),
    warningNote: placeId
      ? undefined
      : 'Google Maps will search by restaurant name and address.',
  };
}

export function buildGoogleMapsDirectionsUrl(
  restaurant: MapsRestaurant,
  originCoordinates?: { lat: number; lng: number }
): GoogleMapsLinkResult {
  const validCoordinates = hasValidDubaiCoordinates(restaurant);
  const placeId = restaurant.googleMaps?.placeId;
  const destination = validCoordinates
    ? `${restaurant.coordinates.lat},${restaurant.coordinates.lng}`
    : getNameAndAddress(restaurant);

  let url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;

  if (placeId && !validCoordinates) {
    url += `&destination_place_id=${encodeURIComponent(placeId)}`;
  }

  if (originCoordinates) {
    url += `&origin=${encodeURIComponent(
      `${originCoordinates.lat},${originCoordinates.lng}`
    )}`;
  }

  return {
    url,
    isExactLocation: isVerifiedLocation(restaurant),
    warningNote: validCoordinates
      ? undefined
      : 'Destination location has not been independently verified.',
  };
}

export function isValidGoogleMapsUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    return (
      parsed.protocol === 'https:' &&
      ['www.google.com', 'google.com', 'maps.google.com'].includes(
        parsed.hostname
      ) &&
      parsed.pathname.startsWith('/maps/')
    );
  } catch {
    return false;
  }
}

