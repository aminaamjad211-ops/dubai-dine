import { DaySchedule, LiveStatusResult, Restaurant, Shift } from '../types/restaurant';

/**
 * Dubai Time Zone calculations (Asia/Dubai, UTC+4, No DST)
 */
export const DUBAI_TIMEZONE = 'Asia/Dubai';

export interface DubaiDateTimeParts {
  year: number;
  month: number; // 1-12
  day: number;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  dayName: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  hour: number; // 0-23
  minute: number; // 0-59
  formattedTime: string; // e.g. "21:45"
  fullFormatted: string; // e.g. "Saturday, Oct 17, 2026, 21:45 GST"
}

/**
 * Returns current Dubai time parts using Intl API with Asia/Dubai timezone.
 * Optionally accepts a mock Date for deterministic unit testing.
 */
export function getDubaiTimeParts(referenceDate: Date = new Date()): DubaiDateTimeParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: DUBAI_TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(referenceDate);
  const partMap: Record<string, string> = {};
  for (const p of parts) {
    partMap[p.type] = p.value;
  }

  const hour = parseInt(partMap.hour, 10);
  const minute = parseInt(partMap.minute, 10);
  const year = parseInt(partMap.year, 10);
  const month = parseInt(partMap.month, 10);
  const day = parseInt(partMap.day, 10);
  const dayName = partMap.weekday as DubaiDateTimeParts['dayName'];

  const dayIndexMap: Record<DubaiDateTimeParts['dayName'], number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formattedTime = `${pad(hour)}:${pad(minute)}`;

  return {
    year,
    month,
    day,
    dayOfWeek: dayIndexMap[dayName],
    dayName,
    hour,
    minute,
    formattedTime,
    fullFormatted: `${dayName}, ${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)} (GST / Asia/Dubai)`,
  };
}

/**
 * Helper to convert "HH:mm" string to minutes from midnight
 */
export function timeStringToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map((s) => parseInt(s, 10));
  return (h || 0) * 60 + (m || 0);
}

/**
 * Helper to format minutes from midnight back to 12h or 24h readable string
 */
export function formatMinutesToTime(totalMinutes: number): string {
  const norm = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(h)}:${pad(m)}`;
}

/**
 * Determines whether a restaurant is open right now in Dubai, handling:
 * 1. Multiple daytime shifts (e.g. Lunch 12:00-15:00 & Dinner 18:30-23:30)
 * 2. Overnight hours (e.g. 19:00 - 02:00 next day)
 * 3. Early morning rollover from previous day's overnight shift
 * 4. Unverified hours warnings
 */
export function calculateDubaiLiveStatus(
  restaurant: Pick<Restaurant, 'operatingHours' | 'verification'>,
  referenceDate: Date = new Date()
): LiveStatusResult {
  const dubaiTime = getDubaiTimeParts(referenceDate);
  const currentMinutes = dubaiTime.hour * 60 + dubaiTime.minute;
  const todayDayIndex = dubaiTime.dayOfWeek;
  const yesterdayDayIndex = (todayDayIndex + 6) % 7;

  const isVerifiedHours =
    restaurant.verification.status === 'verified' &&
    restaurant.verification.verifiedFields.includes('hours');

  const schedule = restaurant.operatingHours.schedule || [];

  // When no schedule is available, do not invent or guess open/closed status
  if (schedule.length === 0) {
    return {
      isOpen: false,
      statusText: 'Hours unverified · Contact venue directly',
      nextEventText: 'Hours unconfirmed',
      dubaiLocalTimeFormatted: dubaiTime.formattedTime,
      isVerifiedHours: false,
      lastCheckedDisplay: restaurant.verification.lastCheckedAt
        ? `Checked ${restaurant.verification.lastCheckedAt.split('T')[0]}`
        : 'Unverified',
    };
  }

  // Find yesterday's and today's schedule
  const todaySchedule = schedule.find((s) => s.dayIndex === todayDayIndex);
  const yesterdaySchedule = schedule.find((s) => s.dayIndex === yesterdayDayIndex);

  // 1. Check if an overnight shift started yesterday is still active this morning
  if (yesterdaySchedule && !yesterdaySchedule.isClosed) {
    for (const shift of yesterdaySchedule.shifts) {
      const openMin = timeStringToMinutes(shift.open);
      const closeMin = timeStringToMinutes(shift.close);

      // If closeMin <= openMin, it crosses midnight into today
      if (closeMin <= openMin && currentMinutes < closeMin) {
        return {
          isOpen: true,
          statusText: `Open now · Closes at ${shift.close} (Asia/Dubai)`,
          nextEventText: `Closes at ${shift.close}`,
          currentShift: shift,
          dubaiLocalTimeFormatted: dubaiTime.formattedTime,
          isVerifiedHours,
          lastCheckedDisplay: restaurant.verification.lastCheckedAt
            ? `Checked ${restaurant.verification.lastCheckedAt.split('T')[0]}`
            : 'Unverified',
        };
      }
    }
  }

  // 2. Check today's active shifts
  if (todaySchedule && !todaySchedule.isClosed) {
    for (const shift of todaySchedule.shifts) {
      const openMin = timeStringToMinutes(shift.open);
      const closeMin = timeStringToMinutes(shift.close);

      if (closeMin > openMin) {
        // Standard same-day shift
        if (currentMinutes >= openMin && currentMinutes < closeMin) {
          const shiftName = shift.label ? `${shift.label} ` : '';
          return {
            isOpen: true,
            statusText: `Open now (${shiftName.trim()}) · Closes at ${shift.close} (Asia/Dubai)`,
            nextEventText: `Closes at ${shift.close}`,
            currentShift: shift,
            dubaiLocalTimeFormatted: dubaiTime.formattedTime,
            isVerifiedHours,
            lastCheckedDisplay: restaurant.verification.lastCheckedAt
              ? `Checked ${restaurant.verification.lastCheckedAt.split('T')[0]}`
              : 'Unverified',
          };
        }
      } else {
        // Overnight shift starting today (openMin -> 23:59)
        if (currentMinutes >= openMin) {
          const shiftName = shift.label ? `${shift.label} ` : '';
          return {
            isOpen: true,
            statusText: `Open now (${shiftName.trim()}) · Closes at ${shift.close} late night (Asia/Dubai)`,
            nextEventText: `Closes at ${shift.close}`,
            currentShift: shift,
            dubaiLocalTimeFormatted: dubaiTime.formattedTime,
            isVerifiedHours,
            lastCheckedDisplay: restaurant.verification.lastCheckedAt
              ? `Checked ${restaurant.verification.lastCheckedAt.split('T')[0]}`
              : 'Unverified',
          };
        }
      }
    }
  }

  // 3. If closed now, find next opening shift
  let nextOpeningMessage = 'Closed now';
  
  if (todaySchedule && !todaySchedule.isClosed) {
    // Check later shifts today
    const upcomingToday = todaySchedule.shifts.find((shift) => {
      const openMin = timeStringToMinutes(shift.open);
      return openMin > currentMinutes;
    });

    if (upcomingToday) {
      const label = upcomingToday.label ? `for ${upcomingToday.label}` : '';
      nextOpeningMessage = `Closed now · Opens today at ${upcomingToday.open} ${label} (Asia/Dubai)`.trim();
      return {
        isOpen: false,
        statusText: nextOpeningMessage,
        nextEventText: `Opens today at ${upcomingToday.open}`,
        dubaiLocalTimeFormatted: dubaiTime.formattedTime,
        isVerifiedHours,
        lastCheckedDisplay: restaurant.verification.lastCheckedAt
          ? `Checked ${restaurant.verification.lastCheckedAt.split('T')[0]}`
          : 'Unverified',
      };
    }
  }

  // Check tomorrow's schedule
  const tomorrowDayIndex = (todayDayIndex + 1) % 7;
  const tomorrowSchedule = schedule.find((s) => s.dayIndex === tomorrowDayIndex);

  if (tomorrowSchedule && !tomorrowSchedule.isClosed && tomorrowSchedule.shifts.length > 0) {
    const firstShift = tomorrowSchedule.shifts[0];
    nextOpeningMessage = `Closed now · Opens tomorrow (${tomorrowSchedule.day}) at ${firstShift.open} (Asia/Dubai)`;
    return {
      isOpen: false,
      statusText: nextOpeningMessage,
      nextEventText: `Opens tomorrow at ${firstShift.open}`,
      dubaiLocalTimeFormatted: dubaiTime.formattedTime,
      isVerifiedHours,
      lastCheckedDisplay: restaurant.verification.lastCheckedAt
        ? `Checked ${restaurant.verification.lastCheckedAt.split('T')[0]}`
        : 'Unverified',
    };
  }

  // Check subsequent days
  for (let offset = 2; offset <= 6; offset++) {
    const nextIdx = (todayDayIndex + offset) % 7;
    const futureSchedule = schedule.find((s) => s.dayIndex === nextIdx);
    if (futureSchedule && !futureSchedule.isClosed && futureSchedule.shifts.length > 0) {
      const firstShift = futureSchedule.shifts[0];
      nextOpeningMessage = `Closed now · Opens ${futureSchedule.day} at ${firstShift.open} (Asia/Dubai)`;
      break;
    }
  }

  return {
    isOpen: false,
    statusText: nextOpeningMessage,
    nextEventText: nextOpeningMessage,
    dubaiLocalTimeFormatted: dubaiTime.formattedTime,
    isVerifiedHours,
    lastCheckedDisplay: restaurant.verification.lastCheckedAt
      ? `Checked ${restaurant.verification.lastCheckedAt.split('T')[0]}`
      : 'Unverified',
  };
}
