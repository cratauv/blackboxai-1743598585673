import { Component, Input } from '@angular/core';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-reminder-email',
  template: `
    <div class="email-container">
      <h2>Upcoming Booking Reminder</h2>
      <p>Dear {{booking?.user?.name || 'Customer'}},</p>
      <p>This is a reminder about your upcoming stay at {{booking?.property?.name || 'our property'}}.</p>
      <p>Check-in: {{booking?.checkInDate | date}}</p>
      <p>Check-out: {{booking?.checkOutDate | date}}</p>
      <p>Booking Reference: {{booking?.id}}</p>
      <div *ngIf="booking?.specialRequests">
        <h3>Your Special Requests:</h3>
        <p>{{booking.specialRequests}}</p>
      </div>
    </div>
  `,
  styles: [`
    .email-container {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ddd;
    }
  `]
})
export class ReminderEmailComponent {
  @Input() booking: Booking | null = null;
  @Input() daysUntilCheckin: number | null = null;
}