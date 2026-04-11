import { RegisterForm } from '@/components/Auth/RegisterForm';
import { CheckSquare } from 'lucide-react';

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <CheckSquare className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold">TaskFlow</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
