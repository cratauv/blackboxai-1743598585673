import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="dashboard-container">
      <h1>Business Analytics Dashboard</h1>
      
      <nav class="analytics-nav">
        <a routerLink="stats" routerLinkActive="active">Booking Stats</a>
        <a routerLink="users" routerLinkActive="active">User Activity</a>
        <a routerLink="trends" routerLinkActive="active">Booking Trends</a>
        <a routerLink="popular" routerLinkActive="active">Popular Options</a>
      </nav>

      <div class="analytics-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
    }
    .analytics-nav {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    .analytics-nav a {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      text-decoration: none;
      color: #333;
      transition: all 0.2s;
    }
    .analytics-nav a:hover {
      background: #f5f5f5;
    }
    .analytics-nav a.active {
      background: #3F51B5;
      color: white;
    }
    .analytics-content {
      min-height: 500px;
    }
  `]
})
export class AnalyticsDashboardComponent implements OnInit {
  // Key Metrics
  totalBookings = 0;
  revenue = 0;
  activeUsers = 0;

  // Line Chart
  lineChartType: ChartType = 'line';
  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true
  };

  // Bar Chart
  barChartType: ChartType = 'bar';
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true
  };

  // Pie Chart
  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: []
  };
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadAnalyticsData();
  }

  loadAnalyticsData() {
    this.analyticsService.getDashboardData().subscribe({
      next: (data) => {
        this.totalBookings = data.totalBookings;
        this.revenue = data.revenue;
        this.activeUsers = data.activeUsers;
        
        // Update charts
        this.lineChartData = data.lineChart;
        this.barChartData = data.barChart;
        this.pieChartData = data.pieChart;
      },
      error: (err) => console.error('Failed to load analytics data', err)
    });
  }
}