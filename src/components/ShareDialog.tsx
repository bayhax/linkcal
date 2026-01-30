import { useState } from 'react';
import { Copy, Check, Download, X, Link2 } from 'lucide-react';
import type { Calendar } from '../types';
import { generateShareUrl } from '../utils/url';
import { downloadICS } from '../utils/export';

interface ShareDialogProps {
  calendar: Calendar;
  onClose: () => void;
}

export function ShareDialog({ calendar, onClose }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = generateShareUrl(calendar);

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Link2 className="mr-2" size={20} />
            Share Calendar
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Share this link with anyone. They'll be able to view your calendar and add events to their own calendar.
        </p>

        <div className="flex items-stretch mb-4">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-50 dark:bg-slate-700 text-sm text-gray-700 dark:text-gray-300 truncate"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-r-md transition-colors flex items-center"
          >
            {copied ? (
              <>
                <Check size={16} className="mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} className="mr-1" />
                Copy
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleDownload}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <Download size={16} className="mr-1" />
            Download .ics file
          </button>
          
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {calendar.events.length} event{calendar.events.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <strong>Privacy note:</strong> Your calendar data is encoded directly in the URL. 
            No data is stored on our servers. Anyone with this link can view your calendar.
          </p>
        </div>
      </div>
    </div>
  );
}
