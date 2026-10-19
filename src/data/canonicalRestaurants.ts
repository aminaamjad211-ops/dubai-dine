import { Restaurant } from '../types/restaurant';
import { INITIAL_RESTAURANTS } from './initialRestaurants';
import { SEED_RESTAURANTS } from './seedDataset';
import { OSM_DUBAI_RESTAURANTS } from './osmDubaiDataset';

function isDuplicate(item: Restaurant, list: Restaurant[]): boolean {
  const normName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return list.some((existing) => {
    if (existing.id === item.id || existing.slug === item.slug) return true;
    const existingNorm = existing.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normName === existingNorm) {
      // Check branch or district
      const itemDist = (item.branch_name || item.neighborhood).toLowerCase();
      const existDist = (existing.branch_name || existing.neighborhood).toLowerCase();
      if (itemDist === existDist || itemDist.includes(existDist) || existDist.includes(itemDist)) {
        return true;
      }
    }
    return false;
  });
}

export function buildCanonicalRestaurantList(): Restaurant[] {
  const list: Restaurant[] = [...INITIAL_RESTAURANTS];

  for (const seedItem of SEED_RESTAURANTS) {
    if (!isDuplicate(seedItem, list)) {
      list.push(seedItem);
    }
  }

  for (const osmItem of OSM_DUBAI_RESTAURANTS) {
    if (!isDuplicate(osmItem, list)) {
      list.push(osmItem);
    }
  }

  return list;
}

export const CANONICAL_RESTAURANTS: Restaurant[] = buildCanonicalRestaurantList();
