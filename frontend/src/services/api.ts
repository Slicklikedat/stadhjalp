// All communication with the backend lives in this file.
// Components call these functions and never use fetch directly.
import type { Task, TaskStatus, FamilyMember} from '../types';

// The server's address, written in ONE place
const API_URL = 'http://localhost:5001/api';

// GET /api/tasks → all tasks
export function getTasks(): Promise<Task[]> {
  return fetch(`${API_URL}/tasks`).then((response) => {
    // Turn an error status (404, 500...) into a real error
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });
}

// POST /api/tasks → create a task, get the new task back
export function createTask(title: string): Promise<Task> {
  return fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title }),
  }).then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });
}

// PATCH /api/tasks/:id/status → move a task, get the updated task back
export function updateTaskStatus(taskId: number, status: TaskStatus): Promise<Task> {
  return fetch(`${API_URL}/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: status }),
  }).then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });
}


export function deleteTask(taskId: number): Promise<void> {
    return fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
    }).then((response) => {
        if (!response.ok) throw new Error (`HTTP ${response.status}`);
    });
}


// GET /api/members -> all family members
export function getMembers(): Promise<FamilyMember[]> {
  return fetch(`${API_URL}/members`).then((response) => {
    // Turn an error status (404, 500...) into a real error
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });
}