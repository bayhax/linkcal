import { useState, useCallback } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  X, 
  Link2, 
  Sparkles,
  Lock,
  Clock,
  Eye,
  Loader2,
  AlertCircle
} from 'lucide-react';
import type { Calendar } from '../types';
import { generateShareUrl } from '../utils/url';
import { downloadICS } from '../utils/export';
import { useProStore, useProFeature } from '../store/calendar';

interface ShareDialogProps {
  calendar: Calendar;
  onClose: () => void;
  onUpgradeClick?: () => void;
}

export function ShareDialog({ calendar, onClose, onUpgradeClick }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [verifyingFeature, setVerifyingFeature] = useState<string | null>(null);
  const [featureError, setFeatureError] = useState<string | null>(null);
  
  const { isPro, proSettings, setProSettings } = useProStore();
  const { requirePro } = useProFeature();
  
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

  // Wrapper for Pro features that verifies license first
  const withProVerification = useCallback(async (
    featureName: string,
    action: () => void
  ) => {
    setVerifyingFeature(featureName);
    setFeatureError(null);
    
    const verified = await requirePro();
    
    if (verified) {
      action();
    } else {
      setFeatureError('Pro license required. Please activate your license.');
    }
    
    setVerifyingFeature(null);
  }, [requirePro]);

  const handlePasswordChange = async (value: string) => {
    await withProVerification('password', () => {
      setProSettings({ password: value || null });
    });
  };

  const handleExpirationChange = async (value: string) => {
    await withProVerification('expiration', () => {
      setProSettings({ expiresAt: value || null });
    });
  };

  const handleBrandingChange = async (checked: boolean) => {
    await withProVerification('branding', () => {
      setProSettings({ hideBranding: checked });
    });
  };

  return (
    <div className="backdrop animate-fade-in" onClick={onClose}>
      <div 
        className="card w-full max-w-lg p-0 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <Link2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Share Calendar
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {calendar.events.length} event{calendar.events.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-icon !p-2 !rounded-lg flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
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
                className={`btn-primary !px-3 sm:!px-4 flex-shrink-0 ${copied ? '!bg-emerald-500 !from-emerald-500 !to-emerald-600' : ''}`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="sr-only sm:not-sr-only">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="sr-only sm:not-sr-only">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Feature verification error */}
          {featureError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{featureError}</span>
              {onUpgradeClick && (
                <button
                  onClick={onUpgradeClick}
                  className="text-xs font-medium underline hover:no-underline"
                >
                  Activate
                </button>
              )}
            </div>
          )}

          {/* Pro Features Section */}
          {isPro ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                <Sparkles className="w-4 h-4" />
                Pro Features
              </div>
              
              {/* Password Protection */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  {verifyingFeature === 'password' ? (
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin flex-shrink-0" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Password protection</p>
                    <p className="text-xs text-gray-500">Require password to view</p>
                  </div>
                </div>
                <input
                  type="password"
                  value={proSettings.password || ''}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Set password"
                  className="input !w-full sm:!w-32 !py-2 text-sm"
                  disabled={verifyingFeature === 'password'}
                />
              </div>

              {/* Link Expiration */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  {verifyingFeature === 'expiration' ? (
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin flex-shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Link expiration</p>
                    <p className="text-xs text-gray-500">Auto-expire after date</p>
                  </div>
                </div>
                <input
                  type="date"
                  value={proSettings.expiresAt || ''}
                  onChange={(e) => handleExpirationChange(e.target.value)}
                  className="input !w-full sm:!w-36 !py-2 text-sm"
                  disabled={verifyingFeature === 'expiration'}
                />
              </div>

              {/* Hide Branding */}
              <label className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  {verifyingFeature === 'branding' ? (
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin flex-shrink-0" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Hide branding</p>
                    <p className="text-xs text-gray-500">Remove LinkCal logo</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={proSettings.hideBranding}
                  onChange={(e) => handleBrandingChange(e.target.checked)}
                  className="flex-shrink-0"
                  disabled={verifyingFeature === 'branding'}
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
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <a
                    href="#upgrade"
                    className="btn-primary text-sm whitespace-nowrap"
                  >
                    Upgrade to Pro
                  </a>
                  <span className="text-xs sm:text-sm text-gray-500">$5/mo or $29 lifetime</span>
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
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            <strong>Privacy:</strong> Your calendar is encoded directly in the URL. 
            No data is stored on our servers. Anyone with the link can view it.
          </p>
        </div>
      </div>
    </div>
  );
}
