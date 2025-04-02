import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-step4',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirmation-container">
      <div class="confirmation-card">
        <h2>Booking Confirmed!</h2>
        <div class="confirmation-icon">✓</div>
        
        <div class="booking-details">
          <h3>Booking Details</h3>
          <div class="detail-row">
            <span class="detail-label">Booking ID:</span>
            <span class="detail-value">{{booking?.id}}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Service:</span>
            <span class="detail-value">{{booking?.optionName}}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date & Time:</span>
            <span class="detail-value">{{booking?.date}} at {{booking?.time}}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Location:</span>
            <span class="detail-value">123 Service St, Your City</span>
          </div>
        </div>

        <div class="customer-details">
          <h3>Your Information</h3>
          <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value">{{booking?.customerInfo?.name}}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{booking?.customerInfo?.email}}</span>
          </div>
        </div>

        <div class="confirmation-actions">
          <button (click)="onDone()" class="primary-btn">Return Home</button>
          <button (click)="downloadReceipt()" class="secondary-btn">Download Receipt</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
    .confirmation-card {
      max-width: 600px;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
    }
    .confirmation-icon {
      font-size: 4rem;
      color: #4CAF50;
      margin: 1rem 0;
    }
    .detail-row {
      display: flex;
      margin: 0.5rem 0;
      text-align: left;
    }
    .detail-label {
      font-weight: bold;
      width: 120px;
    }
    .confirmation-actions {
      margin-top: 2rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
  `]
})
export class BookingStep4Component {
  booking: any;

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {
    this.booking = this.bookingService.getCurrentBooking();
    this.sendConfirmationEmail();
  }

  sendConfirmationEmail() {
    this.bookingService.sendConfirmationEmail(this.booking).subscribe({
      next: () => console.log('Confirmation email sent'),
      error: (err) => console.error('Failed to send email', err)
    });
  }

  downloadReceipt() {
    this.bookingService.downloadReceipt(this.booking.id).subscribe({
      next: (pdf) => {
        const blob = new Blob([pdf], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      error: (err) => console.error('Failed to download receipt', err)
    });
  }

  onDone() {
    this.router.navigate(['/']);
  }
}