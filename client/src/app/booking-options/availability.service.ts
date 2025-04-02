import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private http = inject(HttpClient);
  private availabilitySubject = new BehaviorSubject<boolean>(false);
  availability$ = this.availabilitySubject.asObservable();

  checkRealTimeAvailability(optionId: string, date: string, time: string): Observable<boolean> {
    return this.http.post<{available: boolean}>('/api/booking-options/check-availability', {
      optionId,
      date,
      time
    }).pipe(
      tap(response => this.availabilitySubject.next(response.available))
    );
  }

  getAvailableSlots(optionId: string, date: string): Observable<string[]> {
    return this.http.get<string[]>(`/api/booking-options/available-slots/${optionId}/${date}`);
  }
}