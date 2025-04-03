import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface BookingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  imageUrl: string;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class BookingOptionsAdminService {
  private http = inject(HttpClient);

  getBookingOptions() {
    return this.http.get<BookingOption[]>('/api/admin/booking-options');
  }

  createBookingOption(option: Omit<BookingOption, 'id'>) {
    return this.http.post<BookingOption>('/api/admin/booking-options', option);
  }

  updateBookingOption(id: string, updates: Partial<BookingOption>) {
    return this.http.patch<BookingOption>(`/api/admin/booking-options/${id}`, updates);
  }

  deleteBookingOption(id: string) {
    return this.http.delete(`/api/admin/booking-options/${id}`);
  }
}