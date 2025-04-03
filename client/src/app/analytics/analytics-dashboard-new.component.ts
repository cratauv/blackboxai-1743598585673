import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from './analytics.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="analytics-dashboard">
      <h2>Business Analytics</h2>
      <!-- Simplified template for initial testing -->
      <div>Analytics Dashboard - New Version</div>
    </div>
  `
})
export class AnalyticsDashboardComponent implements OnInit {
  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {}
}