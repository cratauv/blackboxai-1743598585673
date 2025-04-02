import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface BookingDetails {
  optionId: string;
  date: string;
  time: string;
  customerInfo: CustomerInfo;
  paymentInfo: PaymentInfo;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiry: string;
  cvv: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private currentBooking?: BookingDetails;

  createBooking(bookingData: BookingDetails) {
    this.currentBooking = bookingData;
    return this.http.post('/api/bookings', bookingData);
  }

  getCurrentBooking() {
    return this.currentBooking;
  }
}