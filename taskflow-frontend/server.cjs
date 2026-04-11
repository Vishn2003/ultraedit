/**
 * Custom mock API server for TaskFlow.
 * Wraps json-server to add auth endpoints and nested route support.
 *
 * Routes handled here (before json-server):
 *   POST /auth/register  – create user, return { token, user }
 *   POST /auth/login     – validate credentials, return { token, user }
 *   GET  /projects/:id/tasks  – proxy to GET /tasks?project_id=:id
 *   POST /projects/:id/tasks  – inject project_id, proxy to POST /tasks
 *
 * All other routes pass through to json-server.
 */

const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Allow CORS and parse JSON
server.use(middlewares);
server.use(jsonServer.bodyParser);

// ─── Auth: Register ───────────────────────────────────────────────────────────
server.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, and password are required' });
  }

  const db = router.db; // lowdb instance
  const existing = db.get('users').find({ email }).value();
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password, // plain-text fine for mock
    created_at: new Date().toISOString(),
  };
  db.get('users').push(newUser).write();

  const { password: _pw, ...safeUser } = newUser;
  return res.status(201).json({
    token: `mock-token-${newUser.id}`,
    user: safeUser,
  });
});

// ─── Auth: Login ──────────────────────────────────────────────────────────────
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const db = router.db;
  const user = db.get('users').find({ email, password }).value();
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const { password: _pw, ...safeUser } = user;
  return res.json({
    token: `mock-token-${user.id}`,
    user: safeUser,
  });
});

// ─── Nested: GET /projects/:id/tasks ─────────────────────────────────────────
server.get('/projects/:id/tasks', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  let tasks = db.get('tasks').filter({ project_id: id }).value();

  // Optional query filters: status, assignee_id
  const { status, assignee } = req.query;
  if (status) tasks = tasks.filter(t => t.status === status);
  if (assignee) tasks = tasks.filter(t => t.assignee_id === assignee);

  return res.json(tasks);
});

// ─── Nested: POST /projects/:id/tasks ────────────────────────────────────────
server.post('/projects/:id/tasks', (req, res) => {
  const { id } = req.params;
  const db = router.db;

  // Check project exists
  const project = db.get('projects').find({ id }).value();
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const now = new Date().toISOString();
  const newTask = {
    id: `task-${Date.now()}`,
    project_id: id,
    title: req.body.title || '',
    description: req.body.description || '',
    status: req.body.status || 'todo',
    priority: req.body.priority || 'medium',
    assignee_id: req.body.assignee_id ?? null,
    due_date: req.body.due_date || '',
    created_at: now,
    updated_at: now,
  };

  db.get('tasks').push(newTask).write();
  return res.status(201).json(newTask);
});

// ─── Pass everything else to json-server ─────────────────────────────────────
server.use(router);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`\nTaskFlow Mock API running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  POST /auth/login');
  console.log('  POST /auth/register');
  console.log('  GET  /projects');
  console.log('  POST /projects');
  console.log('  GET  /projects/:id');
  console.log('  GET  /projects/:id/tasks');
  console.log('  POST /projects/:id/tasks');
  console.log('  PATCH /tasks/:id');
  console.log('  DELETE /tasks/:id');
  console.log('  GET  /users\n');
});
