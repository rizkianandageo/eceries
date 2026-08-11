import { differenceInDays, startOfDay, parseISO } from 'date-fns';

export type FreshnessStatus = 'fresh' | 'warning' | 'critical' | 'expired';

export interface FreshnessInfo {
  status: FreshnessStatus;
  daysLeft: number;
  statusText: string;
  colorClass: string;
}

export function calculateFreshness(expiryDateString: string): FreshnessInfo {
  const expiryDate = startOfDay(parseISO(expiryDateString));
  const today = startOfDay(new Date());
  
  const daysLeft = differenceInDays(expiryDate, today);

  if (daysLeft < 0) {
    return { status: 'expired', daysLeft, colorClass: 'text-red-600 bg-red-100 border-red-200', statusText: 'Expired' };
  } else if (daysLeft <= 2) {
    return { status: 'critical', daysLeft, colorClass: 'text-orange-600 bg-orange-100 border-orange-200', statusText: 'Critical' };
  } else if (daysLeft <= 5) {
    return { status: 'warning', daysLeft, colorClass: 'text-yellow-700 bg-yellow-100 border-yellow-200', statusText: 'Warning' };
  } else {
    return { status: 'fresh', daysLeft, colorClass: 'text-emerald-700 bg-emerald-100 border-emerald-200', statusText: 'Fresh' };
  }
}
