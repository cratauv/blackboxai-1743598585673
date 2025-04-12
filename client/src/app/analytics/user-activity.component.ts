import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-user-activity',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="activity-container">
      <h2>User Activity</h2>
      <div class="activity-stats">
        <div class="stat-card">
          <h3>Active Users</h3>
          <div class="stat-value">{{activity?.activeUsers || 0}}</div>
        </div>
        <div class="stat-card">
          <h3>New Users</h3>
          <div class="stat-value">{{activity?.newUsers || 0}}</div>
        </div>
        <div class="stat-card">
          <h3>Bookings/User</h3>
          <div class="stat-value">{{activity?.bookingsPerUser || 0}}</div>
        </div>
      </div>
      <div class="chart-container">
        <canvas baseChart
          [type]="'bar'"
          [data]="chartData"
          [options]="chartOptions">
        </canvas>
      </div>
    </div>
  `,
  styles: [`
    .activity-container { padding: 1rem; }
    .activity-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
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
    .chart-container {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class UserActivityComponent implements OnInit {
  activity: any;
  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.analyticsService.getUserActivity().subscribe({
      next: (data) => {
        this.activity = data;
        this.updateChart();
      },
      error: (err) => console.error('Failed to load user activity', err)
    });
  }

  updateChart() {
    this.chartData = {
      labels: ['Active Users', 'New Users', 'Bookings/User'],
      datasets: [{
        label: 'User Metrics',
        data: [
          this.activity?.activeUsers || 0,
          this.activity?.newUsers || 0,
          this.activity?.bookingsPerUser || 0
        ],
        backgroundColor: ['#3F51B5', '#E91E63', '#8BC34A']
      }]
    };
  }
}