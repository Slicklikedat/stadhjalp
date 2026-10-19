# Städhjälp – Project Plan

A Kanban board for a family to share household chores. Tasks can repeat every X days
and rotate between the family members chosen for that task.

Final project for the React course.

---

## 1. Decisions

| Topic | Decision |
|---|---|
| Repeat rule | A repeating task comes back to "Att göra" **X days after it was completed** |
| Rotation | Each time a task comes back, it is assigned to the **next person** in its rotation list |
| Language | UI text in **Swedish**, code (variables, functions, comments) in English |
| TypeScript | **Full TypeScript** (aiming for VG) – frontend in `.tsx`, backend in `.ts` |
| Frontend | React + Vite + TypeScript, deployed on **Vercel** |
| Backend | Node.js + Express + TypeScript, deployed on **Render** |
| Tests | **Jest** (required by the assignment) + React Testing Library |

---

## 2. Data model (TypeScript interfaces)

```ts
// A family member who can be assigned chores
interface FamilyMember {
  id: number;
  name: string;
  color: string; // used for the avatar/badge on cards
}

// The three Kanban columns
type TaskStatus = 'todo' | 'inProgress' | 'done';

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;

  // Rotation: the members who take turns, in order
  assigneeIds: number[];
  currentAssigneeIndex: number; // whose turn it is right now

  // Recurrence: null means a one-time task
  repeatEveryDays: number | null;
  completedAt: string | null; // ISO date, set when moved to "done"
  nextDueAt: string | null;   // ISO date, when it returns to "todo"

  createdAt: string;
}
```

### How recurrence works

1. A task is moved to **Klart** → the server sets `completedAt = now` and
   `nextDueAt = now + repeatEveryDays`.
2. Every time the frontend asks for tasks (`GET /api/tasks`), the server first runs
   `refreshRecurringTasks(tasks, now)`:
   - Every task with `status === 'done'` and `nextDueAt <= now` is moved back to `'todo'`
   - `currentAssigneeIndex` moves to the next person (wraps around to the first one)
   - `completedAt` and `nextDueAt` are reset
3. One-time tasks (`repeatEveryDays === null`) just stay in Klart.

This avoids needing a timer/cron job on the server – the check happens whenever data is read.

The date and rotation logic lives in **pure helper functions** (`addDays`, `getNextAssigneeIndex`,
`refreshRecurringTasks`) – easy to test with Jest and good to show in the presentation.

---

## 3. API endpoints (backend)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/members` | List family members |
| POST | `/api/members` | Add a family member |
| DELETE | `/api/members/:id` | Remove a family member |
| GET | `/api/tasks` | List tasks (runs the recurrence check first) |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task (title, rotation, interval…) |
| PATCH | `/api/tasks/:id/status` | Move a task to another column |
| DELETE | `/api/tasks/:id` | Delete a task |

All routes validate input and return `400` with an error message on bad data,
`404` when an id doesn't exist (same pattern as TaskMaster).

**Storage:** start with an in-memory array (like TaskMaster). Later: save to a JSON
file or a free database so data survives server restarts.

---

## 4. Folder structure

```
stadhjalp/
├── backend/
│   ├── src/
│   │   ├── server.ts          # Express app + start
│   │   ├── routes/            # tasks.ts, members.ts
│   │   ├── data/              # in-memory store / seed data
│   │   ├── utils/             # recurrence.ts (pure helpers)
│   │   └── types/             # Task, FamilyMember
│   └── tests/                 # Jest tests for utils
└── frontend/
    └── src/
        ├── components/        # Board, Column, TaskCard, TaskForm, MemberBadge…
        ├── pages/             # BoardPage, FamilyPage, NotFound
        ├── context/           # TasksContext, MembersContext
        ├── hooks/             # useTasks, useMembers
        ├── services/          # api.ts – all fetch calls
        ├── types/             # Task, FamilyMember
        ├── utils/             # date formatting ("om 3 dagar")
        ├── App.tsx            # routing
        └── main.tsx           # entry point
```

---

## 5. Component tree

```
App (routing)
├── Header (app name, nav: Tavla / Familj)
├── BoardPage
│   ├── TaskForm (create/edit a task – title, rotation members, repeat interval)
│   └── Board
│       └── Column ×3 (Att göra / Pågår / Klart)
│           └── TaskCard (title, whose turn, "kommer tillbaka om X dagar", move buttons)
└── FamilyPage
    ├── MemberForm
    └── MemberList
```

Moving cards: start with **buttons** ("← Flytta" / "Flytta →") – they work with the keyboard
out of the box. Drag-and-drop can be added later as an extra (e.g. `@dnd-kit`, which supports keyboard).

---

## 6. Build order

### Phase 1 – Core (G)
1. Set up backend (Express + TS) with members and tasks routes, in-memory data
2. Write recurrence helpers + Jest tests
3. Set up frontend (Vite + React + TS), `services/api.ts`
4. Board with three columns, fetch tasks, handle **loading / success / error**
5. Create a task (with rotation members and repeat interval)
6. Move tasks between columns, delete tasks
7. Family page – add/remove members
8. Responsive CSS, semantic HTML, keyboard navigation check
9. A few frontend tests (e.g. `TaskCard`, date formatting)
10. Deploy: backend → Render, frontend → Vercel

### Phase 2 – VG
11. Context API for tasks and members (no prop drilling)
12. `React.memo` on `TaskCard` + `useCallback`/`useMemo` so moving one card
    doesn't re-render the whole board
13. Strong typing for all props, hooks and functions
14. Third-party API in the backend (pick one):
    - **Email reminders** (e.g. Resend) – email the person whose turn it is
    - **Login** (e.g. Google OAuth) – each family has its own board
    - **Swedish holidays API** – show red days on the board
15. Persistent storage so data survives restarts

---

## 7. Open questions
- Which third-party API to use for VG?
- Should a task be shown as overdue ("försenad") if nobody does it for a long time (visual warning)?
- One family per app, or several families with login? (ties into the VG API choice)
