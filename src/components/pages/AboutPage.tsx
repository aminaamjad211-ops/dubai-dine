import React from 'react';
import { StaticPageLayout } from './StaticPageLayout';
import { ShieldCheck, CheckCircle2, Award, Clock, MapPin } from 'lucide-react';
import { SITE_CONFIG } from '../../config/siteConfig';

export function AboutPage({ onNavigateHome }: { onNavigateHome: () => void }) {
  return (
    <StaticPageLayout
      title="About DineDubai"
      subtitle="An independent, authentic culinary directory committed to zero-hallucination dining data, verifiable local facts, and precise navigation across Dubai."
      metaDescription="Learn about DineDubai: our mission, editorial standards, open verification methodology, and why we refuse fabricated reviews, hours, or coordinates."
      canonicalPath="/#about"
      onNavigateHome={onNavigateHome}
      showLegalNotice={false}
    >
      <section className="space-y-4">
        <h2 className="font-serif-display text-2xl font-bold text-stone-900">
          Our Guiding Philosophy: Zero AI-Slop & Zero Fabricated Data
        </h2>
        <p>
          In an era where web search and automated directories are increasingly saturated with hallucinated restaurant profiles, fake reviews, guessed opening hours, and broken map pins, <strong>DineDubai</strong> was founded on a simple, non-negotiable premise: <em>every single detail published must be physically verifiable in the real world</em>.
        </p>
        <p>
          If a restaurant’s operating schedule has not been editorially confirmed against official municipal records or direct door-sign audits, we leave it blank and clearly explain why. We never invent fake ratings, fake customer reviews, or synthetic phone numbers.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Verifiable Sources</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            All records trace directly to primary authorities: Michelin Guide Dubai, Dubai Department of Economy and Tourism, and OpenStreetMap geographic nodes.
          </p>
        </div>

        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>Live Asia/Dubai Clock</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Real-time open/closed calculations run strictly in Gulf Standard Time (UTC+4), taking into account split shifts, midnight transitions, and Friday prayer timings.
          </p>
        </div>

        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-stone-800" />
            <span>API-Free Map Links</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every listing provides authentic, URL-encoded Google Maps and turn-by-turn direction links based on exact venue coordinates, requiring no third-party API keys.
          </p>
        </div>
      </section>

      <section className="space-y-4 pt-4 border-t border-stone-100">
        <h2 className="font-serif-display text-2xl font-bold text-stone-900">
          How We Curate & Verify Listings
        </h2>
        <ul className="space-y-3 text-sm text-stone-700">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              <strong>Primary Authority Baseline:</strong> We curate top Dubai venues cited in the Michelin Guide Dubai, Gault & Millau UAE, and municipal registrations.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              <strong>Open Database License (ODbL) Community Data:</strong> We incorporate geocoded nodes from OpenStreetMap with full attribution, verifying that node IDs correspond to actual street addresses and buildings across Dubai.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              <strong>Public Correction Loop:</strong> Every visitor has access to our real-time Correction System. Submissions are reviewed in our Editorial Console with audit logging.
            </span>
          </li>
        </ul>
      </section>

      <section className="p-6 bg-stone-100/70 border border-stone-200 rounded-xl space-y-3 text-xs text-stone-600">
        <h3 className="font-bold uppercase tracking-wider text-stone-900">
          Corporate & Regulatory Transparency
        </h3>
        <p>
          DineDubai is operated in compliance with the laws of the United Arab Emirates and the guidelines set forth by the Dubai Department of Economy and Tourism (DET). Commercial trade licensing and legal ownership records are documented on our Legal and Terms pages.
        </p>
      </section>
    </StaticPageLayout>
  );
}
