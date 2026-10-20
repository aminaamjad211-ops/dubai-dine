import React, { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  ChevronDown,
  BookOpen,
  Utensils,
  FileText,
  Search,
} from 'lucide-react';
import { Restaurant } from './types/restaurant';
import { CANONICAL_RESTAURANTS } from './data/canonicalRestaurants';
import { NEIGHBOURHOODS_DATA, NeighbourhoodGuide } from './data/neighbourhoodsData';
import { GUIDES_DATA, DiningGuide } from './data/guidesData';
import { DirectoryView } from './components/directory/DirectoryView';
import { RestaurantDetail } from './components/detail/RestaurantDetail';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NeighbourhoodGuidePage } from './components/neighbourhoods/NeighbourhoodGuidePage';
import { CuisineGuidePage } from './components/guides/CuisineGuidePage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './components/pages/TermsConditionsPage';
import { CookiePolicyPage } from './components/pages/CookiePolicyPage';
import { FaqPage } from './components/pages/FaqPage';
import { EditorialPolicyPage } from './components/pages/EditorialPolicyPage';
import { AdvertisingDisclosurePage } from './components/pages/AdvertisingDisclosurePage';
import { AffiliateDisclosurePage } from './components/pages/AffiliateDisclosurePage';
import { CorrectionsPage } from './components/pages/CorrectionsPage';
import { SitemapPage } from './components/pages/SitemapPage';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { getDubaiTimeParts } from './utils/dubaiTime';
import { SITE_CONFIG } from './config/siteConfig';

type ViewMode =
  | 'directory'
  | 'detail'
  | 'admin'
  | 'neighbourhood'
  | 'guide'
  | 'about'
  | 'contact'
  | 'privacy-policy'
  | 'terms-and-conditions'
  | 'cookie-policy'
  | 'faq'
  | 'editorial-policy'
  | 'advertising-disclosure'
  | 'affiliate-disclosure'
  | 'corrections'
  | 'sitemap';

export default function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(CANONICAL_RESTAURANTS);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('directory');
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
  const [activeNeighbourhood, setActiveNeighbourhood] = useState<NeighbourhoodGuide | null>(null);
  const [activeGuide, setActiveGuide] = useState<DiningGuide | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dubaiTime, setDubaiTime] = useState(() => getDubaiTimeParts());
  const [navMenuOpen, setNavMenuOpen] = useState<'neighbourhoods' | 'guides' | null>(null);

  // Keep local time clock updated in Asia/Dubai
  useEffect(() => {
    const timer = setInterval(() => {
      setDubaiTime(getDubaiTimeParts());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Fetch restaurant data from API
  const fetchRestaurants = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/restaurants?all=true&reviewStatus=all');
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json) ? json : json.data;
        if (Array.isArray(list) && list.length > 0) {
          setRestaurants(list);
          return;
        }
      } else {
        throw new Error(`Server returned status ${res.status}`);
      }
    } catch (err: any) {
      console.warn('Using client-side canonical verified restaurant registry:', err);
      // Fallback is maintained cleanly with CANONICAL_RESTAURANTS
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Handle URL hash changes or direct routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.pathname.replace(/^\/+|\/+$/g, '') || window.location.hash.replace('#', '').trim();

      if (hash.startsWith('restaurant/')) {
        const slug = hash.replace('restaurant/', '');
        const found = restaurants.find((r) => r.slug === slug || r.id === slug);
        if (found) {
          setActiveRestaurant(found);
          setSelectedRestaurantId(found.id);
          setCurrentView('detail');
          return;
        }
      } else if (hash.startsWith('neighbourhood/')) {
        const slug = hash.replace('neighbourhood/', '');
        const found = NEIGHBOURHOODS_DATA.find((n) => n.slug === slug);
        if (found) {
          setActiveNeighbourhood(found);
          setCurrentView('neighbourhood');
          return;
        }
      } else if (hash.startsWith('guide/')) {
        const slug = hash.replace('guide/', '');
        const found = GUIDES_DATA.find((g) => g.slug === slug);
        if (found) {
          setActiveGuide(found);
          setCurrentView('guide');
          return;
        }
      } else if (hash === 'admin') {
        setCurrentView('admin');
        return;
      } else if (hash === 'about') {
        setCurrentView('about');
        return;
      } else if (hash === 'contact') {
        setCurrentView('contact');
        return;
      } else if (hash === 'privacy-policy') {
        setCurrentView('privacy-policy');
        return;
      } else if (hash === 'terms-and-conditions') {
        setCurrentView('terms-and-conditions');
        return;
      } else if (hash === 'cookie-policy') {
        setCurrentView('cookie-policy');
        return;
      } else if (hash === 'faq') {
        setCurrentView('faq');
        return;
      } else if (hash === 'editorial-policy') {
        setCurrentView('editorial-policy');
        return;
      } else if (hash === 'advertising-disclosure') {
        setCurrentView('advertising-disclosure');
        return;
      } else if (hash === 'affiliate-disclosure') {
        setCurrentView('affiliate-disclosure');
        return;
      } else if (hash === 'corrections') {
        setCurrentView('corrections');
        return;
      } else if (hash === 'sitemap') {
        setCurrentView('sitemap');
        return;
      }

      // Default view is directory
      setCurrentView('directory');
      setActiveRestaurant(null);
      setActiveNeighbourhood(null);
      setActiveGuide(null);
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
window.addEventListener('popstate', handleHash);

return () => {
  window.removeEventListener('hashchange', handleHash);
  window.removeEventListener('popstate', handleHash);
};

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurantId(restaurant.id);
  };

  const handleViewDetails = (restaurant: Restaurant) => {
    setActiveRestaurant(restaurant);
    setSelectedRestaurantId(restaurant.id);
    setCurrentView('detail');
    window.location.hash = `restaurant/${restaurant.slug}`;
  };

  const handleBackToDirectory = () => {
    setCurrentView('directory');
    setActiveRestaurant(null);
    setActiveNeighbourhood(null);
    setActiveGuide(null);
    setNavMenuOpen(null);
    window.location.hash = '';
  };

  const handleNavigateToNeighbourhood = (slug: string) => {
    const found = NEIGHBOURHOODS_DATA.find((n) => n.slug === slug);
    if (found) {
      setActiveNeighbourhood(found);
      setCurrentView('neighbourhood');
      setNavMenuOpen(null);
      window.location.hash = `neighbourhood/${slug}`;
    }
  };

  const handleNavigateToGuide = (slug: string) => {
    const found = GUIDES_DATA.find((g) => g.slug === slug);
    if (found) {
      setActiveGuide(found);
      setCurrentView('guide');
      setNavMenuOpen(null);
      window.location.hash = `guide/${slug}`;
    }
  };

  const handleNavigatePage = (pageSlug: string) => {
    setNavMenuOpen(null);
    window.location.hash = pageSlug;
  };

  const handleNavigateToMap = () => {
    if (currentView !== 'directory') {
      setCurrentView('directory');
      setActiveRestaurant(null);
      window.location.hash = '';
    }
    setTimeout(() => {
      const element = document.getElementById('directory');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-4">
          {/* Brand */}
          <button
            onClick={handleBackToDirectory}
            className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900 hover:text-amber-950 transition-colors whitespace-nowrap shrink-0 text-left flex items-center gap-2"
          >
            <span>DineDubai</span>
            <span className="text-[10px] uppercase font-sans font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              Verified
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-stone-600">
            <button
              onClick={handleBackToDirectory}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'directory' ? 'text-stone-950 font-bold' : ''
              }`}
            >
              Directory
            </button>

            {/* Neighbourhoods Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNavMenuOpen(navMenuOpen === 'neighbourhoods' ? null : 'neighbourhoods')}
                className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
              >
                <span>Neighbourhoods</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {navMenuOpen === 'neighbourhoods' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-stone-200 rounded-xl shadow-lg py-2 z-50 text-left normal-case">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 mb-1">
                    Dubai Dining Districts
                  </div>
                  {NEIGHBOURHOODS_DATA.map((n) => (
                    <button
                      key={n.slug}
                      onClick={() => handleNavigateToNeighbourhood(n.slug)}
                      className="w-full text-left px-3 py-1.5 text-xs text-stone-700 hover:text-stone-950 hover:bg-stone-50 transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium">{n.name}</span>
                      <span className="text-[10px] text-stone-400">{n.arabicName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dining Guides Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNavMenuOpen(navMenuOpen === 'guides' ? null : 'guides')}
                className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
              >
                <span>Cuisine Guides</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {navMenuOpen === 'guides' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-stone-200 rounded-xl shadow-lg py-2 z-50 text-left normal-case">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 mb-1">
                    Featured Dining Guides
                  </div>
                  {GUIDES_DATA.map((g) => (
                    <button
                      key={g.slug}
                      onClick={() => handleNavigateToGuide(g.slug)}
                      className="w-full text-left px-3 py-1.5 text-xs text-stone-700 hover:text-stone-950 hover:bg-stone-50 transition-colors"
                    >
                      {g.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleNavigateToMap}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              Interactive Map
            </button>

            <button
              onClick={() => handleNavigatePage('corrections')}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 text-amber-800"
            >
              Report Correction
            </button>

            <span className="text-stone-400 font-normal font-mono-data text-[11px]">
              GST: {dubaiTime.formattedTime} (UTC+4)
            </span>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            {currentView === 'admin' ? (
              <button
                onClick={handleBackToDirectory}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                View Public Directory
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentView('admin');
                  window.location.hash = 'admin';
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
              >
                Editorial Console
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {errorMessage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>{errorMessage} (Using verified client directory).</span>
              </div>
              <button
                onClick={fetchRestaurants}
                className="font-bold underline hover:text-amber-950 inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {/* View Routing Switch */}
        {currentView === 'admin' ? (
          <AdminDashboard
            restaurants={restaurants}
            onRefresh={fetchRestaurants}
            onExit={handleBackToDirectory}
          />
        ) : currentView === 'detail' && activeRestaurant ? (
          <RestaurantDetail
            restaurant={activeRestaurant}
            onBack={handleBackToDirectory}
          />
        ) : currentView === 'neighbourhood' && activeNeighbourhood ? (
          <NeighbourhoodGuidePage
            guide={activeNeighbourhood}
            restaurants={restaurants}
            onSelectRestaurant={handleSelectRestaurant}
            onViewDetails={handleViewDetails}
            onNavigateHome={handleBackToDirectory}
            onSelectNeighbourhood={handleNavigateToNeighbourhood}
          />
        ) : currentView === 'guide' && activeGuide ? (
          <CuisineGuidePage
            guide={activeGuide}
            restaurants={restaurants}
            onSelectRestaurant={handleSelectRestaurant}
            onViewDetails={handleViewDetails}
            onNavigateHome={handleBackToDirectory}
            onSelectGuide={handleNavigateToGuide}
          />
        ) : currentView === 'about' ? (
          <AboutPage onNavigateHome={handleBackToDirectory} />
        ) : currentView === 'contact' ? (
          <ContactPage onNavigateHome={handleBackToDirectory} />
        ) : currentView === 'privacy-policy' ? (
          <PrivacyPolicyPage onNavigateHome={handleBackToDirectory} />
        ) : currentView === 'terms-and-conditions' ? (
          <TermsConditionsPage onNavigateHome={handleBackToDirectory} />
        ) : currentView === 'cookie-policy' ? (
          <CookiePolicyPage onNavigateHome={handleBackToDirectory} />
        ) : currentView === 'faq' ? (
          <FaqPage onNavigateHome={handleBackToDirectory} />
        ) : currentView === 'editorial-policy' ? (
          <EditorialPolicyPage onNavigateHome={handleBackToDirectory} />
        ) : currentView === 'advertising-disclosure' ? (
          <AdvertisingDisclosurePage onNavigateHome={handleBackToDirectory} />
        ) : currentView === 'affiliate-disclosure' ? (
          <AffiliateDisclosurePage onNavigateHome={handleBackToDirectory} />
        ) : currentView === 'corrections' ? (
          <CorrectionsPage restaurants={restaurants} onNavigateHome={handleBackToDirectory} />
        ) : currentView === 'sitemap' ? (
          <SitemapPage
            restaurants={restaurants}
            onNavigateHome={handleBackToDirectory}
            onSelectRestaurant={handleViewDetails}
            onSelectNeighbourhood={handleNavigateToNeighbourhood}
            onSelectGuide={handleNavigateToGuide}
            onNavigatePage={handleNavigatePage}
          />
        ) : (
          <>
            {/* Hero Section */}
            <section className="bg-stone-100/70 border-b border-stone-200 py-10 sm:py-14">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="max-w-3xl space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                      Authentic Dubai Dining · {restaurants.length} Verified & Researched Records
                    </span>
                  </div>

                  <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight text-balance">
                    Verified Dubai Restaurants, Live Operating Hours & Exact Navigation
                  </h1>

                  <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
                    Every listing in our directory is physically verified against official Dubai Department of Economy and Tourism (DET) records, Michelin Guide Dubai citations, and community geocodes. Real opening hours calculated live in Dubai local time (Asia/Dubai, GST).
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Zero hallucinated coordinates or reviews</span>
                    </div>
                    <span aria-hidden="true">·</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-stone-600" />
                      <span>Asia/Dubai live shift calculations</span>
                    </div>
                    <span aria-hidden="true">·</span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-800" />
                      <span>Working Google Maps URL links</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Explore District Shortcuts */}
            <section className="border-b border-stone-200 bg-white py-3 overflow-x-auto scrollbar-none">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-xs">
                <span className="text-stone-400 font-semibold uppercase tracking-wider text-[11px] whitespace-nowrap mr-2">
                  Districts:
                </span>
                {NEIGHBOURHOODS_DATA.map((n) => (
                  <button
                    key={n.slug}
                    onClick={() => handleNavigateToNeighbourhood(n.slug)}
                    className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 whitespace-nowrap transition-colors font-medium text-[11px]"
                  >
                    {n.name}
                  </button>
                ))}
              </div>
            </section>

            {/* Directory & Interactive Map */}
            <section id="directory">
              <DirectoryView
                restaurants={restaurants}
                selectedRestaurantId={selectedRestaurantId}
                onSelectRestaurant={handleSelectRestaurant}
                onViewDetails={handleViewDetails}
                isLoading={isLoading}
              />
            </section>
          </>
        )}
      </main>

      {/* Comprehensive Compliant Footer */}
      <footer className="border-t border-stone-200 bg-white py-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Registry Charter */}
            <div className="space-y-3">
              <div className="font-serif-display text-base font-bold text-stone-900 flex items-center gap-2">
                <span>DineDubai Registry</span>
              </div>
              <p className="text-stone-600 leading-relaxed text-xs">
                Editorially verified Dubai dining directory. We strictly refuse fabricated coordinates, fake reviews, or unverified hours.
              </p>
              <div className="pt-2 text-[11px] text-stone-400 space-y-1">
                <div>Primary Standards: DET &amp; Michelin Guide</div>
                <div>Licensing: Open Database License (ODbL)</div>
              </div>
            </div>

            {/* Column 2: 10 Neighbourhoods */}
            <div className="space-y-2">
              <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
                Dubai Neighbourhood Guides
              </div>
              <ul className="space-y-1 text-xs text-stone-600">
                {NEIGHBOURHOODS_DATA.map((n) => (
                  <li key={n.slug}>
                    <button
                      onClick={() => handleNavigateToNeighbourhood(n.slug)}
                      className="hover:text-stone-900 transition-colors text-left"
                    >
                      • {n.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: 10 Cuisine Guides */}
            <div className="space-y-2">
              <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
                Cuisine &amp; Dining Guides
              </div>
              <ul className="space-y-1 text-xs text-stone-600">
                {GUIDES_DATA.map((g) => (
                  <li key={g.slug}>
                    <button
                      onClick={() => handleNavigateToGuide(g.slug)}
                      className="hover:text-stone-900 transition-colors text-left"
                    >
                      • {g.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Standards, Policies & Sitemap */}
            <div className="space-y-2">
              <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
                Standards &amp; Transparency
              </div>
              <ul className="space-y-1 text-xs text-stone-600">
                <li>
                  <button onClick={() => handleNavigatePage('about')} className="hover:text-stone-900">
                    • About Us &amp; Verification Charter
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigatePage('contact')} className="hover:text-stone-900">
                    • Contact Editorial Desk
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigatePage('editorial-policy')} className="hover:text-stone-900">
                    • Editorial Standards Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigatePage('advertising-disclosure')} className="hover:text-stone-900">
                    • Advertising Disclosure (UAE NMC)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigatePage('affiliate-disclosure')} className="hover:text-stone-900">
                    • Affiliate Disclosure
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigatePage('corrections')} className="hover:text-stone-900 text-amber-800 font-medium">
                    • Report Correction / Feedback
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigatePage('faq')} className="hover:text-stone-900">
                    • Frequently Asked Questions (FAQ)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigatePage('privacy-policy')} className="hover:text-stone-900">
                    • Privacy Policy (UAE PDPL)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigatePage('terms-and-conditions')} className="hover:text-stone-900">
                    • Terms &amp; Conditions
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigatePage('cookie-policy')} className="hover:text-stone-900">
                    • Cookie Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('openCookiePreferences'))}
                    className="hover:text-amber-800 text-stone-700 underline text-left"
                  >
                    • Manage Cookie Preferences
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigatePage('sitemap')} className="hover:text-stone-900 font-bold text-stone-800">
                    • Complete HTML Sitemap
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
            <div>
              © 2026 DineDubai. Operated by {SITE_CONFIG.legalEntity.registeredName}. Trade License: {SITE_CONFIG.legalEntity.tradeLicenseNumber}.
            </div>
            <div className="flex items-center gap-4">
              <span>Timezone: Asia/Dubai (GST, UTC+4)</span>
              <span>·</span>
              <span>Datum: WGS84</span>
              <span>·</span>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-600">
                XML Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Cookie Consent Banner & Preferences Manager */}
      <CookieConsentBanner onNavigateCookiePolicy={() => handleNavigatePage('cookie-policy')} />
    </div>
  );
}
