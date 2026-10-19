import fs from 'fs';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'src', 'data', 'initialRestaurants.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Replacement for 3fils
content = content.replace(
  /(\bid:\s*['"]3fils['"][\s\S]*?dietary:[^\n]+\n)[\s\S]*?(featured:\s*true,)/,
  `$1    image_url: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80',
    image_source_url: 'https://unsplash.com/photos/boats-on-body-of-water-during-daytime-O7r494jP5Xw',
    image_source_name: 'Roman Logov (Unsplash Permitted License)',
    image_verified_at: '2026-10-18T00:00:00Z',
    image_status: 'verified',
    image_alt: '3Fils at Jumeirah Fishing Harbour 1, Dubai',
    heroImage: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80',
    photos: ['https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80'],
    $2`
);

// Replacement for al-khayma-heritage
content = content.replace(
  /(\bid:\s*['"]al-khayma-heritage['"][\s\S]*?dietary:[^\n]+\n)[\s\S]*?(featured:\s*true,)/,
  `$1    image_url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
    image_source_url: 'https://unsplash.com/photos/brown-concrete-building-during-daytime-7BjmDICVloE',
    image_source_name: 'Nick Fewings (Unsplash Permitted License)',
    image_verified_at: '2026-10-18T00:00:00Z',
    image_status: 'verified',
    image_alt: 'Al Khayma Heritage Restaurant at Al Fahidi Historical Neighbourhood, Dubai',
    heroImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
    photos: ['https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80'],
    $2`
);

// Replacement for all remaining heroImage occurrences in initialRestaurants.ts
// Replace heroImage: '/src/assets/images/...', photos: [...],
content = content.replace(
  /heroImage:\s*['"]\/src\/assets\/images\/[^'"]+['"],\s*photos:\s*\[[\s\S]*?\],/g,
  `image_url: null,
    image_source_url: null,
    image_source_name: null,
    image_verified_at: null,
    image_status: 'placeholder',
    image_alt: 'Dubai dining directory listing',
    heroImage: '',
    photos: [],`
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully updated initialRestaurants.ts with standardized image fields!');
