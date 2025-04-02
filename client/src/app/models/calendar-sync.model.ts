export interface CalendarSync {
  id: string;
  provider: 'google' | 'outlook' | 'apple';
  email: string;
  syncEnabled: boolean;
  lastSynced?: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}