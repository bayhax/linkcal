export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO 8601
  end?: string;
  allDay?: boolean;
  description?: string;
  location?: string;
}

export interface Calendar {
  v: number; // schema version
  title?: string;
  tz?: string; // timezone
  events: CalendarEvent[];
  pro?: {
    expires?: number; // unix timestamp when link expires
    encrypted?: boolean; // if password protected
    license?: string;
    hideBranding?: boolean;
  };
}

// Time Picker types
export interface TimePickerData {
  v: number;              // schema version
  mode: 'pick';           // mode identifier
  title: string;          // event title
  desc?: string;          // description
  loc?: string;           // location
  tz: string;             // creator's timezone
  dur: number;            // duration in minutes
  opts: string[];         // ISO datetime strings for options
  pro?: {
    expires?: number;
    hideBranding?: boolean;
  };
}

export interface TimePickerSelection {
  data: TimePickerData;
  selectedIndex: number;
}

export interface ProSettings {
  password: string | null;
  expiresAt: string | null; // ISO date when link expires
  hideBranding: boolean;
}

export interface ProFeatures {
  encrypted: boolean;
  expiresAt?: Date;
  noBranding: boolean;
}

export interface CreemCheckoutResponse {
  checkout_url: string;
  checkout_id: string;
}

export interface CreemSubscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: string;
  customer: {
    email: string;
  };
}
