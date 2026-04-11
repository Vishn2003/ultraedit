import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Project, Task, User } from '@/types';
import { ProjectDetail } from '@/components/Projects/ProjectDetail';
import { Navbar } from '@/components/Navbar';
import { useApi } from '@/hooks/useApi';
import { Loader2, AlertCircle } from 'lucide-react';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { request } = useApi();

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError('');

    Promise.all([
      request<Project & { tasks?: Task[] }>(`/projects/${id}`),
      request<{ tasks: Task[] } | Task[]>(`/projects/${id}/tasks`),
      request<User[]>('/users'),
    ])
      .then(([projectData, tasksData, usersData]) => {
        if (cancelled) return;
        setProject(projectData);
        const taskList = Array.isArray(tasksData) ? tasksData : tasksData.tasks;
        setTasks(taskList ?? []);
        setUsers(Array.isArray(usersData) ? usersData : []);
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Failed to load project');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id, request]);

  const handleTaskSaved = (savedTask: Task) => {
    setTasks(prev => {
      const idx = prev.findIndex(t => t.id === savedTask.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedTask;
        return next;
      }
      return [savedTask, ...prev];
    });
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-4 text-destructive max-w-md mx-auto">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        ) : project ? (
          <ProjectDetail
            project={project}
            tasks={tasks}
            users={users}
            onTaskSaved={handleTaskSaved}
            onTaskDeleted={handleTaskDeleted}
          />
        ) : null}
      </main>
    </div>
  );
}
