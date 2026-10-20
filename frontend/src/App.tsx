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

      {/*.map turns each task into an <li>. key helps React keep track of them.*/}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </main>
  );
}

// Export the component so main.tsx can import and use it
export default App;