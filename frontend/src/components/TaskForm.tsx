// useState for the input text. FormEvent is the type of a form's submit event.
import { useState, type FormEvent } from 'react';
import type { FamilyMember } from '../types';

// TaskForm gets one prop: a function from App to call with the new title
interface TaskFormProps {
    members: FamilyMember[];
    onAdd: (title: string, assigneeIds: number[]) => void;

}

function TaskForm({ members, onAdd }: TaskFormProps) {
    // What the user has typed so far. Starts empty.
    const [title, setTitle] = useState('');

    // The ids of the ticked members, in the order they were ticked. That order becomes the order people take turns.
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

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

        // Don't send empty titles (the server checks too, but this is faster)
        if (!title.trim()) return;

        // Tell App about the new title
        onAdd(title, selectedIds);

        // Clear the input so the next task can be typed
        setTitle('');
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


            {/* type="submit" makes this button submit the form */}
            <button type="submit">Lägg till</button>
        </form>
    );
}

export default TaskForm;