import React, { useEffect } from 'react';
import { ArrowLeft, ChevronRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { SITE_CONFIG } from '../../config/siteConfig';
import { updatePageSeo } from '../../utils/seo';

interface StaticPageLayoutProps {
  title: string;
  subtitle?: string;
  metaDescription: string;
  canonicalPath: string;
  onNavigateHome: () => void;
  children: React.ReactNode;
  showLegalNotice?: boolean;
}

export function StaticPageLayout({
  title,
  subtitle,
  metaDescription,
  canonicalPath,
  onNavigateHome,
  children,
  showLegalNotice = true,
}: StaticPageLayoutProps) {
  useEffect(() => {
    updatePageSeo({
      title,
      description: metaDescription,
      canonicalPath,
      ogType: 'website',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [title, metaDescription, canonicalPath]);

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <ol className="flex items-center gap-2 text-xs text-stone-500">
            <li>
              <button
                onClick={onNavigateHome}
                className="hover:text-stone-900 transition-colors"
              >
                Home
              </button>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3 h-3 text-stone-400" />
            </li>
            <li className="font-semibold text-stone-900 truncate">
              {title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Header Banner */}
      <header className="bg-stone-900 text-stone-100 py-10 sm:py-14 border-b border-stone-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </button>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </header>

      {/* Page Content Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
        {showLegalNotice && (
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-950">
                Pre-Launch Regulatory Notice (UAE Department of Economy and Tourism)
              </p>
              <p className="text-amber-900/90 leading-relaxed">
                Bracketed placeholders (such as <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">[LEGAL_ENTITY_NAME_TO_BE_SUPPLIED]</code>) are configured in <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">src/config/siteConfig.ts</code> and must be finalized with the site owner’s registered Dubai commercial trade license details prior to public commercial launch.
              </p>
            </div>
          </div>
        )}

        <article className="p-6 sm:p-10 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-8 text-stone-800 text-sm leading-relaxed">
          {children}
        </article>
      </main>
    </div>
  );
}
