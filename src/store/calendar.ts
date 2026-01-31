import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Calendar, CalendarEvent, ProSettings } from '../types';
import { verifyLicense, getStoredLicense, setStoredLicense, clearStoredLicense } from '../services/license';

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

// Pro features store with license verification
interface ProState {
  isPro: boolean;
  isVerifying: boolean;
  licenseKey: string | null;
  licenseStatus: string | null;
  licenseError: string | null;
  proSettings: ProSettings;
  
  // Actions
  setProSettings: (settings: Partial<ProSettings>) => void;
  activateLicense: (key: string) => Promise<boolean>;
  verifyCurrentLicense: () => Promise<boolean>;
  deactivateLicense: () => void;
  checkAndVerifyLicense: () => Promise<void>;
}

const defaultProSettings: ProSettings = {
  password: null,
  expiresAt: null,
  hideBranding: false,
};

export const useProStore = create<ProState>()(
  persist(
    (set, get) => ({
      isPro: false,
      isVerifying: false,
      licenseKey: null,
      licenseStatus: null,
      licenseError: null,
      proSettings: defaultProSettings,
      
      setProSettings: (settings) => set((state) => ({
        proSettings: { ...state.proSettings, ...settings }
      })),
      
      activateLicense: async (key: string) => {
        set({ isVerifying: true, licenseError: null });
        
        try {
          const result = await verifyLicense(key);
          
          if (result.valid) {
            setStoredLicense(key);
            set({
              isPro: true,
              licenseKey: key,
              licenseStatus: result.status || 'active',
              licenseError: null,
              isVerifying: false,
            });
            return true;
          } else {
            set({
              isPro: false,
              licenseKey: null,
              licenseStatus: null,
              licenseError: result.error || 'Invalid license key',
              isVerifying: false,
            });
            return false;
          }
        } catch (error) {
          set({
            licenseError: 'Failed to verify license',
            isVerifying: false,
          });
          return false;
        }
      },
      
      verifyCurrentLicense: async () => {
        const { licenseKey } = get();
        if (!licenseKey) {
          set({ isPro: false });
          return false;
        }
        
        return get().activateLicense(licenseKey);
      },
      
      deactivateLicense: () => {
        clearStoredLicense();
        set({
          isPro: false,
          licenseKey: null,
          licenseStatus: null,
          licenseError: null,
          proSettings: defaultProSettings,
        });
      },
      
      // Check for stored license and verify on app load
      checkAndVerifyLicense: async () => {
        const storedKey = getStoredLicense();
        if (storedKey) {
          await get().activateLicense(storedKey);
        }
      },
    }),
    {
      name: 'linkcal-pro',
      partialize: (state) => ({
        licenseKey: state.licenseKey,
        proSettings: state.proSettings,
      }),
    }
  )
);

// Helper hook to verify Pro before using a feature
export function useProFeature() {
  const { isPro, isVerifying, verifyCurrentLicense, licenseKey } = useProStore();
  
  const requirePro = async (): Promise<boolean> => {
    if (!licenseKey) {
      return false;
    }
    
    if (isPro && !isVerifying) {
      // Already verified, but let's re-verify in background
      verifyCurrentLicense();
      return true;
    }
    
    // Need to verify
    return await verifyCurrentLicense();
  };
  
  return { isPro, isVerifying, requirePro };
}
