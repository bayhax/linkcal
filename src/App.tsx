import { useEffect, useState } from 'react';
import { Share2, Plus, Calendar as CalendarIcon, Zap, Shield, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { EventForm } from './components/EventForm';
import { EventList } from './components/EventList';
import { ShareDialog } from './components/ShareDialog';
import { UpgradeDialog } from './components/UpgradeDialog';
import { PasswordDialog } from './components/PasswordDialog';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { useCalendarStore, useThemeStore, useProStore } from './store/calendar';
import { getCalendarFromUrl, checkLinkExpired } from './utils/url';
import { isEncrypted, decryptData } from './utils/crypto';
import type { CalendarEvent, Calendar as CalendarType } from './types';

function App() {
  const pathname = window.location.pathname;
  
  // Route to legal pages
  if (pathname === '/privacy') {
    return <Privacy />;
  }
  if (pathname === '/terms') {
    return <Terms />;
  }
  const { calendar, setCalendar, setTitle, addEvent, removeEvent, reset } = useCalendarStore();
  const { dark } = useThemeStore();
  const { isPro, checkAndVerifyLicense } = useProStore();
  const [showForm, setShowForm] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeTab, setUpgradeTab] = useState<'upgrade' | 'activate'>('upgrade');
  const [isViewing, setIsViewing] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [hideBranding, setHideBranding] = useState(false);

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  // Check and verify stored license on mount
  useEffect(() => {
    checkAndVerifyLicense();
  }, [checkAndVerifyLicense]);

  // Handle upgrade hash and checkout success
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    
    if (hash === '#upgrade') {
      setUpgradeTab('upgrade');
      setShowUpgrade(true);
    } else if (hash === '#activate') {
      setUpgradeTab('activate');
      setShowUpgrade(true);
    }
    
    // Handle checkout success from Creem
    if (params.get('checkout') === 'success') {
      setUpgradeTab('activate');
      setShowUpgrade(true);
    }
  }, []);

  // Load calendar from URL on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && hash !== 'upgrade' && hash !== 'activate') {
      if (isEncrypted(hash)) {
        setNeedsPassword(true);
        setIsViewing(true);
      } else {
        const loaded = getCalendarFromUrl();
        if (loaded) {
          // Check if link is expired
          if (checkLinkExpired(loaded)) {
            setIsExpired(true);
            setIsViewing(true);
            return;
          }
          setCalendar(loaded);
          setIsViewing(true);
          setHideBranding(loaded.pro?.hideBranding || false);
        }
      }
    }
  }, [setCalendar]);

  const handleAddEvent = (event: CalendarEvent) => {
    addEvent(event);
    setShowForm(false);
  };

  const handleCreateNew = () => {
    reset();
    window.location.href = '/';
  };

  const handlePasswordSubmit = (password: string) => {
    const hash = window.location.hash.slice(1);
    const encryptedPart = hash.slice(2); // Remove 'e:' prefix
    const decryptedJson = decryptData(encryptedPart, password);
    
    if (decryptedJson) {
      try {
        const loaded = JSON.parse(decryptedJson) as CalendarType;
        if (checkLinkExpired(loaded)) {
          setIsExpired(true);
          setNeedsPassword(false);
          return;
        }
        setCalendar(loaded);
        setNeedsPassword(false);
        setHideBranding(loaded.pro?.hideBranding || false);
      } catch {
        alert('Invalid password');
      }
    } else {
      alert('Invalid password');
    }
  };

  const handleShowActivate = () => {
    setUpgradeTab('activate');
    setShowUpgrade(true);
  };

  const handleCloseUpgrade = () => {
    setShowUpgrade(false);
    // Clean URL
    window.history.replaceState({}, '', window.location.pathname);
  };

  // Password dialog
  if (needsPassword) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <Header showBranding={!hideBranding} />
        <PasswordDialog onSubmit={handlePasswordSubmit} />
      </div>
    );
  }

  // Expired link
  if (isExpired) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="card p-8 text-center max-w-md animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Link Expired
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This calendar link has expired and is no longer accessible.
            </p>
            <button onClick={handleCreateNew} className="btn-primary">
              Create New Calendar
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Header 
        showBranding={!hideBranding} 
        onActivateClick={!isPro ? handleShowActivate : undefined}
      />
      
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero section for new users */}
        {!isViewing && calendar.events.length === 0 && !showForm && (
          <div className="text-center mb-12 animate-fade-in-up">
            {/* Decorative gradient */}
            <div className="absolute inset-x-0 top-20 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
              <div className="relative left-1/2 -translate-x-1/2 aspect-[1155/678] w-[36rem] bg-gradient-to-tr from-primary-300 to-purple-300 dark:from-primary-900 dark:to-purple-900 opacity-20" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              No signup required
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight text-balance">
              Share calendars
              <br />
              <span className="text-gradient">instantly</span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Create events, get a link, share with anyone. Your data stays in the URL—nothing stored on servers.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="btn-primary text-base px-5 sm:px-6 py-3 whitespace-nowrap"
            >
              <Plus className="w-5 h-5 flex-shrink-0" />
              Create Calendar
            </button>

            {/* Feature pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <Shield className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                Privacy-first
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <CalendarIcon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                Export to any calendar
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                Works forever
              </div>
            </div>

            {/* Pro teaser on hero */}
            {!isPro && (
              <button
                onClick={() => { setUpgradeTab('upgrade'); setShowUpgrade(true); }}
                className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/40 dark:to-purple-900/40 border border-primary-200 dark:border-primary-700/50 text-sm font-medium text-primary-700 dark:text-primary-300 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Pro: Password protect & more</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Calendar title input */}
        {!isViewing && (calendar.events.length > 0 || showForm) && (
          <div className="mb-8 animate-fade-in">
            <input
              type="text"
              value={calendar.title || ''}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Calendar title (optional)"
              className="input-borderless text-2xl font-semibold"
            />
          </div>
        )}

        {/* Viewing mode header */}
        {isViewing && (
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {calendar.title || 'Shared Calendar'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {calendar.events.length} event{calendar.events.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Event form */}
        {showForm && !isViewing && (
          <div className="mb-8">
            <EventForm
              onAdd={handleAddEvent}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Events list */}
        <EventList
          events={calendar.events}
          onRemove={isViewing ? undefined : removeEvent}
          readonly={isViewing}
        />

        {/* Action buttons */}
        {!isViewing && calendar.events.length > 0 && (
          <div className="mt-8 flex flex-row gap-2 sm:gap-3 animate-fade-in">
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-secondary flex-1 min-w-0"
              >
                <Plus className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Add Event</span>
              </button>
            )}
            <button
              onClick={() => setShowShare(true)}
              className="btn-primary flex-1 min-w-0"
            >
              <Share2 className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">Share</span>
            </button>
          </div>
        )}

        {/* Pro upsell for non-pro users with calendars */}
        {!isViewing && !isPro && calendar.events.length > 0 && (
          <button
            onClick={() => { setUpgradeTab('upgrade'); setShowUpgrade(true); }}
            className="mt-6 w-full p-4 rounded-2xl bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-950/30 dark:to-purple-950/30 border border-primary-200 dark:border-primary-800/50 flex items-center justify-between group hover:border-primary-300 dark:hover:border-primary-700 transition-colors animate-fade-in"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="text-left min-w-0">
                <p className="font-medium text-gray-900 dark:text-white">Upgrade to Pro</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Password protect, auto-expire & more</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </button>
        )}

        {/* Create new button for viewers */}
        {isViewing && (
          <div className="mt-8 text-center animate-fade-in">
            <button
              onClick={handleCreateNew}
              className="btn-ghost"
            >
              <Plus className="w-4 h-4" />
              Create your own calendar
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      {!hideBranding && (
        <footer className="py-8 text-center">
          <div className="divider mb-8" />
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Powered by{' '}
            <a href="/" className="font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              LinkCal
            </a>
            {' · '}
            <a
              href="https://github.com/bayhax/linkcal"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Source
            </a>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
            <a href="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Privacy Policy
            </a>
            {' · '}
            <a href="/terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Terms of Service
            </a>
          </p>
        </footer>
      )}

      {/* Dialogs */}
      {showShare && (
        <ShareDialog
          calendar={calendar}
          onClose={() => setShowShare(false)}
          onUpgradeClick={handleShowActivate}
        />
      )}
      
      {showUpgrade && (
        <UpgradeDialog 
          onClose={handleCloseUpgrade}
          initialTab={upgradeTab}
        />
      )}
    </div>
  );
}

export default App;
