import React from 'react';
import { StaticPageLayout } from './StaticPageLayout';
import { SITE_CONFIG } from '../../config/siteConfig';

export function CookiePolicyPage({ onNavigateHome }: { onNavigateHome: () => void }) {
  return (
    <StaticPageLayout
      title="Cookie Policy"
      subtitle="Complete transparency on the essential technical cookies and local storage mechanisms used by DineDubai."
      metaDescription="DineDubai Cookie Policy: explanation of local storage, session state, absence of cross-site tracking cookies, and how to manage browser preferences."
      canonicalPath="/#cookie-policy"
      onNavigateHome={onNavigateHome}
      showLegalNotice={false}
    >
      <section className="space-y-4">
        <h2 className="font-serif-display text-xl font-bold text-stone-900">
          1. What Are Cookies and Local Storage?
        </h2>
        <p>
          Cookies and local browser storage are small text files or key-value pairs stored on your device when you browse websites. They enable websites to remember user preferences, maintain session continuity, and function securely without requiring users to re-enter information on each page reload.
        </p>
      </section>

      <section className="space-y-4 pt-4 border-t border-stone-100">
        <h2 className="font-serif-display text-xl font-bold text-stone-900">
          2. How DineDubai Uses Storage
        </h2>
        <p>
          DineDubai takes a minimal, privacy-first approach to client-side storage. We do not use third-party behavioral profiling cookies or cross-site tracking pixels.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
            <thead className="bg-stone-100 text-stone-900 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 border-b border-stone-200">Storage Key / Cookie</th>
                <th className="p-3 border-b border-stone-200">Purpose</th>
                <th className="p-3 border-b border-stone-200">Category</th>
                <th className="p-3 border-b border-stone-200">Retention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-stone-700">
              <tr>
                <td className="p-3 font-mono">dinedubai_cookie_preferences</td>
                <td className="p-3">Records your explicit consent choices for essential, analytics, and marketing categories.</td>
                <td className="p-3">Strictly Necessary / Legal</td>
                <td className="p-3">1 Year</td>
              </tr>
              <tr>
                <td className="p-3 font-mono">dinedubai_filter_prefs</td>
                <td className="p-3">Remembers your selected neighborhood, cuisine, or price tier filters during your session.</td>
                <td className="p-3">Functional / Preferences</td>
                <td className="p-3">Session / 30 Days</td>
              </tr>
              <tr>
                <td className="p-3 font-mono">dinedubai_view_mode</td>
                <td className="p-3">Remembers your directory view preference (e.g. Directory Grid vs Interactive Map vs Split View).</td>
                <td className="p-3">Functional</td>
                <td className="p-3">30 Days</td>
              </tr>
              <tr>
                <td className="p-3 font-mono">dinedubai_correction_draft</td>
                <td className="p-3">Temporarily saves draft text in the Report Correction modal to prevent accidental loss if closed.</td>
                <td className="p-3">Functional</td>
                <td className="p-3">Session</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openCookiePreferences'))}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-900 rounded-xl font-semibold text-xs shadow-sm transition-all"
          >
            <span>Open Cookie Consent Manager</span>
          </button>
        </div>
      </section>

      <section className="space-y-4 pt-4 border-t border-stone-100">
        <h2 className="font-serif-display text-xl font-bold text-stone-900">
          3. Third-Party Services
        </h2>
        <p>
          When you click external links to Google Maps, restaurant booking systems, or official hotel websites, those external sites may place their own cookies according to their independent privacy and cookie policies. We encourage you to review their terms upon leaving DineDubai.
        </p>
      </section>

      <section className="space-y-4 pt-4 border-t border-stone-100">
        <h2 className="font-serif-display text-xl font-bold text-stone-900">
          4. How to Manage or Disable Cookies
        </h2>
        <p>
          You can configure your web browser to refuse all cookies, reject third-party cookies, or clear local storage at any time via your browser settings:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-700">
          <li><strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Third-party cookies</li>
          <li><strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</li>
          <li><strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection</li>
          <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions</li>
        </ul>
        <p className="text-xs text-stone-500">
          Disabling essential local storage may cause filter preferences to reset when refreshing the page, but all directory listings and map links will remain completely accessible.
        </p>
      </section>
    </StaticPageLayout>
  );
}
