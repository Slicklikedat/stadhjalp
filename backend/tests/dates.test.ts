import { addDays, isDue } from '../src/utils/dates';

// A fixed "now" so the tests give the same answer every day they run
const NOW = new Date('2026-10-21T12:00:00.000Z');

describe('addDays', () => {
    test('adds the given number of days', () => {
        // toISOString() so we can compare the dates as text
        expect(addDays(NOW, 7).toISOString()).toBe('2026-10-28T12:00:00.000Z');
    });

    test('works across a month boundary', () => {
        expect(addDays(NOW, 14).toISOString()).toBe('2026-11-04T12:00:00.000Z');
    });
});

describe('isDue', () => {
    test('false when nothing is scheduled', () => {
        expect(isDue(null, NOW)).toBe(false);
    });

    test('false before the date', () => {
        // Tomorrow → not yet
        expect(isDue('2026-10-22T12:00:00.000Z', NOW)).toBe(false);
    });

    test('true when the date has passed', () => {
        // Yesterday → it's time
        expect(isDue('2026-10-20T12:00:00.000Z', NOW)).toBe(true);
    });

    test('true at exactly the right moment', () => {
        // The same moment as NOW → <= makes this true
        expect(isDue(NOW.toISOString(), NOW)).toBe(true);
    });
});

