import React from 'react';
import { StaticPageLayout } from './StaticPageLayout';
import { Restaurant } from '../../types/restaurant';
import { NEIGHBOURHOODS_DATA } from '../../data/neighbourhoodsData';
import { GUIDES_DATA } from '../../data/guidesData';
import { MapPin, Utensils, BookOpen, ShieldCheck, ChevronRight, FileText } from 'lucide-react';

interface SitemapPageProps {
  restaurants: Restaurant[];
  onNavigateHome: () => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onSelectNeighbourhood: (slug: string) => void;
  onSelectGuide: (slug: string) => void;
  onNavigatePage: (page: string) => void;
}

export function SitemapPage({
  restaurants,
  onNavigateHome,
  onSelectRestaurant,
  onSelectNeighbourhood,
  onSelectGuide,
  onNavigatePage,
}: SitemapPageProps) {
  // Sort restaurants alphabetically
  const sortedRestaurants = [...restaurants].sort((a, b) => a.name.localeCompare(b.name));

  const essentialPages = [
    { title: 'Homepage / Directory Hub', path: 'directory' },
    { title: 'About Us & Mission', path: 'about' },
    { title: 'Contact Us', path: 'contact' },
    { title: 'Privacy Policy', path: 'privacy-policy' },
    { title: 'Terms and Conditions', path: 'terms-and-conditions' },
    { title: 'Cookie Policy', path: 'cookie-policy' },
    { title: 'Frequently Asked Questions (FAQ)', path: 'faq' },
    { title: 'Editorial Policy & Verification Standards', path: 'editorial-policy' },
    { title: 'Advertising Disclosure', path: 'advertising-disclosure' },
    { title: 'Affiliate Disclosure', path: 'affiliate-disclosure' },
    { title: 'Restaurant Corrections & Feedback Portal', path: 'corrections' },
  ];

  return (
    <StaticPageLayout
      title="Complete Website Sitemap"
      subtitle={`Complete navigational index of all ${essentialPages.length + NEIGHBOURHOODS_DATA.length + GUIDES_DATA.length + restaurants.length} published pages across DineDubai.`}
      metaDescription="Comprehensive HTML sitemap indexing all verified Dubai restaurants, 10 neighbourhood guides, 10 cuisine guides, legal policies, and editorial resources."
      canonicalPath="/#sitemap"
      onNavigateHome={onNavigateHome}
      showLegalNotice={false}
    >
      <div className="space-y-12">
        {/* Section 1: Essential & Legal Pages */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider text-xs border-b border-stone-200 pb-2">
            <FileText className="w-4 h-4 text-amber-700" />
            <span>Essential Platform & Regulatory Pages ({essentialPages.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {essentialPages.map((page) => (
              <button
                key={page.path}
                onClick={() => {
                  if (page.path === 'directory') onNavigateHome();
                  else onNavigatePage(page.path);
                }}
                className="text-left p-2.5 rounded-lg hover:bg-stone-100 text-stone-700 hover:text-stone-950 font-medium transition-colors flex items-center justify-between group border border-transparent hover:border-stone-200"
              >
                <span>{page.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700" />
              </button>
            ))}
          </div>
        </section>

        {/* Section 2: 10 Neighbourhood Guides */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider text-xs border-b border-stone-200 pb-2">
            <MapPin className="w-4 h-4 text-amber-700" />
            <span>Dubai Neighbourhood Guides ({NEIGHBOURHOODS_DATA.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {NEIGHBOURHOODS_DATA.map((n) => (
              <button
                key={n.slug}
                onClick={() => onSelectNeighbourhood(n.slug)}
                className="text-left p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 transition-colors space-y-1 group"
              >
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <span>{n.name}</span>
                  <span className="text-[10px] text-stone-400 font-serif-display">{n.arabicName}</span>
                </div>
                <p className="text-[11px] text-stone-500 line-clamp-1">{n.tagline}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Section 3: 10 Cuisine Guides */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider text-xs border-b border-stone-200 pb-2">
            <Utensils className="w-4 h-4 text-amber-700" />
            <span>Cuisine & Dining Guides ({GUIDES_DATA.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {GUIDES_DATA.map((g) => (
              <button
                key={g.slug}
                onClick={() => onSelectGuide(g.slug)}
                className="text-left p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 transition-colors space-y-1 group"
              >
                <div className="font-bold text-stone-900 flex items-center justify-between">
                  <span>{g.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700" />
                </div>
                <p className="text-[11px] text-stone-500 line-clamp-1">{g.subtitle}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Section 4: Individual Restaurant Detail Pages */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider text-xs border-b border-stone-200 pb-2">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>Individual Verified Restaurant Listings ({sortedRestaurants.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
            {sortedRestaurants.map((r) => (
              <button
                key={r.id}
                onClick={() => onSelectRestaurant(r)}
                className="text-left p-2.5 rounded-lg hover:bg-stone-100 text-stone-700 hover:text-stone-950 transition-colors border border-transparent hover:border-stone-200 space-y-0.5 group"
              >
                <div className="font-semibold text-stone-900 truncate group-hover:text-amber-950">
                  {r.name}
                </div>
                <div className="text-[11px] text-stone-500 truncate">
                  {r.neighborhood} · {r.cuisine[0] || 'Dining'}
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </StaticPageLayout>
  );
}
