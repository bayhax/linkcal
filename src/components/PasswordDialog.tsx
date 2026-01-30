import { useState, useRef, useEffect } from 'react';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface PasswordDialogProps {
  onSubmit: (password: string) => void;
}

export function PasswordDialog({ onSubmit }: PasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    
    setIsLoading(true);
    // Small delay for UX
    setTimeout(() => {
      onSubmit(password);
      setIsLoading(false);
    }, 300);
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-md animate-fade-in-up">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Protected Calendar
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This calendar is password protected. Enter the password to view.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="input pr-12"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={!password.trim() || isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Unlock Calendar</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Help text */}
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Ask the calendar owner for the password if you don't have it.
        </p>
      </div>
    </main>
  );
}
