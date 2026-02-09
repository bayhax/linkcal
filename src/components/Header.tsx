import { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Calendar, Sparkles, Crown, Key, LogOut, ChevronDown } from 'lucide-react';
import { useThemeStore, useProStore } from '../store/calendar';

interface HeaderProps {
  showBranding?: boolean;
  onActivateClick?: () => void;
}

export function Header({ showBranding = true, onActivateClick }: HeaderProps) {
  const { dark, toggle } = useThemeStore();
  const { isPro, proSettings, licenseKey, deactivateLicense } = useProStore();
  const [showProMenu, setShowProMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide branding if Pro user with branding disabled
  const shouldShowBranding = showBranding && (!isPro || !proSettings.hideBranding);

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out of Pro? You\'ll need to re-enter your License Key to restore it.')) {
      deactivateLicense();
      setShowProMenu(false);
    }
  };

  // Mask license key for display
  const maskedLicense = licenseKey 
    ? `${licenseKey.slice(0, 8)}...${licenseKey.slice(-4)}`
    : null;

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
              /* Pro Badge with dropdown */
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowProMenu(!showProMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                >
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Pro</span>
                  <ChevronDown className={`w-3 h-3 text-amber-500 transition-transform ${showProMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown menu */}
                {showProMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden animate-fade-in-down z-50">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Pro Activated</span>
                      </div>
                      {maskedLicense && (
                        <p className="text-xs text-gray-500 font-mono">{maskedLicense}</p>
                      )}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out of Pro
                    </button>
                  </div>
                )}
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
              href="/recruiters"
              className="hidden sm:flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              For Recruiters
            </a>
            
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
