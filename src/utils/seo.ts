/**
 * SEO & Structured Data (JSON-LD) Utility for DineDubai
 */

import { Restaurant } from '../types/restaurant';
import { SITE_CONFIG } from '../config/siteConfig';

export interface SeoProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'restaurant.restaurant';
  image?: string;
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

export function updatePageSeo({
  title,
  description,
  canonicalPath = '',
  ogType = 'website',
  image = '/src/assets/images/hero_dubai_dining_1792259346527.jpg',
  structuredData,
}: SeoProps) {
  // 1. Update Title
  const fullTitle = title.includes(SITE_CONFIG.siteName)
    ? title
    : `${title} | ${SITE_CONFIG.siteName}`;
  document.title = fullTitle;

  // 2. Helper to set or create meta tag
  const setMeta = (name: string, content: string, isProperty = false) => {
    const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let element = document.querySelector(selector) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement('meta');
      if (isProperty) {
        element.setAttribute('property', name);
      } else {
        element.setAttribute('name', name);
      }
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 3. Set description & OpenGraph
  setMeta('description', description);
  setMeta('og:title', fullTitle, true);
  setMeta('og:description', description, true);
  setMeta('og:type', ogType, true);
  setMeta('og:site_name', SITE_CONFIG.siteName, true);
  setMeta('og:url', `${SITE_CONFIG.siteUrl}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`, true);
  setMeta('og:image', image, true);

  // 4. Twitter Card
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', fullTitle);
  setMeta('twitter:description', description);
  setMeta('twitter:image', image);

  // 5. Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', `${SITE_CONFIG.siteUrl}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`);

  // 6. Structured Data (JSON-LD)
  let scriptEl = document.querySelector('#dinedubai-schema') as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'dinedubai-schema';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  if (structuredData) {
    scriptEl.textContent = JSON.stringify(structuredData);
  } else {
    // Default WebSite schema
    scriptEl.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.siteName,
      url: SITE_CONFIG.siteUrl,
      description: SITE_CONFIG.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.siteUrl}/#directory?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });
  }
}

/**
 * Generates Schema.org/Restaurant JSON-LD for individual restaurant listing
 */
export function generateRestaurantSchema(restaurant: Restaurant): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': restaurant.category === 'cafe' ? 'CafeOrCoffeeShop' : 'Restaurant',
    name: restaurant.name,
    description: restaurant.description,
    url: `${SITE_CONFIG.siteUrl}/#restaurant/${restaurant.slug}`,
    image: restaurant.photos?.[0] || restaurant.heroImage,
    servesCuisine: restaurant.cuisine,
    priceRange: restaurant.priceTier,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${restaurant.address.buildingOrUnit ? restaurant.address.buildingOrUnit + ', ' : ''}${restaurant.address.street}`,
      addressLocality: restaurant.address.district || 'Dubai',
      addressRegion: 'Dubai',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: restaurant.coordinates.lat,
      longitude: restaurant.coordinates.lng,
    },
    hasMap: restaurant.googleMaps?.viewUrl,
  };

  if (restaurant.contact.phone) {
    schema.telephone = restaurant.contact.phone;
  }
  if (restaurant.contact.website) {
    schema.sameAs = [restaurant.contact.website];
  }

  // Opening hours specification
  if (restaurant.operatingHours?.schedule && restaurant.operatingHours.schedule.length > 0) {
    schema.openingHoursSpecification = restaurant.operatingHours.schedule
      .filter((s) => !s.isClosed && s.shifts && s.shifts.length > 0)
      .map((s) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${s.day}`,
        opens: s.shifts[0].open,
        closes: s.shifts[0].close,
      }));
  }

  return schema;
}
