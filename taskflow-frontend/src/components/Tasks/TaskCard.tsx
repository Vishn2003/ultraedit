import type { Task, User } from '@/types';
import { Calendar, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  users: User[];
  onClick: (task: Task) => void;
}

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400',
};

const statusColors: Record<string, string> = {
  todo: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
  done: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400',
};

const statusLabels: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export function TaskCard({ task, users, onClick }: TaskCardProps) {
  const assignee = users.find(u => u.id === task.assignee_id);

  return (
    <div
      className="rounded-lg border bg-card p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(task)}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
        <span className={cn('text-xs rounded-full border px-2 py-0.5 shrink-0', priorityColors[task.priority])}>
          {task.priority}
        </span>
      </div>
      {task.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between mt-2">
        <span className={cn('text-xs rounded-full border px-2 py-0.5', statusColors[task.status])}>
          {statusLabels[task.status]}
        </span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {assignee && (
            <span className="flex items-center gap-1">
              <UserIcon className="h-3 w-3" />
              {assignee.name}
            </span>
          )}
          {task.due_date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
