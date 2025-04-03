import { Component } from '@angular/core';
import { NotificationCenterComponent } from './in-app-notifications/notification-center.component';
import { AnalyticsDashboardComponent } from './analytics/analytics-dashboard-new.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotificationCenterComponent, AnalyticsDashboardComponent],
  template: `
    <main>
      <h1>Welcome to Booking App</h1>
      <app-analytics-dashboard></app-analytics-dashboard>
      <app-notification-center></app-notification-center>
    </main>
  `,
  styles: [`
    main {
      max-width: 1280px;
      margin: 0 auto;
      padding: 20px;
    }
  `]
})
export class AppComponent {}