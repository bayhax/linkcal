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
    expires?: number; // unix timestamp
    license?: string;
  };
}

export interface ProFeatures {
  encrypted: boolean;
  expiresAt?: Date;
  noBranding: boolean;
}
