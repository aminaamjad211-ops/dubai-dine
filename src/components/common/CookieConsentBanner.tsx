import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Settings, Check, X, ChevronRight, Lock } from 'lucide-react';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  decided: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'dinedubai_cookie_preferences';

export function getStoredCookiePreferences(): CookiePreferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  return null;
}

export function saveCookiePreferences(prefs: CookiePreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    // Dispatch custom event for listener components
    window.dispatchEvent(new CustomEvent('cookiePreferencesUpdated', { detail: prefs }));
  } catch (e) {
    // ignore
  }
}

interface CookieConsentBannerProps {
  forceOpen?: boolean;
  onCloseCustomizer?: () => void;
  onNavigateCookiePolicy?: () => void;
}

export function CookieConsentBanner({
  forceOpen = false,
  onCloseCustomizer,
  onNavigateCookiePolicy,
}: CookieConsentBannerProps) {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(() => getStoredCookiePreferences());
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false);

  // Preference form toggles
  const [analyticsAllowed, setAnalyticsAllowed] = useState<boolean>(false);
  const [marketingAllowed, setMarketingAllowed] = useState<boolean>(false);

  useEffect(() => {
    const stored = getStoredCookiePreferences();
    if (stored) {
      setPreferences(stored);
      setAnalyticsAllowed(stored.analytics);
      setMarketingAllowed(stored.marketing);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, []);

  useEffect(() => {
    if (forceOpen) {
      setShowCustomizer(true);
      setShowBanner(false);
    }
  }, [forceOpen]);

  // Listen for external trigger to reopen preferences
  useEffect(() => {
    const handleReopen = () => {
      const stored = getStoredCookiePreferences();
      if (stored) {
        setAnalyticsAllowed(stored.analytics);
        setMarketingAllowed(stored.marketing);
      }
      setShowCustomizer(true);
    };

    window.addEventListener('openCookiePreferences', handleReopen);
    return () => window.removeEventListener('openCookiePreferences', handleReopen);
  }, []);

  const handleAcceptAll = () => {
    const newPrefs: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      decided: true,
      timestamp: new Date().toISOString(),
    };
    saveCookiePreferences(newPrefs);
    setPreferences(newPrefs);
    setShowBanner(false);
    setShowCustomizer(false);
    if (onCloseCustomizer) onCloseCustomizer();
  };

  const handleRejectNonEssential = () => {
    const newPrefs: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      decided: true,
      timestamp: new Date().toISOString(),
    };
    saveCookiePreferences(newPrefs);
    setPreferences(newPrefs);
    setAnalyticsAllowed(false);
    setMarketingAllowed(false);
    setShowBanner(false);
    setShowCustomizer(false);
    if (onCloseCustomizer) onCloseCustomizer();
  };

  const handleSaveCustom = () => {
    const newPrefs: CookiePreferences = {
      essential: true,
      analytics: analyticsAllowed,
      marketing: marketingAllowed,
      decided: true,
      timestamp: new Date().toISOString(),
    };
    saveCookiePreferences(newPrefs);
    setPreferences(newPrefs);
    setShowBanner(false);
    setShowCustomizer(false);
    if (onCloseCustomizer) onCloseCustomizer();
  };

  // If user has decided and banner is not forced open
  if (!showBanner && !showCustomizer && !forceOpen) {
    return null;
  }

  return (
    <>
      {/* Banner View (Bottom Floating) */}
      {showBanner && !showCustomizer && (
        <div
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-stone-900/95 backdrop-blur-md text-stone-100 border-t border-stone-800 shadow-2xl animate-fade-in"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 max-w-3xl">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 text-amber-400">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm tracking-wide text-stone-100">
                  Privacy &amp; Cookie Preferences
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  We respect your privacy. DineDubai uses strictly essential storage to remember your search preferences
                  and filter states. Non-essential analytics and marketing technologies remain blocked until you provide
                  informed consent. Read our{' '}
                  <button
                    onClick={() => {
                      if (onNavigateCookiePolicy) onNavigateCookiePolicy();
                      else window.location.hash = 'cookie-policy';
                    }}
                    className="underline text-amber-300 hover:text-amber-200"
                  >
                    Cookie Policy
                  </button>{' '}
                  and{' '}
                  <button
                    onClick={() => {
                      window.location.hash = 'privacy-policy';
                    }}
                    className="underline text-amber-300 hover:text-amber-200"
                  >
                    Privacy Policy
                  </button>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full md:w-auto shrink-0">
              <button
                onClick={handleRejectNonEssential}
                className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={() => setShowCustomizer(true)}
                className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                <span>Customize</span>
              </button>
              <button
                onClick={handleAcceptAll}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-900 transition-colors shadow-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customize Modal */}
      {showCustomizer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-6 my-8 text-stone-900 animate-scale-in">
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                  <Cookie className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="cookie-modal-title" className="font-bold text-stone-900 text-base">
                    Cookie Preferences
                  </h3>
                  <p className="text-xs text-stone-500">Configure which technologies you permit DineDubai to use</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCustomizer(false);
                  if (onCloseCustomizer) onCloseCustomizer();
                }}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Category 1: Strictly Necessary (Always Active) */}
              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-stone-500" />
                    <span className="text-sm font-semibold text-stone-900">Strictly Necessary</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Always Active
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Required for site navigation, security, saving your filter state in localStorage, and recording your
                  cookie preferences. These cannot be disabled.
                </p>
              </div>

              {/* Category 2: Performance & Analytics */}
              <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-stone-900">Analytics &amp; Performance</span>
                    <p className="text-[11px] text-stone-500">Measure aggregate directory page views and navigation flow</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analyticsAllowed}
                      onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Helps us understand which neighbourhood and cuisine guides are most useful. No personally identifiable
                  data is sold or transferred. Disabled by default.
                </p>
              </div>

              {/* Category 3: Marketing & Advertising */}
              <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-stone-900">Advertising &amp; Social Pixels</span>
                    <p className="text-[11px] text-stone-500">Third-party campaign attribution and advertising networks</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingAllowed}
                      onChange={(e) => setMarketingAllowed(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Allows third-party ad networks to deliver relevant dining offers. Per our strict policy, advertising
                  scripts are completely blocked until enabled here.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={handleRejectNonEssential}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors"
              >
                Reject Non-Essential
              </button>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSaveCustom}
                  className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-xl transition-colors"
                >
                  Save Choices
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-900 rounded-xl transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
