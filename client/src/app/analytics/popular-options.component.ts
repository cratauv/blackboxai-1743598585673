import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-popular-options',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="options-container">
      <h2>Popular Booking Options</h2>
      <div class="chart-container">
        <canvas baseChart
          [type]="'bar'"
          [data]="chartData"
          [options]="chartOptions">
        </canvas>
      </div>
      <div class="options-list">
        <div *ngFor="let option of options" class="option-item">
          <span class="option-name">{{option.name}}</span>
          <span class="option-count">{{option.count}} bookings</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .options-container { padding: 1rem; }
    .chart-container {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
    }
    .options-list {
      display: grid;
      gap: 0.5rem;
    }
    .option-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
      background: #f5f5f5;
      border-radius: 4px;
    }
    .option-name {
      font-weight: 500;
    }
    .option-count {
      color: #666;
    }
  `]
})
export class PopularOptionsComponent implements OnInit {
  options: any[] = [];
  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'y'
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.analyticsService.getPopularOptions().subscribe({
      next: (data) => {
        this.options = data;
        this.chartData = {
          labels: data.map(option => option.name),
          datasets: [{
            label: 'Bookings',
            data: data.map(option => option.count),
            backgroundColor: '#3F51B5'
          }]
        };
      },
      error: (err) => console.error('Failed to load popular options', err)
    });
  }
}