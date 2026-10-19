import React from 'react';
import { StaticPageLayout } from './StaticPageLayout';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Scale } from 'lucide-react';
import { SITE_CONFIG } from '../../config/siteConfig';

export function EditorialPolicyPage({ onNavigateHome }: { onNavigateHome: () => void }) {
  return (
    <StaticPageLayout
      title="Editorial Policy & Data Standards"
      subtitle="Our code of ethics, data integrity protocols, and strict verification methodology for Dubai dining information."
      metaDescription="DineDubai Editorial Policy: our zero-fabrication pledge, verification hierarchy, handling of unverified hours, and transparent editorial corrections."
      canonicalPath="/#editorial-policy"
      onNavigateHome={onNavigateHome}
      showLegalNotice={false}
    >
      <section className="space-y-4">
        <h2 className="font-serif-display text-2xl font-bold text-stone-900">
          The DineDubai Data Integrity Pledge
        </h2>
        <p>
          At DineDubai, accuracy is our sole currency. We operate under a strict, immutable editorial charter designed to protect diners from inaccurate information, artificial hallucinations, and deceptive advertising.
        </p>
      </section>

      <section className="space-y-4 pt-4 border-t border-stone-100">
        <h3 className="font-serif-display text-xl font-bold text-stone-900">
          1. The Verification Hierarchy
        </h3>
        <p>
          Every factual datapoint in our directory must trace to a verified tier in our source hierarchy:
        </p>

        <div className="space-y-3">
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-800">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">1</span>
              <span>Tier 1: Official Regulatory & Guide Citations</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed pl-7">
              Municipal business licenses issued by the Dubai Department of Economy and Tourism (DET), physical trade registries, and published guides from Michelin Guide Dubai and Gault &amp; Millau UAE.
            </p>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-800">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px]">2</span>
              <span>Tier 2: Physical Venue Audits & Primary Channels</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed pl-7">
              Direct physical inspection of restaurant door signs, printed paper menus, official restaurant domain websites, and direct telephone confirmation with venue management.
            </p>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-stone-800">
              <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center text-[10px]">3</span>
              <span>Tier 3: Open Community Data (ODbL)</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed pl-7">
              Geographic coordinates and building nodes imported from OpenStreetMap under the Open Database License. Nodes without direct editorial phone confirmation are tagged transparently as <em>&quot;Unconfirmed Schedule / Community Source&quot;</em>.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3 pt-4 border-t border-stone-100">
        <h3 className="font-serif-display text-xl font-bold text-stone-900">
          2. Mandatory Rule on Incomplete or Unverified Data
        </h3>
        <p>
          When operational hours, phone numbers, or official menus cannot be confirmed with high certainty, <strong>we leave those fields blank</strong>. Under no circumstances will automated systems or editorial staff fill in assumed opening hours or generate synthetic reviews to complete a layout.
        </p>
      </section>

      <section className="space-y-3 pt-4 border-t border-stone-100">
        <h3 className="font-serif-display text-xl font-bold text-stone-900">
          3. Clear Labeling of Verification Status
        </h3>
        <p>
          Every restaurant detail page and listing card displays an explicit verification badge:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-700">
          <li>
            <strong className="text-emerald-800">Editorially Verified:</strong> The listing has been audited across all major fields (name, exact coordinates, full weekly operating hours, telephone, and website) by our editorial desk within the past 180 days.
          </li>
          <li>
            <strong className="text-amber-800">Community Node / Unconfirmed Hours:</strong> The geographic location and venue name are genuine OpenStreetMap records, but specific weekly hours require direct venue confirmation.
          </li>
        </ul>
      </section>

      <section className="space-y-3 pt-4 border-t border-stone-100">
        <h3 className="font-serif-display text-xl font-bold text-stone-900">
          4. Commercial Independence
        </h3>
        <p>
          DineDubai maintains strict separation between editorial evaluations and commercial relationships. Restaurants cannot pay to purchase &quot;Verified&quot; status or alter factual details (such as operating hours, address, or Michelin citations). Sponsored placements, if introduced in the future, will be unmistakably labeled in accordance with UAE National Media Council guidelines.
        </p>
      </section>
    </StaticPageLayout>
  );
}
