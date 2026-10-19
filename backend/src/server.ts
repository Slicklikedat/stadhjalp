import express from 'express';

const app = express();
app.use(express.json());

const PORT = 5001;

interface Task {
      id: number;
      title: string;
      status: 'todo' | 'inProgress' | 'done';
}

const tasks: Task[] = [
    { id: 1, title: 'Damsuga vardagsrummet test', status: 'todo'},
    { id: 2, title: 'Tömma dismakskinen test', status: 'todo' },
];

app.get('/', (req, res) => {
    res.send('Välkommen till Städhjälp API!');
});

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hej från servern!' });
});

app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const title = req.body.title;
    if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Uppgiften måste ha en titel'});
    }

    const newTask: Task = {
        id: tasks.length + 1,
        title: req.body.title,
        status: 'todo',
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
