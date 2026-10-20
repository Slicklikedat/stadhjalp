import type { Task } from '../types';

// Describes which prop Column expects to receive
interface ColumnProps {
    title: string; // The heading, e.g. "Att göra"
    tasks: Task[]; // Only the tasks that belong in this column

}

// { title, tasks } takes the props out of the props object ("destructuring")
function Column({ title, tasks }: ColumnProps) {
    return (
        <section>
            <h2>{title}</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </section>
    );
}

export default Column;