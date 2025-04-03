import { Component, Input } from '@angular/core';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-cancellation-email',
  template: `
    <div class="email-container">
      <h2>Booking Cancellation</h2>
      <p>Dear {{booking?.user?.name || 'Customer'}},</p>
      <p>Your booking for {{booking?.property?.name || 'the property'}} 
         from {{booking?.checkInDate | date}} to {{booking?.checkOutDate | date}} has been cancelled.</p>
      <p>Booking Reference: {{booking?.id}}</p>
      <p *ngIf="refundAmount">Refund Amount: {{refundAmount | currency}}</p>
      <p *ngIf="cancellationReason">Reason: {{cancellationReason}}</p>
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
export class CancellationEmailComponent {
  @Input() booking: Booking | null = null;
  @Input() refundAmount: number | null = null;
  @Input() cancellationReason: string | null = null;
}