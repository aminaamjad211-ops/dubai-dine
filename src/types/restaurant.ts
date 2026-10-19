export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface Shift {
  open: string;  // e.g. "12:00"
  close: string; // e.g. "15:00" or "02:00" (overnight)
  label?: string; // "Lunch", "Dinner", "Continuous Service"
}

export interface DaySchedule {
  day: DayOfWeek;
  dayIndex: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  isClosed: boolean;
  shifts: Shift[];
}

export interface AddressInfo {
  street: string;
  buildingOrUnit?: string;
  district: string;
  city: 'Dubai';
  country: 'United Arab Emirates';
  postalCode?: string;
  formattedAddress: string;
}

export interface CoordinatesInfo {
  lat: number;
  lng: number;
  isExact: boolean;
  coordinateSource: 'Official Google Place ID' | 'DET Geocode' | 'Official Website' | 'OpenStreetMap Node' | 'OpenStreetMap Way' | 'Approximate Area Centroid';
}

export interface GoogleMapsInfo {
  placeId?: string;
  cid?: string;
  verifiedLocation: boolean;
  viewUrl: string;
  directionsUrl: string;
}

export interface VerificationInfo {
  status: 'verified' | 'pending' | 'unconfirmed';
  verifiedAt: string; // ISO timestamp
  lastCheckedAt: string;
  verifiedBy: string; // e.g. "Editorial Team", "OpenStreetMap Importer"
  primarySource: string; // e.g. "Michelin Guide Dubai", "OpenStreetMap (ODbL)"
  primarySourceUrl: string;
  secondarySource?: string;
  secondarySourceUrl?: string;
  editorialNotes: string;
  verifiedFields: Array<'name' | 'address' | 'coordinates' | 'hours' | 'phone' | 'price' | 'cuisine' | 'website'>;
}

export interface Accolade {
  title: string;
  body: string;
  year: number;
  source: string;
}

export type DiningCategory = 'restaurant' | 'cafe' | 'fast_food' | 'bakery' | 'bistro' | 'bar' | 'ice_cream';
export type ReviewStatus = 'approved' | 'pending_review' | 'flagged' | 'rejected';
export type SourceType = 'editorial_verified' | 'openstreetmap' | 'csv_import' | 'geojson_import';

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  arabicName?: string;
  tagline: string;
  description: string;
  cuisine: string[];
  category: DiningCategory;
  priceTier: 'AED 30–80' | 'AED 80–180' | 'AED 180–400' | 'AED 400+';
  neighborhood: string;
  address: AddressInfo;
  coordinates: CoordinatesInfo;
  googleMaps: GoogleMapsInfo;
  contact: {
    phone: string;
    email?: string;
    website?: string;
    reservationUrl?: string;
    instagram?: string;
  };
  operatingHours: {
    timeZone: 'Asia/Dubai';
    schedule: DaySchedule[];
    specialHoursNote?: string;
    holidayPolicy?: string;
  };
  verification: VerificationInfo;
  accolades: Accolade[];
  dietary: string[];
  amenities: string[]; // e.g. 'Outdoor Seating', 'Takeaway', 'Delivery', 'Wheelchair Accessible', 'Wi-Fi'

  // Standardized Restaurant Image & Verification Metadata
  image_url: string | null;
  image_source_url: string | null;
  image_source_name: string | null;
  image_verified_at: string | null;
  image_status: 'verified' | 'unverified' | 'placeholder' | 'broken';
  image_alt: string;

  // Legacy compatibility fields
  heroImage?: string;
  photos?: string[];
  featured: boolean;
  
  // Data source & import metadata
  sourceType: SourceType;
  sourceId?: string; // e.g. 'node/123456789' or 'osm/9876543'
  reviewStatus: ReviewStatus;
  importedAt?: string;
  osmTags?: Record<string, string>;
  flagReasons?: string[]; // e.g. 'Missing coordinates', 'Missing phone', 'Unverified hours', 'Flagged closed'

  // Master Prompt & Seed Snapshot Fields
  branch_name?: string;
  branch_or_distinction?: string;
  address_source_snapshot?: string;
  cuisine_source_snapshot?: string;
  price_range_source_snapshot?: string;
  rating_source_snapshot?: string;
  review_count_source_snapshot?: string;
  opening_status_source_snapshot?: string;
  source_list_order?: number;
  city?: string;
  emirate?: string;
  country?: string;
  full_address?: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  official_website?: string | null;
  official_menu_url?: string | null;
  booking_url?: string | null;
  google_maps_url?: string | null;
  google_directions_url?: string | null;
  opening_hours?: string | null;
  short_description?: string;
  features?: string[];
  source_urls?: string[];
  source_type?: string;
  last_verified_at?: string | null;
  verification_status?: 'verified' | 'partially_verified' | 'needs_review';
  missing_fields?: string[];
  notes?: string;
}

export interface LiveStatusResult {
  isOpen: boolean;
  statusText: string;
  nextEventText: string;
  currentShift?: Shift;
  dubaiLocalTimeFormatted: string;
  isVerifiedHours: boolean;
  lastCheckedDisplay: string;
}

export interface VisitorCorrection {
  id: string;
  restaurantId: string;
  restaurantName: string;
  field: 'operating_hours' | 'phone' | 'address' | 'coordinates' | 'closure' | 'menu_price' | 'other';
  reportedValue: string;
  sourceEvidence: string;
  contactEmail?: string;
  status: 'pending_review' | 'investigating' | 'approved_and_applied' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  adminNotes?: string;
}

export interface RestaurantFilterParams {
  query?: string;
  neighborhood?: string;
  cuisine?: string;
  category?: string;
  priceTier?: string;
  openNowOnly?: boolean;
  verifiedOnly?: boolean;
  hasAccolade?: boolean;
  amenity?: string;
  reviewStatus?: ReviewStatus | 'all';
  page?: number;
  limit?: number;
}

export interface PaginatedRestaurantsResponse {
  data: Restaurant[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    hasMore: boolean;
  };
  summary: {
    totalRecords: number;
    uniqueVenues: number;
    approvedCount: number;
    pendingReviewCount: number;
    flaggedCount: number;
    verifiedHoursCount: number;
    verifiedCoordinatesCount: number;
    osmImportedCount: number;
    editorialCount: number;
  };
}

export interface ImportResultSummary {
  success: boolean;
  importedCount: number;
  duplicateCount: number;
  flaggedCount: number;
  backupPath: string;
  errors: string[];
}
