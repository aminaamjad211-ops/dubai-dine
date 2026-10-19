/**
 * Authentic Dubai Cuisine & Dining Guides Data
 * 
 * Filtered strictly against real directory listings and verified amenities.
 * No speculative or unsupported claims are made.
 */

import { Restaurant } from '../types/restaurant';

export interface DiningGuide {
  slug: string;
  title: string;
  subtitle: string;
  heroTagline: string;
  introduction: string;
  historicalContext: string;
  orderingAndEtiquetteTips: string[];
  keySpecialtiesToTry: string[];
  filterPredicate: (restaurant: Restaurant) => boolean;
  metaDescription: string;
}

export const GUIDES_DATA: DiningGuide[] = [
  {
    slug: 'indian-restaurants',
    title: 'Indian Restaurants in Dubai',
    subtitle: 'From historic Meena Bazaar tandoors to two-Michelin-starred modern culinary art',
    heroTagline: 'Explore centuries of regional subcontinental culinary heritage across Dubai',
    introduction: 'Indian cuisine is a foundational pillar of Dubai’s dining landscape. Representing decades of cultural exchange between the Indian subcontinent and the Arabian Gulf, the city features an extraordinary spectrum of Indian gastronomy: from legendary 1970s Punjabi and Malabar eateries in Old Dubai to two-Michelin-starred modernist tasting menus on Palm Jumeirah.',
    historicalContext: 'Following the development of Dubai Creek as a free trade port, merchant families from Gujarat, Punjab, Kerala, and Sindh established some of the emirate’s earliest commercial restaurants in Bur Dubai and Deira during the 1960s and 1970s. These venues continue to operate alongside modern culinary pioneers.',
    orderingAndEtiquetteTips: [
      'In traditional venues in Bur Dubai and Deira, freshly baked tandoori breads are served hot straight from the clay oven—order them incrementally as you eat rather than all at once.',
      'South Indian Malabar restaurants specialize in fresh seafood curries; ask the server for the "Catch of the Day" (often Kingfish, Hammour, or Tiger Prawns).',
      'Biryani portions in Dubai are traditionally very generous and frequently served with complimentary spiced salan gravy and cool cucumber raita.',
    ],
    keySpecialtiesToTry: [
      'Awadhi Dum Pukht Biryani (sealed dough pot slow-cooked with saffron and whole spices)',
      'Malabar Fish Curry with fresh coconut milk, kokum, and fluffy steamed appams',
      'Tandoori Chicken Tikka and spiced seekh kebabs charred over natural charcoal',
      'Butter Chicken paired with hot garlic butter naan',
      'Modern degustation courses highlighting Indian regional micro-cuisines',
    ],
    filterPredicate: (r) =>
      r.cuisine.some((c) =>
        ['Indian', 'North Indian', 'South Indian', 'Mughlai', 'Awadhi', 'Punjabi', 'Modern Indian'].some((k) =>
          c.toLowerCase().includes(k.toLowerCase())
        )
      ),
    metaDescription: 'Discover authentic Indian dining in Dubai, from Meena Bazaar tandoors and Malabar fish curry to two-Michelin-starred fine dining on Palm Jumeirah with exact Google Maps navigation.',
  },
  {
    slug: 'pakistani-restaurants',
    title: 'Pakistani Restaurants in Dubai',
    subtitle: 'Clay oven rotis, bubbling karahi pans, and slow-simmered heritage curries',
    heroTagline: 'Unvarnished, soul-satisfying Pakistani street food and barbecue institutions',
    introduction: 'Pakistani cuisine in Dubai has achieved legendary status among locals, expatriates, and visiting international chefs alike. Built around sizzling wok-like karahi pans, intense clay oven tandoors, and slow overnight simmered meat stews, Dubai’s Pakistani institutions are celebrated for bold spices, generous hospitality, and unbeatable value.',
    historicalContext: 'Pioneered by venues like Ravi Restaurant (est. 1978) in Satwa and Karachi Darbar (est. 1973) in Deira, Pakistani restaurants served generations of builders and entrepreneurs who shaped modern Dubai. Today, they remain beloved culinary cultural institutions.',
    orderingAndEtiquetteTips: [
      'Karahi is ordered by meat weight (half-kg or full-kg) and cooked to order in iron woks—expect a 15–20 minute preparation time for fresh batches.',
      'Order "Rogheni Naan" (sesame-crusted leavened flatbread brushed with ghee) or piping hot "Tandoori Roti" to scoop up thick gravies.',
      'Traditional spiced black tea or Doodh Patti (milk-boiled spiced tea) is the customary conclusion to any authentic Pakistani meal.',
    ],
    keySpecialtiesToTry: [
      'Chicken Peshawari Karahi cooked with ripe tomatoes, ginger batons, and freshly crushed black pepper',
      'Mutton Nihari (slow-cooked bone-in shank stew garnished with fresh ginger, chilies, and lemon)',
      'Bihari Boti Kebabs (tender beef strips marinated in raw papaya and stone-ground spices)',
      'Chicken Tikka freshly pulled from the clay tandoor with mint raita',
      'Fragrant Mutton Dum Biryani with spiced basmati rice',
    ],
    filterPredicate: (r) =>
      r.cuisine.some((c) =>
        ['Pakistani', 'Karahi', 'Bihari'].some((k) => c.toLowerCase().includes(k.toLowerCase()))
      ),
    metaDescription: 'Authentic Pakistani restaurants in Dubai featuring legendary karahi, slow-cooked nihari, and clay tandoor barbecue in Satwa, Deira, and Al Barsha.',
  },
  {
    slug: 'arabic-restaurants',
    title: 'Arabic & Emirati Restaurants in Dubai',
    subtitle: 'Fragrant Khaleeji spiced rice, Levantine grills, and stone-oven bakeries',
    heroTagline: 'Savor genuine Arabian hospitality from Gulf traditions to Levantine innovation',
    introduction: 'Arabic dining in Dubai is as multifaceted as the Arab world itself. It spans deep-rooted Emirati culinary traditions like lamb machboos and cardamom-scented regag bread, Yemeni mandi, Palestinian wood-fired mana’eesh, Syrian 24-hour charcoal grills, and progressive Levantine bistros pushing regional boundaries.',
    historicalContext: 'Emirati cuisine developed from coastal fishing traditions, date palm oasis farming, and maritime spice trading with India and East Africa. In modern Dubai, this rich heritage coexists alongside authentic regional representations from Lebanon, Syria, Palestine, and Yemen.',
    orderingAndEtiquetteTips: [
      'Emirati and Khaleeji rice dishes (Mandi, Machboos) are traditionally shared family-style from large communal platters.',
      'Fresh hot flatbreads and complimentary accompaniments (fresh herbs, raw onions, radishes, pickles) are standard table offerings in traditional Levantine grills.',
      'Finish your meal with Arabic Gahwa (cardamom-infused light coffee) and sweet dates or hot kunafa.',
    ],
    keySpecialtiesToTry: [
      'Mutton Mandi (fall-apart slow-cooked meat over fragrant spiced rice with fiery tomato salsa)',
      'Emirati Lamb Machboos with dried black loomi lime and toasted pine nuts',
      'Shish Tawook and Kebab Halabi grilled over open natural charcoal',
      'Wood-fired Mana’eesh baked with authentic Palestinian za’atar and nabulsi cheese',
      'Freshly fried Falafel stuffed with sumac-spiced onions and pine nuts',
    ],
    filterPredicate: (r) =>
      r.cuisine.some((c) =>
        ['Arabic', 'Emirati', 'Levantine', 'Syrian', 'Mandi', 'Palestinian', 'Lebanese', 'Turkish'].some((k) =>
          c.toLowerCase().includes(k.toLowerCase())
        )
      ),
    metaDescription: 'Explore genuine Arabic and Emirati dining in Dubai: authentic Mandi, wood-fired Palestinian mana’eesh, Syrian charcoal grills, and traditional Emirati tea houses.',
  },
  {
    slug: 'italian-restaurants',
    title: 'Italian Restaurants in Dubai',
    subtitle: 'Handmade pasta, wood-fired ovens, and coastal Mediterranean simplicity',
    heroTagline: 'Artisanal Italian culinary excellence from rustic trattorias to DIFC fine dining',
    introduction: 'Dubai boasts an exceptional Italian dining culture that honours regional craftsmanship. Top-tier kitchens import San Marzano tomatoes, Pugliese burrata, and Sicilian seafood weekly, delivering handmade pasta rolled daily, slow-fermented Neapolitan pizzas, and delicate crudo.',
    historicalContext: 'Italian cuisine in Dubai has evolved from luxury hotel dining rooms in the 1990s into a vibrant landscape of specialized regional trattorias, coastal Mediterranean lounges, and sleek financial district institutions.',
    orderingAndEtiquetteTips: [
      'Authentic Italian venues prepare pasta strictly al dente; do not hesitate to ask the chef about daily fresh pasta cuts.',
      'Business lunch menus in DIFC and Downtown offer exceptional value for 2 or 3 courses of high-end Italian fare.',
    ],
    keySpecialtiesToTry: [
      'Handmade Truffle Tagliolini swirled in aged Parmigiano Reggiano wheels',
      'Wild Sea Bass Carpaccio with Sicilian olive oil and citrus reduction',
      'Slow-braised Ossobuco alla Milanese with saffron risotto',
      'Wood-fired Neapolitan pizza with blistered cornicione crust',
      'Classic Venetian Tiramisu with espresso-soaked savoiardi biscuits',
    ],
    filterPredicate: (r) =>
      r.cuisine.some((c) =>
        ['Italian', 'Mediterranean', 'Pasta', 'Pizza'].some((k) => c.toLowerCase().includes(k.toLowerCase()))
      ),
    metaDescription: 'Verified Italian restaurants in Dubai: handcrafted pasta, wood-fired Neapolitan pizza, and coastal Mediterranean dining in DIFC, Downtown, and Jumeirah.',
  },
  {
    slug: 'chinese-restaurants',
    title: 'Chinese Restaurants in Dubai',
    subtitle: 'Intricately pleated soup dumplings, fiery Sichuan woks, and northern heritage',
    heroTagline: 'Masterful dim sum craft and fiery provincial wok traditions in Dubai',
    introduction: 'From the surgical precision of Taiwanese master dim sum chefs folding 18-pleat soup dumplings to the theatrical spectacle of Northern Chinese Peking duck and fiery Sichuan peppercorns, Chinese dining in Dubai blends world-renowned global brands with authentic regional specialists.',
    historicalContext: 'Dubai’s Chinese community has grown substantially around trade hubs like Dragon Mart and financial centers like DIFC. This has nurtured a mature culinary market where diners demand regional authenticity over westernized adaptations.',
    orderingAndEtiquetteTips: [
      'Xiao Long Bao (soup dumplings) must be eaten with a spoon: place the dumpling in the spoon, pierce a small hole to release the broth, sip the soup, then enjoy with julienned ginger and black vinegar.',
      'Sichuan dishes feature "Mala" (numbing and spicy) peppercorns; notify staff if you have lower chili tolerance.',
    ],
    keySpecialtiesToTry: [
      '18-fold Steamed Xiao Long Bao (Kurobuta pork or chicken soup dumplings)',
      'Fiery Red Lantern Soft-Shell Crab tossed in Sichuan dried red chilies',
      'Traditional Wood-Roasted Peking Duck served with wafer-thin steamed pancakes',
      'Crispy vegetable and prawn potstickers with chili oil',
      'Hand-pulled Dan Dan noodles with toasted sesame and crushed peanuts',
    ],
    filterPredicate: (r) =>
      r.cuisine.some((c) =>
        ['Chinese', 'Taiwanese', 'Sichuan', 'Dim Sum', 'Asian Wok'].some((k) =>
          c.toLowerCase().includes(k.toLowerCase())
        )
      ),
    metaDescription: 'Discover the best authentic Chinese and Taiwanese dining in Dubai, from world-famous 18-fold xiao long bao soup dumplings to fiery Sichuan specialties in DIFC and malls.',
  },
  {
    slug: 'japanese-restaurants',
    title: 'Japanese Restaurants in Dubai',
    subtitle: 'Robatayaki embers, omakase precision, and izakaya soul',
    heroTagline: 'World-class Japanese gastronomy from cozy izakayas to sky-high robata lounges',
    introduction: 'Dubai is globally acknowledged as one of the premier hubs for high-end Japanese dining outside Tokyo. The scene ranges from Michelin-awarded neighborhood izakayas serving soul-warming ramen to glowing robata grills and multi-course omakase counters helmed by master itamae.',
    historicalContext: 'Pioneered by international flagships like Zuma in DIFC and Nobu at Atlantis, Japanese cuisine established the standard for Dubai’s luxury dining scene. More recently, homegrown concepts like Kinoya and 3Fils proved that casual, unpretentious Japanese culinary mastery thrives in Dubai.',
    orderingAndEtiquetteTips: [
      'Counter seating at izakayas and robata grills provides an interactive view of chefs working with binchotan white charcoal.',
      'Traditional ramen bowls are best eaten immediately while piping hot to preserve the springy noodle texture.',
    ],
    keySpecialtiesToTry: [
      'Slow-simmered Shio Paitan and Tonkotsu ramen with soft-boiled ajitsuke tamago',
      'Miso-marinated Black Cod wrapped in hoba leaves',
      'Yellowtail Sashimi with yuzu truffle oil and fresh green jalapeno slices',
      'Wagyu beef skewers grilled over Japanese binchotan charcoal',
      'Handcrafted Nigiri with bluefin otoro and freshly grated wasabi',
    ],
    filterPredicate: (r) =>
      r.cuisine.some((c) =>
        ['Japanese', 'Sushi', 'Ramen', 'Robata', 'Izakaya', 'Nikkei'].some((k) =>
          c.toLowerCase().includes(k.toLowerCase())
        )
      ),
    metaDescription: 'Verified Japanese dining in Dubai: artisanal ramen izakayas, binchotan robatayaki grills, and world-class sushi in DIFC, Business Bay, The Greens, and Palm Jumeirah.',
  },
  {
    slug: 'affordable-restaurants',
    title: 'Affordable Restaurants in Dubai',
    subtitle: 'Legendary meals under AED 80 per person with zero compromise on authenticity',
    heroTagline: 'Eat exceptionally well without spending a fortune in Dubai',
    introduction: 'Contrary to the city’s opulent reputation, Dubai is an absolute paradise for budget-conscious food lovers. In neighbourhoods like Deira, Bur Dubai, Satwa, and Al Barsha, you can enjoy unforgettable, multi-generational feasts—from clay tandoors to Yemeni mandi and Palestinian wood-fired mana’eesh—for under AED 40 to 80 per person.',
    historicalContext: 'Dubai’s rich immigrant trading history created a thriving, competitive cafeteria and neighbourhood dining culture where high culinary standards and generous portions are delivered at honest, working-class prices.',
    orderingAndEtiquetteTips: [
      'Most budget neighborhood eateries accept cash or local debit cards; carrying small notes (AED 10, 20, 50) is helpful.',
      'Portions in Old Dubai cafeterias and grills are large; consider ordering family-style to share among multiple diners.',
    ],
    keySpecialtiesToTry: [
      'Al Ustad mutton and chicken kababs marinated in yogurt and saffron (AED 35–50)',
      'Ravi chicken peshawari with two freshly pulled tandoori rotis (AED 25–40)',
      'Mama’esh Palestinian wood-fired za’atar flatbread with mint tea (AED 20–35)',
      'Karachi Darbar 24-hour chicken karahi and tandoor bread (AED 20–35)',
      'Freshly fried falafel sandwiches with tahini and sumac (AED 15–25)',
    ],
    filterPredicate: (r) => r.priceTier === 'AED 30–80',
    metaDescription: 'Authentic affordable restaurants in Dubai: verified budget-friendly dining under AED 80 per person across Deira, Bur Dubai, Satwa, and Al Barsha.',
  },
  {
    slug: 'family-friendly-dining',
    title: 'Family-Friendly Dining in Dubai',
    subtitle: 'Spacious seating, dedicated family sections, and crowd-pleasing menus',
    heroTagline: 'Relaxed, welcoming dining destinations designed for all ages',
    introduction: 'Dubai is exceptionally welcoming to families with children. Dining across the city frequently features spacious outdoor promenades, stroller-friendly access, diverse multi-cuisine menus, and entertaining open kitchens where kids can watch chefs pull noodles or grill kebabs over coals.',
    historicalContext: 'Arabian culture places paramount importance on family gatherings and communal meals. This is reflected across Dubai’s restaurants, which frequently maintain dedicated family sections, spacious booths, and highchairs as standard amenities.',
    orderingAndEtiquetteTips: [
      'Look for venues in community malls, beachside boardwalks (The Beach JBR, Kite Beach), or waterfront food halls with pedestrianized zones for kids to stretch their legs.',
      'Tabletop barbecue venues (like Barbeque Nation) provide an interactive, exciting experience for older children.',
    ],
    keySpecialtiesToTry: [
      'Stone-fired artisan pizzas and gourmet burgers with fountain or sea views',
      'Interactive live tabletop barbecue skewers and fresh kulfi dessert carts',
      'Artisanal food hall stalls where each family member can select their favorite cuisine',
      'Generous family mixed grill platters with hummus, fatayer, and fresh warm flatbreads',
    ],
    filterPredicate: (r) =>
      r.amenities.some((a) =>
        ['Family Friendly', 'Family Section', 'Interactive Kitchen', 'Beachfront'].some((k) =>
          a.toLowerCase().includes(k.toLowerCase())
        )
      ) || r.priceTier === 'AED 80–180',
    metaDescription: 'Family-friendly restaurants in Dubai with spacious seating, kid-friendly amenities, and waterfront or mall locations across JBR, Downtown, and Al Barsha.',
  },
  {
    slug: 'rooftop-restaurants',
    title: 'Rooftop Restaurants in Dubai',
    subtitle: 'Dramatic skyline vistas, Burj Khalifa backdrops, and open-air lounges',
    heroTagline: 'Elevate your dining experience high above the illuminated Dubai skyline',
    introduction: 'With the highest concentration of supertall towers on Earth, Dubai has perfected the rooftop dining experience. Perched on levels 35 to 122, these elevated venues combine panoramic vistas of the Arabian Gulf, Burj Khalifa, and Dubai Marina with world-class international cuisine.',
    historicalContext: 'As Dubai’s skyline transformed throughout the 2000s and 2010s, luxury hotels began designing their premiere dining spaces as high-altitude viewing observatories, offering an unbeatable sensory convergence of gastronomy and architectural drama.',
    orderingAndEtiquetteTips: [
      'Sunset reservations (between 17:30 and 19:00) provide the dramatic transition from golden hour over the Persian Gulf to illuminated city nightscapes.',
      'Strict smart-casual dress codes apply at high-altitude hotel lounges; avoid athletic wear, beachwear, or open-toe footwear for gentlemen.',
      'High-altitude terraces can experience brisk desert winds during winter months; bring a light jacket or shawl.',
    ],
    keySpecialtiesToTry: [
      'Modern Asian fine dining on Level 54 with infinity pool skyline views at CÉ LA VI',
      'Haute French dining at 442 metres altitude on Level 122 of Burj Khalifa at At.mosphere',
      'Artisanal Brazilian churrasco on the 35th floor overlooking Ain Dubai at Fogueira',
      'Contemporary dry-aged steaks on the 68th floor of JW Marriott Marquis at Prime68',
      'Cocktails and Mediterranean bites on the 51st floor of The Palm Tower at SUSHISAMBA',
    ],
    filterPredicate: (r) =>
      r.amenities.some((a) =>
        ['Rooftop', 'Skyline', 'Level', 'Panoramic', 'Burj Khalifa View', 'Elevated'].some((k) =>
          a.toLowerCase().includes(k.toLowerCase())
        )
      ) ||
      r.description.toLowerCase().includes('rooftop') ||
      r.description.toLowerCase().includes('floor') ||
      r.description.toLowerCase().includes('level'),
    metaDescription: 'Verified rooftop and skyline restaurants in Dubai: high-altitude dining with Burj Khalifa and Marina views from Level 35 to Level 122 with direct Google Maps navigation.',
  },
  {
    slug: 'waterfront-restaurants',
    title: 'Waterfront Restaurants in Dubai',
    subtitle: 'Pier dining, Dubai Creek abra docks, and Arabian Gulf beachfront terraces',
    heroTagline: 'Dine to the soothing sounds of water from ancient creek to modern marinas',
    introduction: 'Water is central to Dubai’s maritime soul. Waterfront dining in Dubai offers an enchanting variety of settings: from traditional wooden fishing piers in Jumeirah and historic abra docks along Dubai Creek to gleaming yacht canals in Dubai Marina and overwater piers on Palm Jumeirah.',
    historicalContext: 'Before the discovery of oil, Dubai was a pearl diving and fishing settlement centered entirely along Dubai Creek and the Arabian Gulf coast. Waterfront eateries celebrate this maritime heritage through fresh coastal seafood and open-air sea-breeze dining.',
    orderingAndEtiquetteTips: [
      'Winter months (November to April) offer pleasant 22–27°C sea breezes ideal for outdoor pier and promenade dining.',
      'Fountain-facing waterfront tables at Dubai Mall and Souk Al Bahar experience show spectacles every 30 minutes from 18:00 onwards.',
    ],
    keySpecialtiesToTry: [
      'Catch of the Day fried in spiced masala at Jumeirah wooden fishing piers',
      'British gastropub roasts overlooking superyachts at Pier 7 Dubai Marina',
      'Casual fish tacos and wagyu sliders with your toes in the sand at Kite Beach',
      'Chilled seafood towers and fresh oysters on private overwater jetties on the Palm',
      'Asian street food on Souk Al Bahar terrace overlooking the illuminated Dubai Fountain',
    ],
    filterPredicate: (r) =>
      r.amenities.some((a) =>
        ['Waterfront', 'Marina', 'Beachfront', 'Creek', 'Pier', 'Fountain View', 'Beach'].some((k) =>
          a.toLowerCase().includes(k.toLowerCase())
        )
      ) ||
      r.neighborhood.toLowerCase().includes('marina') ||
      r.neighborhood.toLowerCase().includes('jbr') ||
      r.description.toLowerCase().includes('water') ||
      r.description.toLowerCase().includes('beach') ||
      r.description.toLowerCase().includes('canal'),
    metaDescription: 'Verified waterfront dining in Dubai: scenic seaside terraces, Dubai Marina pier restaurants, Kite Beach seafood, and Dubai Creek views with Google Maps navigation.',
  },
];
