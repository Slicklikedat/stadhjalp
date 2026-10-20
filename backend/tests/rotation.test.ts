// Import the function we want to test
import { getNextAssigneeIndex } from '../src/utils/rotation';
// describe groups related tests under one name
describe('getNextAssigneeIndex', () => {
    // Each test checks ONE thing. The text says what should happen.
    test('moves to the next person', () => {
        // expect(actual).toBe(expected): "I expect this to be that"
        expect(getNextAssigneeIndex(0, 3)).toBe(1);
    });

    test('starts over at the first person after the last one', () => {
        expect(getNextAssigneeIndex(2, 3)).toBe(0);
    });

    test('stays at 0 when nobody is in the rotation', () => {
        expect(getNextAssigneeIndex(0, 0)).toBe(0);
    });
});