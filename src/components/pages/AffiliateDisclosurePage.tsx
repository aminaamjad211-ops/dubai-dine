import React from 'react';
import { StaticPageLayout } from './StaticPageLayout';
import { Link2, ShieldCheck, HelpCircle, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '../../config/siteConfig';

export function AffiliateDisclosurePage({ onNavigateHome }: { onNavigateHome: () => void }) {
  return (
    <StaticPageLayout
      title="Affiliate Disclosure"
      subtitle="How affiliate links support DineDubai’s physical verification research without compromising our editorial objectivity."
      metaDescription="DineDubai Affiliate Disclosure: transparent explanation of booking affiliate links, zero cost to consumers, and independent editorial inclusion."
      canonicalPath="/#affiliate-disclosure"
      onNavigateHome={onNavigateHome}
      showLegalNotice={false}
    >
      <section className="space-y-4">
        <h2 className="font-serif-display text-2xl font-bold text-stone-900">
          Transparency in Affiliate Relationships
        </h2>
        <p>
          To sustain the ongoing operational costs of maintaining a comprehensive, physically audited directory of Dubai restaurants—including field audits of door signage, municipal record verifications, and hosting infrastructure—<strong>DineDubai</strong> participates in select affiliate programs.
        </p>
      </section>

      <section className="space-y-4 pt-4 border-t border-stone-100">
        <h3 className="font-serif-display text-xl font-bold text-stone-900">
          What Is an Affiliate Link?
        </h3>
        <p>
          Certain outbound links on restaurant detail pages (such as links to reserve a table via hotel booking engines, official restaurant booking partners, or culinary tour platforms) are customized tracking links.
        </p>
        <p>
          If you click on one of these links and complete a valid reservation or transaction, DineDubai may earn a modest referral commission at <strong>no additional cost to you</strong>. The price you pay for meals, booking deposits, or event tickets remains completely identical whether you use our link or navigate directly.
        </p>
      </section>

      <section className="space-y-4 pt-4 border-t border-stone-100">
        <h3 className="font-serif-display text-xl font-bold text-stone-900">
          Our Three Guarantees on Affiliate Links
        </h3>

        <div className="space-y-3">
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>1. Zero Cost to the Diner</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Affiliate referral fees are paid exclusively by partner platforms out of their standard marketing budgets. You will never incur surcharges or booking markups.
            </p>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>2. Inclusion Is Never Based on Commission</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Restaurants are selected and indexed based purely on authentic geographic existence, cultural significance, and municipal records. We list hundreds of small, family-run cafeterias, historic kabab houses, and local bakeries with whom we have zero commercial relationship.
            </p>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>3. Unaltered Google Maps Links</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Our &quot;View on Google Maps&quot; and &quot;Get Directions&quot; links are clean, direct Google Maps URL parameters. They contain zero affiliate redirects, zero tracking cookies, and zero intermediary landing pages.
            </p>
          </div>
        </div>
      </section>

      <section className="p-6 bg-stone-100/70 border border-stone-200 rounded-xl space-y-2 text-xs text-stone-600">
        <h4 className="font-bold uppercase tracking-wider text-stone-900">
          Questions About Our Disclosures?
        </h4>
        <p>
          If you have questions regarding our affiliate disclosures or wish to verify the commercial nature of any specific partner link, please reach out to our editorial desk at <code className="font-mono text-stone-800">{SITE_CONFIG.legalEntity.editorialEmail}</code>.
        </p>
      </section>
    </StaticPageLayout>
  );
}
