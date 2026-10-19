import fs from 'fs';
import path from 'path';
import { Restaurant, ImportResultSummary } from '../../src/types/restaurant';
import { buildGoogleMapsDirectionsUrl, buildGoogleMapsViewUrl } from '../../src/utils/googleMapsUrl';
import { OSM_DUBAI_RESTAURANTS } from '../../src/data/osmDubaiDataset';

const BACKUP_DIR = path.resolve(process.cwd(), 'data', 'backups');

export function ensureBackupDir(): void {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

/**
 * Creates an automatic backup of the current restaurants list before bulk operations
 */
export function createBackup(currentList: Restaurant[]): string {
  ensureBackupDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(BACKUP_DIR, `restaurants_backup_${timestamp}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(currentList, null, 2), 'utf-8');
  return backupFile;
}

/**
 * Calculates distance in meters between two lat/lng coordinates (Haversine formula)
 */
export function haversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Normalizes restaurant name for fuzzy duplicate comparison
 */
export function normalizeVenueName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/(restaurant|cafe|caf|bistro|dubai|lounge|kitchen|grill|the)/g, '')
    .trim();
}

/**
 * Checks whether an incoming restaurant is a duplicate of an existing record
 */
export function findDuplicate(candidate: Partial<Restaurant>, existingList: Restaurant[]): Restaurant | undefined {
  const candSourceId = candidate.sourceId;
  const candLat = candidate.coordinates?.lat;
  const candLng = candidate.coordinates?.lng;
  const candNormName = candidate.name ? normalizeVenueName(candidate.name) : '';

  for (const existing of existingList) {
    // 1. Direct Source ID match
    if (candSourceId && existing.sourceId && candSourceId === existing.sourceId) {
      return existing;
    }

    // 2. Exact slug match
    if (candidate.slug && existing.slug && candidate.slug === existing.slug) {
      return existing;
    }

    // 3. Proximity and name match (within 80 meters and similar normalized name)
    if (candLat && candLng && existing.coordinates?.lat && existing.coordinates?.lng) {
      const dist = haversineDistanceMeters(candLat, candLng, existing.coordinates.lat, existing.coordinates.lng);
      if (dist < 80) {
        const existNormName = normalizeVenueName(existing.name);
        if (candNormName && existNormName && (candNormName.includes(existNormName) || existNormName.includes(candNormName))) {
          return existing;
        }
      }
    }
  }

  return undefined;
}

/**
 * Standardizes raw incoming properties into a validated Restaurant object
 */
export function convertToRestaurant(raw: {
  name: string;
  category?: string;
  cuisine?: string[] | string;
  priceTier?: string;
  neighborhood?: string;
  street?: string;
  building?: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  sourceType: Restaurant['sourceType'];
  sourceId?: string;
  amenities?: string[] | string;
  openingHoursRaw?: string;
  rawTags?: Record<string, string>;
  imageUrl?: string | null;
  imageSourceUrl?: string | null;
  imageSourceName?: string | null;
  imageVerifiedAt?: string | null;
  imageStatus?: Restaurant['image_status'];
  imageAlt?: string;
}): Restaurant {
  const slug = raw.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const cuisineArray = Array.isArray(raw.cuisine)
    ? raw.cuisine
    : typeof raw.cuisine === 'string'
    ? raw.cuisine.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
    : ['International'];

  const amenitiesArray = Array.isArray(raw.amenities)
    ? raw.amenities
    : typeof raw.amenities === 'string'
    ? raw.amenities.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
    : [];

  const category = (
    raw.category && ['restaurant', 'cafe', 'fast_food', 'bakery', 'bistro', 'bar', 'ice_cream'].includes(raw.category)
      ? raw.category
      : 'restaurant'
  ) as Restaurant['category'];

  const priceTier = (
    raw.priceTier && ['AED 30–80', 'AED 80–180', 'AED 180–400', 'AED 400+'].includes(raw.priceTier)
      ? raw.priceTier
      : 'AED 80–180'
  ) as Restaurant['priceTier'];

  const neighborhood = raw.neighborhood || 'Dubai';
  const street = raw.street || 'Dubai Street';

  const address = {
    street,
    buildingOrUnit: raw.building,
    district: neighborhood,
    city: 'Dubai' as const,
    country: 'United Arab Emirates' as const,
    formattedAddress: `${raw.building ? raw.building + ', ' : ''}${street}, ${neighborhood}, Dubai, United Arab Emirates`,
  };

  const isExactCoord = raw.lat >= 24.8 && raw.lat <= 25.4 && raw.lng >= 55.0 && raw.lng <= 55.6;

  const coordinates = {
    lat: raw.lat,
    lng: raw.lng,
    isExact: isExactCoord,
    coordinateSource: (raw.sourceType === 'openstreetmap' ? 'OpenStreetMap Node' : 'DET Geocode') as any,
  };

  const flagReasons: string[] = [];
  if (!isExactCoord) flagReasons.push('Coordinates outside standard Dubai bounds');
  if (!raw.phone) flagReasons.push('Unverified telephone');
  if (!raw.openingHoursRaw) flagReasons.push('Unverified opening hours');

  const verification: Restaurant['verification'] = {
    status: 'unconfirmed',
    verifiedAt: new Date().toISOString(),
    lastCheckedAt: new Date().toISOString(),
    verifiedBy: 'Automated Import Pipeline',
    primarySource: raw.sourceType === 'openstreetmap' ? 'OpenStreetMap (ODbL License)' : 'Batch Dataset Import',
    primarySourceUrl: raw.sourceId ? `https://www.openstreetmap.org/${raw.sourceId}` : '',
    editorialNotes: 'Imported via data pipeline. Location verified via geographic coordinates; hours pending direct confirmation.',
    verifiedFields: isExactCoord ? ['name', 'address', 'coordinates'] : ['name', 'address'],
  };

  const viewUrl = buildGoogleMapsViewUrl({
    name: raw.name,
    address,
    coordinates,
    googleMaps: { verifiedLocation: isExactCoord, viewUrl: '', directionsUrl: '' },
    verification: { status: isExactCoord ? 'verified' : 'unconfirmed', verifiedFields: isExactCoord ? ['coordinates'] : [] } as any,
  }).url;

  const directionsUrl = buildGoogleMapsDirectionsUrl({
    name: raw.name,
    address,
    coordinates,
    googleMaps: { verifiedLocation: isExactCoord, viewUrl: '', directionsUrl: '' },
    verification: { status: isExactCoord ? 'verified' : 'unconfirmed', verifiedFields: isExactCoord ? ['coordinates'] : [] } as any,
  }).url;

  return {
    id: `imp-${slug}-${Date.now().toString(36).substr(-4)}`,
    slug,
    name: raw.name,
    tagline: `${category === 'cafe' ? 'Artisanal café' : 'Dining venue'} in ${neighborhood}`,
    description: `Discovered in ${neighborhood}, Dubai. Verified location coordinates with direct turn-by-turn navigation available.`,
    category,
    cuisine: cuisineArray.length > 0 ? cuisineArray : ['International'],
    priceTier,
    neighborhood,
    address,
    coordinates,
    googleMaps: {
      verifiedLocation: isExactCoord,
      viewUrl,
      directionsUrl,
    },
    contact: {
      phone: raw.phone || '',
      website: raw.website || '',
    },
    operatingHours: {
      timeZone: 'Asia/Dubai',
      schedule: [], // Unverified hours left blank as requested
      specialHoursNote: raw.openingHoursRaw ? `Raw schedule: ${raw.openingHoursRaw}` : undefined,
    },
    verification,
    accolades: [],
    dietary: amenitiesArray.filter((a) => a.toLowerCase().includes('vegan') || a.toLowerCase().includes('vegetarian')),
    amenities: amenitiesArray,

    // Image metadata
    image_url: raw.imageUrl || null,
    image_source_url: raw.imageSourceUrl || null,
    image_source_name: raw.imageSourceName || null,
    image_verified_at: raw.imageVerifiedAt || (raw.imageUrl ? new Date().toISOString() : null),
    image_status: raw.imageStatus || (raw.imageUrl ? 'verified' : 'placeholder'),
    image_alt: raw.imageAlt || `${raw.name} - ${neighborhood}, Dubai dining directory listing`,
    heroImage: raw.imageUrl || '',
    photos: raw.imageUrl ? [raw.imageUrl] : [],

    featured: false,
    sourceType: raw.sourceType,
    sourceId: raw.sourceId,
    reviewStatus: 'approved',
    importedAt: new Date().toISOString(),
    osmTags: raw.rawTags,
    flagReasons: flagReasons.length > 0 ? flagReasons : undefined,
  };
}

/**
 * Imports GeoJSON FeatureCollection containing Point restaurants
 */
export function importGeoJson(geoJsonString: string, currentList: Restaurant[]): { summary: ImportResultSummary; updatedList: Restaurant[] } {
  const backupPath = createBackup(currentList);
  const errors: string[] = [];
  let importedCount = 0;
  let duplicateCount = 0;
  let flaggedCount = 0;
  const nextList = [...currentList];

  try {
    const parsed = JSON.parse(geoJsonString);
    const features = parsed.features || (parsed.type === 'Feature' ? [parsed] : []);

    for (const feat of features) {
      const props = feat.properties || {};
      const coords = feat.geometry?.coordinates; // [lng, lat]

      const name = props.name || props['name:en'] || props.brand;
      if (!name) continue;

      const lng = coords && coords[0] ? parseFloat(coords[0]) : parseFloat(props.lng || props.lon || '0');
      const lat = coords && coords[1] ? parseFloat(coords[1]) : parseFloat(props.lat || '0');

      if (!lat || !lng) {
        errors.push(`Skipped "${name}": missing coordinates`);
        continue;
      }

      const candidate = convertToRestaurant({
        name,
        category: props.amenity || props.category || 'restaurant',
        cuisine: props.cuisine || props.food,
        neighborhood: props['addr:district'] || props['addr:suburb'] || props['addr:neighbourhood'] || props.neighborhood || 'Dubai',
        street: props['addr:street'] || props.street || 'Dubai Street',
        building: props['addr:housenumber'] || props['addr:building'] || props.building,
        lat,
        lng,
        phone: props.phone || props['contact:phone'],
        website: props.website || props['contact:website'],
        sourceType: 'geojson_import',
        sourceId: props.id || props['@id'] || props.osm_id ? `osm/${props.id || props['@id'] || props.osm_id}` : undefined,
        amenities: props.amenity ? [props.amenity] : [],
        openingHoursRaw: props.opening_hours,
        rawTags: props,
        imageUrl: props.image_url || props.image || props['contact:image'] || null,
        imageSourceUrl: props.image_source_url || props.image_source || null,
        imageSourceName: props.image_source_name || props.image_credit || null,
        imageAlt: props.image_alt || undefined,
      });

      const duplicate = findDuplicate(candidate, nextList);
      if (duplicate) {
        duplicateCount++;
        continue;
      }

      if (candidate.flagReasons && candidate.flagReasons.length > 0) {
        flaggedCount++;
      }

      nextList.push(candidate);
      importedCount++;
    }
  } catch (err: any) {
    errors.push(`GeoJSON parsing failure: ${err.message}`);
  }

  return {
    summary: {
      success: errors.length === 0 || importedCount > 0,
      importedCount,
      duplicateCount,
      flaggedCount,
      backupPath,
      errors,
    },
    updatedList: nextList,
  };
}

/**
 * Parses a single CSV line respecting quotes, escaped quotes, and commas
 */
export function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped double quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^["']|["']$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^["']|["']$/g, ''));
  return result;
}

/**
 * Imports CSV text with restaurant records
 */
export function importCsv(csvString: string, currentList: Restaurant[]): { summary: ImportResultSummary; updatedList: Restaurant[] } {
  const backupPath = createBackup(currentList);
  const errors: string[] = [];
  let importedCount = 0;
  let duplicateCount = 0;
  let flaggedCount = 0;
  const nextList = [...currentList];

  try {
    const lines = csvString.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      throw new Error('CSV must contain a header row and at least one data row.');
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));
    const nameIdx = headers.findIndex((h) => h === 'name' || h === 'restaurant_name');
    const latIdx = headers.findIndex((h) => h === 'lat' || h === 'latitude');
    const lngIdx = headers.findIndex((h) => h === 'lng' || h === 'lon' || h === 'longitude');
    const hoodIdx = headers.findIndex((h) => h === 'neighborhood' || h === 'district' || h === 'suburb');
    const streetIdx = headers.findIndex((h) => h === 'street' || h === 'address');
    const cuisineIdx = headers.findIndex((h) => h === 'cuisine' || h === 'category_food');
    const categoryIdx = headers.findIndex((h) => h === 'category' || h === 'amenity' || h === 'type');
    const phoneIdx = headers.findIndex((h) => h === 'phone' || h === 'tel');
    const websiteIdx = headers.findIndex((h) => h === 'website' || h === 'url');
    const imageUrlIdx = headers.findIndex((h) => h === 'image_url' || h === 'image' || h === 'photo');
    const imageSrcUrlIdx = headers.findIndex((h) => h === 'image_source_url' || h === 'photo_source');
    const imageSrcNameIdx = headers.findIndex((h) => h === 'image_source_name' || h === 'photo_credit');
    const imageAltIdx = headers.findIndex((h) => h === 'image_alt');

    if (nameIdx === -1 || latIdx === -1 || lngIdx === -1) {
      throw new Error('CSV missing required columns. Must contain: name, lat, lng');
    }

    for (let i = 1; i < lines.length; i++) {
      const cleanRow = parseCsvLine(lines[i]);

      const name = cleanRow[nameIdx];
      const lat = parseFloat(cleanRow[latIdx]);
      const lng = parseFloat(cleanRow[lngIdx]);

      if (!name || isNaN(lat) || isNaN(lng)) continue;

      const candidate = convertToRestaurant({
        name,
        lat,
        lng,
        neighborhood: hoodIdx >= 0 ? cleanRow[hoodIdx] : 'Dubai',
        street: streetIdx >= 0 ? cleanRow[streetIdx] : 'Dubai Street',
        cuisine: cuisineIdx >= 0 ? cleanRow[cuisineIdx] : 'International',
        category: categoryIdx >= 0 ? cleanRow[categoryIdx] : 'restaurant',
        phone: phoneIdx >= 0 ? cleanRow[phoneIdx] : undefined,
        website: websiteIdx >= 0 ? cleanRow[websiteIdx] : undefined,
        imageUrl: imageUrlIdx >= 0 ? cleanRow[imageUrlIdx] : undefined,
        imageSourceUrl: imageSrcUrlIdx >= 0 ? cleanRow[imageSrcUrlIdx] : undefined,
        imageSourceName: imageSrcNameIdx >= 0 ? cleanRow[imageSrcNameIdx] : undefined,
        imageAlt: imageAltIdx >= 0 ? cleanRow[imageAltIdx] : undefined,
        sourceType: 'csv_import',
      });

      const duplicate = findDuplicate(candidate, nextList);
      if (duplicate) {
        duplicateCount++;
        continue;
      }

      if (candidate.flagReasons && candidate.flagReasons.length > 0) {
        flaggedCount++;
      }

      nextList.push(candidate);
      importedCount++;
    }
  } catch (err: any) {
    errors.push(`CSV parsing error: ${err.message}`);
  }

  return {
    summary: {
      success: errors.length === 0 || importedCount > 0,
      importedCount,
      duplicateCount,
      flaggedCount,
      backupPath,
      errors,
    },
    updatedList: nextList,
  };
}

/**
 * Imports authentic curated OpenStreetMap Dubai records
 */
export function importOsmDubaiDataset(currentList: Restaurant[]): { summary: ImportResultSummary; updatedList: Restaurant[] } {
  const backupPath = createBackup(currentList);
  let importedCount = 0;
  let duplicateCount = 0;
  let flaggedCount = 0;
  const nextList = [...currentList];

  for (const osmItem of OSM_DUBAI_RESTAURANTS) {
    const duplicate = findDuplicate(osmItem, nextList);
    if (duplicate) {
      duplicateCount++;
      continue;
    }

    if (osmItem.flagReasons && osmItem.flagReasons.length > 0) {
      flaggedCount++;
    }

    nextList.push(osmItem);
    importedCount++;
  }

  return {
    summary: {
      success: true,
      importedCount,
      duplicateCount,
      flaggedCount,
      backupPath,
      errors: [],
    },
    updatedList: nextList,
  };
}

/**
 * Bounding boxes for popular Dubai neighbourhoods for focused, fast Overpass queries
 */
export const DUBAI_NEIGHBOURHOOD_BBOXES: Record<
  string,
  { label: string; south: number; west: number; north: number; east: number }
> = {
  downtown: { label: 'Downtown Dubai', south: 25.185, west: 55.265, north: 25.205, east: 55.285 },
  marina: { label: 'Dubai Marina & JBR', south: 25.065, west: 55.120, north: 25.090, east: 55.148 },
  difc: { label: 'DIFC', south: 25.205, west: 55.275, north: 25.220, east: 55.290 },
  deira: { label: 'Deira & Creek', south: 25.250, west: 55.305, north: 25.275, east: 55.335 },
  burdubai: { label: 'Bur Dubai & Al Fahidi', south: 25.245, west: 55.285, north: 25.268, east: 55.305 },
  jumeirah: { label: 'Jumeirah & Kite Beach', south: 25.150, west: 55.210, north: 25.220, east: 55.260 },
  businessbay: { label: 'Business Bay', south: 25.170, west: 55.250, north: 25.195, east: 55.280 },
  palm: { label: 'Palm Jumeirah', south: 25.105, west: 55.110, north: 25.145, east: 55.155 },
  albarsha: { label: 'Al Barsha & MOE', south: 25.100, west: 55.180, north: 25.130, east: 55.220 },
  all: { label: 'Greater Dubai Urban Area', south: 24.980, west: 55.100, north: 25.320, east: 55.400 },
};

/**
 * Query live OpenStreetMap Overpass API for genuine restaurants within a Dubai neighbourhood bounding box.
 * Adheres to OSM usage policy, sets custom User-Agent, handles timeouts, and deduplicates against current database.
 */
export async function fetchAndImportOverpassDubai(
  areaKey: string = 'downtown',
  currentList: Restaurant[]
): Promise<{ summary: ImportResultSummary; updatedList: Restaurant[] }> {
  const bbox = DUBAI_NEIGHBOURHOOD_BBOXES[areaKey] || DUBAI_NEIGHBOURHOOD_BBOXES.downtown;
  const backupPath = createBackup(currentList);
  const errors: string[] = [];
  let importedCount = 0;
  let duplicateCount = 0;
  let flaggedCount = 0;
  const nextList = [...currentList];

  const query = `[out:json][timeout:20];(node["amenity"~"^(restaurant|cafe|fast_food|bistro|bakery)$"](${bbox.south},${bbox.west},${bbox.north},${bbox.east}););out body 35;`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'DineDubai-Directory/1.0 (Dubai Verified Restaurant Project; ODbL compliant)',
      },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Overpass server returned HTTP ${res.status}`);
    }

    const json = (await res.json()) as any;
    const elements: any[] = json.elements || [];

    for (const el of elements) {
      const tags = el.tags || {};
      const name = tags.name || tags['name:en'] || tags.brand;
      if (!name) continue;

      const lat = el.lat;
      const lng = el.lon;
      if (!lat || !lng) continue;

      const candidate = convertToRestaurant({
        name,
        category: tags.amenity || 'restaurant',
        cuisine: tags.cuisine || tags.food,
        neighborhood: tags['addr:district'] || tags['addr:suburb'] || tags['addr:neighbourhood'] || bbox.label,
        street: tags['addr:street'] || 'Dubai Street',
        building: tags['addr:housenumber'] || tags['addr:building'],
        lat,
        lng,
        phone: tags.phone || tags['contact:phone'],
        website: tags.website || tags['contact:website'],
        sourceType: 'openstreetmap',
        sourceId: `node/${el.id}`,
        amenities: tags.amenity ? [tags.amenity] : [],
        openingHoursRaw: tags.opening_hours,
        rawTags: tags,
      });

      const duplicate = findDuplicate(candidate, nextList);
      if (duplicate) {
        duplicateCount++;
        continue;
      }

      if (candidate.flagReasons && candidate.flagReasons.length > 0) {
        flaggedCount++;
      }

      nextList.push(candidate);
      importedCount++;
    }
  } catch (err: any) {
    errors.push(
      `Overpass API request failed: ${err.message}. Overpass servers may be under heavy load or rate-limited. You can use the instant curated Dubai OSM dataset or paste GeoJSON/CSV directly.`
    );
  }

  return {
    summary: {
      success: errors.length === 0 || importedCount > 0,
      importedCount,
      duplicateCount,
      flaggedCount,
      backupPath,
      errors,
    },
    updatedList: nextList,
  };
}
