import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface UpcomingBooking {
  id: string;
  optionName: string;
  date: string;
  time: string;
  location: string;
  duration: number;
  price: number;
  status: 'confirmed' | 'pending';
}

@Injectable({ providedIn: 'root' })
export class UpcomingBookingsService {
  private http = inject(HttpClient);

  getUpcomingBookings(userId: string) {
    return this.http.get<UpcomingBooking[]>(`/api/users/${userId}/upcoming-bookings`);
  }
}