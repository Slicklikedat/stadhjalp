// The three Kanban columns. A union type: only these three values are allowed.
export type TaskStatus = 'todo' | 'inProgress' | 'done';

// Shared types used by many components.
// "export" lets other files import them.
export interface Task {
    id: number;
    title: string;
    status: TaskStatus; // Uses the type above instead of repeating the three values
}