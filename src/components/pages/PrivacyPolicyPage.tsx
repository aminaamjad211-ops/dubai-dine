import React from 'react';
import { StaticPageLayout } from './StaticPageLayout';
import { SITE_CONFIG } from '../../config/siteConfig';

export function PrivacyPolicyPage({ onNavigateHome }: { onNavigateHome: () => void }) {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      subtitle="How DineDubai handles, protects, and respects visitor data in compliance with UAE Data Protection Law and international standards."
      metaDescription="DineDubai Privacy Policy: zero unnecessary tracking, transparent handling of user corrections, and compliance with UAE Federal Decree-Law No. 45 of 2021."
      canonicalPath="/#privacy-policy"
      onNavigateHome={onNavigateHome}
      showLegalNotice={true}
    >
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-200 pb-3">
          <span>Effective Date: 17 October 2026</span>
          <span>Last Audited: {SITE_CONFIG.editorial.lastUpdated}</span>
        </div>

        <h2 className="font-serif-display text-xl font-bold text-stone-900">
          1. Legal Entity & Regulatory Scope
        </h2>
        <p>
          This Privacy Policy governs the processing of information collected through the website{' '}
          <strong>{SITE_CONFIG.siteUrl}</strong> (&quot;DineDubai&quot;), operated by{' '}
          <strong>{SITE_CONFIG.legalEntity.registeredName}</strong> (commercial trade license{' '}
          <code>{SITE_CONFIG.legalEntity.tradeLicenseNumber}</code>, registered in{' '}
          {SITE_CONFIG.legalEntity.jurisdiction}).
        </p>
        <p>
          Our policies are structured in strict compliance with UAE Federal Decree-Law No. 45 of 2021 regarding the Protection of Personal Data (&quot;UAE PDPL&quot;) and, where applicable to international visitors, the General Data Protection Regulation (&quot;GDPR&quot;).
        </p>
      </section>

      <section className="space-y-3 pt-4 border-t border-stone-100">
        <h2 className="font-serif-display text-xl font-bold text-stone-900">
          2. Information We Collect
        </h2>
        <p>
          DineDubai operates as an open informational registry. You do not need to create an account or provide personal credentials to browse our restaurant listings, view Google Maps links, or read neighbourhood guides.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-stone-700">
          <li>
            <strong>Voluntary Correction Submissions:</strong> If you submit an edit or report an inaccuracy via our public Correction Portal, we collect the details you provide (such as your email address, description of the change, and supporting evidence). Providing an email is voluntary and is used solely to verify the submission or request clarification.
          </li>
          <li>
            <strong>Contact Form Inquiries:</strong> If you submit an inquiry through our Contact page, we collect your name, email address, and message contents to respond to your request.
          </li>
          <li>
            <strong>Essential Technical Logs:</strong> Standard server logs (IP address, browser user-agent, requested URL, timestamp) are retained temporarily for server security, defense against DDoS attacks, and rate limiting.
          </li>
        </ul>
      </section>

      <section className="space-y-3 pt-4 border-t border-stone-100">
        <h2 className="font-serif-display text-xl font-bold text-stone-900">
          3. How We Use Your Data
        </h2>
        <p>We process personal data only when we have a legitimate legal basis:</p>
        <ul className="list-disc pl-5 space-y-2 text-stone-700">
          <li>To investigate, audit, and apply factual restaurant corrections submitted by visitors.</li>
          <li>To respond to editorial, media, or regulatory inquiries.</li>
          <li>To ensure platform uptime, performance, and cyber safety.</li>
        </ul>
        <p>
          We do <strong>not</strong> sell, rent, monetize, or trade visitor personal data to third-party data brokers or marketing aggregators.
        </p>
      </section>

      <section className="space-y-3 pt-4 border-t border-stone-100">
        <h2 className="font-serif-display text-xl font-bold text-stone-900">
          4. External Links & Google Maps
        </h2>
        <p>
          Our directory links to official restaurant websites, booking engines, and Google Maps. Our Google Maps integration utilizes standard URL schemes that do not track your location on our servers. When you click &quot;View on Google Maps&quot; or &quot;Get Directions&quot;, you are redirected to Google’s services, which are governed by Google’s own Privacy Policy.
        </p>
      </section>

      <section className="space-y-3 pt-4 border-t border-stone-100">
        <h2 className="font-serif-display text-xl font-bold text-stone-900">
          5. Data Subject Rights & Contacting the DPO
        </h2>
        <p>
          Under the UAE PDPL, you have the right to request access to, correction of, or deletion of any personal data you have voluntarily provided to us.
        </p>
        <p>
          To exercise your data protection rights, please contact our Data Protection Officer at{' '}
          <a href={`mailto:${SITE_CONFIG.legalEntity.dataProtectionOfficerEmail}`} className="text-amber-800 underline font-mono">
            {SITE_CONFIG.legalEntity.dataProtectionOfficerEmail}
          </a>.
        </p>
      </section>
    </StaticPageLayout>
  );
}
