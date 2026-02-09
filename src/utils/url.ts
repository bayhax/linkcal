import LZString from 'lz-string';
import type { Calendar, ProSettings, TimePickerData } from '../types';
import { encryptData } from './crypto';

const SCHEMA_VERSION = 1;
const TIMEPICKER_VERSION = 2;

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

// Time Picker URL functions
export function encodeTimePicker(data: TimePickerData): string {
  const json = JSON.stringify(data);
  const compressed = LZString.compressToEncodedURIComponent(json);
  return compressed;
}

export function decodeTimePicker(hash: string): TimePickerData | null {
  try {
    // Remove selection suffix if present (e.g., &sel=0)
    const cleanHash = hash.split('&')[0];
    
    // Check if encrypted (starts with 'e:')
    if (cleanHash.startsWith('e:')) {
      return null;
    }
    
    const json = LZString.decompressFromEncodedURIComponent(cleanHash);
    if (!json) return null;
    
    const data = JSON.parse(json) as TimePickerData;
    
    // Validate it's a time picker
    if (data.mode !== 'pick') return null;
    
    return data;
  } catch (e) {
    console.error('Failed to decode time picker:', e);
    return null;
  }
}

export function getTimePickerFromUrl(): { data: TimePickerData | null; selectedIndex: number | null } {
  const hash = window.location.hash.slice(1);
  if (!hash) return { data: null, selectedIndex: null };
  
  // Parse selection from hash (format: data&sel=0)
  const parts = hash.split('&sel=');
  const dataHash = parts[0];
  const selectedIndex = parts[1] !== undefined ? parseInt(parts[1], 10) : null;
  
  const data = decodeTimePicker(dataHash);
  return { data, selectedIndex: isNaN(selectedIndex as number) ? null : selectedIndex };
}

export function generateTimePickerUrl(data: TimePickerData, proSettings?: ProSettings): string {
  // Add pro metadata if applicable
  const dataWithPro: TimePickerData = {
    ...data,
    v: TIMEPICKER_VERSION,
    pro: proSettings?.expiresAt || proSettings?.hideBranding
      ? {
          expires: proSettings.expiresAt ? new Date(proSettings.expiresAt).getTime() : undefined,
          hideBranding: proSettings.hideBranding || undefined,
        }
      : undefined,
  };

  let encoded = encodeTimePicker(dataWithPro);
  
  // If password is set, encrypt the data
  if (proSettings?.password) {
    const encryptedData = encryptData(JSON.stringify(dataWithPro), proSettings.password);
    encoded = `e:${encryptedData}`;
  }
  
  return `${window.location.origin}/pick#${encoded}`;
}

export function generateTimePickerConfirmUrl(data: TimePickerData, selectedIndex: number): string {
  const encoded = encodeTimePicker(data);
  return `${window.location.origin}/pick#${encoded}&sel=${selectedIndex}`;
}

export function checkTimePickerExpired(data: TimePickerData): boolean {
  if (!data.pro?.expires) return false;
  return Date.now() > data.pro.expires;
}
