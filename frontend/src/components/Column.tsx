import type { Task, TaskStatus, FamilyMember } from '../types';

// Turns number and dates into Swedish text for the cards
import { formatRepeat, formatReturnsIn } from '../utils/dateFormat';

// Describes which props Column expects to receive
interface ColumnProps {
    title: string;           // The heading, e.g. "Att göra"
    tasks: Task[];           // Only the tasks that belong in this column
    nextStatus?: TaskStatus; // Where "Flytta →" moves tasks. The ? means optional: Klart has no next column
    members: FamilyMember[]; // All family members, to look up names from ids
    onMove: (taskId: number, newStatus: TaskStatus) => void; // Function from App, called on click
    onDelete: (taskId: number) => void; // Function from app, called when "Ta bort" is clicked
}


// { title, tasks } takes the props out of the props object ("destructuring")
function Column({ title, tasks, members, nextStatus, onMove, onDelete }: ColumnProps) {
    return (
        <section>
            <h2>{title}</h2>
            <ul>
                {tasks.map((task) => {
                    // Step 1: the id of the person whose turn it is
                    const currentId = task.assigneeIds[task.currentAssigneeIndex];
                    // Step 2: find that person among all members (undefined if nobody)
                    const currentMember = members.find((member) => member.id === currentId);
                    return (
                        <li key={task.id} className="task-card">
                            {/* The task's title as a small heading */}
                            <h3>{task.title}</h3>

                            {/* Each detail on its own line */}
                            <p>Tur: {currentMember ? currentMember.name : 'Ingen vald'}</p>
                            <p>{formatRepeat(task.repeatEveryDays)}</p>

                            {/* Only for done tasks that will come back: when */}
                            {task.status === 'done' && task.nextDueAt && (
                                <p className="task-returns">{formatReturnsIn(task.nextDueAt, new Date())}</p>
                            )}

                            {/* The buttons grouped together, so CSS can lay them out in a row */}
                            <div className="task-actions">
                                {nextStatus && (
                                    <button onClick={() => onMove(task.id, nextStatus)}>Flytta →</button>
                                )}
                                <button onClick={() => onDelete(task.id)}>Ta bort</button>
                            </div>
                        </li>
                    )
                }
                )}
            </ul>
        </section>
    );
}

export default Column;
