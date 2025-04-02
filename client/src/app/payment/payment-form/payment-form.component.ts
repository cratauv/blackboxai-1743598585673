import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PaymentRequest } from '../../models/payment.model';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label>Card Number</label>
        <input type="text" formControlName="cardNumber" placeholder="4242 4242 4242 4242">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Expiry</label>
          <input type="text" formControlName="expiry" placeholder="MM/YY">
        </div>
        <div class="form-group">
          <label>CVC</label>
          <input type="text" formControlName="cvc" placeholder="123">
        </div>
      </div>
      <div class="form-group">
        <label>Name on Card</label>
        <input type="text" formControlName="name" placeholder="John Doe">
      </div>
      <button type="submit" [disabled]="paymentForm.invalid">Pay Now</button>
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
    button:disabled {
      background: #cccccc;
    }
  `]
})
export class PaymentFormComponent {
  @Output() paymentSubmit = new EventEmitter<PaymentRequest>();

  paymentForm = this.fb.group({
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]],
    cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    name: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.paymentForm.valid) {
      const paymentData: PaymentRequest = {
        amount: 100, // Should be dynamic
        currency: 'USD',
        description: 'Booking Payment',
        customerEmail: '', // Should be from auth
        metadata: this.paymentForm.value
      };
      this.paymentSubmit.emit(paymentData);
    }
  }
}