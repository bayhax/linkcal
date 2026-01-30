import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Calendar, CalendarEvent, ProSettings } from '../types';

interface CalendarState {
  calendar: Calendar;
  setCalendar: (calendar: Calendar) => void;
  setTitle: (title: string) => void;
  setTimezone: (tz: string) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  removeEvent: (id: string) => void;
  clearEvents: () => void;
  reset: () => void;
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

  reset: () => set({ calendar: defaultCalendar }),
}));

// Theme store with persistence
interface ThemeState {
  dark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      dark: typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-color-scheme: dark)').matches 
        : false,
      toggle: () => set((state) => ({ dark: !state.dark })),
      setDark: (dark) => set({ dark }),
    }),
    {
      name: 'linkcal-theme',
    }
  )
);

// Pro features store
interface ProState {
  isPro: boolean;
  proSettings: ProSettings;
  subscriptionId: string | null;
  expiresAt: string | null;
  setIsPro: (isPro: boolean) => void;
  setProSettings: (settings: Partial<ProSettings>) => void;
  setSubscription: (id: string, expires: string) => void;
  clearSubscription: () => void;
}

const defaultProSettings: ProSettings = {
  password: null,
  expiresAt: null,
  hideBranding: false,
};

export const useProStore = create<ProState>()(
  persist(
    (set) => ({
      isPro: false,
      proSettings: defaultProSettings,
      subscriptionId: null,
      expiresAt: null,
      
      setIsPro: (isPro) => set({ isPro }),
      
      setProSettings: (settings) => set((state) => ({
        proSettings: { ...state.proSettings, ...settings }
      })),
      
      setSubscription: (id, expires) => set({
        isPro: true,
        subscriptionId: id,
        expiresAt: expires,
      }),
      
      clearSubscription: () => set({
        isPro: false,
        subscriptionId: null,
        expiresAt: null,
        proSettings: defaultProSettings,
      }),
    }),
    {
      name: 'linkcal-pro',
    }
  )
);
