import { format } from 'date-fns';
import type { CalendarEvent, Calendar } from '../types';

function formatDateForICS(date: Date, allDay?: boolean): string {
  if (allDay) {
    return format(date, "yyyyMMdd");
  }
  return format(date, "yyyyMMdd'T'HHmmss'Z'");
}

function escapeICS(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export function generateICS(calendar: Calendar): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LinkCal//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  if (calendar.title) {
    lines.push(`X-WR-CALNAME:${escapeICS(calendar.title)}`);
  }

  for (const event of calendar.events) {
    const start = new Date(event.start);
    const end = event.end ? new Date(event.end) : new Date(start.getTime() + 60 * 60 * 1000);

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${event.id}@linkcal.app`);
    lines.push(`DTSTAMP:${formatDateForICS(new Date())}`);
    
    if (event.allDay) {
      lines.push(`DTSTART;VALUE=DATE:${formatDateForICS(start, true)}`);
      lines.push(`DTEND;VALUE=DATE:${formatDateForICS(end, true)}`);
    } else {
      lines.push(`DTSTART:${formatDateForICS(start)}`);
      lines.push(`DTEND:${formatDateForICS(end)}`);
    }
    
    lines.push(`SUMMARY:${escapeICS(event.title)}`);
    
    if (event.description) {
      lines.push(`DESCRIPTION:${escapeICS(event.description)}`);
    }
    
    if (event.location) {
      lines.push(`LOCATION:${escapeICS(event.location)}`);
    }
    
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadICS(calendar: Calendar): void {
  const ics = generateICS(calendar);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${calendar.title || 'calendar'}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const start = new Date(event.start);
  const end = event.end ? new Date(event.end) : new Date(start.getTime() + 60 * 60 * 1000);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${format(start, "yyyyMMdd'T'HHmmss'Z'")}/${format(end, "yyyyMMdd'T'HHmmss'Z'")}`,
  });
  
  if (event.description) {
    params.set('details', event.description);
  }
  
  if (event.location) {
    params.set('location', event.location);
  }
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateOutlookUrl(event: CalendarEvent): string {
  const start = new Date(event.start);
  const end = event.end ? new Date(event.end) : new Date(start.getTime() + 60 * 60 * 1000);
  
  const params = new URLSearchParams({
    rru: 'addevent',
    subject: event.title,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
  });
  
  if (event.description) {
    params.set('body', event.description);
  }
  
  if (event.location) {
    params.set('location', event.location);
  }
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function generateYahooCalendarUrl(event: CalendarEvent): string {
  const start = new Date(event.start);
  const end = event.end ? new Date(event.end) : new Date(start.getTime() + 60 * 60 * 1000);
  
  const duration = Math.round((end.getTime() - start.getTime()) / 1000 / 60);
  const hours = Math.floor(duration / 60).toString().padStart(2, '0');
  const minutes = (duration % 60).toString().padStart(2, '0');
  
  const params = new URLSearchParams({
    v: '60',
    title: event.title,
    st: format(start, "yyyyMMdd'T'HHmmss"),
    dur: `${hours}${minutes}`,
  });
  
  if (event.description) {
    params.set('desc', event.description);
  }
  
  if (event.location) {
    params.set('in_loc', event.location);
  }
  
  return `https://calendar.yahoo.com/?${params.toString()}`;
}
