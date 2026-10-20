// Import the two hooks we need from React
import { useEffect, useState } from 'react';

// Import the Task type from our shared types file
import type { Task, TaskStatus } from './types'

// Our own component for one Kanban column
import Column from './components/Column';

// Form for creating new tasks
import TaskForm from './components/TaskForm';

// All server communication goes through these functions
import { getTasks, createTask, updateTaskStatus, deleteTask } from './services/api';


function App() {
  // tasks = the current list, setTasks = the function that changes it.
  // Starts as an empty list [] until the server answers.
  const [tasks, setTasks] = useState<Task[]>([]);

  // True while we wait for the server's first answer
  const [loading, setLoading] = useState(true);
  // An error message to show, or null when everything is fine
  const [error, setError] = useState<string | null>(null);

  // Runs once, after the component first appears on screen
  useEffect(() => {

    // Ask the server for all tasks (teh details live in services/api.ts)
    getTasks()
    // Success: save the tasks
    .then((data: Task[]) => setTasks(data))
    // Error: anything that went wrong above ends up here
    .catch(() => setError('Kunde inte hämta uppgifterna. Är servern igång?'))
    // Runs last, whether it worked or not: we're done loading
    .finally(() => setLoading(false));
  }, []); // [] = only run once, not on every redraw

  // Called by Column when a "Flytta ->" button is clicked.
  function moveTask(taskId: number, newStatus: TaskStatus) {
    // Tell the server, then swap teh old version of the task for the updated one
    updateTaskStatus(taskId, newStatus)
    .then((updatedTask) => {
      setTasks((previousTasks) =>
      previousTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  })
  // If the server couldn't be reached or said no, tell the user
  .catch(() => alert ('Kunde inte flytta uppgiften.'));
}

  // Called by TaskForm when the form is submitted.
  function addTask(title: string) {
    // Tell the server, then add the new task (with the id the server chose) to our list
    createTask(title)
    .then((newTask) => {
      setTasks((previousTasks) => [...previousTasks, newTask]);
    })
    // If the server couldn't be reached or said no, tell the user
    .catch(() => alert('Kunde inte skapa uppgiften.'));
  }

// Called by Column when a "Ta bort" button is clicked
function removeTask(taskId: number) {
  // Tell the server to delete the task
  deleteTask(taskId)
  .then(() => {
    // Keep every task except the one we deleted
    setTasks((previousTasks) =>
    previousTasks.filter((task) => task.id !== taskId)
  );
})
  // if the server couldn't be reached or said no, tell teh user
  .catch(() => alert('Kunde inte ta bort uppgiften.'));
}

  return (
    <main>
      <h1>StädHjälp</h1>
      <p>Familjens städtavla</p>
      {/* Loading: shown until the first answer arrives */}
      {loading && <p>Laddar uppgifter...</p>}

      {/* Error: role="alert" makes screen readers read it out right away*/}
      {error && <p role="alert">{error}</p>}

      {/* Success: only show the board when we're done and nothing went wrong*/}
      {!loading && !error && (
        <>
        <TaskForm onAdd={addTask} />

        {/* Same component three times, with different props */}
        <Column title="Att göra" tasks={tasks.filter((task) => task.status === 'todo')} nextStatus="inProgress" onMove={moveTask} onDelete={removeTask} />
        <Column title="Pågår" tasks={tasks.filter((task) => task.status === 'inProgress')} nextStatus="done" onMove={moveTask} onDelete={removeTask} />
        <Column title="Klart" tasks={tasks.filter((task) => task.status === 'done')} onMove={moveTask} onDelete={removeTask} />
        </>
      )}


    </main>
  );
}

// Export the component so main.tsx can import and use it
export default App;