import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingOptionsService } from '../booking-options/booking-options.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BookingCalendarComponent } from './booking-calendar/booking-calendar.component';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, BookingCalendarComponent],
  template: `
    <div class="booking-details-container">
      <mat-card *ngIf="bookingOption" class="details-card">
        <mat-card-header>
          <mat-card-title>{{ bookingOption.name }}</mat-card-title>
          <mat-card-subtitle>{{ bookingOption.category }}</mat-card-subtitle>
        </mat-card-header>
        <img mat-card-image [src]="bookingOption.imageUrl" [alt]="bookingOption.name">
        <mat-card-content>
          <p>{{ bookingOption.description }}</p>
          <div class="details-grid">
            <div>
              <h3>Price</h3>
              <p>{{ bookingOption.price | currency }}</p>
            </div>
            <div>
              <h3>Duration</h3>
              <p>{{ bookingOption.duration }} minutes</p>
            </div>
            <div>
              <h3>Rating</h3>
              <p>{{ bookingOption.rating }}/5</p>
            </div>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="openBookingCalendar()">
            Book Now
          </button>
        </mat-card-actions>
      </mat-card>

      <div *ngIf="loading" class="loading-spinner">
        Loading booking details...
      </div>
      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .booking-details-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .details-card {
      margin-bottom: 2rem;
    }
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    mat-card-actions {
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class BookingDetailsComponent {
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingOptionsService);

  bookingOption: any;
  loading = false;
  error = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBookingDetails(id);
    }
  }

  loadBookingDetails(id: string) {
    this.loading = true;
    this.bookingService.getOptionDetails(id).subscribe({
      next: (option) => {
        this.bookingOption = option;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load booking details';
        this.loading = false;
      }
    });
  }

  openBookingCalendar() {
    // Implementation would open calendar for booking
  }
}