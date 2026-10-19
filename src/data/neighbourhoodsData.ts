/**
 * Authentic, Verifiable Dubai Neighbourhood Guides Data
 * 
 * Each neighbourhood is detailed with unique local transit facts, parking dynamics,
 * price landscapes, and dining atmosphere specific to that part of Dubai.
 */

export interface NeighbourhoodGuide {
  slug: string;
  name: string;
  arabicName: string;
  tagline: string;
  overview: string;
  diningCulture: string;
  transitAndMetro: string;
  parkingAndAccess: string;
  priceLandscape: string;
  signatureCuisines: string[];
  bestTimesToVisit: string;
  localInsiderTips: string[];
  approxCenter: { lat: number; lng: number; zoom: number };
  aliases: string[]; // for matching restaurants
}

export const NEIGHBOURHOODS_DATA: NeighbourhoodGuide[] = [
  {
    slug: 'downtown-dubai',
    name: 'Downtown Dubai',
    arabicName: 'وسط مدينة دبي',
    tagline: 'World-record landmarks, fountain terraces, and high-altitude fine dining',
    overview: 'Anchored by the 828-metre Burj Khalifa, The Dubai Mall, and Dubai Opera, Downtown Dubai is the city’s premiere tourist and luxury dining epicentre. The dining scene ranges from casual lakeside bistros along Sheikh Mohammed bin Rashid Boulevard to theatrical, high-altitude dining experiences located over 400 metres above ground level.',
    diningCulture: 'High-energy, cosmopolitan, and visually theatrical. The Boulevard features shaded outdoor terraces with continuous afternoon-to-midnight crowds, while venues within Souk Al Bahar and The Dubai Mall cater heavily to fountain-facing spectacle dinners.',
    transitAndMetro: 'Directly served by the Burj Khalifa / Dubai Mall Metro Station on the Dubai Metro Red Line via the air-conditioned Metro Link bridge (approx. 10-15 minute walk). Dedicated taxi stands are located at all Dubai Mall gates and Boulevard hotels.',
    parkingAndAccess: 'The Dubai Mall offers extensive underground parking (Cinema, Fashion, and Grand Parking zones, note: Salik parking fees apply at peak mall hours). Boulevard dining commonly uses hotel valet (AED 50-100 or validated with minimum dining spend) or RTA paid street parking zones along Sheikh Mohammed bin Rashid Blvd.',
    priceLandscape: 'Predominantly mid-tier to ultra-luxury. Casual mall and food hall meals range AED 50–120 per person; licensed boulevard venues range AED 250–500; high-altitude observation level restaurants (Burj Khalifa, Address Sky View) exceed AED 500–1,000+ per diner.',
    signatureCuisines: ['Contemporary French', 'Modern Asian Fusion', 'Artisanal Food Hall', 'Emirati Modern', 'Italian Bistro'],
    bestTimesToVisit: 'Evenings from 18:00 to 22:30 coincide with the 30-minute Dubai Fountain shows. Outdoor terrace seating is best between November and April.',
    localInsiderTips: [
      'Souk Al Bahar terraces offer superior, less crowded fountain views compared to the main Dubai Mall promenade.',
      'Book high-floor tower restaurants at least 2–3 weeks in advance for weekend sunset slots.',
      'Allow extra time for traffic on the Boulevard loop during Friday and Saturday evenings after 19:00.',
    ],
    approxCenter: { lat: 25.1972, lng: 55.2744, zoom: 14 },
    aliases: ['Downtown Dubai', 'Downtown', 'Burj Khalifa', 'Souk Al Bahar', 'The Dubai Mall'],
  },
  {
    slug: 'dubai-marina',
    name: 'Dubai Marina',
    arabicName: 'دبي مارينا',
    tagline: 'Waterfront promenade bistros, yacht views, and multi-tier dining hubs',
    overview: 'Carved out of the Arabian Gulf desert coastline, Dubai Marina is a 3-kilometre artificial canal surrounded by supertall residential towers. The neighbourhood is famous for its 7-kilometre Marina Walk promenade and Pier 7, a unique circular seven-storey dining tower where each floor hosts a distinct world restaurant.',
    diningCulture: 'Social, alfresco, and relaxed yet chic. Residents and visitors flock to waterside boardwalk tables for lazy brunches, evening seafood dinners, and scenic sundowners overlooking gleaming superyachts.',
    transitAndMetro: 'Exceptional public transport access: connected by DMCC and Sobha Realty Metro Stations (Red Line), integrated seamlessly with the Dubai Tram which circumnavigates the Marina loop.',
    parkingAndAccess: 'Underground parking is available at Dubai Marina Mall. Pier 7 provides dedicated valet. Street parking along Al Marsa Street is limited and heavily monitored by RTA; utilizing the Dubai Tram is often faster on busy weekend nights.',
    priceLandscape: 'Broadly mid-range to premium. Promenade cafes and casual dining range AED 70–150; Pier 7 licensed venues and signature seafood bistros average AED 250–450 per person.',
    signatureCuisines: ['British Gastropub', 'Pan-Asian', 'Mediterranean Coastal', 'French Bistro', 'Artisan Coffee'],
    bestTimesToVisit: 'Golden hour (17:00–18:30) for sunset reflections off the glass towers, transitioning to evening when the marina skyscrapers illuminate the water.',
    localInsiderTips: [
      'Pier 7 floors 4 to 6 offer unobstructed 360-degree views of the canal; reserve balcony tables well in advance.',
      'The Dubai Water Bus runs ferry shuttles across the marina between Marina Mall and Marina Walk, offering a scenic shortcut.',
      'Comfortable walking shoes are recommended if you plan to stroll between Dubai Marina Mall and JBR across the pedestrian footbridges.',
    ],
    approxCenter: { lat: 25.0784, lng: 55.1409, zoom: 14 },
    aliases: ['Dubai Marina', 'Marina', 'Pier 7', 'Marina Promenade'],
  },
  {
    slug: 'jbr',
    name: 'JBR (Jumeirah Beach Residence)',
    arabicName: 'جميرا بيتش ريزيدنس',
    tagline: 'Beachfront boardwalk dining, seaside street food, and lively open-air terraces',
    overview: 'Stretching 1.7 kilometres along the Persian Gulf coast directly in front of Dubai Marina, JBR encompasses 40 high-rise towers facing the Arabian sea. Its two primary arteries—The Walk and The Beach—host hundreds of casual dining establishments, international franchise flagships, and beach clubs with views of Ain Dubai on Bluewaters Island.',
    diningCulture: 'Bustling, sun-soaked, and family-oriented. Beachgoers dine in casual resort attire during the day, while evenings draw massive foot traffic for open-air dining, gelato, and street-level shisha lounges.',
    transitAndMetro: 'Served directly by the Dubai Tram (JBR 1 and JBR 2 stations), which connect to the Red Line Metro at DMCC station. Pedestrian footbridges link JBR to Bluewaters Island and Dubai Marina.',
    parkingAndAccess: 'The Beach features an extensive underground parking facility (validation available with AED 100+ spend at participating eateries). Traffic on The Walk can be very slow moving on weekend evenings.',
    priceLandscape: 'Affordable to upper mid-range. Street food, falafel wraps, and beach burgers cost AED 35–80; sit-down beachfront grills and hotel restaurants run AED 150–350.',
    signatureCuisines: ['Levantine Street Food', 'American Coastal Burgers', 'Turkish Charcoal Grills', 'Brazilian Churrasco', 'Artisan Gelato'],
    bestTimesToVisit: 'Late afternoon to night. Perfect for a swim or beach walk followed by casual dinner as the sun sets over Ain Dubai.',
    localInsiderTips: [
      'Avoid driving through The Walk between 20:00 and 23:00 on Fridays and Saturdays; park at Dubai Marina Mall and walk across the footbridge instead.',
      'The open-air seating directly on the sand at The Beach is licensed for food but not alcohol; for licensed venues, head up to the adjacent hotel terraces like Delta or Hilton.',
    ],
    approxCenter: { lat: 25.0792, lng: 55.1321, zoom: 15 },
    aliases: ['JBR', 'Jumeirah Beach Residence', 'The Walk at JBR', 'The Beach, JBR'],
  },
  {
    slug: 'deira',
    name: 'Deira',
    arabicName: 'ديرة',
    tagline: 'Historic Creek trading quarter, legendary 24-hour grills, and authentic diaspora gems',
    overview: 'As Dubai’s historic commercial cradle, Deira sits north of Dubai Creek and retains the aromatic, bustling trading soul of the emirate. Here you will find multi-generational spice merchants, gold souks, and historic cafeterias serving authentic Emirati, Syrian, Iranian, Pakistani, and South Indian cuisines at honest local prices.',
    diningCulture: 'Unpretentious, vibrant, and nocturnal. Cafes and grills along Al Rigga and Al Muraqqabat stay open late into the early morning hours, often packed with communal tables and tea-drinking regulars.',
    transitAndMetro: 'Extremely well served by both the Dubai Metro Green Line (Al Ras, Baniyas Square, Salah Al Din) and Red Line (Union, Al Rigga, Deira City Centre). Union Station serves as the major interchange. Traditional wooden abra boats cross the Creek to Bur Dubai for just AED 1.',
    parkingAndAccess: 'Street parking is heavily congested and governed by RTA Zone A (paid). It is strongly recommended to park at designated RTA multi-storey car parks near Fish Roundabout or use the Dubai Metro.',
    priceLandscape: 'Dubai’s most affordable and value-rich dining district. Generous, authentic meals can easily be enjoyed for AED 25–65 per person. Upscale heritage dining (such as Al Dawaar revolving restaurant at Hyatt Regency) provides a luxury contrast.',
    signatureCuisines: ['Syrian & Levantine Grills', 'Emirati Traditional', 'Pakistani Karahi', 'Filipino Seafood Dumps', 'Mughlai Awadhi Biryani'],
    bestTimesToVisit: 'Evenings from 19:00 until 02:00. The souks and street food stalls truly come alive after nightfall.',
    localInsiderTips: [
      'Take the traditional wooden abra from Bur Dubai Abra Station across to Deira Old Souk for AED 1—it remains the most scenic and authentic commute in the city.',
      'Do not miss the 24-hour bakeries on Al Muraqqabat for fresh hot Syrian pita right out of the flaming stone oven.',
    ],
    approxCenter: { lat: 25.2662, lng: 55.3219, zoom: 14 },
    aliases: ['Deira', 'Al Rigga', 'Al Muraqqabat', 'Port Saeed', 'Old Dubai'],
  },
  {
    slug: 'bur-dubai',
    name: 'Bur Dubai',
    arabicName: 'بر دبي',
    tagline: 'Wind-tower heritage quarter, historic Indian culinary alleys, and Creek abra docks',
    overview: 'Located on the southern side of Dubai Creek, Bur Dubai encompasses the Al Fahidi Historical Neighbourhood, the textile souk, and the vibrant Meena Bazaar district. It is home to some of Dubai’s oldest culinary institutions, established in the 1960s and 1970s by early merchant communities.',
    diningCulture: 'Richly cultural and nostalgic. Tranquil, leafy wind-tower courtyards serving traditional mint tea sit just blocks away from the bustling, sensory spice alleys of Meena Bazaar with sputtering clay tandoors and sweet shops.',
    transitAndMetro: 'Served by the Green Line Metro (Al Fahidi, Sharaf DG, Burjuman) with Burjuman serving as the key Red/Green Line interchange. Abra docks at Bur Dubai provide seamless connection to Deira.',
    parkingAndAccess: 'Tight street layout with limited roadside parking. Paid RTA parking lots are situated near Al Fahidi roundabout and behind Meena Bazaar, but Metro travel or walking from the Creek abra is vastly preferable.',
    priceLandscape: 'Extremely budget-friendly. Historic kabab houses and curry joints cost AED 30–75 per person. Heritage courtyard tea houses range AED 70–150 for lavish breakfast spreads.',
    signatureCuisines: ['Traditional Emirati', 'Iranian Kababs', 'North Indian Punjabi & Mughlai', 'South Indian Vegetarian', 'Street Chaat & Samosas'],
    bestTimesToVisit: 'Late morning (10:00–13:00) for courtyard tea in Bastakiya, or evening (18:00–22:00) to experience the lively buzz of Meena Bazaar.',
    localInsiderTips: [
      'Visit Al Ustad Special Kabab—a landmark operating since 1978 whose walls are lined with thousands of customer photos and VIP currency notes.',
      'The quiet limestone courtyards of Al Fahidi offer a peaceful sanctuary from city noise with traditional shaded canopy seating.',
    ],
    approxCenter: { lat: 25.2631, lng: 55.2992, zoom: 14 },
    aliases: ['Bur Dubai', 'Al Fahidi', 'Meena Bazaar', 'Bastakiya', 'Al Mankhool'],
  },
  {
    slug: 'business-bay',
    name: 'Business Bay',
    arabicName: 'الخليج التجاري',
    tagline: 'Dubai Water Canal promenade, architectural showpieces, and corporate chic dining',
    overview: 'Bordering Downtown Dubai to the south, Business Bay is a rapidly developing metropolis of soaring office towers, high-end residences, and luxury hotels set along the glistening Dubai Water Canal. Architectural icons like Zaha Hadid’s The Opus and the twin-tower JW Marriott Marquis house world-class culinary concepts.',
    diningCulture: 'Sophisticated corporate lunches by day giving way to sleek lounges, canal-side alfresco terraces, and late-night culinary destinations by night.',
    transitAndMetro: 'Served by the Business Bay Metro Station on the Red Line. RTA Dubai Ferry and Water Taxi stations operate along the Dubai Canal boardwalk with stops at Godolphin and Marasi.',
    parkingAndAccess: 'Most signature restaurants are inside major hotels or commercial hubs (The Opus, JW Marriott Marquis, Bay Square) featuring dedicated valet services. Bay Square offers subterranean parking with 2 hours free validation at many outlets.',
    priceLandscape: 'Upper mid-range to fine dining. Executive business lunches range AED 90–160; fine dining robatayaki and rooftop grills range AED 250–550+ per person.',
    signatureCuisines: ['Robatayaki Japanese', 'British Artisan Gastropub', 'Authentic Royal Thai', 'American Steakhouse', 'Modern European'],
    bestTimesToVisit: '12:30–15:00 for value-driven corporate lunch menus; 19:30–23:00 for canal-side dinner and evening skyline views.',
    localInsiderTips: [
      'Take advantage of Business Bay’s high-end "business lunch" menus on weekdays—many top-tier restaurants offer 3-course chef menus for under AED 150.',
      'Stroll the Dubai Water Canal promenade after dinner to view the mechanical waterfall under the Sheikh Zayed Road bridge.',
    ],
    approxCenter: { lat: 25.1859, lng: 25.2578, zoom: 14 },
    aliases: ['Business Bay', 'The Opus', 'Marasi Drive', 'Bay Square', 'Dubai Canal'],
  },
  {
    slug: 'difc',
    name: 'DIFC (Dubai International Financial Centre)',
    arabicName: 'مركز دبي المالي العالمي',
    tagline: 'The culinary powerhouse: Gate Village art galleries, Michelin stars, and power lunches',
    overview: 'DIFC is not only the Middle East’s leading financial free zone—it is arguably the undisputed epicentre of high-end gastronomy in the UAE. Concentrated primarily within Gate Village, DIFC boasts an extraordinary density of Michelin-starred, Michelin-selected, and MENA 50 Best restaurants situated above world-class contemporary art galleries.',
    diningCulture: 'High-powered, cosmopolitan, and impeccably polished. Sharp-suited executives conduct boardroom negotiations over express business lunches, while evenings transform into glamorous social dining with international crowds and world-renowned resident chefs.',
    transitAndMetro: 'Directly served by Financial Centre and Emirates Towers Metro Stations on the Red Line, with air-conditioned pedestrian walkways and Gate Avenue retail connectors.',
    parkingAndAccess: 'All Gate Village dining outlets offer unified underground valet parking (AED 50 or validated with restaurant receipt). Self-parking is available in Gate District car parks with hourly fee structures.',
    priceLandscape: 'Premium to luxury. Express business lunches range AED 120–180; dinner for two with drinks typically runs AED 600–1,500+.',
    signatureCuisines: ['French Mediterranean', 'Contemporary Japanese & Robata', 'Modern Greek & Aegean', 'Northern Chinese Sichuan', 'Latin American Nikkei'],
    bestTimesToVisit: 'Thursdays and Fridays for the premier dining buzz; weekday lunchtimes between 12:30 and 14:30 for prime people-watching and exceptional set lunch menus.',
    localInsiderTips: [
      'Almost every fine-dining venue in DIFC offers a remarkably good value "Business Lunch" on weekdays—often 2 to 3 courses from Michelin-pedigree kitchens at a fraction of dinner pricing.',
      'Gate Avenue connects the entire district through air-conditioned landscaped corridors, making it easy to stroll between Gate Village and South District.',
    ],
    approxCenter: { lat: 25.2120, lng: 55.2831, zoom: 15 },
    aliases: ['DIFC', 'Gate Village', 'Gate Building', 'Gate Avenue', 'Financial Centre'],
  },
  {
    slug: 'jumeirah',
    name: 'Jumeirah & Umm Suqeim',
    arabicName: 'جميرا وأم سقيم',
    tagline: 'Standalone villa cafes, homegrown culinary trailblazers, and Kite Beach seafood',
    overview: 'Hugging the coastline from the Dubai Canal to the Burj Al Arab, Jumeirah is a low-rise residential district of whitewashed seaside villas. Rather than inside mega-malls, dining here takes place in converted villas, boutique strips like Wasl 51 and Galleria Mall, and seaside fishing harbours where independent, homegrown chefs have made their mark.',
    diningCulture: 'Artisanal, creative, and community-driven. Jumeirah is the birthplace of Dubai’s modern homegrown food movement, where local Emirati and resident restaurateurs launch boundary-pushing concepts with fierce local followings.',
    transitAndMetro: 'Jumeirah is not directly traversed by the Dubai Metro. The closest stations are Onpassive, Equiti, and Mall of the Emirates on Sheikh Zayed Road (a short 5-10 minute taxi ride to the coast). RTA Bus routes 8, 81, and 88 run along Jumeirah Beach Road.',
    parkingAndAccess: 'Most villa cafes and community centres (Wasl 51, Dar Wasl, Galleria Mall) have basement parking (often with complimentary 1–2 hours). Street parking along Jumeirah Beach Road is paid RTA parking.',
    priceLandscape: 'Varied: from humble wooden fishing shack seafood (Bu Qtair) at AED 45–90 to Michelin-awarded homegrown bistros (Orfali Bros, 3Fils) at AED 150–350, up to ultra-luxury resort beachfront dining at Four Seasons.',
    signatureCuisines: ['Modern Homegrown Bistro', 'Artisanal Coffee & Roasteries', 'Coastal Seafood & Harbor Dining', 'Palestinian Stone Oven Bakery', 'Healthy Organic Vegan'],
    bestTimesToVisit: 'Mornings for relaxed courtyard breakfasts and third-wave coffee; late afternoons to watch surfers at Kite Beach before sunset dinner.',
    localInsiderTips: [
      'Jumeirah Fishing Harbour 1 and 2 are hidden culinary gems with charming wooden piers, fishing boat views, and zero mall bustle.',
      'Check out Wasl 51 and Dar Wasl on Al Wasl Road for the densest cluster of award-winning independent restaurants in the city.',
    ],
    approxCenter: { lat: 25.2015, lng: 55.2413, zoom: 13 },
    aliases: ['Jumeirah', 'Umm Suqeim', 'Al Wasl', 'Wasl 51', 'Kite Beach', 'Jumeirah 1', 'Jumeirah 2', 'Jumeirah 3'],
  },
  {
    slug: 'al-barsha',
    name: 'Al Barsha',
    arabicName: 'البرشاء',
    tagline: 'Mall of the Emirates hub, diverse Asian & Arab diaspora street fare, and hidden gems',
    overview: 'Situated south of Al Sufouh and centered around the colossal Mall of the Emirates, Al Barsha is a vibrant, accessible neighbourhood. Beyond the ski slope and mall dining, Al Barsha 1 contains one of Dubai’s richest concentrations of regional Indian, Pakistani, Filipino, and Levantine dining spots.',
    diningCulture: 'Casual, diverse, and culinary authentic. The streets behind Mall of the Emirates are packed with family-run dining halls, sizzling tandoors, clay oven grills, and lively sweet shops that cater to Dubai’s diverse multinational workforce.',
    transitAndMetro: 'Directly connected via the Mall of the Emirates and Mashreq Metro Stations on the Red Line. Buses connect seamlessly to Dubai Science Park and Barsha Heights.',
    parkingAndAccess: 'Mall of the Emirates offers 7,000+ parking spaces (free for 4 hours on weekdays, free on weekends). In Al Barsha 1, paid street parking is available along Streets 14 and 14B.',
    priceLandscape: 'Outstanding value. Most neighborhood dining options cost AED 30–75 per person. Mall of the Emirates features casual dining flagships (Din Tai Fung, Texas De Brazil) at AED 75–180.',
    signatureCuisines: ['Pakistani Barbecue & Biryani', 'South Indian Malabar Seafood', 'Taiwanese Dim Sum', 'Live Tabletop Charcoal Grills', 'North Indian Curries'],
    bestTimesToVisit: 'Evenings between 18:30 and 23:00 when the culinary streets behind the mall come alive with sizzling grills and local families.',
    localInsiderTips: [
      'For authentic South Indian coastal seafood, Calicut Paragon on Street 14B serves what many consider the best fish curry in Dubai.',
      'Din Tai Fung in Mall of the Emirates consistently has a queue—arrive before 12:30 for lunch or 18:30 for dinner to minimize wait times.',
    ],
    approxCenter: { lat: 25.1185, lng: 55.2014, zoom: 14 },
    aliases: ['Al Barsha', 'Al Barsha 1', 'Barsha', 'Mall of the Emirates'],
  },
  {
    slug: 'palm-jumeirah',
    name: 'Palm Jumeirah',
    arabicName: 'نخلة جميرا',
    tagline: 'Man-made marvel: 360-degree island views, overwater piers, and world-class luxury',
    overview: 'The world-famous palm-tree-shaped artificial archipelago extending into the Arabian Gulf is a showcase of architectural ambition and culinary extravagance. From the 51st floor observatory of The Palm Tower to the subterranean aquarium of Atlantis The Palm and scenic boardwalks along the crescent, dining on the Palm is synonymous with panoramic island vistas.',
    diningCulture: 'Lavish, resort-centric, and celebratory. Diners dress up for landmark experiences, Michelin-starred tasting menus, and barefoot luxury beach clubs overlooking the Dubai Marina skyline across the water.',
    transitAndMetro: 'Connected via the Palm Jumeirah Monorail, which runs along the trunk from Palm Gateway Station (linked to Dubai Tram) all the way to Nakheel Mall, The Pointe, and Atlantis Aquaventure.',
    parkingAndAccess: 'Complimentary or validated valet parking is universal across Palm luxury resorts and Nakheel Mall. Road access is via the Palm trunk underpass; drive times can lengthen during weekend sunset hours.',
    priceLandscape: 'Predominantly luxury. Nakheel Mall casual dining ranges AED 80–180; signature tower and resort venues range AED 400–1,200+ per diner.',
    signatureCuisines: ['Japanese-Peruvian Nikkei', 'Progressive Underwater Seafood', 'Overwater Mediterranean Coastal', 'Modern Indian Tasting Menu', 'French Haute Cuisine'],
    bestTimesToVisit: 'Sunset (17:30–19:00) offers unparalleled views of the Arabian Gulf turning amber, followed by dinner overlooking the illuminated Dubai Marina skyline.',
    localInsiderTips: [
      'The Palm Monorail is the easiest and most scenic way to traverse the trunk without worrying about taxi lines or parking.',
      'The crescent road offers public parking bays along the outer boardwalk for sunset strolls before heading into nearby resort restaurants.',
    ],
    approxCenter: { lat: 25.1182, lng: 55.1412, zoom: 13 },
    aliases: ['The Palm Jumeirah', 'Palm Jumeirah', 'The Palm', 'The Palm Tower', 'Atlantis'],
  },
];
