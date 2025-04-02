import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentResponse } from '../models/payment.model';

@Component({
  selector: 'app-payment-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="payment-status" [class]="'status-' + payment?.status">
      <h3>Payment {{ payment?.status | uppercase }}</h3>
      <p *ngIf="payment?.status === 'succeeded'">
        Your payment of {{ payment?.amount | currency:payment?.currency }} was successful!
      </p>
      <p *ngIf="payment?.status === 'failed'">
        Payment failed. Please try again.
      </p>
      <p *ngIf="payment?.status === 'pending'">
        Your payment is being processed...
      </p>
      <a *ngIf="payment?.receiptUrl" 
         [href]="payment.receiptUrl" 
         target="_blank"
         class="receipt-link">
        View Receipt
      </a>
    </div>
  `,
  styles: [`
    .payment-status {
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }
    .status-succeeded {
      background-color: #e6f7e6;
      border-left: 4px solid #4CAF50;
    }
    .status-failed {
      background-color: #ffebee;
      border-left: 4px solid #F44336;
    }
    .status-pending {
      background-color: #fff8e1;
      border-left: 4px solid #FFC107;
    }
    .receipt-link {
      display: inline-block;
      margin-top: 0.5rem;
      color: #0066cc;
    }
  `]
})
export class PaymentStatusComponent {
  @Input() payment: PaymentResponse | null = null;
}