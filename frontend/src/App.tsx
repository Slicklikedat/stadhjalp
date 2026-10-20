// Import the two hooks we need from React
import { useEffect, useState } from 'react';

// Import the Task type from our shared types file
import type { Task, TaskStatus } from './types'

// Our own component for one Kanban column
import Column from './components/Column';

function App() {
  // tasks = the current list, setTasks = the function that changes it.
  // Starts as an empty list [] until the server answers.
  const [tasks, setTasks] = useState<Task[]>([]);

  // Runs once, after the component first appears on screen
  useEffect(() => {
    // Ask the backend for the task (a GET request, just like the browser does)
    fetch('http://localhost:5001/api/tasks')
    // Turn the answer from JSON text into a JavaScript array
    .then((response) => response.json())
    // Save the array in state -> React redraws the page with the tasks
    .then((data) => setTasks(data));
  }, []); // [] = only run once, not every redraw

  // Called by Column when a "Flytta ->" button is clicked.
  // For now it only logs. In part 2 it will talk to the server.
  function moveTask(taskId: number, newStatus: TaskStatus) {
    console.log('Move Task', taskId, 'to', newStatus);
  }

  return (
    <main>
      <h1>StädHjälp</h1>
      <p>Familjens städtavla</p>

      {/* Same component three times, with different props */}
      <Column title="Att göra" tasks={tasks.filter((task) => task.status === 'todo')} nextStatus="inProgress" onMove={moveTask} />
      <Column title="Pågår" tasks={tasks.filter((task) => task.status === 'inProgress')}nextStatus="done" onMove={moveTask} />
      <Column title="Klart" tasks={tasks.filter((task) => task.status === 'done')} onMove={moveTask} />

    </main>
  );
}

// Export the component so main.tsx can import and use it
export default App;