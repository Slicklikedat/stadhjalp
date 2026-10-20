// Import Express, which makes it easy to build a web server
import express from 'express';

// CORS let our React app (on another port) read answers from this server
import cors from 'cors';

// Create the server application
const app = express();

// Allow requests from other origins, like our frontend on port 5173
app.use(cors());

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
    assigneeIds: number[]; // The ids of the members who take turns, in order
    currentAssigneeIndex: number; // Position in assigneeIds of whose turn it is now

}

// Our temporary "database": a list in memory.
// It resets every time the server restarts.
const tasks: Task[] = [
    // Mamma (1) and Ella (3) take turns. It's Mamma's turn (position 0).
    { id: 1, title: 'Damsuga vardagsrummet test', status: 'todo', assigneeIds: [1, 3], currentAssigneeIndex: 0 },
    // Only Pappa (2) does this one
    { id: 2, title: 'Tömma dismakskinen test', status: 'todo', assigneeIds: [2], currentAssigneeIndex: 0 },
];

// The id the NEXT new task will get. Only goes up, never down, so an id is never reused, even after a task is deleted.
let nextId = 3;

// Describes what a family member must look like
interface FamilyMember {
    id: number;
    name: string;
    color: string; // A hex color like "#e76f51", used to show the person on cards
}

// Temporary list of family members ( resets when the server restarts)
const members: FamilyMember[] = [
    { id: 1, name: 'Mamma test', color: '#e75f51' },
    { id: 2, name: 'Pappa test', color: '#2a9d8f' },
    { id: 3, name: 'Ella test', color: '#e9c46a' },
];

// The id the NEXT new member will get (same idea as nextId for tasks)
let nextMemberId = 4;


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

    // Who takes turns. If nothing was sent, start with an empty list (nobody yet).
    const assigneeIds = req.body.assigneeIds || [];

    // Validation: must be a list, and every id must belong to a real family member
    const allMembersExist = Array.isArray(assigneeIds) && assigneeIds.every((id) => members.some((member) => member.id === id));

    if (!allMembersExist) {
        return res.status(400).json({ error: 'En vald familjemedlem finns inte' });
    }

    // Build the new task. New tasks always start in "todo".
    const newTask: Task = {
        id: nextId,
        title: title.trim(), // trim() removes extra spaces at the start/end
        status: 'todo',
        assigneeIds: assigneeIds, // The people who take turns
        currentAssigneeIndex: 0, // The first person in the list starts
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

// GET /api/members -> send all family members
app.get('/api/members', (req, res) => {
    res.json(members);
});

// POST /api/members -> add a family member
app.post('/api/members', (req, res) => {
    const name = req.body.name;
    const color = req.body.color;

    // Validation: a name is required (same check as task titles)
    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'namn krävs' });
    }

    const newMember: FamilyMember = {
        id: nextMemberId,
        name: name.trim(),
        // Use the color that was sent, or a default color if none was sent
        color: color || '#8e7dbe',
    };
    members.push(newMember);
    nextMemberId = nextMemberId + 1;

    // 201 = Created
    res.status(201).json(newMember);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});