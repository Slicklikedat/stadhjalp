// Returns the POSITION of the enxt person in the rotation.
// After the last person, it starts over from the first (position 0)

// Example with 3 people (position 0, 1, 2);
// 0 -> 1, 1 -> 2, 2 -> 0 (start over)
export function getNextAssigneeIndex(currentIndex: number, assigneeCount: number): number {
    // Nobody in the rotation -> nothing to rotate, stay at 0
    if (assigneeCount === 0) return 0;

    //normally: just the next position
    const nextIndex = currentIndex + 1;

    // Past the last person? Start over from the first
    if (nextIndex >= assigneeCount) return 0;

    return nextIndex;
}