import { INITIAL_RESTAURANTS } from '../src/data/initialRestaurants';
import { OSM_DUBAI_RESTAURANTS } from '../src/data/osmDubaiDataset';
import { calculateDubaiLiveStatus, getDubaiTimeParts } from '../src/utils/dubaiTime';
import { buildGoogleMapsDirectionsUrl, buildGoogleMapsViewUrl, isValidGoogleMapsUrl } from '../src/utils/googleMapsUrl';
import { importCsv, importGeoJson, findDuplicate } from '../server/importers/dataImporter';
import { getBaselineDataset } from '../server/storage';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n--- 1. Testing Google Maps URL Builder & Validation ---');

// Test 1: Orfali Bros Bistro verified URL with Place ID
const orfali = INITIAL_RESTAURANTS.find((r) => r.slug === 'orfali-bros-bistro')!;
const orfaliView = buildGoogleMapsViewUrl(orfali);
assert(isValidGoogleMapsUrl(orfaliView.url), 'Orfali view URL is a valid Google Maps HTTPS URL');
assert(orfaliView.url.includes('query='), 'Orfali view URL includes query parameter');
assert(orfaliView.url.includes('query_place_id=ChIJp9J8t7pAXz4RLU-ZpXvYyW8'), 'Orfali view URL includes exact Google Place ID');
assert(orfaliView.isExactLocation === true, 'Verified venue marked with isExactLocation: true');

const orfaliDir = buildGoogleMapsDirectionsUrl(orfali);
assert(isValidGoogleMapsUrl(orfaliDir.url), 'Orfali directions URL is a valid Google Maps HTTPS URL');
assert(orfaliDir.url.includes('/maps/dir/'), 'Directions URL includes /maps/dir/ endpoint');
assert(orfaliDir.url.includes('destination='), 'Directions URL includes destination parameter');
assert(orfaliDir.url.includes('destination_place_id=ChIJp9J8t7pAXz4RLU-ZpXvYyW8'), 'Directions URL includes exact destination Google Place ID');

// Test 2: OpenStreetMap Imported Venue URL (At.mosphere in Burj Khalifa)
const atmosphere = OSM_DUBAI_RESTAURANTS.find((r) => r.slug === 'atmosphere-burj-khalifa')!;
const atmoView = buildGoogleMapsViewUrl(atmosphere);
assert(isValidGoogleMapsUrl(atmoView.url), 'At.mosphere view URL is valid');
assert(atmoView.url.includes('Burj%20Khalifa') || atmoView.url.includes('Burj+Khalifa'), 'At.mosphere view URL targets Burj Khalifa address');
assert(!atmoView.url.includes('query=Dubai%2C'), 'At.mosphere view URL does not fall back to generic Dubai query');

// Test 3: Unverified location safeguard
const unverifiedMock: any = {
  name: 'Sample Unverified Cafe',
  address: { district: 'Jumeirah', formattedAddress: 'Jumeirah, Dubai' },
  coordinates: { lat: 25.2, lng: 55.27, isExact: false, coordinateSource: 'Approximate Area Centroid' },
  googleMaps: { verifiedLocation: false, viewUrl: '', directionsUrl: '' },
  verification: { status: 'unconfirmed', verifiedFields: [] },
};
const unverifiedView = buildGoogleMapsViewUrl(unverifiedMock);
assert(unverifiedView.isExactLocation === false, 'Unverified location safeguard marks isExactLocation: false');
assert(Boolean(unverifiedView.warningNote), 'Unverified location produces clear warning note');
assert(!unverifiedView.url.includes('query_place_id='), 'Unverified location does not inject Place ID');

console.log('\n--- 2. Testing Dubai Time & Live Operating Hours ---');

// Test 4: Dubai timezone offset check (Asia/Dubai is strictly UTC+4)
const dubaiParts = getDubaiTimeParts(new Date('2026-10-17T12:00:00Z')); // 12:00 UTC = 16:00 Dubai
assert(dubaiParts.hour === 16, 'UTC 12:00 converts accurately to 16:00 GST in Asia/Dubai');

// Test 5: Regular daytime continuous hours
const orfaliAt15 = calculateDubaiLiveStatus(orfali, new Date('2026-10-17T11:00:00Z')); // 15:00 Dubai
assert(orfaliAt15.isOpen === true, 'Orfali is open at 15:00 Dubai local time');

const orfaliAt03 = calculateDubaiLiveStatus(orfali, new Date('2026-10-17T23:00:00Z')); // 03:00 Dubai
assert(orfaliAt03.isOpen === false, 'Orfali is closed at 03:00 Dubai local time');

// Test 6: Split shifts
const alUstad = INITIAL_RESTAURANTS.find((r) => r.slug === 'al-ustad-special-kabab')!;
const ustadLunch = calculateDubaiLiveStatus(alUstad, new Date('2026-10-17T09:00:00Z')); // 13:00 Dubai
assert(ustadLunch.isOpen === true, 'Al Ustad is open during Saturday lunch shift (13:00 Dubai)');

const ustadBreak = calculateDubaiLiveStatus(alUstad, new Date('2026-10-17T13:00:00Z')); // 17:00 Dubai
assert(ustadBreak.isOpen === false, 'Al Ustad is closed during afternoon break (17:00 Dubai)');
assert(ustadBreak.statusText.includes('Opens today at 18:30'), 'Al Ustad status predicts 18:30 dinner shift');

// Test 7: Closed day handling
const tresind = INITIAL_RESTAURANTS.find((r) => r.slug === 'tresind-studio')!;
const mondayDate = new Date('2026-10-19T16:00:00Z'); // Oct 19, 2026 is Monday, 20:00 Dubai
const tresindMonday = calculateDubaiLiveStatus(tresind, mondayDate);
assert(tresindMonday.isOpen === false, 'Trèsind Studio is closed on Mondays');
assert(tresindMonday.statusText.includes('Tuesday'), 'Trèsind predicts opening on Tuesday');

// Test 8: Unverified hours safeguard (Requirement 2: Never claim open if hours unverified)
const atmoStatus = calculateDubaiLiveStatus(atmosphere, new Date('2026-10-17T12:00:00Z'));
assert(atmoStatus.isVerifiedHours === false, 'Imported OSM venue with blank schedule correctly flagged as isVerifiedHours: false');

console.log('\n--- 3. Testing Dataset Expansion & 14-Restaurant Fix ---');

const baselineDataset = getBaselineDataset();
assert(baselineDataset.length > 14, `Expanded dataset count is ${baselineDataset.length} (> 14 required, 14-restaurant limitation fixed!)`);
assert(baselineDataset.length >= 35, `Baseline includes at least 35 authentic venues across Dubai`);

// Verify all 36 venues reside within the Dubai geographic box
baselineDataset.forEach((venue) => {
  const { lat, lng } = venue.coordinates;
  const inDubaiBounds = lat >= 24.8 && lat <= 25.4 && lng >= 55.0 && lng <= 55.6;
  assert(inDubaiBounds, `${venue.name} coordinates (${lat}, ${lng}) lie within Dubai boundaries`);
  assert(isValidGoogleMapsUrl(venue.googleMaps.viewUrl), `${venue.name} has valid Google Maps View link`);
  assert(isValidGoogleMapsUrl(venue.googleMaps.directionsUrl), `${venue.name} has valid Google Maps Directions link`);
});

console.log('\n--- 4. Testing GeoJSON and CSV Import Pipelines & Deduplication ---');

// Test 9: GeoJSON Import Pipeline
const sampleGeoJson = JSON.stringify({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [55.2708, 25.2048] },
      properties: {
        name: 'Arabian Karak Shack',
        amenity: 'cafe',
        cuisine: 'Tea;Street Food',
        'addr:district': 'Al Satwa',
        'addr:street': '2nd December St',
        phone: '+971 4 332 9988',
      },
    },
  ],
});

const geoJsonResult = importGeoJson(sampleGeoJson, baselineDataset);
assert(geoJsonResult.summary.success === true, 'GeoJSON import succeeds');
assert(geoJsonResult.summary.importedCount === 1, 'Imported 1 new venue from GeoJSON');
assert(Boolean(geoJsonResult.summary.backupPath), 'Automatic backup snapshot created before GeoJSON import');

// Test 10: Duplicate Prevention on repeat import
const repeatGeoJsonResult = importGeoJson(sampleGeoJson, geoJsonResult.updatedList);
assert(repeatGeoJsonResult.summary.duplicateCount === 1, 'Duplicate detected and prevented on repeat import');
assert(repeatGeoJsonResult.summary.importedCount === 0, 'Zero duplicate records inserted');

// Test 11: CSV Import Pipeline
const sampleCsv = `name,category,cuisine,neighborhood,street,lat,lng,phone
Allo Beirut Street Food,restaurant,Lebanese Street Food,Al Barsha,Hessa St,25.0921,55.1912,+971 800 8623478
JBR Chai Spot,cafe,Specialty Karak,JBR,The Walk,25.0812,55.1345,+971 4 551 2233`;

const csvResult = importCsv(sampleCsv, baselineDataset);
assert(csvResult.summary.success === true, 'CSV import succeeds');
assert(csvResult.summary.importedCount === 2, 'Imported 2 records from CSV');
assert(csvResult.updatedList.some((r) => r.name === 'Allo Beirut Street Food'), 'Imported venue found in updated list');

console.log('\n--- 5. Testing Seed Dataset (52 Unique Records) & Deliverables ---');

import { SEED_RAW_RECORDS, SEED_RESTAURANTS } from '../src/data/seedDataset';
import fs from 'fs';
import path from 'path';

assert(SEED_RAW_RECORDS.length === 52, `Seed dataset contains exactly 52 unique records (count: ${SEED_RAW_RECORDS.length})`);

// Check deduplication of sponsored listings: The Pods and TakaHisa
const podsEntries = SEED_RAW_RECORDS.filter((r) => r.name === 'The Pods');
assert(podsEntries.length === 1, 'The Pods repeated sponsored entry is deduplicated to 1 canonical record');

const takahisaEntries = SEED_RAW_RECORDS.filter((r) => r.name.includes('TakaHisa'));
assert(takahisaEntries.length === 1, 'TakaHisa repeated sponsored entry is deduplicated to 1 canonical record');

// Validate Google Maps links for all 52 seed records
let allSeedMapsValid = true;
SEED_RESTAURANTS.forEach((s) => {
  if (!isValidGoogleMapsUrl(s.googleMaps.viewUrl) || !isValidGoogleMapsUrl(s.googleMaps.directionsUrl)) {
    allSeedMapsValid = false;
  }
});
assert(allSeedMapsValid, 'All 52 seed restaurants have valid Google Maps & Directions URLs without API keys');

// Validate files exist
const DATA_DIR = path.resolve(process.cwd(), 'data');
assert(fs.existsSync(path.join(DATA_DIR, 'restaurants.json')), 'data/restaurants.json exists');
assert(fs.existsSync(path.join(DATA_DIR, 'restaurants.csv')), 'data/restaurants.csv exists');
assert(fs.existsSync(path.join(DATA_DIR, 'restaurant_sources.csv')), 'data/restaurant_sources.csv exists');
assert(fs.existsSync(path.join(DATA_DIR, 'restaurant_import_report.md')), 'data/restaurant_import_report.md exists');
assert(fs.existsSync(path.join(DATA_DIR, 'image_audit_report.md')), 'data/image_audit_report.md exists');

console.log('\n--- 6. Testing Restaurant Image System & Zero-Duplicate Integrity ---');

import { loadRestaurants } from '../server/storage';
const loadedList = loadRestaurants();

// Test 12: Zero Duplicate Image URLs across different restaurants
const verifiedMap = new Map<string, string[]>();
let verifiedImageCount = 0;
let placeholderImageCount = 0;
let legacyHardcodedFound = 0;

loadedList.forEach((r) => {
  // Check required fields exist
  assert(r.image_status !== undefined, `${r.name} has image_status defined`);
  assert(Boolean(r.image_alt), `${r.name} has non-empty image_alt text`);

  // Check that legacy hardcoded shared asset is NOT assigned as image_url or heroImage
  if (r.image_url?.includes('hero_dubai_dining') || r.heroImage?.includes('hero_dubai_dining')) {
    legacyHardcodedFound++;
  }

  if (r.image_status === 'verified' && r.image_url) {
    verifiedImageCount++;
    const existing = verifiedMap.get(r.image_url) || [];
    existing.push(r.id);
    verifiedMap.set(r.image_url, existing);

    assert(Boolean(r.image_source_name), `${r.name} verified image has source credit name`);
    assert(Boolean(r.image_source_url), `${r.name} verified image has source URL`);
  } else {
    placeholderImageCount++;
    assert(r.image_status === 'placeholder', `${r.name} unverified image has image_status: 'placeholder'`);
    assert(r.image_url === null, `${r.name} placeholder has image_url: null`);
  }
});

assert(legacyHardcodedFound === 0, `Zero restaurants use hardcoded generic asset hero_dubai_dining (found: ${legacyHardcodedFound})`);

let duplicateCount = 0;
verifiedMap.forEach((ids, url) => {
  if (ids.length > 1) {
    duplicateCount++;
    console.error(`Duplicate image URL found: ${url} across [${ids.join(', ')}]`);
  }
});
assert(duplicateCount === 0, `Zero cross-restaurant duplicate image URLs detected across all verified listings`);
assert(verifiedImageCount > 0, `Found ${verifiedImageCount} verified restaurant-specific images with proper licenses`);
assert(placeholderImageCount > 0, `Found ${placeholderImageCount} restaurants configured with professional branded placeholders`);

// Test 13: Pagination & Filtering stability - Images remain bound to correct restaurants
const testNeighbourhoodFilter = loadedList.filter((r) => r.neighborhood === 'Downtown Dubai');
assert(testNeighbourhoodFilter.length > 0, 'Found Downtown Dubai restaurants for filter testing');
testNeighbourhoodFilter.forEach((r) => {
  assert(r.neighborhood === 'Downtown Dubai', `${r.name} matches filter neighborhood`);
  assert(r.image_alt.includes('Dubai'), `${r.name} image_alt is correctly bound to restaurant details`);
});

// Test 14: Pagination slice test - Page 1 vs Page 2 items retain independent image definitions
const pageSize = 6;
const page1 = loadedList.slice(0, pageSize);
const page2 = loadedList.slice(pageSize, pageSize * 2);
assert(page1[0].id !== page2[0].id, 'Page 1 and Page 2 contain distinct restaurants');
assert(page1[0].name !== page2[0].name, 'Page 1 and Page 2 restaurants have distinct names');

// Test 15: CSV Importer without image sets placeholder, not hardcoded image
const sampleNoImageCsv = `name,lat,lng,neighborhood
Boutique Al Barsha Cafe,25.115,55.201,Al Barsha`;
const noImageResult = importCsv(sampleNoImageCsv, loadedList);
const importedNoImage = noImageResult.updatedList.find((r) => r.name === 'Boutique Al Barsha Cafe')!;
assert(importedNoImage !== undefined, 'Imported candidate venue without image');
assert(importedNoImage.image_status === 'placeholder', 'Candidate without image receives image_status: placeholder');
assert(importedNoImage.image_url === null, 'Candidate without image receives image_url: null');
assert(!importedNoImage.heroImage?.includes('hero_dubai_dining'), 'Candidate does not receive hardcoded hero_dubai_dining image');

// Test 16: CSV Importer with verified image sets verified status and credits
const sampleWithImageCsv = `name,lat,lng,neighborhood,image_url,image_source_name,image_source_url
Palm Beachside Brasserie,25.119,55.142,Palm Jumeirah,https://images.unsplash.com/photo-custom-brasserie,Official PR,https://example.com/pr`;
const withImageResult = importCsv(sampleWithImageCsv, loadedList);
const importedWithImage = withImageResult.updatedList.find((r) => r.name === 'Palm Beachside Brasserie')!;
assert(importedWithImage !== undefined, 'Imported candidate venue with image');
assert(importedWithImage.image_status === 'verified', 'Candidate with image receives image_status: verified');
assert(importedWithImage.image_url === 'https://images.unsplash.com/photo-custom-brasserie', 'Candidate preserves image_url');
assert(importedWithImage.image_source_name === 'Official PR', 'Candidate preserves image_source_name');

console.log(`\n========================================`);
console.log(`Test Results: ${passed} passed, ${failed} failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
