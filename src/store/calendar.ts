import { create } from 'zustand';
import type { Calendar, CalendarEvent } from '../types';

interface CalendarState {
  calendar: Calendar;
  setCalendar: (calendar: Calendar) => void;
  setTitle: (title: string) => void;
  setTimezone: (tz: string) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  removeEvent: (id: string) => void;
  clearEvents: () => void;
}

const defaultCalendar: Calendar = {
  v: 1,
  title: '',
  tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  events: [],
};

export const useCalendarStore = create<CalendarState>((set) => ({
  calendar: defaultCalendar,
  
  setCalendar: (calendar) => set({ calendar }),
  
  setTitle: (title) => set((state) => ({
    calendar: { ...state.calendar, title }
  })),
  
  setTimezone: (tz) => set((state) => ({
    calendar: { ...state.calendar, tz }
  })),
  
  addEvent: (event) => set((state) => ({
    calendar: {
      ...state.calendar,
      events: [...state.calendar.events, event]
    }
  })),
  
  updateEvent: (id, updates) => set((state) => ({
    calendar: {
      ...state.calendar,
      events: state.calendar.events.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      )
    }
  })),
  
  removeEvent: (id) => set((state) => ({
    calendar: {
      ...state.calendar,
      events: state.calendar.events.filter((e) => e.id !== id)
    }
  })),
  
  clearEvents: () => set((state) => ({
    calendar: { ...state.calendar, events: [] }
  })),
}));

// Theme store
interface ThemeState {
  dark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  dark: window.matchMedia('(prefers-color-scheme: dark)').matches,
  toggle: () => set((state) => ({ dark: !state.dark })),
  setDark: (dark) => set({ dark }),
}));
