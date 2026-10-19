import fs from 'fs';
import path from 'path';
import { getBaselineDataset, saveRestaurants } from '../server/storage';

const baseline = getBaselineDataset();
saveRestaurants(baseline);

console.log(`Successfully synced data/restaurants.json with ${baseline.length} restaurants!`);
console.log(`Verified image count: ${baseline.filter(r => r.image_status === 'verified').length}`);
console.log(`Placeholder image count: ${baseline.filter(r => r.image_status === 'placeholder').length}`);
