// useState for the input text. FormEvent is the type of a form's submit event.
import { useState, type FormEvent } from 'react';
import type { FamilyMember } from '../types';

// TaskForm gets one prop: a function from App to call with the new title
interface TaskFormProps {
    members: FamilyMember[];
    onAdd: (title: string, assigneeIds: number[], repeatEveryDays: number | null) => void;

}

function TaskForm({ members, onAdd }: TaskFormProps) {
    // What the user has typed so far. Starts empty.
    const [title, setTitle] = useState('');

    // The ids of the ticked members, in the order they were ticked. That order becomes the order people take turns.
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Is this a repeating task? Ticked by default, since most chroes repeat.
    const [isRepeating, setIsRepeating] = useState(true);

    // How many days until it comes back. A string, because that's what <input> gives us.
    const [repeatDays, setRepeatDays] = useState('7');

    // An error message to show in the form or '' when there's none
    const [error, setError] = useState('');

    // Tick -> add the id to the end. Untick -> remove it.
    function toggleMember(memberId: number) {
        setSelectedIds((previousIds) =>
            previousIds.includes(memberId)
                ? previousIds.filter((id) => id !== memberId) // Already ticked -> remove
                : [...previousIds, memberId] // Not ticked -> add to the end
        );
    }

    // Runs when the form is submitted (button click OR Enter in the input)
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        // Stop the browser from reloading the page (its old default for forms)
        event.preventDefault();

        // Don't send empty title (the server checks too, but this is faster)
        if (!title.trim()) {
            setError('Skriv en titel');
            return;
        }

        // Turn the text "7" into the number 7
        const days = Number(repeatDays);

        // Same rule as the server: a whole number from 1 to 365
        if (isRepeating && (!Number.isInteger(days) || days < 1 || days > 365)) {
            setError('Antal dagar måste vara mellan 1 och 365');
            return;
            
        }

        // Everything OK: clear any old error
        setError('');

        // Tell App about the new task. Not repeating -> send null.
        onAdd(title, selectedIds, isRepeating ? days : null);

        // Clear the form so the next task can be added
        setTitle('');
        setSelectedIds([]);

        
        
        setSelectedIds([]);
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* htmlFor connects the label to the input with the same id */}
            <label htmlFor="task-title">Ny uppgift</label>

            {/* Controlled input: value comes from state, onChange updates state */}
            <input
                id="task-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            />

            {/* fieldset + legend group the checkboxes under one heading for screen readers*/}
            <fieldset>
                <legend>Vem turas om?</legend>

                {members.map((member) => (
                    //Wrapping the checkbox in a <label> makes the name clickable too
                    <label key={member.id}>
                        <input
                            type="checkbox"
                            // Ticked if this member's id is in selectedIds
                            checked={selectedIds.includes(member.id)}
                            onChange={() => toggleMember(member.id)}
                        />
                        {member.name}
                    </label>
                ))}
            </fieldset>

            {/* Checkbox: does this task repeat? */}
            <label>
                <input
                    type="checkbox"
                    checked={isRepeating}
                    onChange={(event) => setIsRepeating(event.target.checked)}
                />
                Återkommande
            </label>

            {/* Only ask "how many days" if the task repeats */}
            {isRepeating && (
                <div>
                    <label htmlFor="task-repeat-days">Kommer tillbaka efter</label>
                    <input
                        id="task-repeat-days"
                        type="number"
                        min={1}
                        max={365}
                        value={repeatDays}
                        onChange={(event) => setRepeatDays(event.target.value)}
                    />
                    <span> dagar</span>
                </div>
            )}

            {/* role="alert" makes screen readers read the error right away */}
            {error && <p role="alert">{error}</p>}

            {/* type="submit" makes this button submit the form */}
            <button type="submit">Lägg till</button>
        </form>
    );
}

export default TaskForm;