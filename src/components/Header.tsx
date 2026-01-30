import { Moon, Sun, Calendar } from 'lucide-react';
import { useThemeStore } from '../store/calendar';

export function Header() {
  const { dark, toggle } = useThemeStore();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center space-x-2">
          <Calendar className="text-primary-600" size={28} />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            LinkCal
          </span>
        </a>
        
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/bayhax/linkcal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
          >
            GitHub
          </a>
          
          <button
            onClick={toggle}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
