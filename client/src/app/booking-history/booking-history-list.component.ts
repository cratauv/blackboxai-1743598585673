import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingHistoryService } from './booking-history.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking-history-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="booking-history">
      <h2>Your Booking History</h2>
      <div *ngIf="loading" class="loading">Loading your bookings...</div>
      <div *ngIf="error" class="error">{{error}}</div>

      <div class="booking-cards">
        <div *ngFor="let booking of bookings" class="booking-card" [class.cancelled]="booking.status === 'cancelled'">
          <h3>{{booking.optionName}}</h3>
          <div class="booking-details">
            <p><strong>Date:</strong> {{booking.date | date}}</p>
            <p><strong>Time:</strong> {{booking.time}}</p>
            <p><strong>Status:</strong> 
              <span [class]="booking.status">{{booking.status}}</span>
            </p>
            <p><strong>Price:</strong> {{booking.price | currency}}</p>
          </div>
          <div class="booking-actions">
            <a [routerLink]="['/bookings', booking.id]" class="btn">View Details</a>
            <button *ngIf="booking.status === 'confirmed'" 
                    (click)="cancelBooking(booking.id)" 
                    class="btn cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-history {
      padding: 2rem;
    }
    .booking-cards {
      display: grid;
      gap: 1.5rem;
      margin-top: 1.5rem;
    }
    .booking-card {
      padding: 1.5rem;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .booking-card.cancelled {
      opacity: 0.7;
    }
    .booking-details {
      margin: 1rem 0;
    }
    .confirmed {
      color: #2e7d32;
    }
    .cancelled {
      color: #c62828;
    }
    .completed {
      color: #1565c0;
    }
  `]
})
export class BookingHistoryListComponent implements OnInit {
  bookings: any[] = [];
  loading = false;
  error = '';

  constructor(private bookingHistoryService: BookingHistoryService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingHistoryService.getUserBookings('current-user-id').subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load bookings';
        this.loading = false;
      }
    });
  }

  cancelBooking(bookingId: string) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingHistoryService.cancelBooking(bookingId).subscribe({
        next: () => this.loadBookings(),
        error: () => alert('Failed to cancel booking')
      });
    }
  }
}