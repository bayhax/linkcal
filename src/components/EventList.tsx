import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Trash2, 
  ExternalLink, 
  ChevronDown,
  Plus
} from 'lucide-react';
import { useState } from 'react';
import type { CalendarEvent } from '../types';
import { generateGoogleCalendarUrl, generateOutlookUrl, generateYahooCalendarUrl, generateIcsDataUrl } from '../utils/export';

interface EventListProps {
  events: CalendarEvent[];
  onRemove?: (id: string) => void;
  readonly?: boolean;
}

export function EventList({ events, onRemove, readonly = false }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">No events yet</p>
        {!readonly && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Add your first event to get started
          </p>
        )}
      </div>
    );
  }

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedEvents.map((event, index) => (
        <EventCard
          key={event.id}
          event={event}
          onRemove={onRemove}
          readonly={readonly}
          index={index}
        />
      ))}
    </div>
  );
}

interface EventCardProps {
  event: CalendarEvent;
  onRemove?: (id: string) => void;
  readonly?: boolean;
  index: number;
}

function EventCard({ event, onRemove, readonly, index }: EventCardProps) {
  const [showCalendars, setShowCalendars] = useState(false);
  const startDate = new Date(event.start);
  const endDate = event.end ? new Date(event.end) : null;
  const isPastEvent = isPast(startDate) && !isToday(startDate);

  const getDateLabel = () => {
    if (isToday(startDate)) return 'Today';
    if (isTomorrow(startDate)) return 'Tomorrow';
    return format(startDate, 'EEE, MMM d');
  };

  const calendarLinks = [
    { name: 'Google Calendar', url: generateGoogleCalendarUrl(event), icon: '🗓️' },
    { name: 'Outlook', url: generateOutlookUrl(event), icon: '📧' },
    { name: 'Yahoo Calendar', url: generateYahooCalendarUrl(event), icon: '📅' },
    { name: 'Download .ics', url: generateIcsDataUrl(event), icon: '📥', download: `${event.title}.ics` },
  ];

  return (
    <div 
      className={`card-hover p-5 animate-fade-in-up ${isPastEvent ? 'opacity-60' : ''}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* Date Badge */}
        <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-center flex-shrink-0">
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase">
            {format(startDate, 'MMM')}
          </span>
          <span className="text-xl font-bold text-primary-700 dark:text-primary-300 -mt-0.5">
            {format(startDate, 'd')}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight truncate">
                {event.title}
              </h4>
              
              {/* Mobile date */}
              <div className="sm:hidden mt-1.5 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{getDateLabel()}</span>
              </div>

              {/* Time */}
              <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                {event.allDay ? (
                  <span>All day</span>
                ) : (
                  <span>
                    {format(startDate, 'h:mm a')}
                    {endDate && ` – ${format(endDate, 'h:mm a')}`}
                  </span>
                )}
              </div>
              
              {/* Location */}
              {event.location && (
                <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {event.location.startsWith('http') ? (
                    <a
                      href={event.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 truncate"
                    >
                      <span className="truncate">{new URL(event.location).hostname}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  ) : (
                    <span className="truncate">{event.location}</span>
                  )}
                </div>
              )}
            </div>

            {/* Remove button */}
            {!readonly && onRemove && (
              <button
                onClick={() => onRemove(event.id)}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                title="Remove event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Description */}
          {event.description && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
              {event.description}
            </p>
          )}
        </div>
      </div>
      
      {/* Add to calendar section (readonly mode) */}
      {readonly && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setShowCalendars(!showCalendars)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add to my calendar
            <ChevronDown className={`w-4 h-4 transition-transform ${showCalendars ? 'rotate-180' : ''}`} />
          </button>
          
          {showCalendars && (
            <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
              {calendarLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target={link.download ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  download={link.download}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
