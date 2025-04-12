import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-container">
      <h2>Booking Statistics</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Bookings</h3>
          <div class="stat-value">{{stats?.total || 0}}</div>
        </div>
        <div class="stat-card">
          <h3>Confirmed</h3>
          <div class="stat-value">{{stats?.confirmed || 0}}</div>
        </div>
        <div class="stat-card">
          <h3>Cancelled</h3>
          <div class="stat-value">{{stats?.cancelled || 0}}</div>
        </div>
        <div class="stat-card">
          <h3>Revenue</h3>
          <div class="stat-value">{{stats?.revenue | currency || 0}}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-container { padding: 1rem; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }
    .stat-card {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 8px;
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
    }
  `]
})
export class BookingStatsComponent implements OnInit {
  stats: any;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.analyticsService.getBookingStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Failed to load booking stats', err)
    });
  }
}