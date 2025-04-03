import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface BookingHistory {
  id: string;
  optionName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  price: number;
}

@Injectable({ providedIn: 'root' })
export class BookingHistoryService {
  private http = inject(HttpClient);

  getUserBookings(userId: string) {
    return this.http.get<BookingHistory[]>(`/api/users/${userId}/bookings`);
  }

  cancelBooking(bookingId: string) {
    return this.http.patch(`/api/bookings/${bookingId}/cancel`, {});
  }
}