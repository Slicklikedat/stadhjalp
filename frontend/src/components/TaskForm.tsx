// useState for the input text. FormEvent is the type of a form's submit event.
import { useState, type FormEvent } from 'react';

// TaskForm gets one prop: a function from App to call with the new title
interface TaskFormProps {
    onAdd: (title: string) => void;

}

function TaskForm({ onAdd }: TaskFormProps) {
    // What the user has typed so far. Starts empty.
    const [title, setTitle] = useState('');

    // Runs when the form is submitted (button click OR Enter in the input)
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        // Stop the browser from reloading the page (its old default for forms)
        event.preventDefault();

        // Don't send pemty titles (the server checks too, but this is faster)
        if (!title.trim()) return;

        // Tell App about the new title
        onAdd(title);

        // Clear the input so the next task can be typed
        setTitle('');
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Controlled input: value comes from state, onChange updates state */}
            <input
            id="task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            />

            {/* type="submit" makes this button submit the form */}
            <button type="submit">Lägg till</button>
        </form>
    );
}

export default TaskForm;