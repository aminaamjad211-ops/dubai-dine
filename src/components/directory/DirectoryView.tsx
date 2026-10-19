import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Map as MapIcon,
  List,
  Clock,
  ShieldCheck,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Restaurant } from '../../types/restaurant';
import { calculateDubaiLiveStatus } from '../../utils/dubaiTime';
import { RestaurantCard } from './RestaurantCard';
import { RestaurantMap } from '../map/RestaurantMap';

interface DirectoryViewProps {
  restaurants: Restaurant[];
  selectedRestaurantId: string | null;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onViewDetails: (restaurant: Restaurant) => void;
  isLoading?: boolean;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  restaurants,
  selectedRestaurantId,
  onSelectRestaurant,
  onViewDetails,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>('all');
  const [selectedAmenity, setSelectedAmenity] = useState<string>('all');
  const [openNowOnly, setOpenNowOnly] = useState<boolean>(false);
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified_only' | 'community_only'>('all');
  const [awardedOnly, setAwardedOnly] = useState<boolean>(false);
  const [layoutMode, setLayoutMode] = useState<'split' | 'list' | 'map'>('split');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);

  // Extract unique neighborhoods, cuisines, categories, and amenities
  const neighborhoods = useMemo(() => {
    const set = new Set<string>();
    restaurants.forEach((r) => {
      if (r.neighborhood) set.add(r.neighborhood);
    });
    return Array.from(set).sort();
  }, [restaurants]);

  const cuisines = useMemo(() => {
    const set = new Set<string>();
    restaurants.forEach((r) => {
      r.cuisine.forEach((c) => set.add(c));
    });
    return Array.from(set).sort();
  }, [restaurants]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    restaurants.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return Array.from(set).sort();
  }, [restaurants]);

  const amenities = useMemo(() => {
    const set = new Set<string>();
    restaurants.forEach((r) => {
      (r.amenities || []).forEach((a) => set.add(a));
    });
    return Array.from(set).sort();
  }, [restaurants]);

  const priceTiers = useMemo(() => {
    return ['AED 30–80', 'AED 80–180', 'AED 180–400', 'AED 400+'];
  }, []);

  // Filter restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = r.name.toLowerCase().includes(query);
        const matchesNeighborhood = r.neighborhood.toLowerCase().includes(query);
        const matchesCuisine = r.cuisine.some((c) => c.toLowerCase().includes(query));
        const matchesAddress = r.address.formattedAddress.toLowerCase().includes(query);
        if (!matchesName && !matchesNeighborhood && !matchesCuisine && !matchesAddress) {
          return false;
        }
      }

      // Neighborhood filter
      if (selectedNeighborhood !== 'all') {
        if (!r.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase())) {
          return false;
        }
      }

      // Cuisine filter
      if (selectedCuisine !== 'all') {
        if (!r.cuisine.some((c) => c.toLowerCase() === selectedCuisine.toLowerCase())) {
          return false;
        }
      }

      // Category filter (restaurant, cafe, bistro, etc.)
      if (selectedCategory !== 'all') {
        if ((r.category || 'restaurant') !== selectedCategory) {
          return false;
        }
      }

      // Price Tier filter
      if (selectedPriceTier !== 'all') {
        if (r.priceTier !== selectedPriceTier) {
          return false;
        }
      }

      // Amenity filter
      if (selectedAmenity !== 'all') {
        if (!(r.amenities || []).some((a) => a.toLowerCase().includes(selectedAmenity.toLowerCase()))) {
          return false;
        }
      }

      // Open now filter calculated in Asia/Dubai timezone
      if (openNowOnly) {
        const status = (r as any).liveStatus || calculateDubaiLiveStatus(r);
        if (!status?.isOpen) {
          return false;
        }
      }

      // Verified status filter (All, Editorial Verified, Community Sourced)
      if (verificationFilter === 'verified_only') {
        if (r.verification.status !== 'verified') {
          return false;
        }
      } else if (verificationFilter === 'community_only') {
        if (r.verification.status === 'verified') {
          return false;
        }
      }

      // Awarded filter
      if (awardedOnly) {
        if (!r.accolades || r.accolades.length === 0) {
          return false;
        }
      }

      return true;
    });
  }, [
    restaurants,
    searchQuery,
    selectedNeighborhood,
    selectedCuisine,
    selectedCategory,
    selectedPriceTier,
    selectedAmenity,
    openNowOnly,
    verificationFilter,
    awardedOnly,
  ]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedNeighborhood,
    selectedCuisine,
    selectedCategory,
    selectedPriceTier,
    selectedAmenity,
    openNowOnly,
    verificationFilter,
    awardedOnly,
    pageSize,
  ]);

  // Pagination Slicing
  const totalRecords = filteredRestaurants.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRestaurants = useMemo(() => {
    return filteredRestaurants.slice(startIndex, startIndex + pageSize);
  }, [filteredRestaurants, startIndex, pageSize]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedNeighborhood('all');
    setSelectedCuisine('all');
    setSelectedCategory('all');
    setSelectedPriceTier('all');
    setSelectedAmenity('all');
    setOpenNowOnly(false);
    setVerificationFilter('all');
    setAwardedOnly(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedNeighborhood !== 'all' ||
    selectedCuisine !== 'all' ||
    selectedCategory !== 'all' ||
    selectedPriceTier !== 'all' ||
    selectedAmenity !== 'all' ||
    openNowOnly ||
    verificationFilter !== 'all' ||
    awardedOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Search & Main Filter Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 mb-6 shadow-xs space-y-4">
        {/* Row 1: Search & Core Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, district, or dish..."
              className="w-full pl-10 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Neighborhood Select */}
          <div>
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-medium"
            >
              <option value="all">All Neighborhoods ({neighborhoods.length})</option>
              {neighborhoods.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Dining Category Select */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-medium capitalize"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Cuisine Select */}
          <div>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-medium"
            >
              <option value="all">All Cuisines ({cuisines.length})</option>
              {cuisines.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Secondary Filters & Layout Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
          {/* Quick Filter Buttons & Amenities */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setOpenNowOnly(!openNowOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                openNowOnly
                  ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Open Now in Dubai</span>
            </button>

            <button
              onClick={() => setAwardedOnly(!awardedOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                awardedOnly
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>Michelin / 50 Best</span>
            </button>

            {/* Verification Status Selector */}
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 text-xs font-semibold focus:outline-none"
            >
              <option value="all">Verification: All</option>
              <option value="verified_only">Editorial Verified Only</option>
              <option value="community_only">OpenStreetMap (ODbL) Only</option>
            </select>

            {/* Price Tier Selector */}
            <select
              value={selectedPriceTier}
              onChange={(e) => setSelectedPriceTier(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 text-xs font-semibold focus:outline-none font-mono-data"
            >
              <option value="all">Price: All</option>
              {priceTiers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {/* Amenity Selector */}
            {amenities.length > 0 && (
              <select
                value={selectedAmenity}
                onChange={(e) => setSelectedAmenity(e.target.value)}
                className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 text-xs font-semibold focus:outline-none"
              >
                <option value="all">Amenity: All</option>
                {amenities.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            )}

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-stone-500 hover:text-stone-900 underline underline-offset-2 ml-1"
              >
                Reset all
              </button>
            )}
          </div>

          {/* Layout Mode Switcher */}
          <div className="flex items-center p-1 bg-stone-100 rounded-lg border border-stone-200 shrink-0">
            <button
              onClick={() => setLayoutMode('split')}
              className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                layoutMode === 'split' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                layoutMode === 'list' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setLayoutMode('map')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                layoutMode === 'map' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Header Count & ODbL Attribution Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 text-xs text-stone-500 font-medium">
        <div>
          Showing <strong className="text-stone-900 font-mono-data">{totalRecords === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + pageSize, totalRecords)}</strong> of{' '}
          <strong className="text-stone-900 font-mono-data">{totalRecords}</strong> authentic Dubai dining venues
          {restaurants.length > totalRecords && (
            <span> (filtered from {restaurants.length} total directory listings)</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-stone-400">
          <span>Sources: Michelin Guide Dubai & OpenStreetMap (ODbL)</span>
        </div>
      </div>

      {/* Main View Display */}
      {totalRecords === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <h3 className="font-serif-display text-xl font-bold text-stone-900">No venues match your criteria</h3>
          <p className="text-sm text-stone-600">
            Try loosening your filters or resetting the search term to view all authentic Dubai listings.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : layoutMode === 'list' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                isSelected={restaurant.id === selectedRestaurantId}
                onSelect={onSelectRestaurant}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
              <div className="text-xs text-stone-500">
                Page <strong className="text-stone-900 font-mono-data">{currentPage}</strong> of <strong className="text-stone-900 font-mono-data">{totalPages}</strong>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 border border-stone-300 rounded-lg bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-stone-700" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  if (totalPages > 7 && Math.abs(p - currentPage) > 2 && p !== 1 && p !== totalPages) {
                    if (p === 2 || p === totalPages - 1) {
                      return <span key={p} className="px-1 text-stone-400">...</span>;
                    }
                    return null;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-8 h-8 px-2 text-xs font-semibold rounded-lg transition-colors ${
                        p === currentPage
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 border border-stone-300 rounded-lg bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-stone-700" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="px-2 py-1 bg-white border border-stone-200 rounded-md font-mono-data"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>
            </div>
          )}
        </div>
      ) : layoutMode === 'map' ? (
        <div className="h-[650px] w-full rounded-2xl overflow-hidden border border-stone-200">
          <RestaurantMap
            restaurants={filteredRestaurants}
            selectedRestaurantId={selectedRestaurantId}
            onSelectRestaurant={onSelectRestaurant}
            className="h-full w-full"
          />
        </div>
      ) : (
        /* Split Layout: Responsive Side-by-side List & Map */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (7 cols): Scrollable List of Paginated Restaurant Cards */}
            <div className="lg:col-span-7 space-y-4">
              {paginatedRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  isSelected={restaurant.id === selectedRestaurantId}
                  onSelect={onSelectRestaurant}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>

            {/* Right Column (5 cols): Sticky Interactive Map (shows all filtered pins!) */}
            <div className="lg:col-span-5 sticky top-20">
              <div className="h-[620px] w-full rounded-2xl overflow-hidden border border-stone-200 shadow-xs">
                <RestaurantMap
                  restaurants={filteredRestaurants}
                  selectedRestaurantId={selectedRestaurantId}
                  onSelectRestaurant={onSelectRestaurant}
                  className="h-full w-full"
                />
              </div>
              <p className="text-[11px] text-stone-400 text-center mt-2 font-mono-data">
                Showing all {filteredRestaurants.length} matching pins on map
              </p>
            </div>
          </div>

          {/* Pagination Bar for Split View */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
              <div className="text-xs text-stone-500">
                Page <strong className="text-stone-900 font-mono-data">{currentPage}</strong> of <strong className="text-stone-900 font-mono-data">{totalPages}</strong>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 border border-stone-300 rounded-lg bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-stone-700" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  if (totalPages > 7 && Math.abs(p - currentPage) > 2 && p !== 1 && p !== totalPages) {
                    if (p === 2 || p === totalPages - 1) {
                      return <span key={p} className="px-1 text-stone-400">...</span>;
                    }
                    return null;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-8 h-8 px-2 text-xs font-semibold rounded-lg transition-colors ${
                        p === currentPage
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 border border-stone-300 rounded-lg bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-stone-700" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="px-2 py-1 bg-white border border-stone-200 rounded-md font-mono-data"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
