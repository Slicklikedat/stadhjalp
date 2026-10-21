// Number of milliseconds in one day
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// How many days from `now`until ´dataString´, rounded UP.
// Example: 2.1 days left -> 3 ("om 3 dagar"), so we never say "0 days" too early.
export function getDaysUntil(dateString: string, now: Date): number {
    const difference = new Date(dateString).getTime() - now.getTime();
    return Math.ceil(difference / MS_PER_DAY);
}

// Swedish text for when a task comes back to "Att göra"
export function formatReturnsIn(nextDueAt: string, now: Date): string {
    const days = getDaysUntil(nextDueAt, now);

    if (days <= 0) return 'kommer tillbaka idag';
    if (days === 1) return 'Kommer tillbaka imorgon';
    return `Kommer tillbaka om ${days} dagar`;

}

// Swedish text for how often a task repeats
export function formatRepeat(repeatEveryDays: number | null): string {
    if (repeatEveryDays === null) return 'Engångsuppgift';
    if (repeatEveryDays === 1) return 'Upprepas varje dag';
    return `Upprepas efter ${repeatEveryDays} dagar`;
    
}