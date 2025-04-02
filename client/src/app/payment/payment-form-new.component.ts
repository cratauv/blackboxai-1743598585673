import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentRequest } from '../models/payment.model';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <form (submit)="onSubmit($event)">
      <div class="form-group">
        <label>Card Number</label>
        <input type="text" #cardNumber placeholder="4242 4242 4242 4242" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Expiry</label>
          <input type="text" #expiry placeholder="MM/YY" required>
        </div>
        <div class="form-group">
          <label>CVC</label>
          <input type="text" #cvc placeholder="123" required>
        </div>
      </div>
      <div class="form-group">
        <label>Name on Card</label>
        <input type="text" #name placeholder="John Doe" required>
      </div>
      <button type="submit">Pay Now</button>
    </form>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1rem;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    input {
      width: 100%;
      padding: 0.5rem;
    }
    button {
      background: #0066cc;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class PaymentFormComponent {
  @Output() paymentSubmit = new EventEmitter<PaymentRequest>();

  onSubmit(event: Event) {
    event.preventDefault();
    const cardNumber = (event.target as any).elements.cardNumber.value;
    const expiry = (event.target as any).elements.expiry.value;
    const cvc = (event.target as any).elements.cvc.value;
    const name = (event.target as any).elements.name.value;

    const paymentData: PaymentRequest = {
      amount: 100, // Should be dynamic
      currency: 'USD',
      description: 'Booking Payment',
      customerEmail: '', // Should be from auth
      metadata: {
        cardNumber,
        expiry,
        cvc,
        name
      }
    };
    this.paymentSubmit.emit(paymentData);
  }
}