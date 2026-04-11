import { useState, useEffect } from 'react';
import type { Project } from '@/types';
import { ProjectList } from '@/components/Projects/ProjectList';
import { Navbar } from '@/components/Navbar';
import { useApi } from '@/hooks/useApi';
import { Loader2, AlertCircle } from 'lucide-react';

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { request } = useApi();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    request<{ projects: Project[] } | Project[]>('/projects')
      .then(data => {
        if (!cancelled) {
          const list = Array.isArray(data) ? data : data.projects;
          setProjects(list ?? []);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Failed to load projects');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [request]);

  const handleProjectCreated = (project: Project) => {
    setProjects(prev => [project, ...prev]);
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
        ) : (
          <ProjectList projects={projects} onProjectCreated={handleProjectCreated} />
        )}
      </main>
    </div>
  );
}
