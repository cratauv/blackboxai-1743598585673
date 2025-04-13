import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingOption } from '../booking-options/booking-options.service';
import { Booking } from '../models/booking.model';

export interface BookingDetails {
  optionId: string;
  date: string;
  time: string;
  customerInfo: CustomerInfo;
  paymentInfo: PaymentInfo;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface PaymentInfo {
  method: string;
  details: string;
  cardDetails?: {
    cardNumber: string;
    expiry: string;
    cvv: string;
  };
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private currentBooking?: BookingDetails;
  private apiUrl = '/api/bookings';

  createBooking(bookingData: Booking): Observable<Booking> {
    this.currentBooking = this.mapToBookingDetails(bookingData);
    return this.http.post<Booking>(this.apiUrl, bookingData);
  }

  getCurrentBooking() {
    return this.currentBooking;
  }

  getBookingOptions(): Observable<BookingOption[]> {
    return this.http.get<BookingOption[]>('/api/booking-options');
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  updateBooking(id: string, bookingData: Partial<Booking>): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/${id}`, bookingData);
  }

  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private mapToBookingDetails(booking: Booking): BookingDetails {
    return {
      optionId: booking.optionId,
      date: booking.date,
      time: booking.time,
      customerInfo: {
        name: booking.customerInfo.name,
        email: booking.customerInfo.email,
        phone: booking.customerInfo.phone,
        specialRequests: booking.specialRequests
      },
      paymentInfo: {
        method: booking.paymentInfo.method,
        details: booking.paymentInfo.details
      }
    };
  }
}
