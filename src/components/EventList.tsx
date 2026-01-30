import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Trash2, ExternalLink } from 'lucide-react';
import type { CalendarEvent } from '../types';
import { generateGoogleCalendarUrl, generateOutlookUrl, generateYahooCalendarUrl } from '../utils/export';

interface EventListProps {
  events: CalendarEvent[];
  onRemove?: (id: string) => void;
  readonly?: boolean;
}

export function EventList({ events, onRemove, readonly = false }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Calendar className="mx-auto mb-2" size={32} />
        <p>No events yet</p>
        {!readonly && <p className="text-sm">Add your first event above</p>}
      </div>
    );
  }

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedEvents.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onRemove={onRemove}
          readonly={readonly}
        />
      ))}
    </div>
  );
}

interface EventCardProps {
  event: CalendarEvent;
  onRemove?: (id: string) => void;
  readonly?: boolean;
}

function EventCard({ event, onRemove, readonly }: EventCardProps) {
  const startDate = new Date(event.start);
  const endDate = event.end ? new Date(event.end) : null;

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
            {event.title}
          </h4>
          
          <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock size={14} className="mr-1 flex-shrink-0" />
            {event.allDay ? (
              <span>{format(startDate, 'MMM d, yyyy')} (All day)</span>
            ) : (
              <span>
                {format(startDate, 'MMM d, yyyy h:mm a')}
                {endDate && ` - ${format(endDate, 'h:mm a')}`}
              </span>
            )}
          </div>
          
          {event.location && (
            <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin size={14} className="mr-1 flex-shrink-0" />
              {event.location.startsWith('http') ? (
                <a
                  href={event.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline flex items-center"
                >
                  <span className="truncate">{event.location}</span>
                  <ExternalLink size={12} className="ml-1 flex-shrink-0" />
                </a>
              ) : (
                <span className="truncate">{event.location}</span>
              )}
            </div>
          )}
          
          {event.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {event.description}
            </p>
          )}
        </div>
        
        {!readonly && onRemove && (
          <button
            onClick={() => onRemove(event.id)}
            className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove event"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      
      {readonly && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Add to calendar:</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={generateGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Google
            </a>
            <a
              href={generateOutlookUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Outlook
            </a>
            <a
              href={generateYahooCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Yahoo
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
