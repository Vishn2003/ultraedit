# TaskFlow Frontend

A modern task management system built with React, TypeScript, and shadcn/ui.

## Overview

TaskFlow is a full-featured project and task management frontend that connects to a json-server mock API. It features authentication, project management, task tracking with filtering, and a polished responsive UI.

**Tech Stack:**
- React 18 + TypeScript
- React Router v6 (protected routes)
- shadcn/ui component library
- Tailwind CSS
- Vite (build tool)
- json-server (mock API)
- Docker for deployment

## Architecture Decisions

- **Context + localStorage for auth**: Simple, no external state library needed. JWT stored in localStorage persists across refresh.
- **useApi hook**: Centralizes auth header injection and error handling. All API calls flow through one place.
- **Optimistic UI in TaskModal**: Tasks appear immediately on create/edit; reverted if the API call fails.
- **Component breakdown**: Pages own data-fetching state; components receive props and emit callbacks. Minimal prop-drilling.
- **shadcn/ui**: Copied components directly into `src/components/ui/` — no magic CLI needed, full control over styles.
- **Dark mode**: Persisted to localStorage, toggled via Navbar button, applies `dark` class to `<html>`.

**Tradeoffs / Left out:**
- No real JWT validation (json-server doesn't support it natively — login stores a mock token)
- No pagination (bonus feature omitted for time)
- No drag-and-drop (would use @dnd-kit)

## Running Locally

```bash
# 1. Clone the repo
git clone <repo-url>
cd ultraedit/taskflow-frontend

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env

# 4. Start mock API (in a separate terminal)
npx json-server --watch db.json --port 4000

# 5. Start dev server
npm run dev
# App runs at http://localhost:5173
```

**Or with Docker Compose:**
```bash
cd taskflow-frontend
docker-compose up --build
# Frontend: http://localhost:3000
# Mock API: http://localhost:4000
```

## Test Credentials

| Field    | Value              |
|----------|--------------------|
| Email    | test@example.com   |
| Password | password123        |

## API Reference

Base URL: `http://localhost:4000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | Login → { token, user } |
| POST | /auth/register | Register → { token, user } |
| GET | /projects | List all projects |
| POST | /projects | Create project |
| GET | /projects/:id | Get project |
| PATCH | /projects/:id | Update project |
| DELETE | /projects/:id | Delete project |
| GET | /projects/:id/tasks | List tasks (filter: status, assignee) |
| POST | /projects/:id/tasks | Create task |
| PATCH | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |

## What I'd Do With More Time

- **Real auth**: Implement JWT signing in a real backend (not json-server)
- **Drag-and-drop**: Use `@dnd-kit/core` for Kanban board view
- **Pagination**: Add cursor-based pagination for large task lists
- **Real-time updates**: WebSocket or polling for collaborative editing
- **Tests**: Vitest + React Testing Library for component tests
- **Error boundary**: Global error boundary component
- **Optimistic rollback UX**: Toast notification when optimistic update reverts
