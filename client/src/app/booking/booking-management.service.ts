import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BookingManagementService {
  private http = inject(HttpClient);

  cancelBooking(bookingId: string) {
    return this.http.patch(`/api/bookings/${bookingId}/cancel`, {});
  }

  rescheduleBooking(bookingId: string, newDate: string, newTime: string) {
    return this.http.patch(`/api/bookings/${bookingId}/reschedule`, {
      date: newDate,
      time: newTime
    });
  }

  updateBookingDetails(bookingId: string, updates: any) {
    return this.http.patch(`/api/bookings/${bookingId}`, updates);
  }
}