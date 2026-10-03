/**
 * Date utility functions for calendar date validation.
 * All functions treat dates as calendar dates (no timezone conversion).
 */

/**
 * Returns whether a year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns the number of days in a given month/year.
 * month is 1-indexed (1 = January, 12 = December).
 */
export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Validates that a given year/month/day combination is a real calendar date.
 */
export function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (!Number.isInteger(year) || year < 1900 || year > 2100) return false;
  if (!Number.isInteger(month) || month < 1 || month > 12) return false;
  if (!Number.isInteger(day) || day < 1) return false;
  const maxDays = getDaysInMonth(month, year);
  return day <= maxDays;
}

/**
 * Parses a date string in YYYY-MM-DD format and validates it.
 * Returns { year, month, day } or null if invalid.
 */
export function parseDateString(dateStr: string): { year: number; month: number; day: number } | null {
  if (typeof dateStr !== 'string') return null;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  if (!isValidCalendarDate(year, month, day)) return null;
  return { year, month, day };
}

/**
 * Converts a parsed date to a JS Date object that represents midnight local time.
 * Use this when creating a Date for Prisma (which stores DATE correctly).
 */
export function toDateObject(year: number, month: number, day: number): Date {
  // Using UTC midnight to avoid timezone shifting the date
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Formats a Date object stored as DATE in the DB back to YYYY-MM-DD string.
 */
export function formatDateToString(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
