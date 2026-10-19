import express from 'express';

const app = express();
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
