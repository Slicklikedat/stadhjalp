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
                        <li key={task.id}>
                            {task.title}
                            {/* Show whose turn it is, or "Ingen vald" if nobody is assigned */}
                            <span> · Tur: {currentMember ? currentMember.name : 'Ingen vald'}</span>
                            
                            {/* How often it repeats, e.g. "Upprepas efter 7 dagar"*/}
                            <span> · {formatRepeat(task.repeatEveryDays)}</span> 
                            
                            {/* Only for done tasks that will come back: when */}
                            {task.status === 'done' && task.nextDueAt && (
                                <span> · {formatReturnsIn(task.nextDueAt, new Date())} </span>

                            )}
                            {/* Only show the button if this column has a next column */}
                            {nextStatus && (
                                <button onClick={() => onMove(task.id, nextStatus)}>Flytta →</button>
                            )}

                            {/* Every task can be deleted, in every column */}
                            <button onClick={() => onDelete(task.id)}>Ta bort</button>
                        </li>
                    )
                }
                )}
            </ul>
        </section>
    );
}

export default Column;
