import React from 'react';
import { StaticPageLayout } from './StaticPageLayout';
import { Megaphone, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '../../config/siteConfig';

export function AdvertisingDisclosurePage({ onNavigateHome }: { onNavigateHome: () => void }) {
  return (
    <StaticPageLayout
      title="Advertising Disclosure"
      subtitle="Complete transparency on our advertising policies, commercial partnerships, and compliance with UAE National Media Council regulations."
      metaDescription="DineDubai Advertising Disclosure: our adherence to UAE NMC digital advertising standards, clear labeling of sponsored placements, and editorial separation."
      canonicalPath="/#advertising-disclosure"
      onNavigateHome={onNavigateHome}
      showLegalNotice={true}
    >
      <section className="space-y-4">
        <h2 className="font-serif-display text-2xl font-bold text-stone-900">
          Commitment to Ethical Advertising & UAE NMC Compliance
        </h2>
        <p>
          DineDubai adheres strictly to the digital advertising and media guidelines established by the <strong>UAE National Media Council (NMC)</strong> and the <strong>Dubai Department of Economy and Tourism (DET)</strong>.
        </p>
        <p>
          We believe our readers have a fundamental right to distinguish immediately between independent editorial evaluations and commercial advertising messages.
        </p>
      </section>

      <section className="space-y-4 pt-4 border-t border-stone-100">
        <h3 className="font-serif-display text-xl font-bold text-stone-900">
          Core Principles of Advertising on DineDubai
        </h3>

        <div className="space-y-3">
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-stone-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Unmistakable Visual Labeling</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Any paid advertisement, branded feature, or sponsored placement will be clearly and prominently identified using terms such as &quot;Sponsored Listing&quot;, &quot;Advertisement&quot;, or &quot;Paid Partner&quot;.
            </p>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-stone-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Verification Cannot Be Purchased</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Restaurants cannot pay to alter their factual verification status. A venue is marked &quot;Editorially Verified&quot; only when primary municipal documentation, door signs, or verified phone audits substantiate its details.
            </p>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-stone-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>No Native Camouflage</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              We prohibit advertising formats that mimic genuine editorial reviews, simulate third-party consumer ratings, or disguise paid endorsements as independent guide recommendations.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3 pt-4 border-t border-stone-100">
        <h3 className="font-serif-display text-xl font-bold text-stone-900">
          Inquiries for Advertisers & Media Agencies
        </h3>
        <p>
          All commercial advertising campaigns must comply with the UAE Media Regulatory Office requirements, including possession of appropriate commercial licenses. For commercial inquiries, contact our advertising desk at{' '}
          <a href={`mailto:${SITE_CONFIG.legalEntity.corporateEmail}`} className="text-amber-800 underline font-mono">
            {SITE_CONFIG.legalEntity.corporateEmail}
          </a>.
        </p>
      </section>
    </StaticPageLayout>
  );
}
