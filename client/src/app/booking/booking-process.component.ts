import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from './booking.service';
import { BookingStep1Component } from './steps/step1-date-time.component';
import { BookingStep2Component } from './steps/step2-customer-info.component';
import { BookingStep3Component } from './steps/step3-payment.component';
import { BookingStep4Component } from './steps/step4-confirmation.component';

@Component({
  selector: 'app-booking-process',
  standalone: true,
  imports: [
    CommonModule,
    BookingStep1Component,
    BookingStep2Component,
    BookingStep3Component,
    BookingStep4Component
  ],
  template: `
    <div class="booking-process">
      <div class="progress-steps">
        <div *ngFor="let step of steps" 
             [class.active]="currentStep === step.id"
             [class.completed]="currentStep > step.id">
          {{ step.label }}
        </div>
      </div>

      <div class="step-container">
        <app-booking-step1 *ngIf="currentStep === 1" 
                          (next)="goToStep(2)"></app-booking-step1>
        
        <app-booking-step2 *ngIf="currentStep === 2" 
                          (next)="goToStep(3)"
                          (back)="goToStep(1)"></app-booking-step2>
        
        <app-booking-step3 *ngIf="currentStep === 3" 
                          (next)="completeBooking()"
                          (back)="goToStep(2)"></app-booking-step3>
        
        <app-booking-step4 *ngIf="currentStep === 4"></app-booking-step4>
      </div>
    </div>
  `,
  styles: [`
    .booking-process {
      max-width: 800px;
      margin: 2rem auto;
    }
    .progress-steps {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
    }
    .progress-steps div {
      padding: 0.5rem 1rem;
      border-bottom: 3px solid #ddd;
    }
    .progress-steps .active {
      border-color: #3498db;
      font-weight: bold;
    }
    .progress-steps .completed {
      border-color: #2ecc71;
    }
    .step-container {
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 8px;
    }
  `]
})
export class BookingProcessComponent {
  currentStep = 1;
  steps = [
    { id: 1, label: 'Date & Time' },
    { id: 2, label: 'Your Info' },
    { id: 3, label: 'Payment' },
    { id: 4, label: 'Confirmation' }
  ];

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  goToStep(step: number) {
    this.currentStep = step;
  }

  completeBooking() {
    const booking = this.bookingService.getCurrentBooking();
    if (booking) {
      this.bookingService.createBooking(booking).subscribe({
        next: () => this.goToStep(4),
        error: () => alert('Booking failed, please try again')
      });
    }
  }
}