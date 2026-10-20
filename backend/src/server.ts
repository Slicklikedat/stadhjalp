// Import Express, which makes it easy to build a web server
import express from 'express';

// Create the server application
const app = express();

// Turn incoming JSON (e.g. from a POST) into an object we can use as req.body
app.use(express.json());

// The port the server listens on (5000 is taken by AirPlay on Mac)
const PORT = 5001;

// Describes what a task must look like.
// status can ONLY be one of the three columns (a union type).
interface Task {
    id: number;
    title: string;
    status: 'todo' | 'inProgress' | 'done';
}

// Our temporary "database": a list in memory.
// It resets every time the server restarts.
const tasks: Task[] = [
    { id: 1, title: 'Damsuga vardagsrummet test', status: 'todo' },
    { id: 2, title: 'Tömma dismakskinen test', status: 'todo' },
];

// The id the NEXT new task will get. Only goes up, never down, so an id is never reused, even after a task is deleted.
let nextId = 3;

// GET / → simple text to check that the server is running
app.get('/', (req, res) => {
    res.send('Välkommen till Städhjälp API!');
});

// GET /api/hello → test route that sends JSON
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hej från servern!' });
});

// GET /api/tasks → send the whole task list
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// POST /api/tasks → create a new task
app.post('/api/tasks', (req, res) => {
    const title = req.body.title;

    // Validation: stop if the title is missing or only spaces
    if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Uppgiften måste ha en titel' });
    }

    // Build the new task. New tasks always start in "todo".
    const newTask: Task = {
        id: nextId,
        title: title.trim(), // trim() removes extra spaces at the start/end
        status: 'todo',
    };

    tasks.push(newTask);

    // Move the counter up so the next task get a new id
    nextId = nextId + 1;

    // 201 = Created. Send the new task back.
    res.status(201).json(newTask);
});

// PATCH /api/tasks/:id/status → move a task to another column.
// GET reads, POST creates, PATCH changes part of something that already exists.
app.patch('/api/tasks/:id/status', (req, res) => {
    // :id in the URL arrives as text ("2"), so turn it into a number
    const id = Number(req.params.id);
    const status = req.body.status;

    // Find the task with that id (undefined if none matches)
    const task = tasks.find((task) => task.id === id);

    // 404 = Not Found
    if (!task) {
        return res.status(404).json({ error: 'Uppgiften hittades inte' });
    }

    // Only accept our three columns. 400 = Bad Request.
    if (status !== 'todo' && status !== 'inProgress' && status !== 'done') {
        return res.status(400).json({ error: 'Ogiltig status' });
    }

    // Change the task (find gives us the real task in the list, not a copy)
    task.status = status;
    res.json(task);
});

// DELETE /api/tasks/:id -> remove a task
app.delete('/api/tasks/:id', (req, res) => {
    // :id arrives as text, so turn it into a number
    const id = Number(req.params.id);

    // findIndex gives the task's POSITION in the list (or -1 if not found)
    const index = tasks.findIndex((task) => task.id === id);

    // -1 means no task has that id -> 404 Not Found
    if (index === -1) {
        return res.status(404).json({ error: 'Uppgiften hittades inte' });

    }

    // splice(index, 1) removes 1 item at that position from the list
    tasks.splice(index, 1);

    // 204 = No Content: "it worked, nothing to send back"
    res.status(204).end();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});