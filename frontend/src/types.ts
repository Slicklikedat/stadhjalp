// The three Kanban columns. A union type: only these three values are allowed.
export type TaskStatus = 'todo' | 'inProgress' | 'done';

// A family member who can be given chores
export interface FamilyMember {
    id: number;
    name: string;
    color: string; // Hex color, e.g. "#e76f51"
}

// Shared types used by many components
// "export" lets other files import them.
export interface Task {
    id: number;
    title: string;
    status: TaskStatus;
    assigneeIds: number[]; // The ids of the members who take turns, in order
    currentAssigneeIndex: number; //Position in assigneeIds of whose turn it is now
    repeatEveryDays: number | null; // Days until it comes back after Klart. null = one-time task
    nextDueAt: string | null; // ISO date when it comes back to "todo". null = not scheduled
    
}


// Shared types used by many components.
// "export" lets other files import them.
export interface Task {
    id: number;
    title: string;
    status: TaskStatus; // Uses the type above instead of repeating the three values
}