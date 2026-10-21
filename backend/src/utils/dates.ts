// Number of milliseconds in one day: 24 hours x 60 minutes x 60 seconds x 1000ms
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Returns a new date that is `days`days after `date`.
// Exmaple: addDays(1 Jan, 7) -> 8 Jan
export function addDays(date: Date, days: number): Date {
    // getTime() = the date is milliseconds since 1970.
    // Add the days (as milliseconds) and turn it back into a date.
    return new Date(date.getTime() + days * MS_PER_DAY);
}

// True if a "come back" date exists and has been reahced.
// "now" is a parameter (instead of new Date() inside) so tests can pick any date.
export function isDue(nextDueAt: string | null, now: Date): boolean {
    // Nothing scheduled -> never due
    if (nextDueAt === null) return false;

    // Turn the ISO text back into a date and compare the millisecond numbers.
    // <= means "the moment has come or already passed".
    return new Date(nextDueAt).getTime() <= now.getTime();
}