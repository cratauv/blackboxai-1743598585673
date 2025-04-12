import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingService, BookingDetails, CustomerInfo, PaymentInfo } from '../booking.service';
import { BookingOptionsService } from '../../booking-options/booking-options.service';
import { PaymentService } from '../../payment/payment.service';
import { BookingOption } from '../../booking-options/booking-options.service';
import { PaymentRequest } from '../../models/payment.model';

@Component({
  selector: 'app-booking-step3',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step">
      <h2>Select Service</h2>
      
      <div class="service-options" *ngIf="serviceOptions">
        <div class="service-option" *ngFor="let option of serviceOptions" 
             [class.selected]="selectedOption?.id === option.id"
             (click)="selectOption(option)">
          <h3>{{option.name}}</h3>
          <p>{{option.description}}</p>
          <div class="price">{{option.price | currency}}</div>
        </div>
      </div>

      <div class="payment-form" *ngIf="selectedOption">
        <h3>Payment Information</h3>
        <div class="form-group">
          <label>Card Number</label>
          <input type="text" [(ngModel)]="paymentInfo.cardNumber" placeholder="1234 5678 9012 3456">
        </div>
        <div class="form-group">
          <label>Expiration</label>
          <input type="text" [(ngModel)]="paymentInfo.expiration" placeholder="MM/YY">
        </div>
        <div class="form-group">
          <label>CVV</label>
          <input type="text" [(ngModel)]="paymentInfo.cvv" placeholder="123">
        </div>
      </div>

      <div class="step-actions">
        <button (click)="onBack()">Back</button>
        <button (click)="onNext()" [disabled]="!selectedOption || !isPaymentValid()">Next</button>
      </div>
    </div>
  `,
  styles: [`
    .step {
      max-width: 600px;
      margin: 0 auto;
    }
    .service-options {
      display: grid;
      gap: 1rem;
      margin: 1rem 0;
    }
    .service-option {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }
    .service-option.selected {
      border-color: #3f51b5;
      background-color: #f5f5f5;
    }
    .service-option h3 {
      margin: 0 0 0.5rem 0;
    }
    .price {
      font-weight: bold;
      color: #3f51b5;
      margin-top: 0.5rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.25rem;
    }
    .form-group input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .step-actions {
      margin-top: 2rem;
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class BookingStep3Component {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  serviceOptions: BookingOption[] = [];
  selectedOption: BookingOption | null = null;
  paymentInfo = {
    cardNumber: '',
    expiration: '',
    cvv: '',
    email: ''
  };

  constructor(
    private bookingService: BookingService,
    private bookingOptionsService: BookingOptionsService,
    private paymentService: PaymentService
  ) {
    this.loadServiceOptions();
  }

  loadServiceOptions() {
    this.bookingOptionsService.getFeaturedOptions().subscribe({
      next: (options: BookingOption[]) => this.serviceOptions = options,
      error: (err: Error) => console.error('Failed to load options', err)
    });
  }

  selectOption(option: any) {
    this.selectedOption = option;
  }

  isPaymentValid() {
    return this.paymentInfo.cardNumber && 
           this.paymentInfo.expiration && 
           this.paymentInfo.cvv;
  }

  onNext() {
    if (!this.selectedOption) return;
    
    if (!this.selectedOption) return;
    
    const currentBooking = this.bookingService.getCurrentBooking();
    const booking: BookingDetails = {
      optionId: this.selectedOption.id,
      date: currentBooking?.date || '',
      time: currentBooking?.time || '',
      customerInfo: currentBooking?.customerInfo || {
        name: '',
        email: '',
        phone: '',
        specialRequests: ''
      },
      paymentInfo: {
        cardNumber: this.paymentInfo.cardNumber,
        expiry: this.paymentInfo.expiration,
        cvv: this.paymentInfo.cvv
      }
    };
    
    const paymentRequest: PaymentRequest = {
      amount: this.selectedOption.price,
      currency: 'USD',
      description: `Booking for ${this.selectedOption.name}`,
      customerEmail: this.paymentInfo.email || currentBooking?.customerInfo?.email || ''
    };

    this.paymentService.processPayment(paymentRequest).subscribe({
      next: () => {
        this.bookingService.createBooking(booking);
        this.next.emit();
      },
      error: (err) => console.error('Payment failed', err)
    });
  }

  onBack() {
    this.back.emit();
  }
}