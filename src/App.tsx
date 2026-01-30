import { useEffect, useState } from 'react';
import { Share2, Plus } from 'lucide-react';
import { Header } from './components/Header';
import { EventForm } from './components/EventForm';
import { EventList } from './components/EventList';
import { ShareDialog } from './components/ShareDialog';
import { useCalendarStore, useThemeStore } from './store/calendar';
import { getCalendarFromUrl, setCalendarToUrl } from './utils/url';
import { isEncrypted } from './utils/crypto';
import type { CalendarEvent } from './types';

function App() {
  const { calendar, setCalendar, setTitle, addEvent, removeEvent } = useCalendarStore();
  const { dark } = useThemeStore();
  const [showForm, setShowForm] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  // Load calendar from URL on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      if (isEncrypted(hash)) {
        setNeedsPassword(true);
        setIsViewing(true);
      } else {
        const loaded = getCalendarFromUrl();
        if (loaded) {
          setCalendar(loaded);
          setIsViewing(true);
        }
      }
    }
  }, [setCalendar]);

  // Update URL when calendar changes (only in edit mode)
  useEffect(() => {
    if (!isViewing && calendar.events.length > 0) {
      setCalendarToUrl(calendar);
    }
  }, [calendar, isViewing]);

  const handleAddEvent = (event: CalendarEvent) => {
    addEvent(event);
    setShowForm(false);
  };

  const handleCreateNew = () => {
    window.location.href = '/';
  };

  if (needsPassword) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Header />
        <main className="max-w-lg mx-auto px-4 py-12 text-center">
          <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Protected Calendar
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This calendar is password protected. Enter the password to view.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Password protection is a Pro feature. Coming soon!
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero section for new users */}
        {!isViewing && calendar.events.length === 0 && !showForm && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Share calendars instantly
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Create events, get a link, share with anyone. No signup required.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Create Calendar
            </button>
          </div>
        )}

        {/* Calendar title input */}
        {!isViewing && (calendar.events.length > 0 || showForm) && (
          <div className="mb-6">
            <input
              type="text"
              value={calendar.title || ''}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Calendar title (optional)"
              className="w-full px-4 py-3 text-lg border-0 border-b-2 border-gray-200 dark:border-gray-700 bg-transparent focus:border-primary-500 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
        )}

        {/* Viewing mode header */}
        {isViewing && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {calendar.title || 'Shared Calendar'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {calendar.events.length} event{calendar.events.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Event form */}
        {showForm && !isViewing && (
          <div className="mb-6">
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
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Add Event
              </button>
            )}
            <button
              onClick={() => setShowShare(true)}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm transition-colors"
            >
              <Share2 size={20} className="mr-2" />
              Share Calendar
            </button>
          </div>
        )}

        {/* Create new button for viewers */}
        {isViewing && (
          <div className="mt-6 text-center">
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              <Plus size={16} className="mr-1" />
              Create your own calendar
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-500">
        <p>
          Powered by{' '}
          <a href="/" className="text-primary-600 hover:underline">
            LinkCal
          </a>
          {' · '}
          <a
            href="https://github.com/bayhax/linkcal"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Source
          </a>
        </p>
      </footer>

      {/* Share dialog */}
      {showShare && (
        <ShareDialog
          calendar={calendar}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}

export default App;
