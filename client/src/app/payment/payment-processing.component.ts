import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentFormComponent } from './payment-form-new.component';
import { PaymentStatusComponent } from './payment-status.component';
import { PaymentService } from './payment.service';
import { PaymentRequest, PaymentResponse } from '../models/payment.model';

@Component({
  selector: 'app-payment-processing',
  standalone: true,
  imports: [CommonModule, PaymentFormComponent, PaymentStatusComponent],
  template: `
    <div class="payment-container">
      <h2>Complete Payment</h2>
      <app-payment-form 
        *ngIf="!paymentResult"
        (paymentSubmit)="processPayment($event)">
      </app-payment-form>
      <app-payment-status 
        *ngIf="paymentResult"
        [payment]="paymentResult">
      </app-payment-status>
    </div>
  `,
  styles: [`
    .payment-container {
      max-width: 500px;
      margin: 0 auto;
      padding: 2rem;
    }
  `]
})
export class PaymentProcessingComponent {
  paymentResult: PaymentResponse | null = null;

  constructor(private paymentService: PaymentService) {}

  processPayment(paymentRequest: PaymentRequest) {
    this.paymentService.processPayment(paymentRequest)
      .subscribe({
        next: (response) => {
          this.paymentResult = response;
        },
        error: (err) => {
          this.paymentResult = {
            id: '',
            status: 'failed',
            amount: paymentRequest.amount,
            amountRefunded: 0,
            currency: paymentRequest.currency,
            paymentMethod: 'card',
            createdAt: new Date(),
            refundable: false
          };
        }
      });
  }
}