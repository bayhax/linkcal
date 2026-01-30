import LZString from 'lz-string';
import type { Calendar, ProSettings } from '../types';
import { encryptData } from './crypto';

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

export function generateShareUrl(calendar: Calendar, proSettings?: ProSettings): string {
  // Add pro metadata to calendar if applicable
  const calendarWithPro: Calendar = {
    ...calendar,
    pro: proSettings?.expiresAt || proSettings?.hideBranding
      ? {
          expires: proSettings.expiresAt ? new Date(proSettings.expiresAt).getTime() : undefined,
          hideBranding: proSettings.hideBranding || undefined,
        }
      : undefined,
  };

  let encoded = encodeCalendar(calendarWithPro);
  
  // If password is set, encrypt the data
  if (proSettings?.password) {
    const encryptedData = encryptData(JSON.stringify(calendarWithPro), proSettings.password);
    encoded = `e:${encryptedData}`;
  }
  
  return `${window.location.origin}/#${encoded}`;
}

export function checkLinkExpired(calendar: Calendar): boolean {
  if (!calendar.pro?.expires) return false;
  return Date.now() > calendar.pro.expires;
}
