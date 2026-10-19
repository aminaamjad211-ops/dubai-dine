import React from 'react';
import { StaticPageLayout } from './StaticPageLayout';
import { SITE_CONFIG } from '../../config/siteConfig';

export function TermsConditionsPage({ onNavigateHome }: { onNavigateHome: () => void }) {
  return (
    <StaticPageLayout
      title="Terms and Conditions"
      subtitle="The legal terms governing your use of the DineDubai directory, geographic routing links, and editorial content."
      metaDescription="DineDubai Terms and Conditions: platform usage rules, intellectual property, disclaimer of operating hours warranties, and UAE jurisdiction."
      canonicalPath="/#terms-and-conditions"
      onNavigateHome={onNavigateHome}
      showLegalNotice={true}
    >
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-200 pb-3">
          <span>Effective Date: 17 October 2026</span>
          <span>Jurisdiction: Dubai, United Arab Emirates</span>
        </div>

        <h2 className="font-serif-display text-xl font-bold text-stone-900">
          1. Agreement to Terms
        </h2>
        <p>
          By accessing or using the website located at <strong>{SITE_CONFIG.siteUrl}</strong> (&quot;DineDubai&quot;), you agree to be bound by these Terms and Conditions (&quot;Terms&quot;) and all applicable laws and regulations of the Emirate of Dubai and the United Arab Emirates.
        </p>
        <p>
          If you do not agree with any of these terms, you are prohibited from using or accessing this site. The platform is owned and operated by <strong>{SITE_CONFIG.legalEntity.registeredName}</strong> (commercial trade license <code>{SITE_CONFIG.legalEntity.tradeLicenseNumber}</code>).
        </p>
      </section>

      <section className="space-y-3 pt-4 border-t border-stone-100">
        <h2 className="font-serif-display text-xl font-bold text-stone-900">
          2. Informational Directory & Disclaimer of Warranties
        </h2>
        <p>
          DineDubai provides directory listings, geographic coordinates, and calculated operating hours on an &quot;as is&quot; and &quot;as available&quot; basis for informational purposes only. While our editorial team rigorously audits data against primary municipal and official sources:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-stone-700">
          <li>
            <strong>Operating Hours & Holidays:</strong> Restaurant opening hours are subject to sudden change by restaurant management without notice, particularly during Islamic holidays (e.g. Ramadan, Eid Al Fitr, Eid Al Adha, UAE National Day) or private buyouts. Diners are strongly encouraged to contact the venue directly via their published telephone number to confirm reservations.
          </li>
          <li>
            <strong>Pricing & Menus:</strong> Price tiers (e.g. AED 30–80, AED 80–180) are estimates based on average meal costs for one person at the time of editorial audit and do not constitute binding price quotes.
          </li>
          <li>
            <strong>Navigation & Mapping:</strong> Google Maps links are provided for convenience via standard URL queries. DineDubai does not control Google Maps routing algorithms or local traffic closures.
          </li>
        </ul>
      </section>

      <section className="space-y-3 pt-4 border-t border-stone-100">
        <h2 className="font-serif-display text-xl font-bold text-stone-900">
          3. Intellectual Property & Open Data Licensing
        </h2>
        <p>
          Original editorial articles, curated neighbourhood guides, bespoke UI design, and editorial audit commentary are the intellectual property of DineDubai and protected under UAE copyright laws.
        </p>
        <p>
          Certain geographic node identifiers, addresses, and street locations incorporated into our directory are derived from <strong>OpenStreetMap</strong> and made available under the <strong>Open Database License (ODbL)</strong>. We gratefully acknowledge and attribute the OpenStreetMap community.
        </p>
      </section>

      <section className="space-y-3 pt-4 border-t border-stone-100">
        <h2 className="font-serif-display text-xl font-bold text-stone-900">
          4. User Contributions & Correction Submissions
        </h2>
        <p>
          When you submit feedback or reported corrections regarding restaurant data, you grant DineDubai a perpetual, royalty-free license to verify, publish, edit, or incorporate such factual details into our public directory for the benefit of all users.
        </p>
      </section>

      <section className="space-y-3 pt-4 border-t border-stone-100">
        <h2 className="font-serif-display text-xl font-bold text-stone-900">
          5. Governing Law & Dispute Resolution
        </h2>
        <p>
          These Terms are governed by and construed in accordance with the laws of the Emirate of Dubai and the federal laws of the United Arab Emirates. Any dispute arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the Courts of Dubai.
        </p>
      </section>
    </StaticPageLayout>
  );
}
