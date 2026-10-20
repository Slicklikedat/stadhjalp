import type { Task, TaskStatus } from '../types';

// Describes which props Column expects to receive
interface ColumnProps {
    title: string;           // The heading, e.g. "Att göra"
    tasks: Task[];           // Only the tasks that belong in this column
    nextStatus?: TaskStatus; // Where "Flytta →" moves tasks. The ? means optional: Klart has no next column
    onMove: (taskId: number, newStatus: TaskStatus) => void; // Function from App, called on click
}


// { title, tasks } takes the props out of the props object ("destructuring")
function Column({ title, tasks, nextStatus, onMove }: ColumnProps) {
    return (
        <section>
            <h2>{title}</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {task.title}

                        {/* Only show the button if this column has a next column */}
                        {nextStatus && (
                            <button onClick={() => onMove(task.id, nextStatus)}>Flytta →</button>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Column;
