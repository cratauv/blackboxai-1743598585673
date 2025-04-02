import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentHistoryItemComponent } from './payment-history-item.component';
import { PaymentHistoryService } from './payment-history.service';
import { PaymentResponse } from '../models/payment.model';

@Component({
  selector: 'app-payment-history-list',
  standalone: true,
  imports: [CommonModule, PaymentHistoryItemComponent],
  template: `
    <div class="payment-history">
      <h2>Payment History</h2>
      <div class="filters">
        <button (click)="filterPayments('')">All</button>
        <button (click)="filterPayments('succeeded')">Completed</button>
        <button (click)="filterPayments('failed')">Failed</button>
      </div>
      <div *ngIf="isLoading" class="loading">Loading...</div>
      <div *ngIf="!isLoading && payments.length === 0" class="empty">
        No payment history found
      </div>
      <app-payment-history-item
        *ngFor="let payment of payments"
        [payment]="payment">
      </app-payment-history-item>
    </div>
  `,
  styles: [`
    .payment-history {
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem;
    }
    .filters {
      margin: 1rem 0;
      display: flex;
      gap: 0.5rem;
    }
    .filters button {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
    }
    .filters button:hover {
      background: #f5f5f5;
    }
    .loading, .empty {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
  `]
})
export class PaymentHistoryListComponent {
  payments: PaymentResponse[] = [];
  isLoading = true;

  constructor(private paymentHistoryService: PaymentHistoryService) {}

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.isLoading = true;
    this.paymentHistoryService.getPaymentHistory()
      .subscribe({
        next: (payments) => {
          this.payments = payments;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  filterPayments(status: string) {
    this.isLoading = true;
    if (status) {
      this.paymentHistoryService.filterPayments(status)
        .subscribe(payments => {
          this.payments = payments;
          this.isLoading = false;
        });
    } else {
      this.loadPayments();
    }
  }
}