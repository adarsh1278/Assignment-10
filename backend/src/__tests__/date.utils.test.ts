import {
  isLeapYear,
  getDaysInMonth,
  isValidCalendarDate,
  parseDateString,
  formatDateToString,
  toDateObject,
} from '../utils/date.utils';

describe('isLeapYear', () => {
  it('returns true for year divisible by 4', () => expect(isLeapYear(2024)).toBe(true));
  it('returns false for year divisible by 100 but not 400', () => expect(isLeapYear(1900)).toBe(false));
  it('returns true for year divisible by 400', () => expect(isLeapYear(2000)).toBe(true));
  it('returns false for regular non-leap years', () => expect(isLeapYear(2025)).toBe(false));
  it('returns false for 2026', () => expect(isLeapYear(2026)).toBe(false));
});

describe('getDaysInMonth', () => {
  it('January has 31 days', () => expect(getDaysInMonth(1, 2026)).toBe(31));
  it('February has 28 days in non-leap year', () => expect(getDaysInMonth(2, 2026)).toBe(28));
  it('February has 29 days in leap year', () => expect(getDaysInMonth(2, 2024)).toBe(29));
  it('April has 30 days', () => expect(getDaysInMonth(4, 2026)).toBe(30));
  it('December has 31 days', () => expect(getDaysInMonth(12, 2026)).toBe(31));
});

describe('isValidCalendarDate', () => {
  it('January 31 is valid', () => expect(isValidCalendarDate(2026, 1, 31)).toBe(true));
  it('January 32 is invalid', () => expect(isValidCalendarDate(2026, 1, 32)).toBe(false));
  it('February 28 is valid in non-leap year', () => expect(isValidCalendarDate(2026, 2, 28)).toBe(true));
  it('February 29 is valid in leap year', () => expect(isValidCalendarDate(2024, 2, 29)).toBe(true));
  it('February 29 is invalid in non-leap year', () => expect(isValidCalendarDate(2026, 2, 29)).toBe(false));
  it('February 30 is invalid', () => expect(isValidCalendarDate(2026, 2, 30)).toBe(false));
  it('April 30 is valid', () => expect(isValidCalendarDate(2026, 4, 30)).toBe(true));
  it('April 31 is invalid', () => expect(isValidCalendarDate(2026, 4, 31)).toBe(false));
  it('June 31 is invalid', () => expect(isValidCalendarDate(2026, 6, 31)).toBe(false));
  it('month 0 is invalid', () => expect(isValidCalendarDate(2026, 0, 1)).toBe(false));
  it('month 13 is invalid', () => expect(isValidCalendarDate(2026, 13, 1)).toBe(false));
  it('day 0 is invalid', () => expect(isValidCalendarDate(2026, 1, 0)).toBe(false));
  it('year 1899 is invalid', () => expect(isValidCalendarDate(1899, 1, 1)).toBe(false));
  it('year 2101 is invalid', () => expect(isValidCalendarDate(2101, 1, 1)).toBe(false));
});

describe('parseDateString', () => {
  it('parses valid date string', () => {
    expect(parseDateString('2026-10-03')).toEqual({ year: 2026, month: 10, day: 3 });
  });
  it('returns null for invalid format', () => expect(parseDateString('2026/10/03')).toBeNull());
  it('returns null for February 30', () => expect(parseDateString('2026-02-30')).toBeNull());
  it('returns null for April 31', () => expect(parseDateString('2026-04-31')).toBeNull());
  it('returns null for empty string', () => expect(parseDateString('')).toBeNull());
  it('returns null for non-string', () => expect(parseDateString(null as unknown as string)).toBeNull());
});

describe('formatDateToString', () => {
  it('formats date correctly', () => {
    const d = toDateObject(2026, 10, 3);
    expect(formatDateToString(d)).toBe('2026-10-03');
  });
  it('pads month and day with zeros', () => {
    const d = toDateObject(2026, 1, 5);
    expect(formatDateToString(d)).toBe('2026-01-05');
  });
});
