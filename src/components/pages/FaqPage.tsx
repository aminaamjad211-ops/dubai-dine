import React, { useState } from 'react';
import { StaticPageLayout } from './StaticPageLayout';
import { ChevronDown, HelpCircle, ShieldCheck, MapPin, Clock, AlertTriangle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    category: 'Data & Verification',
    question: 'How does DineDubai verify restaurant information?',
    answer: 'We audit every listing against primary, authoritative sources including official registrations from the Dubai Department of Economy and Tourism (DET), the Michelin Guide Dubai (2024/2025), Gault & Millau UAE, and exact geographic nodes from OpenStreetMap. For editorially maintained venues, our team physically reviews official menus and door signage.',
  },
  {
    category: 'Data & Verification',
    question: 'Why do some restaurants have blank or unverified opening hours?',
    answer: 'Under our strict Authentic Data Policy, we never invent or guess operational schedules. If a venue’s operating hours have not been verified via primary municipal records, official door audits, or direct venue confirmation, we deliberately leave the schedule blank and advise diners to contact the venue directly.',
  },
  {
    category: 'Navigation & Maps',
    question: 'How do the “View on Google Maps” and “Get Directions” links work without requiring an API key?',
    answer: 'We format Google Maps links using standard, URL-encoded Google Maps Scheme URLs incorporating the restaurant’s exact verified street address and WGS84 geographic coordinates (latitude and longitude). This launches native Google Maps in your browser or phone app directly to the restaurant’s physical pin with zero reliance on paid API quotas.',
  },
  {
    category: 'Dining in Dubai',
    question: 'What time zone is used to calculate whether a restaurant is “Open Now”?',
    answer: 'All live operational statuses are calculated in real time using Gulf Standard Time (Asia/Dubai, UTC+4). Our logic accounts for late-night shifts extending past midnight into the early morning hours, as well as distinct Friday schedules.',
  },
  {
    category: 'Dining in Dubai',
    question: 'Are all restaurants in Dubai Halal?',
    answer: 'By UAE municipal regulation, all meat served in licensed non-pork food establishments across Dubai must be certified Halal. Venues that serve pork products must operate segregated, clearly signposted non-Halal preparation areas. In our directory, dietary and halal tags are only applied when verified by municipal inspection or official venue documentation.',
  },
  {
    category: 'Pricing & Budget',
    question: 'How are price tiers calculated?',
    answer: 'Price tiers (AED 30–80, AED 80–180, AED 180–400, AED 400+) represent the estimated average cost of a meal for one adult diner, typically comprising an appetizer or side, a main course, and a non-alcoholic beverage, inclusive of UAE 5% VAT. Alcohol, tasting menus, and discretionary service charges are not included in baseline tiers.',
  },
  {
    category: 'Corrections & Feedback',
    question: 'How can restaurant owners or patrons submit updated details or report a closure?',
    answer: 'Anyone can click the “Report Correction” button found on any restaurant card or detail page, or visit our dedicated Corrections Portal. Submissions require a brief description and supporting evidence (such as a photo of the door sign or link to official social announcements). Submissions enter our Editorial Console for audit before being applied.',
  },
  {
    category: 'Licensing & Open Data',
    question: 'What is the licensing behind community-imported restaurant nodes?',
    answer: 'Community restaurant listings imported from OpenStreetMap are published under the Open Database License (ODbL). We maintain strict source attribution, including original OSM Node/Way identifiers and links back to OpenStreetMap contributors.',
  },
];

export function FaqPage({ onNavigateHome }: { onNavigateHome: () => void }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <StaticPageLayout
      title="Frequently Asked Questions (FAQ)"
      subtitle="Everything you need to know about our authentic Dubai restaurant verification, live operating hours, and Google Maps navigation."
      metaDescription="Frequently asked questions about DineDubai: how we verify records, our zero-hallucination policy, Google Maps navigation without API keys, and Dubai dining culture."
      canonicalPath="/#faq"
      onNavigateHome={onNavigateHome}
      showLegalNotice={false}
    >
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-stone-200 rounded-xl overflow-hidden transition-colors bg-stone-50/50"
            >
              <button
                onClick={() => toggleItem(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-stone-900 hover:text-amber-950 text-sm"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-200/80 text-stone-700">
                    {item.category}
                  </span>
                  <span>{item.question}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-amber-800' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 pt-1 sm:px-5 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-stone-200/60 bg-white">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-stone-100/70 border border-stone-200 rounded-xl space-y-2 text-xs text-stone-600">
        <h3 className="font-bold uppercase tracking-wider text-stone-900">
          Have an unaddressed question?
        </h3>
        <p>
          Reach out to our editorial desk via our <a href="#contact" className="text-amber-800 underline font-medium">Contact Page</a> or submit immediate restaurant corrections via our <a href="#corrections" className="text-amber-800 underline font-medium">Corrections Portal</a>.
        </p>
      </div>
    </StaticPageLayout>
  );
}
