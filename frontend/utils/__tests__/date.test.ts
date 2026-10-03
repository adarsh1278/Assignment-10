import { describe, it, expect } from 'vitest';
import {
  isLeapYear,
  getDaysInMonth,
  isValidCalendarDate,
  parseDateString,
  formatDateString,
  formatFullDate,
} from '../date';

describe('isLeapYear', () => {
  it('2024 is a leap year', () => expect(isLeapYear(2024)).toBe(true));
  it('2026 is not a leap year', () => expect(isLeapYear(2026)).toBe(false));
  it('2000 is a leap year', () => expect(isLeapYear(2000)).toBe(true));
  it('1900 is not a leap year', () => expect(isLeapYear(1900)).toBe(false));
});

describe('getDaysInMonth', () => {
  it('January has 31 days', () => expect(getDaysInMonth(1, 2026)).toBe(31));
  it('February has 28 days in 2026', () => expect(getDaysInMonth(2, 2026)).toBe(28));
  it('February has 29 days in 2024', () => expect(getDaysInMonth(2, 2024)).toBe(29));
  it('April has 30 days', () => expect(getDaysInMonth(4, 2026)).toBe(30));
  it('December has 31 days', () => expect(getDaysInMonth(12, 2026)).toBe(31));
});

describe('isValidCalendarDate', () => {
  it('January 31 valid', () => expect(isValidCalendarDate(2026, 1, 31)).toBe(true));
  it('January 32 invalid', () => expect(isValidCalendarDate(2026, 1, 32)).toBe(false));
  it('February 29 valid in leap year', () => expect(isValidCalendarDate(2024, 2, 29)).toBe(true));
  it('February 29 invalid in non-leap year', () => expect(isValidCalendarDate(2026, 2, 29)).toBe(false));
  it('February 30 invalid', () => expect(isValidCalendarDate(2026, 2, 30)).toBe(false));
  it('April 30 valid', () => expect(isValidCalendarDate(2026, 4, 30)).toBe(true));
  it('April 31 invalid', () => expect(isValidCalendarDate(2026, 4, 31)).toBe(false));
  it('June 31 invalid', () => expect(isValidCalendarDate(2026, 6, 31)).toBe(false));
});

describe('parseDateString', () => {
  it('parses valid date', () => {
    expect(parseDateString('2026-10-03')).toEqual({ year: 2026, month: 10, day: 3 });
  });
  it('returns null for Feb 30', () => expect(parseDateString('2026-02-30')).toBeNull());
  it('returns null for Apr 31', () => expect(parseDateString('2026-04-31')).toBeNull());
  it('returns null for bad format', () => expect(parseDateString('10/03/2026')).toBeNull());
});

describe('formatDateString', () => {
  it('pads month and day', () => expect(formatDateString(2026, 1, 5)).toBe('2026-01-05'));
  it('formats correctly', () => expect(formatDateString(2026, 10, 3)).toBe('2026-10-03'));
});

describe('formatFullDate', () => {
  it('formats full date', () => expect(formatFullDate('2026-10-03')).toBe('October 3, 2026'));
  it('formats January', () => expect(formatFullDate('2026-01-01')).toBe('January 1, 2026'));
});
