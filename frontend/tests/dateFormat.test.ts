import { getDaysUntil, formatReturnsIn, formatRepeat } from '../src/utils/dateFormat';

// A fixed "now" so the tests give the same answer every day
const NOW = new Date('2026-10-21T12:00:00.000Z');

describe('getDaysUntil', () => {
    test('counts whole days', () => {
        expect(getDaysUntil('2026-10-24T12:00:00.000Z', NOW)).toBe(3);
    });

    test('rounds up part of a day', () => {
        // Only 1 hour into the next day → still counts as 1 day left
        expect(getDaysUntil('2026-10-21T13:00:00.000Z', NOW)).toBe(1);
    });
});

describe('formatReturnsIn', () => {
    test('today', () => {
        expect(formatReturnsIn(NOW.toISOString(), NOW)).toBe('Kommer tillbaka idag');
    });

    test('tomorrow', () => {
        expect(formatReturnsIn('2026-10-22T12:00:00.000Z', NOW)).toBe('Kommer tillbaka imorgon');
    });

    test('several days', () => {
        expect(formatReturnsIn('2026-10-24T12:00:00.000Z', NOW)).toBe('Kommer tillbaka om 3 dagar');
    });
});

describe('formatRepeat', () => {
    test('one-time task', () => {
        expect(formatRepeat(null)).toBe('Engångsuppgift');
    });

    test('every day', () => {
        expect(formatRepeat(1)).toBe('Upprepas varje dag');
    });

    test('several days', () => {
        expect(formatRepeat(7)).toBe('Upprepas efter 7 dagar');
    });
});
