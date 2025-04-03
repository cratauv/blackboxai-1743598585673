import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface BookingStats {
  total: number;
  confirmed: number;
  cancelled: number;
  revenue: number;
}

export interface UserActivity {
  activeUsers: number;
  newUsers: number;
  bookingsPerUser: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface PopularOption {
  id: string;
  name: string;
  count: number;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);

  getBookingStats() {
    return this.http.get<BookingStats>('/api/analytics/bookings');
  }

  getUserActivity() {
    return this.http.get<UserActivity>('/api/analytics/users');
  }

  getBookingTrends(timeframe: string) {
    return this.http.get<TimeSeriesData[]>(`/api/analytics/trends?timeframe=${timeframe}`);
  }

  getPopularOptions() {
    return this.http.get<PopularOption[]>('/api/analytics/popular-options');
  }
}