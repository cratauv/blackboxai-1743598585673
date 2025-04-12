import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

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

export interface DashboardData {
  totalBookings: number;
  revenue: number;
  activeUsers: number;
  lineChart: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
  barChart: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
  pieChart: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>('/api/analytics/dashboard').pipe(
      catchError((error: unknown) => {
        console.error('Failed to load dashboard data', error);
        return of(this.getEmptyDashboardData());
      })
    );
  }

  getBookingStats(): Observable<BookingStats> {
    return this.http.get<BookingStats>('/api/analytics/bookings').pipe(
      catchError((error: unknown) => {
        console.error('Failed to load booking stats', error);
        return of({ total: 0, confirmed: 0, cancelled: 0, revenue: 0 });
      })
    );
  }

  getUserActivity(): Observable<UserActivity> {
    return this.http.get<UserActivity>('/api/analytics/users').pipe(
      catchError((error: unknown) => {
        console.error('Failed to load user activity', error);
        return of({ activeUsers: 0, newUsers: 0, bookingsPerUser: 0 });
      })
    );
  }

  getBookingTrends(timeframe: string): Observable<TimeSeriesData[]> {
    return this.http.get<TimeSeriesData[]>(`/api/analytics/trends?timeframe=${timeframe}`).pipe(
      catchError((error: unknown) => {
        console.error('Failed to load booking trends', error);
        return of([]);
      })
    );
  }

  getPopularOptions(): Observable<PopularOption[]> {
    return this.http.get<PopularOption[]>('/api/analytics/popular-options').pipe(
      catchError((error: unknown) => {
        console.error('Failed to load popular options', error);
        return of([]);
      })
    );
  }

  private getEmptyDashboardData(): DashboardData {
    return {
      totalBookings: 0,
      revenue: 0,
      activeUsers: 0,
      lineChart: {
        labels: [],
        datasets: [{
          label: 'Bookings',
          data: [],
          borderColor: '#3F51B5',
          backgroundColor: 'rgba(63, 81, 181, 0.1)'
        }]
      },
      barChart: {
        labels: [],
        datasets: [{
          label: 'Revenue',
          data: [],
          backgroundColor: ['#3F51B5', '#E91E63', '#8BC34A', '#FFC107']
        }]
      },
      pieChart: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: ['#3F51B5', '#E91E63', '#8BC34A', '#FFC107']
        }]
      }
    };
  }
}