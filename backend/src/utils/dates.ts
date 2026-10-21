// Number of milliseconds in one day: 24 hours x 60 minutes x 60 seconds x 1000ms
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Returns a new date that is `days`days after `date`.
// Exmaple: addDays(1 Jan, 7) -> 8 Jan
export function addDays(date: Date, days: number): Date {
    // getTime() = the date is milliseconds since 1970.
    // Add the days (as milliseconds) and turn it back into a date.
    return new Date(date.getTime() + days * MS_PER_DAY);
}