// Import the two hooks we need from React
import { useEffect, useState } from 'react';

// Import the Task type from our shared types file
import type { Task, TaskStatus } from './types'

// Our own component for one Kanban column
import Column from './components/Column';

// Form for creating new tasks
import TaskForm from './components/TaskForm';

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
  function moveTask(taskId: number, newStatus: TaskStatus) {
    // 1. Send a PATCH to the server, like we did with curl.
    // The task id goes in the URL; the new status goes in the body.
    fetch(`http://localhost:5001/api/tasks/${taskId}/status`, {
      method: 'PATCH',  //curl's -X PATCH
      headers: { 'Content-Type': 'application/json' }, //curl's -H "Content-Type:..."
      body: JSON.stringify({ status: newStatus }), // curl's -d '{"status":"..."}'
    })
    // The server answers with the update task
    .then((response) => response.json())
    .then((updatedTask: Task) => {
      // 2. Update our list: swap the old version of the task for the new one
      setTasks((previousTasks) =>
      previousTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    });

  }

  // Called by TaskForm when the form is submitted.
  // for now it only logs. In part 2 it will talk to the server
  function addTask(title: string) {
    // 1. Send a POST to the server with the title, like our curl test
    fetch('http://localhost:5001/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body:JSON.stringify({ title: title }),
    })
    // The server answers with the new task, including the id it chose
    .then((response) => response.json())
    .then((newTask: Task) => {
      // 2. Add the new task to the END of our list.
      // [...previousTasks, newTask] = a NEW list: all old tasks + the new one
      setTasks((previousTasks) => [...previousTasks, newTask]);
    });

  }

  return (
    <main>
      <h1>StädHjälp</h1>
      <p>Familjens städtavla</p>
      
      <TaskForm onAdd={addTask} />

      {/* Same component three times, with different props */}
      <Column title="Att göra" tasks={tasks.filter((task) => task.status === 'todo')} nextStatus="inProgress" onMove={moveTask} />
      <Column title="Pågår" tasks={tasks.filter((task) => task.status === 'inProgress')}nextStatus="done" onMove={moveTask} />
      <Column title="Klart" tasks={tasks.filter((task) => task.status === 'done')} onMove={moveTask} />

    </main>
  );
}

// Export the component so main.tsx can import and use it
export default App;