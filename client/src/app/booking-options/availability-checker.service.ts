import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AvailabilityCheckerService {
  private http = inject(HttpClient);
  private availabilitySubject = new BehaviorSubject<boolean>(false);
  
  availability$ = this.availabilitySubject.asObservable();

  checkRealTimeAvailability(optionId: string, date: string, time: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/booking-options/${optionId}/availability`, {
      params: { date, time }
    });
  }

  startPollingAvailability(optionId: string, date: string, time: string, interval = 5000): void {
    const check = () => {
      this.checkRealTimeAvailability(optionId, date, time).subscribe({
        next: available => this.availabilitySubject.next(available),
        error: () => this.availabilitySubject.next(false)
      });
    };
    
    check(); // Initial check
    setInterval(check, interval); // Periodic checks
  }

  stopPolling(): void {
    this.availabilitySubject.next(false);
  }
}