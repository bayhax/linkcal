import LZString from 'lz-string';
import type { Calendar } from '../types';

const SCHEMA_VERSION = 1;

export function encodeCalendar(calendar: Calendar): string {
  const data = { ...calendar, v: SCHEMA_VERSION };
  const json = JSON.stringify(data);
  const compressed = LZString.compressToEncodedURIComponent(json);
  return compressed;
}

export function decodeCalendar(hash: string): Calendar | null {
  try {
    // Check if encrypted (starts with 'e:')
    if (hash.startsWith('e:')) {
      // Return null for encrypted calendars - need password
      return null;
    }
    
    const json = LZString.decompressFromEncodedURIComponent(hash);
    if (!json) return null;
    
    const data = JSON.parse(json) as Calendar;
    return data;
  } catch (e) {
    console.error('Failed to decode calendar:', e);
    return null;
  }
}

export function getCalendarFromUrl(): Calendar | null {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  return decodeCalendar(hash);
}

export function setCalendarToUrl(calendar: Calendar): string {
  const encoded = encodeCalendar(calendar);
  const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
  window.history.replaceState(null, '', url);
  return url;
}

export function generateShareUrl(calendar: Calendar): string {
  const encoded = encodeCalendar(calendar);
  return `${window.location.origin}/#${encoded}`;
}
