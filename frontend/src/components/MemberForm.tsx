// useState for the inputs. FormEvent is the type of a form's submit event.
import { useState, type FormEvent } from 'react';

// MemberForm gets one prop: a function from App to call with the new member's info
interface MemberFormProps {
    onAdd: (name: string, color: string) => void;
}

function MemberForm({ onAdd }: MemberFormProps) {
    // What the user has typed in the name field
    const [name, setName] = useState('');

    // The chosen color. <input type="color"> always gives a hex code like "#2a9d8f".
    const [color, setColor] = useState('#2a9d8f');

    // An error message to show, or '' when there's none
    const [error, setError] = useState('');

    // Runs when the form is submitted (button click OR Enter)
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        // Stop the browser from reloading the page
        event.preventDefault();

        // A name is required
        if (!name.trim()) {
            setError('Skriv ett namn');
            return;
        }

        setError('');

        // Tell App about the new member
        onAdd(name, color);

        // Clear the name field (keep the color, in case they add several)
        setName('');
    }

    return (
        <form onSubmit={handleSubmit} className="member-form">
            {/* Name field */}
            <label htmlFor="member-name">Namn</label>
            <input
                id="member-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
            />

            {/* Color picker: the browser shows a color square that opens a picker */}
            <label htmlFor="member-color">Färg</label>
            <input
                id="member-color"
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
            />

            <button type="submit">Lägg till</button>

            {/* role="alert" makes screen readers read the error right away */}
            {error && <p role="alert">{error}</p>}
        </form>
    );
}

export default MemberForm;