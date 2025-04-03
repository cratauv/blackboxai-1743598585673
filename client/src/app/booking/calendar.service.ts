import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Availability } from '../models/availability.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = `${environment.apiUrl}/availability`;

  constructor(private http: HttpClient) {}

  getMonthlyAvailability(year: number, month: number): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${this.apiUrl}/monthly?year=${year}&month=${month}`);
  }

  getDailyAvailability(date: Date): Observable<Availability> {
    return this.http.get<Availability>(`${this.apiUrl}/daily?date=${date.toISOString()}`);
  }

  getTimeSlots(date: Date): Observable<Availability['timeSlots']> {
    return this.http.get<Availability['timeSlots']>(`${this.apiUrl}/timeslots?date=${date.toISOString()}`);
  }
}