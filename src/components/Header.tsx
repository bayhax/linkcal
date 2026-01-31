import { Moon, Sun, Calendar, Sparkles, Crown, Key } from 'lucide-react';
import { useThemeStore, useProStore } from '../store/calendar';

interface HeaderProps {
  showBranding?: boolean;
  onActivateClick?: () => void;
}

export function Header({ showBranding = true, onActivateClick }: HeaderProps) {
  const { dark, toggle } = useThemeStore();
  const { isPro, proSettings } = useProStore();

  // Hide branding if Pro user with branding disabled
  const shouldShowBranding = showBranding && (!isPro || !proSettings.hideBranding);

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
            {isPro ? (
              /* Pro Badge */
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <Crown className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Pro</span>
              </div>
            ) : (
              /* Upgrade buttons */
              <>
                <a
                  href="#upgrade"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden xs:inline">Pro</span>
                </a>
                {onActivateClick && (
                  <button
                    onClick={onActivateClick}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title="Enter license key"
                  >
                    <Key className="w-4 h-4" />
                  </button>
                )}
              </>
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
