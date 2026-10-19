import React, { useState } from 'react';
import { StaticPageLayout } from './StaticPageLayout';
import { Restaurant } from '../../types/restaurant';
import { AlertCircle, CheckCircle2, Send, ShieldCheck, HelpCircle } from 'lucide-react';
import { SITE_CONFIG } from '../../config/siteConfig';

interface CorrectionsPageProps {
  restaurants: Restaurant[];
  onNavigateHome: () => void;
}

export function CorrectionsPage({ restaurants, onNavigateHome }: { restaurants: Restaurant[]; onNavigateHome: () => void }) {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('');
  const [customRestaurantName, setCustomRestaurantName] = useState<string>('');
  const [field, setField] = useState<string>('operating_hours');
  const [reportedValue, setReportedValue] = useState<string>('');
  const [sourceEvidence, setSourceEvidence] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const targetRestaurant = restaurants.find((r) => r.id === selectedRestaurantId);
    const rName = targetRestaurant ? targetRestaurant.name : customRestaurantName.trim() || 'Unlisted Dubai Venue';

    try {
      const res = await fetch('/api/corrections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: selectedRestaurantId || 'custom_venue',
          restaurantName: rName,
          field,
          reportedValue,
          sourceEvidence,
          contactEmail,
        }),
      });

      if (res.ok) {
        setSubmissionSuccess(true);
        setReportedValue('');
        setSourceEvidence('');
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with ${res.status}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit correction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StaticPageLayout
      title="Restaurant Correction & Verification Portal"
      subtitle="Help keep Dubai’s dining records 100% authentic. Report changed operating hours, permanent closures, updated phone numbers, or new coordinates."
      metaDescription="Report factual restaurant corrections, changed hours, or closures in Dubai. Verified through our editorial audit desk with complete transparency."
      canonicalPath="/#corrections"
      onNavigateHome={onNavigateHome}
      showLegalNotice={false}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif-display text-2xl font-bold text-stone-900">
              Submit a Factual Correction
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every submission is queued in our Editorial Console, checked against primary evidence, and audited by our verification desk before updating the public registry.
            </p>
          </div>

          {submissionSuccess ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-emerald-950 text-base">
                  Correction Submitted to Editorial Review
                </h3>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                  Thank you for contributing to Dubai’s dining accuracy. Our editorial desk will investigate your submission and update the verified registry.
                </p>
              </div>
              <button
                onClick={() => setSubmissionSuccess(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors"
              >
                Submit Another Correction
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 bg-stone-50 border border-stone-200 rounded-2xl space-y-4 text-xs">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Select Restaurant Listing
                </label>
                <select
                  value={selectedRestaurantId}
                  onChange={(e) => setSelectedRestaurantId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-600"
                >
                  <option value="">-- Choose from {restaurants.length} indexed Dubai venues --</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.neighborhood})
                    </option>
                  ))}
                </select>
              </div>

              {!selectedRestaurantId && (
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Or Enter Restaurant Name (if unlisted)
                  </label>
                  <input
                    type="text"
                    value={customRestaurantName}
                    onChange={(e) => setCustomRestaurantName(e.target.value)}
                    placeholder="e.g. Al Safadi Restaurant, Sheikh Zayed Rd"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Field to Correct <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  >
                    <option value="operating_hours">Operating Hours / Ramadan Schedule</option>
                    <option value="permanent_closure">Business Is Permanently Closed</option>
                    <option value="address_location">Address or Geographic Coordinates</option>
                    <option value="phone_contact">Telephone / WhatsApp Number</option>
                    <option value="website_url">Official Website / Reservation Link</option>
                    <option value="cuisine_price">Cuisine Category / Price Tier</option>
                    <option value="other">Other Factual Detail</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Your Contact Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="For editorial follow-up only"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Accurate / Correct Information <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={reportedValue}
                  onChange={(e) => setReportedValue(e.target.value)}
                  placeholder="Detail the exact correct information (e.g. 'Opens at 13:00 on Fridays after Jumu'ah prayer, not 12:00')."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-600 resize-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Source Evidence / Verification Reference <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={sourceEvidence}
                  onChange={(e) => setSourceEvidence(e.target.value)}
                  placeholder="e.g. 'In-person visit on 14 Oct 2026; confirmed with restaurant manager; verified on official door sign'."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-600 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-xs disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting to Editorial Desk...' : 'Submit Factual Correction'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Verification Standards Sidebar */}
        <aside className="space-y-6">
          <div className="p-5 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>What Evidence Is Accepted?</span>
            </div>
            <ul className="space-y-2 text-xs text-amber-900/90 leading-relaxed">
              <li>• Direct physical observation of official venue signage</li>
              <li>• Official announcements on restaurant corporate domains</li>
              <li>• Direct telephone communication with venue management</li>
              <li>• Official Dubai Department of Economy and Tourism notices</li>
            </ul>
          </div>

          <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3 text-xs text-stone-600">
            <h4 className="font-bold uppercase tracking-wider text-stone-900">
              Audit Transparency
            </h4>
            <p className="leading-relaxed">
              Approved adjustments are timestamped and recorded in our verification audit trail. We do not accept promotional puffery or subjective review disputes.
            </p>
          </div>
        </aside>
      </div>
    </StaticPageLayout>
  );
}
