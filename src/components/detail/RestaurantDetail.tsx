import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Globe,
  Mail,
  Instagram,
  CalendarCheck,
  ShieldCheck,
  Flag,
  Share2,
  ExternalLink,
  MapPin,
  Info,
} from 'lucide-react';
import { Restaurant } from '../../types/restaurant';
import { GoogleMapsButtons } from '../common/GoogleMapsButtons';
import { OpeningHoursCard } from '../common/OpeningHoursCard';
import { RestaurantMap } from '../map/RestaurantMap';
import { CorrectionModal } from '../common/CorrectionModal';
import { RestaurantImage } from '../common/RestaurantImage';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onBack: () => void;
}

export const RestaurantDetail: React.FC<RestaurantDetailProps> = ({ restaurant, onBack }) => {
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [restaurant.id]);

  // Inject Schema.org JSON-LD for SEO
  useEffect(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: restaurant.name,
      description: restaurant.description,
      image: restaurant.image_url
        ? [restaurant.image_url]
        : restaurant.photos && restaurant.photos.length > 0
        ? restaurant.photos
        : undefined,
      telephone: restaurant.contact.phone,
      servesCuisine: restaurant.cuisine,
      priceRange: restaurant.priceTier,
      address: {
        '@type': 'PostalAddress',
        streetAddress: restaurant.address.street,
        addressLocality: restaurant.address.district,
        addressRegion: 'Dubai',
        addressCountry: 'AE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: restaurant.coordinates.lat,
        longitude: restaurant.coordinates.lng,
      },
      url: restaurant.contact.website || window.location.href,
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    script.id = `schema-restaurant-${restaurant.id}`;
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById(`schema-restaurant-${restaurant.id}`);
      if (existing) {
        document.head.removeChild(existing);
      }
    };
  }, [restaurant]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  const isVerified = restaurant.verification.status === 'verified';
  const checkedFields = restaurant.verification.verifiedFields || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-20">
      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-1.5 rounded-lg transition-colors shadow-2xs hover:border-stone-400"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Restaurant Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-500" />
            <span>{copyFeedback ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => setIsCorrectionModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Flag className="w-3.5 h-3.5 text-stone-500" />
            <span>Report Correction</span>
          </button>
        </div>
      </div>

      {/* Editorial Header Section */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-stone-500 font-medium mb-2">
          <span className="text-stone-900 font-bold uppercase tracking-wider">{restaurant.neighborhood}</span>
          <span aria-hidden="true">·</span>
          <span>{restaurant.cuisine.join(' · ')}</span>
          <span aria-hidden="true">·</span>
          <span className="text-stone-900 font-mono-data font-semibold">{restaurant.priceTier}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div>
            <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight text-balance">
              {restaurant.name}
            </h1>
            {restaurant.arabicName && (
              <p className="text-base text-stone-400 font-serif mt-1" dir="rtl">
                {restaurant.arabicName}
              </p>
            )}
          </div>

          {/* Verification Stamp */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs shrink-0 border ${
              isVerified
                ? 'bg-emerald-50 border-emerald-200/90 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {isVerified ? (
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            )}
            <div>
              <div className="font-bold">{isVerified ? 'Verified Listing' : 'Verification Pending'}</div>
              <div className={`text-[11px] ${isVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                Audit: {restaurant.verification.lastCheckedAt.split('T')[0]}
              </div>
            </div>
          </div>
        </div>

        <p className="text-base sm:text-lg text-stone-600 mt-4 leading-relaxed max-w-4xl">
          {restaurant.description}
        </p>

        {/* Accolades Strip */}
        {restaurant.accolades.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {restaurant.accolades.map((acc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-stone-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
              >
                <Award className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  <strong>{acc.title}</strong> ({acc.year}) · {acc.source}
                </span>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Hero Visual Presentation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="md:col-span-2 h-80 sm:h-96 rounded-2xl overflow-hidden border border-stone-200">
          <RestaurantImage
            restaurant={restaurant}
            className="w-full h-full"
            variant="hero"
            showAttribution={true}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="h-44 sm:h-46 rounded-2xl overflow-hidden border border-stone-200">
            <RestaurantImage
              restaurant={restaurant}
              className="w-full h-full"
              variant="gallery"
            />
          </div>

          {/* Quick Contact & Verification Disclosures Card */}
          <div className="bg-stone-100/90 border border-stone-200 rounded-2xl p-4 flex-1 flex flex-col justify-between text-xs space-y-3">
            <div className="space-y-2.5">
              <span className="font-semibold text-stone-500 uppercase tracking-wider block">
                Official Inquiries & Contacts
              </span>

              {/* Phone */}
              <div className="flex items-start gap-2 text-stone-800">
                <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <div>
                  <a href={`tel:${restaurant.contact.phone}`} className="font-mono-data font-bold hover:underline block">
                    {restaurant.contact.phone}
                  </a>
                  <span className="text-[10px] text-emerald-700 font-medium">✓ Verified Official Line</span>
                </div>
              </div>

              {/* Website or Missing Notice */}
              <div className="flex items-start gap-2 text-stone-800">
                <Globe className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <div>
                  {restaurant.contact.website ? (
                    <>
                      <a
                        href={restaurant.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline font-medium text-stone-900 block truncate max-w-[200px]"
                      >
                        {restaurant.contact.website.replace('https://', '')}
                      </a>
                      <span className="text-[10px] text-emerald-700 font-medium">✓ Verified Official Website</span>
                    </>
                  ) : (
                    <span className="text-stone-500 italic block">
                      Website: Unregistered / Not operated by venue
                    </span>
                  )}
                </div>
              </div>

              {/* Email or Missing Notice */}
              <div className="flex items-start gap-2 text-stone-800">
                <Mail className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <div>
                  {restaurant.contact.email ? (
                    <a
                      href={`mailto:${restaurant.contact.email}`}
                      className="hover:underline font-mono-data text-stone-800 block truncate max-w-[200px]"
                    >
                      {restaurant.contact.email}
                    </a>
                  ) : (
                    <span className="text-stone-500 italic block">
                      Email: Unprovided / Direct phone contact only
                    </span>
                  )}
                </div>
              </div>

              {/* Instagram */}
              {restaurant.contact.instagram && (
                <div className="flex items-center gap-2 text-stone-800">
                  <Instagram className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <a
                    href={`https://instagram.com/${restaurant.contact.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-medium text-stone-700"
                  >
                    {restaurant.contact.instagram}
                  </a>
                </div>
              )}
            </div>

            {/* Reservations Action or Walk-In Only Disclosure */}
            {restaurant.contact.reservationUrl ? (
              <a
                href={restaurant.contact.reservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition-colors shadow-xs"
              >
                <CalendarCheck className="w-4 h-4 text-amber-300" />
                <span>Book Official Table</span>
              </a>
            ) : (
              <div className="p-2.5 bg-stone-200/70 border border-stone-300 rounded-xl text-stone-700 text-center font-medium">
                <span>Walk-In Seating Policy · No Online Booking</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Details, Hours & Google Maps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Operating Hours & Verification Audit */}
        <div className="lg:col-span-7 space-y-8">
          {/* Real-time Opening Hours & Asia/Dubai Timezone */}
          <section>
            <OpeningHoursCard
              restaurant={restaurant}
              onRequestCorrection={(r) => setIsCorrectionModalOpen(true)}
            />
          </section>

          {/* Verification Audit & Source References */}
          <section className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif-display text-lg font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                Editorial Verification Audit
              </h3>
              <span className="text-xs text-stone-500 font-mono-data">
                ID: {restaurant.id}
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {restaurant.verification.editorialNotes}
            </p>

            {/* Sources */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-1">
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                  Primary Source Citation
                </span>
                <div className="font-semibold text-stone-800">{restaurant.verification.primarySource}</div>
                {restaurant.verification.primarySourceUrl ? (
                  <a
                    href={restaurant.verification.primarySourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 underline pt-1"
                  >
                    <span>View Reference</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-stone-400 italic">Official municipal record on file</span>
                )}
              </div>

              {restaurant.verification.secondarySource && (
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-1">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                    Secondary Source Citation
                  </span>
                  <div className="font-semibold text-stone-800">{restaurant.verification.secondarySource}</div>
                  {restaurant.verification.secondarySourceUrl ? (
                    <a
                      href={restaurant.verification.secondarySourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 underline pt-1"
                    >
                      <span>View Reference</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-stone-400 italic">Field inspection check</span>
                  )}
                </div>
              )}
            </div>

            {/* Field-by-Field Verification Matrix (Requirement 5: Clearly identify missing/unverified info) */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Verification Matrix by Data Field
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { field: 'name', label: 'Venue Name' },
                  { field: 'address', label: 'Physical Address' },
                  { field: 'coordinates', label: 'GPS Coordinates' },
                  { field: 'hours', label: 'Operating Schedule' },
                  { field: 'phone', label: 'Official Phone' },
                  { field: 'price', label: 'Price Range' },
                  { field: 'cuisine', label: 'Cuisine Classification' },
                ].map(({ field, label }) => {
                  const isChecked = checkedFields.includes(field as any);
                  return (
                    <div
                      key={field}
                      className={`p-2 rounded-lg border flex items-center justify-between ${
                        isChecked
                          ? 'bg-emerald-50/60 border-emerald-200/70 text-emerald-950'
                          : 'bg-amber-50/70 border-amber-200 text-amber-950'
                      }`}
                    >
                      <span className="font-medium truncate">{label}</span>
                      {isChecked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 ml-1" />
                      ) : (
                        <span className="text-[10px] text-amber-800 font-bold ml-1">Pending</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 text-xs text-stone-500 flex flex-wrap items-center justify-between gap-2">
              <span>Audited By: <strong>{restaurant.verification.verifiedBy}</strong></span>
              <span className="font-mono-data">Audit Timestamp: {restaurant.verification.verifiedAt}</span>
            </div>
          </section>

          {/* Dietary Options */}
          {restaurant.dietary.length > 0 && (
            <section className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
                Dietary & Sourcing Information
              </h4>
              <div className="flex flex-wrap gap-2">
                {restaurant.dietary.map((d, i) => (
                  <span
                    key={i}
                    className="text-xs text-stone-700 bg-stone-100 border border-stone-200 px-3 py-1 rounded-md"
                  >
                    ✓ {d}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (5 cols): Interactive Map & Google Maps Action Center */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-serif-display text-lg font-bold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-800" />
                  Exact Location & Map
                </h3>
              </div>
              <p className="text-xs text-stone-500">
                {restaurant.address.formattedAddress}
              </p>
            </div>

            {/* Interactive Location Map */}
            <div className="h-72 w-full rounded-xl overflow-hidden border border-stone-200">
              <RestaurantMap
                restaurants={[restaurant]}
                selectedRestaurantId={restaurant.id}
                singleRestaurantMode={true}
                className="h-full w-full"
              />
            </div>

            {/* Google Maps Actions */}
            <GoogleMapsButtons restaurant={restaurant} variant="expanded" />
          </section>

          {/* Directions & Arrival Tips Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-xs text-stone-600 space-y-2.5">
            <h4 className="font-bold text-stone-900 text-sm">Arrival & Navigation Disclosures</h4>
            <p>
              • <strong>District:</strong> {restaurant.address.district}, Dubai, UAE
            </p>
            {restaurant.address.buildingOrUnit && (
              <p>
                • <strong>Building / Landmark:</strong> {restaurant.address.buildingOrUnit}
              </p>
            )}
            <p>
              • <strong>Coordinate Verification Source:</strong> {restaurant.coordinates.coordinateSource}
            </p>
            {restaurant.googleMaps.placeId ? (
              <p className="font-mono-data text-[11px] text-stone-500">
                • <strong>Google Place ID:</strong> {restaurant.googleMaps.placeId}
              </p>
            ) : (
              <p className="text-[11px] text-amber-800">
                • <strong>Google Place ID:</strong> Not mapped to Place ID; coordinates used directly.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Visitor Correction Modal */}
      <CorrectionModal
        restaurant={restaurant}
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
      />
    </div>
  );
};
