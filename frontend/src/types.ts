// Shared types used by many components.
// "export" lets other files import them
export interface Task {
    id: number;
    title: string;
    status: 'todo' | 'inProgress' | 'done';
}