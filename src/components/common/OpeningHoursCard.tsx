import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertTriangle, Calendar, ChevronDown, ChevronUp, Flag } from 'lucide-react';
import { Restaurant } from '../../types/restaurant';
import { calculateDubaiLiveStatus, getDubaiTimeParts } from '../../utils/dubaiTime';

interface OpeningHoursCardProps {
  restaurant: Restaurant;
  onRequestCorrection?: (restaurant: Restaurant, field: 'operating_hours') => void;
  className?: string;
}

export const OpeningHoursCard: React.FC<OpeningHoursCardProps> = ({
  restaurant,
  onRequestCorrection,
  className = '',
}) => {
  const [dubaiTime, setDubaiTime] = useState(() => getDubaiTimeParts());
  const [liveStatus, setLiveStatus] = useState(() => calculateDubaiLiveStatus(restaurant));
  const [isExpanded, setIsExpanded] = useState(false);

  // Keep live time ticking in Dubai timezone every 30 seconds
  useEffect(() => {
    const update = () => {
      const parts = getDubaiTimeParts();
      setDubaiTime(parts);
      setLiveStatus(calculateDubaiLiveStatus(restaurant));
    };

    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [restaurant]);

  const schedule = restaurant.operatingHours.schedule;
  const currentDayIndex = dubaiTime.dayOfWeek;
  const isVerifiedHours = restaurant.verification.status === 'verified' && restaurant.verification.verifiedFields.includes('hours');

  return (
    <div className={`bg-white border border-stone-200 rounded-2xl p-6 shadow-xs ${className}`}>
      {/* Top Header: Current Dubai Clock & Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Dubai Local Time (GST / Asia/Dubai)
            </span>
          </div>
          <div className="text-xl font-bold text-stone-900 font-mono-data">
            {dubaiTime.formattedTime} <span className="text-xs text-stone-500 font-sans font-normal">GST · UTC+4</span>
          </div>
        </div>

        {/* Live Status Pill with zero-pill discipline (unboxed clean status with subtle background) */}
        <div className="flex items-center gap-2">
          {liveStatus.isOpen ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{liveStatus.statusText}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-stone-400" />
              <span>{liveStatus.statusText}</span>
            </div>
          )}
        </div>
      </div>

      {/* Verification Notice */}
      <div className="py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
        <div className="flex items-center gap-1.5">
          {isVerifiedHours ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Schedule verified on{' '}
                <strong className="text-stone-700 font-mono-data">
                  {restaurant.verification.lastCheckedAt?.split('T')[0] || 'Recently'}
                </strong>{' '}
                via {restaurant.verification.primarySource.split('(')[0]}
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-amber-800 font-medium">Unverified schedule · Call venue to confirm</span>
            </>
          )}
        </div>

        {onRequestCorrection && (
          <button
            onClick={() => onRequestCorrection(restaurant, 'operating_hours')}
            className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer underline underline-offset-2"
          >
            <Flag className="w-3 h-3" />
            <span>Suggest hours change</span>
          </button>
        )}
      </div>

      {/* Weekly Schedule Table */}
      <div className="mt-4 pt-3 border-t border-stone-100">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            Weekly Operating Schedule
          </h4>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                <span>Collapse</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>View Full Week</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Schedule Rows */}
        {(!schedule || schedule.length === 0) ? (
          <div className="p-4 bg-amber-50/60 border border-amber-200/70 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Weekly schedule not yet verified</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              In accordance with our authentic data policy, operating hours are only published when verified against official venue sources. We never estimate or fabricate opening times. Please call the establishment directly before visiting.
            </p>
            {onRequestCorrection && (
              <button
                onClick={() => onRequestCorrection(restaurant, 'operating_hours')}
                className="inline-flex items-center gap-1.5 font-bold text-amber-900 hover:text-amber-950 underline underline-offset-2 pt-1"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Submit verified operating hours</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            {schedule.map((item) => {
              const isToday = item.dayIndex === currentDayIndex;
              // In collapsed mode, only show today; in expanded mode, show all 7 days
              if (!isExpanded && !isToday) return null;

              return (
                <div
                  key={item.day}
                  className={`flex items-start justify-between py-2 px-3 rounded-lg transition-colors ${
                    isToday ? 'bg-amber-50/70 border border-amber-200/60 font-medium text-stone-900' : 'text-stone-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-24 ${isToday ? 'font-bold text-amber-950' : ''}`}>{item.day}</span>
                    {isToday && (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    {item.isClosed || item.shifts.length === 0 ? (
                      <span className="text-stone-400 font-medium">Closed</span>
                    ) : (
                      <div className="space-y-0.5 font-mono-data">
                        {item.shifts.map((shift, sIdx) => (
                          <div key={sIdx} className="text-xs">
                            {shift.label && <span className="font-sans text-stone-400 mr-1.5">{shift.label}:</span>}
                            <span>
                              {shift.open} – {shift.close}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Special notes & holiday policies */}
        {(restaurant.operatingHours.specialHoursNote || restaurant.operatingHours.holidayPolicy) && (
          <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500 space-y-1">
            {restaurant.operatingHours.specialHoursNote && (
              <p>
                <strong className="text-stone-700">Special Note:</strong> {restaurant.operatingHours.specialHoursNote}
              </p>
            )}
            {restaurant.operatingHours.holidayPolicy && (
              <p>
                <strong className="text-stone-700">Holidays:</strong> {restaurant.operatingHours.holidayPolicy}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
