import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface AdminBooking {
  id: string;
  userId: string;
  userName: string;
  optionName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  price: number;
}

@Injectable({ providedIn: 'root' })
export class AdminBookingsService {
  private http = inject(HttpClient);

  getAllBookings() {
    return this.http.get<AdminBooking[]>('/api/admin/bookings');
  }

  updateBooking(bookingId: string, updates: Partial<AdminBooking>) {
    return this.http.patch<AdminBooking>(`/api/admin/bookings/${bookingId}`, updates);
  }

  cancelBooking(bookingId: string) {
    return this.http.patch(`/api/admin/bookings/${bookingId}/cancel`, {});
  }
}