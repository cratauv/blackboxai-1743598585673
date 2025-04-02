import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-booking-step1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step">
      <h2>Select Date & Time</h2>
      <div class="form-group">
        <label>Date</label>
        <input type="date" [(ngModel)]="date" (change)="onDateChange()">
      </div>
      <div class="form-group" *ngIf="date">
        <label>Time</label>
        <select [(ngModel)]="time">
          <option *ngFor="let slot of timeSlots" [value]="slot">{{slot}}</option>
        </select>
      </div>
      <div class="step-actions">
        <button (click)="onNext()" [disabled]="!date || !time">Next</button>
      </div>
    </div>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1rem;
    }
    .step-actions {
      margin-top: 2rem;
      text-align: right;
    }
  `]
})
export class BookingStep1Component {
  @Output() next = new EventEmitter<void>();
  date = '';
  time = '';
  timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  constructor(private bookingService: BookingService) {}

  onDateChange() {
    // Could fetch available time slots here
  }

  onNext() {
    const booking = this.bookingService.getCurrentBooking() || {};
    booking.date = this.date;
    booking.time = this.time;
    this.bookingService.createBooking(booking);
    this.next.emit();
  }
}