import type { Project, Task, User } from '@/types';
import { TaskList } from '@/components/Tasks/TaskList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectDetailProps {
  project: Project;
  tasks: Task[];
  users: User[];
  onTaskSaved: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export function ProjectDetail({ project, tasks, users, onTaskSaved, onTaskDeleted }: ProjectDetailProps) {
  const navigate = useNavigate();

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate('/projects')} className="mb-4 gap-1">
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Button>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        {project.description && (
          <p className="text-muted-foreground mt-1">{project.description}</p>
        )}
      </div>
      <TaskList
        tasks={tasks}
        users={users}
        projectId={project.id}
        onTaskSaved={onTaskSaved}
        onTaskDeleted={onTaskDeleted}
      />
    </div>
  );
}
