import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CalendarSync, CalendarEvent } from '../models/calendar-sync.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarSyncService {
  private apiUrl = `${environment.apiUrl}/calendar-sync`;

  constructor(private http: HttpClient) {}

  getConnectedCalendars(): Observable<CalendarSync[]> {
    return this.http.get<CalendarSync[]>(`${this.apiUrl}`);
  }

  connectCalendar(provider: string): Observable<{authUrl: string}> {
    return this.http.post<{authUrl: string}>(`${this.apiUrl}/connect`, {provider});
  }

  disconnectCalendar(calendarId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${calendarId}`);
  }

  syncCalendar(calendarId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${calendarId}/sync`, {});
  }

  getCalendarEvents(calendarId: string): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/${calendarId}/events`);
  }

  addEventToCalendar(calendarId: string, event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(`${this.apiUrl}/${calendarId}/events`, event);
  }
}