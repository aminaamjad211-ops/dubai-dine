import React, { useEffect, useState } from 'react';
import {
  Compass,
  ArrowLeft,
  CheckCircle2,
  UtensilsCrossed,
  Sparkles,
  Info,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { DiningGuide, GUIDES_DATA } from '../../data/guidesData';
import { Restaurant } from '../../types/restaurant';
import { RestaurantCard } from '../directory/RestaurantCard';
import { updatePageSeo } from '../../utils/seo';

interface CuisineGuidePageProps {
  guide: DiningGuide;
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onViewDetails: (restaurant: Restaurant) => void;
  onNavigateHome: () => void;
  onSelectGuide: (slug: string) => void;
}

export function CuisineGuidePage({
  guide,
  restaurants,
  onSelectRestaurant,
  onViewDetails,
  onNavigateHome,
  onSelectGuide,
}: CuisineGuidePageProps) {
  const [selectedNeighborhoodFilter, setSelectedNeighborhoodFilter] = useState<string>('all');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>('all');

  // Filter restaurants matching this guide predicate
  const matchingRestaurants = restaurants.filter(guide.filterPredicate);

  // Secondary filters
  const filteredRestaurants = matchingRestaurants.filter((r) => {
    if (selectedNeighborhoodFilter !== 'all' && !r.neighborhood.toLowerCase().includes(selectedNeighborhoodFilter.toLowerCase())) {
      return false;
    }
    if (selectedPriceFilter !== 'all' && r.priceTier !== selectedPriceFilter) {
      return false;
    }
    return true;
  });

  const availableNeighborhoods = Array.from(
    new Set(matchingRestaurants.map((r) => r.neighborhood))
  ).sort();

  // Dynamic SEO update
  useEffect(() => {
    updatePageSeo({
      title: `${guide.title} | Verified Dubai Dining Guide`,
      description: guide.metaDescription,
      canonicalPath: `/#guide/${guide.slug}`,
      ogType: 'article',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.title,
        description: guide.introduction,
        author: {
          '@type': 'Organization',
          name: 'DineDubai Editorial Board',
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
              <span className="text-stone-600">Dining Guides</span>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3 h-3 text-stone-400" />
            </li>
            <li className="font-semibold text-stone-900 truncate">
              {guide.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Guide Header Banner */}
      <header className="bg-stone-900 text-stone-100 py-12 sm:py-16 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Directory</span>
            </button>
            <span className="text-xs font-medium text-stone-400">
              Verified Guide · {matchingRestaurants.length} Restaurants
            </span>
          </div>

          <div className="space-y-3 max-w-4xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Dubai Culinary Guide</span>
              </span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance">
              {guide.title}
            </h1>
            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-3xl">
              {guide.subtitle}
            </p>
          </div>
        </div>
      </header>

      {/* Main Guide Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editorial Body */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 sm:p-8 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-4">
              <h2 className="font-serif-display text-2xl font-bold text-stone-900">
                Culinary Background & Character
              </h2>
              <p className="text-stone-700 text-sm leading-relaxed">
                {guide.introduction}
              </p>
              <h3 className="font-serif-display text-xl font-bold text-stone-900 pt-4">
                Historical Context & Evolution in Dubai
              </h3>
              <p className="text-stone-700 text-sm leading-relaxed">
                {guide.historicalContext}
              </p>
            </div>

            {/* Ordering & Etiquette Advice */}
            <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-4 shadow-2xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>Ordering, Etiquette & Insider Tips</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-stone-600 leading-relaxed">
                {guide.orderingAndEtiquetteTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar: Key Specialties & Other Guides */}
          <aside className="space-y-6">
            <div className="p-6 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Iconic Dishes to Seek Out</span>
              </h3>
              <ul className="space-y-2 text-xs text-amber-900/90 leading-relaxed">
                {guide.keySpecialtiesToTry.map((dish, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-700 font-bold">•</span>
                    <span>{dish}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Switch to Other Dining Guides */}
            <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Explore More Dubai Dining Guides
              </h3>
              <div className="space-y-1.5 text-xs">
                {GUIDES_DATA.filter((g) => g.slug !== guide.slug).map((g) => (
                  <button
                    key={g.slug}
                    onClick={() => onSelectGuide(g.slug)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-700 hover:text-stone-950 transition-colors flex items-center justify-between group"
                  >
                    <span className="font-medium truncate">{g.title.replace(' in Dubai', '')}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {/* Directory Listings for this Guide */}
        <section className="space-y-6 pt-6 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-display text-2xl font-bold text-stone-900">
                Verified Listings for {guide.title}
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Displaying {filteredRestaurants.length} verified dining establishments supported by real records.
              </p>
            </div>

            {/* Mini Filters */}
            <div className="flex items-center gap-3">
              {availableNeighborhoods.length > 0 && (
                <select
                  value={selectedNeighborhoodFilter}
                  onChange={(e) => setSelectedNeighborhoodFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="all">All Neighbourhoods ({matchingRestaurants.length})</option>
                  {availableNeighborhoods.map((n) => (
                    <option key={n} value={n}>{n}</option>
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
                Try resetting your filters to view all verified listings for this culinary guide.
              </p>
              <button
                onClick={() => {
                  setSelectedNeighborhoodFilter('all');
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
