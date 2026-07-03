import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  calculateDaysRemaining,
  getProductStatus,
  formatDaysRemaining,
} from '../dateHelpers';

describe('dateHelpers', () => {
  beforeEach(() => {
    // Lock system time to a fixed date: Saturday, July 4, 2026
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-04T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('calculateDaysRemaining', () => {
    it('returns 0 if expiryDate is missing', () => {
      expect(calculateDaysRemaining('')).toBe(0);
      expect(calculateDaysRemaining(null)).toBe(0);
      expect(calculateDaysRemaining(undefined)).toBe(0);
    });

    it('calculates days remaining for a future date (same month)', () => {
      // Expiry on July 9, 2026 (5 days after July 4)
      expect(calculateDaysRemaining('2026-07-09')).toBe(5);
    });

    it('calculates days remaining for a future date (next month)', () => {
      // Expiry on August 4, 2026 (31 days after July 4)
      expect(calculateDaysRemaining('2026-08-04')).toBe(31);
    });

    it('returns 0 for a date expiring today', () => {
      expect(calculateDaysRemaining('2026-07-04')).toBe(0);
    });

    it('returns negative days for a past date', () => {
      // Expired on July 1, 2026 (-3 days relative to July 4)
      expect(calculateDaysRemaining('2026-07-01')).toBe(-3);
    });
  });

  describe('getProductStatus', () => {
    it('returns "Expired" for negative days remaining', () => {
      const status = getProductStatus('2026-07-01');
      expect(status.label).toBe('Expired');
      expect(status.color).toBe('#ff6b6b');
      expect(status.backgroundColor).toBe('#ffe0e0');
      expect(status.daysRemaining).toBe(-3);
    });

    it('returns "Expires Today" for 0 days remaining', () => {
      const status = getProductStatus('2026-07-04');
      expect(status.label).toBe('Expires Today');
      expect(status.color).toBe('#ff8c42');
      expect(status.backgroundColor).toBe('#ffe8cc');
      expect(status.daysRemaining).toBe(0);
    });

    it('returns "Expiring Soon" (Orange) for 1 to 3 days remaining', () => {
      // Expires July 7 (3 days remaining)
      const status = getProductStatus('2026-07-07');
      expect(status.label).toBe('Expiring Soon');
      expect(status.color).toBe('#ffa94d');
      expect(status.backgroundColor).toBe('#fff3cd');
      expect(status.daysRemaining).toBe(3);
    });

    it('returns "Expiring Soon" (Yellow) for 4 to 7 days remaining', () => {
      // Expires July 11 (7 days remaining)
      const status = getProductStatus('2026-07-11');
      expect(status.label).toBe('Expiring Soon');
      expect(status.color).toBe('#ffd43b');
      expect(status.backgroundColor).toBe('#fffacd');
      expect(status.daysRemaining).toBe(7);
    });

    it('returns "Good" (Green) for more than 7 days remaining', () => {
      // Expires July 15 (11 days remaining)
      const status = getProductStatus('2026-07-15');
      expect(status.label).toBe('Good');
      expect(status.color).toBe('#51cf66');
      expect(status.backgroundColor).toBe('#e7f5e9');
      expect(status.daysRemaining).toBe(11);
    });
  });

  describe('formatDaysRemaining', () => {
    it('formats expired dates correctly for plural days', () => {
      expect(formatDaysRemaining(-3)).toBe('Expired 3 days ago');
    });

    it('formats expired dates correctly for single day', () => {
      expect(formatDaysRemaining(-1)).toBe('Expired 1 day ago');
    });

    it('formats expires today correctly', () => {
      expect(formatDaysRemaining(0)).toBe('Expires today');
    });

    it('formats expires tomorrow correctly', () => {
      expect(formatDaysRemaining(1)).toBe('Expires tomorrow');
    });

    it('formats future dates correctly with plural days', () => {
      expect(formatDaysRemaining(5)).toBe('5 days left');
    });
  });
});
