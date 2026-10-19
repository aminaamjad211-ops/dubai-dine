import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Train,
  Car,
  Coins,
  Compass,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Info,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { NeighbourhoodGuide, NEIGHBOURHOODS_DATA } from '../../data/neighbourhoodsData';
import { Restaurant } from '../../types/restaurant';
import { RestaurantCard } from '../directory/RestaurantCard';
import { updatePageSeo } from '../../utils/seo';

interface NeighbourhoodGuidePageProps {
  guide: NeighbourhoodGuide;
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onViewDetails: (restaurant: Restaurant) => void;
  onNavigateHome: () => void;
  onSelectNeighbourhood: (slug: string) => void;
}

export function NeighbourhoodGuidePage({
  guide,
  restaurants,
  onSelectRestaurant,
  onViewDetails,
  onNavigateHome,
  onSelectNeighbourhood,
}: NeighbourhoodGuidePageProps) {
  const [selectedCuisineFilter, setSelectedCuisineFilter] = useState<string>('all');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>('all');

  // Filter restaurants matching this neighbourhood
  const matchingRestaurants = restaurants.filter((r) => {
    const rNeigh = r.neighborhood.toLowerCase();
    const matchesArea =
      guide.aliases.some((alias) => rNeigh.includes(alias.toLowerCase())) ||
      rNeigh.includes(guide.name.toLowerCase());
    return matchesArea;
  });

  // Filter by user selection
  const filteredRestaurants = matchingRestaurants.filter((r) => {
    if (selectedCuisineFilter !== 'all' && !r.cuisine.includes(selectedCuisineFilter)) {
      return false;
    }
    if (selectedPriceFilter !== 'all' && r.priceTier !== selectedPriceFilter) {
      return false;
    }
    return true;
  });

  // Unique cuisines in this area
  const availableCuisines = Array.from(
    new Set(matchingRestaurants.flatMap((r) => r.cuisine))
  ).sort();

  // Dynamic SEO update
  useEffect(() => {
    updatePageSeo({
      title: `${guide.name} Dining Guide & Verified Restaurants`,
      description: `${guide.name} dining guide: ${guide.tagline}. Discover verified restaurants, transit info, parking dynamics, and direct Google Maps navigation.`,
      canonicalPath: `/#neighbourhood/${guide.slug}`,
      ogType: 'article',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Guide',
        name: `${guide.name} Dubai Dining Guide`,
        description: guide.overview,
        about: {
          '@type': 'Place',
          name: guide.name,
          address: {
            '@type': 'PostalAddress',
            addressLocality: guide.name,
            addressRegion: 'Dubai',
            addressCountry: 'AE',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: guide.approxCenter.lat,
            longitude: guide.approxCenter.lng,
          },
        },
      },
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [guide]);

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <ol className="flex items-center gap-2 text-xs text-stone-500">
            <li>
              <button
                onClick={onNavigateHome}
                className="hover:text-stone-900 transition-colors flex items-center gap-1"
              >
                Home
              </button>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3 h-3 text-stone-400" />
            </li>
            <li>
              <span className="text-stone-600">Neighbourhoods</span>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3 h-3 text-stone-400" />
            </li>
            <li className="font-semibold text-stone-900 truncate">
              {guide.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* Guide Header Banner */}
      <header className="bg-stone-900 text-stone-100 py-12 sm:py-16 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Directory</span>
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-400">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>District Coordinates: {guide.approxCenter.lat.toFixed(4)}°N, {guide.approxCenter.lng.toFixed(4)}°E</span>
            </div>
          </div>

          <div className="space-y-3 max-w-4xl">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Official District Guide
              </span>
              <span className="text-stone-400 font-serif-display text-sm">
                {guide.arabicName}
              </span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance">
              {guide.name} Dining Guide
            </h1>
            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-3xl">
              {guide.tagline}
            </p>
          </div>
        </div>
      </header>

      {/* Main District Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        {/* District Intelligence Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Transit & Metro */}
          <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider">
              <Train className="w-4 h-4 text-amber-700" />
              <span>Metro & Public Transit</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {guide.transitAndMetro}
            </p>
          </div>

          {/* Card 2: Parking & Access */}
          <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider">
              <Car className="w-4 h-4 text-amber-700" />
              <span>Parking & Driving Dynamics</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {guide.parkingAndAccess}
            </p>
          </div>

          {/* Card 3: Price Landscape */}
          <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider">
              <Coins className="w-4 h-4 text-amber-700" />
              <span>Price Landscape</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {guide.priceLandscape}
            </p>
          </div>

          {/* Card 4: Timing & Season */}
          <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Prime Visiting Times</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {guide.bestTimesToVisit}
            </p>
          </div>
        </section>

        {/* In-Depth Overview & Culture */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 sm:p-8 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-4">
              <h2 className="font-serif-display text-2xl font-bold text-stone-900">
                District Overview
              </h2>
              <p className="text-stone-700 text-sm leading-relaxed">
                {guide.overview}
              </p>
              <h3 className="font-serif-display text-xl font-bold text-stone-900 pt-4">
                Local Dining Culture & Atmosphere
              </h3>
              <p className="text-stone-700 text-sm leading-relaxed">
                {guide.diningCulture}
              </p>
            </div>

            {/* Verifiable Local Insider Tips */}
            <div className="p-6 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Verified Local Dining Tips</span>
              </div>
              <ul className="space-y-2.5 text-xs text-amber-900/90 leading-relaxed">
                {guide.localInsiderTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar: Signature Cuisines & Other Neighbourhoods */}
          <aside className="space-y-6">
            <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Signature Cuisines in {guide.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {guide.signatureCuisines.map((sc) => (
                  <span
                    key={sc}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100 text-stone-700 border border-stone-200"
                  >
                    {sc}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Switch to Other Neighbourhoods */}
            <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Explore Other Dubai Districts
              </h3>
              <div className="space-y-1.5 text-xs">
                {NEIGHBOURHOODS_DATA.filter((n) => n.slug !== guide.slug).map((n) => (
                  <button
                    key={n.slug}
                    onClick={() => onSelectNeighbourhood(n.slug)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-700 hover:text-stone-950 transition-colors flex items-center justify-between group"
                  >
                    <span className="font-medium">{n.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {/* Directory Listings for this Neighbourhood */}
        <section className="space-y-6 pt-6 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-display text-2xl font-bold text-stone-900">
                Verified Restaurants in {guide.name}
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Showing {filteredRestaurants.length} authentic, geocoded dining venues located in {guide.name}.
              </p>
            </div>

            {/* Mini Filters */}
            <div className="flex items-center gap-3">
              {availableCuisines.length > 0 && (
                <select
                  value={selectedCuisineFilter}
                  onChange={(e) => setSelectedCuisineFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="all">All Cuisines ({matchingRestaurants.length})</option>
                  {availableCuisines.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}

              <select
                value={selectedPriceFilter}
                onChange={(e) => setSelectedPriceFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">All Prices</option>
                <option value="AED 30–80">AED 30–80</option>
                <option value="AED 80–180">AED 80–180</option>
                <option value="AED 180–400">AED 180–400</option>
                <option value="AED 400+">AED 400+</option>
              </select>
            </div>
          </div>

          {filteredRestaurants.length === 0 ? (
            <div className="p-12 text-center bg-white border border-stone-200 rounded-2xl space-y-3">
              <Info className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="font-semibold text-stone-800 text-sm">
                No matching restaurants found with current filter
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Try resetting your cuisine or price filter to view all verified listings in {guide.name}.
              </p>
              <button
                onClick={() => {
                  setSelectedCuisineFilter('all');
                  setSelectedPriceFilter('all');
                }}
                className="px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  isSelected={false}
                  onSelect={onSelectRestaurant}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
