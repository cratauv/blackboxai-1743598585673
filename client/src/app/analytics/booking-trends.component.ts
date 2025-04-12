import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-booking-trends',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="trends-container">
      <h2>Booking Trends</h2>
      <div class="timeframe-selector">
        <button (click)="loadData('week')">Week</button>
        <button (click)="loadData('month')">Month</button>
        <button (click)="loadData('year')">Year</button>
      </div>
      <div class="chart-container">
        <canvas baseChart
          [type]="'line'"
          [data]="chartData"
          [options]="chartOptions">
        </canvas>
      </div>
    </div>
  `,
  styles: [`
    .trends-container { padding: 1rem; }
    .timeframe-selector {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    button {
      padding: 0.5rem 1rem;
      background: #3F51B5;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .chart-container {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class BookingTrendsComponent implements OnInit {
  chartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadData('week');
  }

  loadData(timeframe: string) {
    this.analyticsService.getBookingTrends(timeframe).subscribe({
      next: (data) => {
        this.chartData = {
          labels: data.map(item => item.date),
          datasets: [{
            label: 'Bookings',
            data: data.map(item => item.value),
            borderColor: '#3F51B5',
            backgroundColor: 'rgba(63, 81, 181, 0.1)',
            fill: true
          }]
        };
      },
      error: (err) => console.error('Failed to load booking trends', err)
    });
  }
}