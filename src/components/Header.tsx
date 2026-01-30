import { Moon, Sun, Calendar, Sparkles } from 'lucide-react';
import { useThemeStore, useProStore } from '../store/calendar';

interface HeaderProps {
  showBranding?: boolean;
}

export function Header({ showBranding = true }: HeaderProps) {
  const { dark, toggle } = useThemeStore();
  const { isPro } = useProStore();

  // Hide branding if Pro user with branding disabled
  const shouldShowBranding = showBranding && (!isPro || true); // Always show for now

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50" />
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {shouldShowBranding ? (
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500/20 rounded-xl blur-lg group-hover:bg-primary-500/30 transition-colors" />
                <div className="relative flex items-center justify-center w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-soft">
                  <Calendar className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Link<span className="text-gradient">Cal</span>
              </span>
            </a>
          ) : (
            <div /> 
          )}

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {!isPro && (
              <a
                href="#upgrade"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Pro</span>
              </a>
            )}
            
            <a
              href="https://github.com/bayhax/linkcal"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>

            <button
              onClick={toggle}
              className="btn-icon"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {dark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
