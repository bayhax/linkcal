import { useEffect, useState } from 'react';
import { format, addMinutes } from 'date-fns';
import {
  Clock,
  Plus,
  Trash2,
  Share2,
  MapPin,
  AlignLeft,
  CheckCircle2,
  Calendar as CalendarIcon,
  ArrowRight,
  Copy,
  Check,
  Download,
  Sparkles,
  X,
  ChevronDown,
  Mail,
  Link2,
} from 'lucide-react';
import { Header } from '../components/Header';
import type { TimePickerData, CalendarEvent } from '../types';
import {
  getTimePickerFromUrl,
  generateTimePickerUrl,
  generateTimePickerConfirmUrl,
  checkTimePickerExpired,
} from '../utils/url';
import { isEncrypted, decryptData } from '../utils/crypto';
import { generateIcsDataUrl, generateGoogleCalendarUrl, generateOutlookUrl } from '../utils/export';
import { useProStore, useThemeStore } from '../store/calendar';
import { PasswordDialog } from '../components/PasswordDialog';

type ViewMode = 'create' | 'select' | 'confirm' | 'expired';

const DURATION_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

export function TimePicker() {
  const { dark } = useThemeStore();
  const { isPro, proSettings, checkAndVerifyLicense } = useProStore();

  const [viewMode, setViewMode] = useState<ViewMode>('create');
  const [pickerData, setPickerData] = useState<TimePickerData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [hideBranding, setHideBranding] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState(60);
  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  const [showOptional, setShowOptional] = useState(false);

  // New time option inputs
  const [newDate, setNewDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newTime, setNewTime] = useState('09:00');

  // Share dialog state
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedConfirm, setCopiedConfirm] = useState(false);

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  // Check license
  useEffect(() => {
    checkAndVerifyLicense();
  }, [checkAndVerifyLicense]);

  // Load from URL
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      if (isEncrypted(hash.split('&')[0])) {
        setNeedsPassword(true);
        return;
      }

      const { data, selectedIndex: sel } = getTimePickerFromUrl();
      if (data) {
        if (checkTimePickerExpired(data)) {
          setViewMode('expired');
          return;
        }
        setPickerData(data);
        setHideBranding(data.pro?.hideBranding || false);
        if (sel !== null && sel >= 0 && sel < data.opts.length) {
          setSelectedIndex(sel);
          setViewMode('confirm');
        } else {
          setViewMode('select');
        }
      }
    }
  }, []);

  const handlePasswordSubmit = (password: string) => {
    const hash = window.location.hash.slice(1);
    const dataHash = hash.split('&')[0];
    const encryptedPart = dataHash.slice(2);
    const decryptedJson = decryptData(encryptedPart, password);

    if (decryptedJson) {
      try {
        const loaded = JSON.parse(decryptedJson) as TimePickerData;
        if (checkTimePickerExpired(loaded)) {
          setViewMode('expired');
          setNeedsPassword(false);
          return;
        }
        setPickerData(loaded);
        setHideBranding(loaded.pro?.hideBranding || false);
        setNeedsPassword(false);

        // Check for selection
        const selMatch = hash.match(/&sel=(\d+)/);
        if (selMatch) {
          const sel = parseInt(selMatch[1], 10);
          if (sel >= 0 && sel < loaded.opts.length) {
            setSelectedIndex(sel);
            setViewMode('confirm');
            return;
          }
        }
        setViewMode('select');
      } catch {
        alert('Invalid password');
      }
    } else {
      alert('Invalid password');
    }
  };

  const addTimeOption = () => {
    const datetime = `${newDate}T${newTime}`;
    if (!timeOptions.includes(datetime)) {
      setTimeOptions([...timeOptions, datetime].sort());
    }
    // Increment time for next add
    const nextTime = addMinutes(new Date(`${newDate}T${newTime}`), duration);
    setNewTime(format(nextTime, 'HH:mm'));
  };

  const removeTimeOption = (index: number) => {
    setTimeOptions(timeOptions.filter((_, i) => i !== index));
  };

  const handleCreatePicker = () => {
    if (timeOptions.length < 2) {
      alert('Please add at least 2 time options');
      return;
    }

    const data: TimePickerData = {
      v: 2,
      mode: 'pick',
      title,
      desc: description || undefined,
      loc: location || undefined,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dur: duration,
      opts: timeOptions,
    };

    setPickerData(data);
    setShowShare(true);
  };

  const handleConfirmSelection = () => {
    if (selectedIndex === null || !pickerData) return;
    
    const confirmUrl = generateTimePickerConfirmUrl(pickerData, selectedIndex);
    window.history.replaceState(null, '', confirmUrl);
    setViewMode('confirm');
  };

  const handleCopyUrl = async () => {
    if (!pickerData) return;
    const url = generateTimePickerUrl(pickerData, proSettings);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyConfirmUrl = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopiedConfirm(true);
    setTimeout(() => setCopiedConfirm(false), 2000);
  };

  const generateNotifyEmail = () => {
    if (!pickerData || selectedIndex === null) return '';
    const event = getSelectedEvent();
    if (!event) return '';
    
    const subject = encodeURIComponent(`Time Confirmed: ${pickerData.title}`);
    const dateStr = format(new Date(event.start), 'EEEE, MMMM d, yyyy');
    const timeStr = `${format(new Date(event.start), 'h:mm a')} - ${format(new Date(event.end!), 'h:mm a')}`;
    const body = encodeURIComponent(
      `Hi,\n\nI've confirmed my time for "${pickerData.title}":\n\n` +
      `📅 ${dateStr}\n` +
      `🕐 ${timeStr}\n` +
      (pickerData.loc ? `📍 ${pickerData.loc}\n` : '') +
      `\nConfirmation link: ${window.location.href}\n\n` +
      `Looking forward to it!`
    );
    return `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCreateNew = () => {
    window.location.href = '/pick';
  };

  // Generate event from selected option
  const getSelectedEvent = (): CalendarEvent | null => {
    if (!pickerData || selectedIndex === null) return null;
    const startTime = pickerData.opts[selectedIndex];
    const endTime = format(addMinutes(new Date(startTime), pickerData.dur), "yyyy-MM-dd'T'HH:mm:ss");
    
    return {
      id: crypto.randomUUID(),
      title: pickerData.title,
      start: startTime,
      end: endTime,
      description: pickerData.desc,
      location: pickerData.loc,
    };
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

  // Expired view
  if (viewMode === 'expired') {
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
              This time picker link has expired and is no longer accessible.
            </p>
            <button onClick={handleCreateNew} className="btn-primary">
              Create New Time Picker
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Confirmation view
  if (viewMode === 'confirm' && pickerData && selectedIndex !== null) {
    const event = getSelectedEvent();
    if (!event) return null;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <Header showBranding={!hideBranding} />
        <main className="flex-1 w-full max-w-lg mx-auto px-4 py-8 sm:py-12">
          <div className="card p-6 sm:p-8 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Time Confirmed!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You've selected the following time for:
            </p>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-left mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {pickerData.title}
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{format(new Date(event.start), 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end!), 'h:mm a')}
                  </span>
                </div>
                {pickerData.loc && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{pickerData.loc}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Add to your calendar:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
              <a
                href={generateGoogleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                Google
              </a>
              <a
                href={generateOutlookUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                Outlook
              </a>
              <a
                href={generateIcsDataUrl(event)}
                download={`${pickerData.title}.ics`}
                className="btn-secondary text-sm"
              >
                <Download className="w-4 h-4" />
                .ics
              </a>
            </div>

            {/* Notify Organizer Section */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Let the organizer know:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={generateNotifyEmail()}
                  className="btn-primary text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </a>
                <button
                  onClick={handleCopyConfirmUrl}
                  className={`btn-secondary text-sm ${copiedConfirm ? '!bg-emerald-500 !text-white !border-emerald-500' : ''}`}
                >
                  {copiedConfirm ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                  {copiedConfirm ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            <button onClick={handleCreateNew} className="btn-ghost text-sm">
              <Plus className="w-4 h-4" />
              Create your own time picker
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Selection view
  if (viewMode === 'select' && pickerData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <Header showBranding={!hideBranding} />
        <main className="flex-1 w-full max-w-lg mx-auto px-4 py-8 sm:py-12">
          <div className="animate-fade-in-up">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {pickerData.title}
            </h1>
            {pickerData.desc && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">{pickerData.desc}</p>
            )}
            {pickerData.loc && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <MapPin className="w-4 h-4" />
                <span>{pickerData.loc}</span>
              </div>
            )}

            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select a time ({pickerData.dur} min):
            </p>

            <div className="space-y-2 mb-6">
              {pickerData.opts.map((opt, index) => {
                const startTime = new Date(opt);
                const endTime = addMinutes(startTime, pickerData.dur);
                const isSelected = selectedIndex === index;

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {format(startTime, 'EEEE, MMMM d')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                        </p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleConfirmSelection}
              disabled={selectedIndex === null}
              className="btn-primary w-full"
            >
              <CheckCircle2 className="w-5 h-5" />
              Confirm Selection
            </button>

            <div className="mt-6 text-center">
              <button onClick={handleCreateNew} className="btn-ghost text-sm">
                <Plus className="w-4 h-4" />
                Create your own time picker
              </button>
            </div>
          </div>
        </main>

        {!hideBranding && (
          <footer className="py-8 text-center">
            <div className="border-t border-gray-200 dark:border-gray-800 mb-8" />
            <p className="text-sm text-gray-500">
              Powered by{' '}
              <a href="/" className="font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600">
                LinkCal
              </a>
            </p>
          </footer>
        )}
      </div>
    );
  }

  // Create view (default)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="animate-fade-in-up">
          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
              <Clock className="w-4 h-4" />
              Time Picker
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Let them <span className="text-gradient">pick a time</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Create multiple time options. Share the link. They pick one. Done.
            </p>
          </div>

          {/* Form */}
          <div className="card p-6">
            {/* Title */}
            <div className="mb-5">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title (e.g., Interview - John Smith)"
                className="input-borderless text-xl font-medium placeholder:font-normal"
                required
              />
            </div>

            {/* Duration */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                <Clock className="w-4 h-4" />
                Duration
              </label>
              <div className="relative">
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="input appearance-none pr-10"
                >
                  {DURATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Time Options */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                <CalendarIcon className="w-4 h-4" />
                Time Options ({timeOptions.length} added)
              </label>

              {/* Added options */}
              {timeOptions.length > 0 && (
                <div className="space-y-2 mb-4">
                  {timeOptions.map((opt, index) => {
                    const startTime = new Date(opt);
                    const endTime = addMinutes(startTime, duration);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {format(startTime, 'EEE, MMM d')}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTimeOption(index)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add new option */}
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="input flex-1"
                />
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="input w-28"
                />
                <button
                  type="button"
                  onClick={addTimeOption}
                  className="btn-secondary !px-3"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Add at least 2 time options
              </p>
            </div>

            {/* Optional Fields Toggle */}
            {!showOptional && (
              <button
                type="button"
                onClick={() => setShowOptional(true)}
                className="w-full py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors mb-5"
              >
                + Add location or description
              </button>
            )}

            {/* Optional Fields */}
            {showOptional && (
              <div className="space-y-4 mb-5 animate-fade-in">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add location or meeting link"
                    className="input"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <AlignLeft className="w-4 h-4" />
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Add notes or details"
                    className="input resize-none"
                  />
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleCreatePicker}
              disabled={!title.trim() || timeOptions.length < 2}
              className="btn-primary w-full"
            >
              <Share2 className="w-5 h-5" />
              Generate Link
            </button>

            {/* Back to Calendar - inside card */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
              <a href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center gap-2 transition-colors">
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to Calendar mode
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Share Dialog */}
      {showShare && pickerData && (
        <div className="backdrop animate-fade-in" onClick={() => setShowShare(false)}>
          <div
            className="card w-full max-w-lg p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary-600" />
                Share Time Picker
              </h3>
              <button onClick={() => setShowShare(false)} className="btn-icon !p-2 !rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Share link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generateTimePickerUrl(pickerData, proSettings)}
                  readOnly
                  className="input flex-1 text-sm font-mono truncate"
                />
                <button
                  onClick={handleCopyUrl}
                  className={`btn-primary !px-4 ${copied ? '!bg-emerald-500' : ''}`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isPro && (
              <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                  <span className="font-medium text-primary-700 dark:text-primary-300 text-sm">
                    Pro Features
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Password protection, link expiration, and hide branding.
                </p>
                <a href="#upgrade" className="btn-primary text-sm w-full">
                  Upgrade to Pro
                </a>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <strong>Privacy:</strong> All data is encoded in the URL. Nothing stored on our servers.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
