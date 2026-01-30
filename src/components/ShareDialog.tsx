import { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  X, 
  Link2, 
  Sparkles,
  Lock,
  Clock,
  Eye
} from 'lucide-react';
import type { Calendar } from '../types';
import { generateShareUrl } from '../utils/url';
import { downloadICS } from '../utils/export';
import { useProStore } from '../store/calendar';

interface ShareDialogProps {
  calendar: Calendar;
  onClose: () => void;
}

export function ShareDialog({ calendar, onClose }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const { isPro, proSettings, setProSettings } = useProStore();
  const shareUrl = generateShareUrl(calendar, proSettings);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    downloadICS(calendar);
  };

  return (
    <div className="backdrop animate-fade-in" onClick={onClose}>
      <div 
        className="card w-full max-w-lg p-0 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Share Calendar
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {calendar.events.length} event{calendar.events.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-icon !p-2 !rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Share URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Share link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="input flex-1 text-sm font-mono truncate"
              />
              <button
                onClick={handleCopy}
                className={`btn-primary !px-4 ${copied ? '!bg-emerald-500 !from-emerald-500 !to-emerald-600' : ''}`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Pro Features Section */}
          {isPro ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                <Sparkles className="w-4 h-4" />
                Pro Features
              </div>
              
              {/* Password Protection */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Password protection</p>
                    <p className="text-xs text-gray-500">Require password to view</p>
                  </div>
                </div>
                <input
                  type="password"
                  value={proSettings.password || ''}
                  onChange={(e) => setProSettings({ password: e.target.value || null })}
                  placeholder="Set password"
                  className="input !w-32 !py-2 text-sm"
                />
              </div>

              {/* Link Expiration */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Link expiration</p>
                    <p className="text-xs text-gray-500">Auto-expire after date</p>
                  </div>
                </div>
                <input
                  type="date"
                  value={proSettings.expiresAt || ''}
                  onChange={(e) => setProSettings({ expiresAt: e.target.value || null })}
                  className="input !w-36 !py-2 text-sm"
                />
              </div>

              {/* Hide Branding */}
              <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Hide branding</p>
                    <p className="text-xs text-gray-500">Remove LinkCal logo</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={proSettings.hideBranding}
                  onChange={(e) => setProSettings({ hideBranding: e.target.checked })}
                />
              </label>
            </div>
          ) : (
            /* Pro Upsell */
            <div className="relative p-5 rounded-2xl bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-950/30 dark:to-purple-950/30 border border-primary-200 dark:border-primary-800/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span className="font-semibold text-primary-700 dark:text-primary-300">Upgrade to Pro</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Unlock password protection, link expiration, and hide branding.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#upgrade"
                    className="btn-primary text-sm"
                  >
                    Upgrade for $5/mo
                  </a>
                  <span className="text-sm text-gray-500">or $29 lifetime</span>
                </div>
              </div>
            </div>
          )}

          {/* Download ICS */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={handleDownload}
              className="btn-ghost !px-3 text-sm"
            >
              <Download className="w-4 h-4" />
              Download .ics file
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            <strong>Privacy:</strong> Your calendar is encoded directly in the URL. 
            No data is stored on our servers. Anyone with the link can view it.
          </p>
        </div>
      </div>
    </div>
  );
}
