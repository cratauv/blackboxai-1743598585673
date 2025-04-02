import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private http = inject(HttpClient);

  sendBookingConfirmation(bookingData: any): Observable<any> {
    return this.http.post('/api/emails/booking-confirmation', bookingData);
  }

  generateReceipt(bookingId: string): Observable<Blob> {
    return this.http.get(`/api/emails/receipt/${bookingId}`, {
      responseType: 'blob'
    });
  }
}