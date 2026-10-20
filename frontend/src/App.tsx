// Import the two hooks we need from React
import { useEffect, useState } from 'react';

// The same shape as the Task interface in the backend
interface Task {
  id: number;
  title: string;
  status: 'todo' | 'inProgress' | 'done';
}

function App() {
  // task = the current list, setTasks = the function that changes it.
  // Starts as an empty list [] until the server answers.
  const [tasks, setTasks] = useState<Task[]>([]);

  // Runs once, after the component first appears on screen
  useEffect(() => {
    // Ask the backend for the task (a GET request, just like the browser does)
    fetch('http://localhost:5001/api/tasks')
    // Turn the answer from JSON text into a JavaScript array
    .then((response) => response.json())
    // Save teh array in state -> React redraws the page with the tasks
    .then((data) => setTasks(data));
  }, []); // [] = only run once, not every redraw
  return (
    <main>
      <h1>StädHjälp</h1>
      <p>Familjens städtavla</p>

      {/* Column 1: task with status "todo" */}
      <section>
        <h2>Att göra</h2>
        <ul>
          {tasks
          .filter((task) => task.status === 'todo')
          .map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      </section>

      {/* Column 2: tasks with tstatus "inProgress" */}
      <section>
        <h2>Pågår</h2>
        <ul>
          {tasks
          .filter((task) => task.status === 'inProgress')
          .map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      </section>
      
      {/* Column 3: tasks with status "done" */}
      <section>
        <h2>Klart</h2>
        <ul>
          {tasks
          .filter((task) => task.status === 'done')
          .map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

// Export the component so main.tsx can import and use it
export default App;