import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-booking-step2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step">
      <h2>Your Information</h2>
      <div class="form-group">
        <label>Full Name</label>
        <input type="text" [(ngModel)]="customerInfo.name" required>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" [(ngModel)]="customerInfo.email" required>
      </div>
      <div class="form-group">
        <label>Phone</label>
        <input type="tel" [(ngModel)]="customerInfo.phone" required>
      </div>
      <div class="form-group">
        <label>Special Requests</label>
        <textarea [(ngModel)]="customerInfo.specialRequests"></textarea>
      </div>
      <div class="step-actions">
        <button (click)="onBack()">Back</button>
        <button (click)="onNext()" [disabled]="!isValid()">Next</button>
      </div>
    </div>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1rem;
    }
    .step-actions {
      margin-top: 2rem;
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class BookingStep2Component {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  customerInfo = {
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  };

  constructor(private bookingService: BookingService) {}

  isValid() {
    return this.customerInfo.name && this.customerInfo.email && this.customerInfo.phone;
  }

  onNext() {
    const booking = this.bookingService.getCurrentBooking() || {};
    booking.customerInfo = this.customerInfo;
    this.bookingService.createBooking(booking);
    this.next.emit();
  }

  onBack() {
    this.back.emit();
  }
}