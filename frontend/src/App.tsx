// Import the two hooks we need from React
import { useEffect, useState } from 'react';

// Import the Task type from our shared types file
import type { Task } from './types'

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
  return (
    <main>
      <h1>StädHjälp</h1>
      <p>Familjens städtavla</p>

      {/* Same component three times, with different props */}
      <Column title="Att göra" tasks={tasks.filter((task) => task.status === 'todo')} />
      <Column title="Pågår" tasks={tasks.filter((task) => task.status === 'inProgress')} />
      <Column title="Klart" tasks={tasks.filter((task) => task.status === 'done')} />

    </main>
  );
}

// Export the component so main.tsx can import and use it
export default App;