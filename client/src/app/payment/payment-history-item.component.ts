import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentResponse } from '../models/payment.model';

@Component({
  selector: 'app-payment-history-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="payment-item" [class]="'status-' + payment.status">
      <div class="payment-header">
        <span class="amount">{{payment.amount | currency:payment.currency}}</span>
        <span class="date">{{payment.createdAt | date:'mediumDate'}}</span>
      </div>
      <div class="payment-details">
        <span class="status-badge">{{payment.status}}</span>
        <span class="description">{{payment.description}}</span>
      </div>
      <a *ngIf="payment.receiptUrl" 
         [href]="payment.receiptUrl" 
         target="_blank"
         class="receipt-link">
        View Receipt
      </a>
    </div>
  `,
  styles: [`
    .payment-item {
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .payment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .amount {
      font-weight: bold;
    }
    .date {
      color: #666;
    }
    .payment-details {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      text-transform: capitalize;
    }
    .status-succeeded .status-badge {
      background: #e6f7e6;
      color: #4CAF50;
    }
    .status-failed .status-badge {
      background: #ffebee;
      color: #F44336;
    }
    .status-pending .status-badge {
      background: #fff8e1;
      color: #FFC107;
    }
    .receipt-link {
      display: inline-block;
      margin-top: 0.5rem;
      color: #0066cc;
    }
  `]
})
export class PaymentHistoryItemComponent {
  @Input() payment!: PaymentResponse;
}