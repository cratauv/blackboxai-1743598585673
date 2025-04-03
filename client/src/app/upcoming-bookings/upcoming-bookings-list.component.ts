import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UpcomingBookingsService } from './upcoming-bookings.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-upcoming-bookings-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  template: `
    <div class="upcoming-bookings">
      <h2>Your Upcoming Bookings</h2>
      <div *ngIf="loading" class="loading">Loading upcoming bookings...</div>
      <div *ngIf="error" class="error">{{error}}</div>
      <div *ngIf="bookings.length === 0 && !loading" class="empty-state">
        You have no upcoming bookings
      </div>

      <div class="booking-cards">
        <div *ngFor="let booking of bookings" class="booking-card">
          <div class="booking-header">
            <h3>{{booking.optionName}}</h3>
            <span class="status-badge" [class.confirmed]="booking.status === 'confirmed'"
                                 [class.pending]="booking.status === 'pending'">
              {{booking.status}}
            </span>
          </div>
          
          <div class="booking-details">
            <div class="detail">
              <span class="label">Date:</span>
              <span class="value">{{booking.date | date:'fullDate'}}</span>
            </div>
            <div class="detail">
              <span class="label">Time:</span>
              <span class="value">{{booking.time}}</span>
            </div>
            <div class="detail">
              <span class="label">Duration:</span>
              <span class="value">{{booking.duration}} minutes</span>
            </div>
            <div class="detail">
              <span class="label">Location:</span>
              <span class="value">{{booking.location}}</span>
            </div>
          </div>

          <div class="booking-footer">
            <span class="price">{{booking.price | currency}}</span>
            <a [routerLink]="['/bookings', booking.id]" class="view-details">View Details</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .upcoming-bookings {
      padding: 2rem;
    }
    .booking-cards {
      display: grid;
      gap: 1.5rem;
      margin-top: 1.5rem;
    }
    .booking-card {
      padding: 1.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: bold;
    }
    .confirmed {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
    .pending {
      background-color: #fff8e1;
      color: #ff8f00;
    }
    .booking-details {
      margin: 1rem 0;
    }
    .detail {
      display: flex;
      margin-bottom: 0.5rem;
    }
    .label {
      font-weight: bold;
      min-width: 100px;
    }
    .booking-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
    }
    .price {
      font-weight: bold;
      font-size: 1.1rem;
    }
    .view-details {
      color: #1565c0;
      text-decoration: none;
    }
  `]
})
export class UpcomingBookingsListComponent implements OnInit {
  bookings: any[] = [];
  loading = false;
  error = '';

  constructor(private upcomingBookingsService: UpcomingBookingsService) {}

  ngOnInit() {
    this.loadUpcomingBookings();
  }

  loadUpcomingBookings() {
    this.loading = true;
    this.upcomingBookingsService.getUpcomingBookings('current-user-id').subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load upcoming bookings';
        this.loading = false;
      }
    });
  }
}