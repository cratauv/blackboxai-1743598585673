import { Component, Input } from '@angular/core';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-confirmation-email',
  template: `
    <div class="email-container">
      <h2>Booking Confirmation</h2>
      <p>Dear {{booking?.customerName}},</p>
      <p>Your booking for {{booking?.serviceName}} on {{booking?.date | date}} has been confirmed.</p>
      <p>Booking Reference: {{booking?.id}}</p>
      <div *ngIf="booking?.details">
        <h3>Booking Details:</h3>
        <pre>{{booking?.details | json}}</pre>
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
export class ConfirmationEmailComponent {
  @Input() booking: Booking | null = null;
}