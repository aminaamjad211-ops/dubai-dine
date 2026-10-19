import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Restaurant, VisitorCorrection } from '../../types/restaurant';

interface CorrectionModalProps {
  restaurant: Restaurant;
  initialField?: VisitorCorrection['field'];
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CorrectionModal: React.FC<CorrectionModalProps> = ({
  restaurant,
  initialField = 'operating_hours',
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [field, setField] = useState<VisitorCorrection['field']>(initialField);
  const [reportedValue, setReportedValue] = useState('');
  const [sourceEvidence, setSourceEvidence] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!reportedValue.trim()) {
      setErrorMessage('Please describe the correct or updated information.');
      return;
    }

    if (!sourceEvidence.trim()) {
      setErrorMessage('Please cite your source or evidence (e.g. restaurant sign, Instagram story, phone check).');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/corrections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          field,
          reportedValue: reportedValue.trim(),
          sourceEvidence: sourceEvidence.trim(),
          contactEmail: contactEmail.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit correction');
      }

      setSuccessMessage('Thank you! Your correction report has been sent to our editorial desk for verification.');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-stone-100 bg-stone-50">
          <div>
            <h3 className="font-serif-display text-lg font-bold text-stone-900">
              Submit Directory Correction
            </h3>
            <p className="text-xs text-stone-500">
              For: <strong className="text-stone-800">{restaurant.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMessage ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-stone-900">Correction Received</h4>
            <p className="text-sm text-stone-600">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
            {errorMessage && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Information to Correct
              </label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value as VisitorCorrection['field'])}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="operating_hours">Opening & Closing Hours</option>
                <option value="phone">Phone Number / Contact</option>
                <option value="address">Street Address / Unit</option>
                <option value="coordinates">Coordinates / Map Location Pin</option>
                <option value="menu_price">Price Range / Cuisine</option>
                <option value="closure">Temporary or Permanent Closure</option>
                <option value="other">Other Information</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Accurate Information / Proposed Change *
              </label>
              <textarea
                rows={3}
                required
                value={reportedValue}
                onChange={(e) => setReportedValue(e.target.value)}
                placeholder="e.g. The restaurant is closed on Tuesdays for prep, and closes at 01:00 on weekends."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Verification Source or Evidence *
              </label>
              <textarea
                rows={2}
                required
                value={sourceEvidence}
                onChange={(e) => setSourceEvidence(e.target.value)}
                placeholder="e.g. Official website, restaurant manager phone confirmation, Instagram announcement link, or on-site photo."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400"
              />
              <span className="text-[11px] text-stone-500 block mt-1">
                To prevent unverified edits, all corrections are reviewed against official sources.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Your Email (Optional, for editorial follow-up)
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Send for Editorial Review'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
