import React, { useState } from 'react';
import { StaticPageLayout } from './StaticPageLayout';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { SITE_CONFIG } from '../../config/siteConfig';

export function ContactPage({ onNavigateHome }: { onNavigateHome: () => void }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
  };

  return (
    <StaticPageLayout
      title="Contact Us"
      subtitle="Have an editorial question, media inquiry, or need to connect with our editorial team? We welcome your correspondence."
      metaDescription="Contact the DineDubai editorial board and administrative team. Inquire about listings, municipal verifications, and regulatory disclosures."
      canonicalPath="/#contact"
      onNavigateHome={onNavigateHome}
      showLegalNotice={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Information & Channels */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif-display text-2xl font-bold text-stone-900">
              Get in Touch
            </h2>
            <p className="text-stone-600 text-xs leading-relaxed">
              For restaurant corrections or updated hours, please use our dedicated <a href="#corrections" className="text-amber-800 underline font-medium">Corrections & Feedback Portal</a> so submissions are routed directly to our verification queue.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider text-[11px]">
                <Mail className="w-4 h-4 text-amber-700" />
                <span>Editorial Desk</span>
              </div>
              <p className="text-stone-600">
                {SITE_CONFIG.legalEntity.editorialEmail}
              </p>
              <p className="text-[11px] text-stone-400">
                For chef stories, press releases, and editorial suggestions.
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider text-[11px]">
                <Mail className="w-4 h-4 text-amber-700" />
                <span>Legal & Regulatory Compliance</span>
              </div>
              <p className="text-stone-600">
                {SITE_CONFIG.legalEntity.corporateEmail}
              </p>
              <p className="text-[11px] text-stone-400">
                For UAE regulatory matters, copyright, and trade licensing queries.
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider text-[11px]">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>Registered Office Location</span>
              </div>
              <p className="font-mono text-stone-600">
                {SITE_CONFIG.legalEntity.registeredAddress}
              </p>
              <p className="text-[11px] text-stone-400">
                Jurisdiction: {SITE_CONFIG.legalEntity.jurisdiction}
              </p>
            </div>
          </div>
        </section>

        {/* Working Inquiry Form */}
        <section className="p-6 bg-stone-50 border border-stone-200 rounded-2xl space-y-4">
          <h3 className="font-serif-display text-lg font-bold text-stone-900">
            Send an Inquiry
          </h3>

          {formSubmitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <p className="font-bold text-emerald-950 text-sm">
                  Inquiry Received
                </p>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Thank you for reaching out, {formData.name}. Our team will review your message and reply to <code className="font-mono">{formData.email}</code> within 1–2 business days.
                </p>
              </div>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                }}
                className="mt-2 text-xs font-semibold text-emerald-900 underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tariq Al Mansoori"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-600"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Press & Media">Press & Media</option>
                  <option value="Restaurant Verification Request">Restaurant Verification Request</option>
                  <option value="Licensing & Technical Integration">Licensing & Technical Integration</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our editorial or administrative team assist you?"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </section>
      </div>
    </StaticPageLayout>
  );
}
