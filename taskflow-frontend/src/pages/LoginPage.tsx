import { LoginForm } from '@/components/Auth/LoginForm';
import { CheckSquare } from 'lucide-react';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <CheckSquare className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold">TaskFlow</h1>
          <p className="text-muted-foreground">Manage your projects and tasks</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
